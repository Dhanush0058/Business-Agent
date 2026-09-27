import { Lead, WebsiteStatus } from '../types';
import { fetchLiveRealBusinesses } from './liveMapsService';

export interface DiscoveryCriteria {
  category: string;
  location: string;
  limit: number;
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
  new LiveMapsDiscoveryProvider(),
  new GooglePlacesProviderStub(),
];
