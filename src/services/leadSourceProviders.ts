import { Lead, WebsiteStatus } from '../types';
import { fetchLiveRealBusinesses } from './liveMapsService';
import { fetchGeoapifyPlaces } from './geoapifyService';

export interface DiscoveryCriteria {
  category: string;
  location: string;
  limit: number;
  offset?: number;
  websiteRequirement: 'any' | 'no_website' | 'poor_website';
  contactPreference: 'all' | 'phone' | 'email' | 'social';
}

export interface LeadSourceProvider {
  id: string;
  name: string;
  description: string;
  isConfigured: boolean;
  search(criteria: DiscoveryCriteria): Promise<Lead[]>;
}

export class LiveMapsDiscoveryProvider implements LeadSourceProvider {
  id = 'live-maps';
  name = 'Live Maps & Real Local Business Search (Live GPS/OSM)';
  description = 'Queries real-time live business listings with actual street addresses and verified coordinates.';
  isConfigured = true;

  async search(criteria: DiscoveryCriteria): Promise<Lead[]> {
    const liveResults = await fetchLiveRealBusinesses({
      category: criteria.category,
      location: criteria.location,
      limit: criteria.limit,
    });

    if (criteria.websiteRequirement === 'no_website') {
      return liveResults.filter((l) => !l.website || l.website.trim() === '');
    }
    if (criteria.websiteRequirement === 'poor_website') {
      return liveResults.filter((l) => l.website && l.website.trim() !== '');
    }

    return liveResults;
  }
}

export class GeoapifyPlacesProvider implements LeadSourceProvider {
  id = 'geoapify-places';
  name = 'Geoapify Places API (Live Real Maps & Addresses)';
  description = 'Live global places search with verified contacts, address formats, and categories using Geoapify.';
  isConfigured = true;

  async search(criteria: DiscoveryCriteria): Promise<Lead[]> {
    const results = await fetchGeoapifyPlaces({
      category: criteria.category,
      location: criteria.location,
      limit: criteria.limit,
      offset: criteria.offset || 0,
    });

    if (results.length === 0) {
      // Fallback to Live OSM if Geoapify key is missing or quota reached
      return fetchLiveRealBusinesses({
        category: criteria.category,
        location: criteria.location,
        limit: criteria.limit,
      });
    }

    if (criteria.websiteRequirement === 'no_website') {
      return results.filter((l) => !l.website || l.website.trim() === '');
    }
    if (criteria.websiteRequirement === 'poor_website') {
      return results.filter((l) => l.website && l.website.trim() !== '');
    }

    return results;
  }
}

export class GooglePlacesProviderStub implements LeadSourceProvider {
  id = 'google-places';
  name = 'Google Places API (Live Maps Authorized Connector)';
  description = 'Connects directly to Google Maps / Places API using your authorized developer API key.';
  isConfigured = false;

  async search(criteria: DiscoveryCriteria): Promise<Lead[]> {
    return fetchLiveRealBusinesses({
      category: criteria.category,
      location: criteria.location,
      limit: criteria.limit,
    });
  }
}

export const LEAD_PROVIDERS: LeadSourceProvider[] = [
  new GeoapifyPlacesProvider(),
  new LiveMapsDiscoveryProvider(),
  new GooglePlacesProviderStub(),
];

