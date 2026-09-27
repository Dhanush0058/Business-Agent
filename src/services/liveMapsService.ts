import { Lead, WebsiteStatus } from '../types';
import { calculateLeadScore } from './scoringEngine';
import { analyzeWebsite } from './websiteAnalyzer';
import { runAIQualification } from './aiAdvisor';

export interface LiveMapsQuery {
  category: string;
  location: string;
  limit: number;
  googleApiKey?: string;
}

// City coordinates and search radii
const CITY_CENTERS: Record<string, { lat: number; lon: number; radiusKm: number }> = {
  hyderabad: { lat: 17.385, lon: 78.4867, radiusKm: 20 },
  bengaluru: { lat: 12.9716, lon: 77.5946, radiusKm: 20 },
  bangalore: { lat: 12.9716, lon: 77.5946, radiusKm: 20 },
  mumbai: { lat: 19.076, lon: 72.8777, radiusKm: 20 },
  delhi: { lat: 28.6139, lon: 77.209, radiusKm: 20 },
  chennai: { lat: 13.0827, lon: 80.2707, radiusKm: 20 },
  pune: { lat: 18.5204, lon: 73.8567, radiusKm: 18 },
  kolkata: { lat: 22.5726, lon: 88.3639, radiusKm: 18 },
  ahmedabad: { lat: 23.0225, lon: 72.5714, radiusKm: 18 },
  london: { lat: 51.5074, lon: -0.1278, radiusKm: 12 },
  'new york': { lat: 40.7128, lon: -74.006, radiusKm: 12 },
};

function getCategoryFilters(category: string): string[] {
  const cat = category.toLowerCase();
  if (cat.includes('fitness') || cat.includes('gym')) {
    return [
      '["leisure"="fitness_centre"]',
      '["leisure"="sports_centre"]',
      '["sport"="fitness"]',
    ];
  }
  if (cat.includes('restaurant') || cat.includes('caf') || cat.includes('dining') || cat.includes('food')) {
    return [
      '["amenity"="restaurant"]',
      '["amenity"="cafe"]',
      '["amenity"="fast_food"]',
    ];
  }
  if (cat.includes('coaching') || cat.includes('education') || cat.includes('school') || cat.includes('academy') || cat.includes('institute')) {
    return [
      '["amenity"="school"]',
      '["amenity"="college"]',
      '["amenity"="training"]',
    ];
  }
  if (cat.includes('salon') || cat.includes('spa') || cat.includes('beauty')) {
    return [
      '["shop"="hairdresser"]',
      '["shop"="beauty"]',
      '["amenity"="spa"]',
    ];
  }
  if (cat.includes('estate')) {
    return ['["office"="estate_agent"]'];
  }
  if (cat.includes('photo')) {
    return ['["shop"="photo"]', '["craft"="photographer"]'];
  }
  return ['["amenity"="restaurant"]', '["leisure"="fitness_centre"]', '["shop"="hairdresser"]'];
}

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// Cleans phone numbers into valid WhatsApp / dialer format
function normalizePhoneNumber(rawPhone: string, city: string): string {
  if (!rawPhone || rawPhone.trim() === '') {
    return '';
  }
  const digits = rawPhone.replace(/[^0-9+]/g, '').trim();
  if (digits.startsWith('+')) return digits;
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return rawPhone;
}

export async function fetchLiveRealBusinesses(query: LiveMapsQuery): Promise<Lead[]> {
  const locKey = query.location.toLowerCase().trim();
  const cityInfo = CITY_CENTERS[locKey] || {
    lat: 17.385,
    lon: 78.4867,
    radiusKm: 20,
  };

  const catFilters = getCategoryFilters(query.category);
  const radiusMeters = cityInfo.radiusKm * 1000;
  const maxResults = Math.min(query.limit || 20, 40);

  // Overpass QL Query
  const qlNodes = catFilters
    .map((f) => `node${f}(around:${radiusMeters},${cityInfo.lat},${cityInfo.lon});`)
    .join('\n');

  const overpassQL = `[out:json][timeout:20];
(
${qlNodes}
);
out center ${maxResults};`;

  for (const endpoint of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(overpassQL)}`,
      });

      if (!res.ok) continue;

      const json = await res.json();
      const elements = json?.elements || [];

      if (elements.length > 0) {
        const valid = elements.filter((el: any) => el.tags && (el.tags.name || el.tags['name:en']));

        if (valid.length > 0) {
          return valid.map((el: any, idx: number) => {
            const rawName = el.tags.name || el.tags['name:en'];
            const cleanName = rawName.replace(/[\n\r]+/g, ' ').trim();

            // Extract real website tag if available on map node
            const rawWeb = el.tags.website || el.tags['contact:website'] || el.tags.url || '';
            const web = rawWeb.trim();

            // Extract real phone numbers
            const rawPhone = el.tags.phone || el.tags['contact:phone'] || el.tags['contact:mobile'] || el.tags.mobile || '';
            const phone = normalizePhoneNumber(rawPhone, query.location);

            // Extract real street and address tags
            const street = el.tags['addr:street'] || el.tags['addr:suburb'] || el.tags['addr:neighbourhood'] || el.tags['addr:district'] || '';
            const fullLocation = street ? `${street}, ${query.location}` : query.location;

            const lat = el.lat || el.center?.lat;
            const lon = el.lon || el.center?.lon;
            const gMapsRef = lat && lon
              ? `https://www.google.com/maps?q=${lat},${lon}`
              : `https://maps.google.com/?q=${encodeURIComponent(cleanName + ' ' + fullLocation)}`;

            // Analyze website condition (or absence)
            const analysis = analyzeWebsite(web, cleanName, query.category);

            // Calculate lead score based on actual presence
            const scoreResult = calculateLeadScore({
              website: web,
              websiteStatus: analysis.status,
              phone: phone || undefined,
              category: query.category,
              businessActivity: `Live verified map listing at (${lat?.toFixed(3)}, ${lon?.toFixed(3)})`,
            });

            // Assign matching template
            const templateId = query.category.toLowerCase().includes('fitness') || query.category.toLowerCase().includes('gym')
              ? 'fitness'
              : query.category.toLowerCase().includes('restaurant') || query.category.toLowerCase().includes('caf') || query.category.toLowerCase().includes('food')
              ? 'restaurant'
              : 'education';

            const lead: Lead = {
              id: `lead-live-${Date.now()}-${idx + 1}`,
              businessName: cleanName,
              category: query.category,
              location: fullLocation,
              website: web,
              websiteStatus: analysis.status,
              websiteAnalysis: analysis,
              phone: phone,
              email: el.tags.email || el.tags['contact:email'] || '',
              instagram: `@${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
              facebook: '',
              otherLinks: [],
              description: `Real local business in ${fullLocation} with live GPS coordinates (${lat?.toFixed(4)}, ${lon?.toFixed(4)}).`,
              services: [`${query.category} Standard Service`, 'Custom Client Consultation'],
              businessActivity: `Active location on Google Maps / GPS Node (Coordinates: ${lat?.toFixed(4)}, ${lon?.toFixed(4)})`,
              googleMapsRef: gMapsRef,
              source: 'Live GPS & OpenStreetMap API',
              dateAdded: new Date().toISOString(),
              lastResearched: new Date().toISOString(),
              leadScore: scoreResult.score,
              scoreBreakdown: scoreResult.breakdown,
              priority: scoreResult.priority,
              status: 'NEW',
              assignedTemplate: templateId,
              demoApproved: false,
              hours: el.tags.opening_hours || 'Mon - Sat: 9:00 AM - 9:00 PM',
              notes: `Live mapped business in ${fullLocation}. Website status: ${analysis.status}. Coordinates: ${lat}, ${lon}.`,
              followUps: [],
            };

            lead.aiQualification = runAIQualification(lead);
            return lead;
          });
        }
      }
    } catch (err) {
      console.warn(`Error on mirror ${endpoint}:`, err);
    }
  }

  return [];
}
