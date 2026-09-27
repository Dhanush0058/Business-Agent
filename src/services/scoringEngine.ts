import { Lead, ScoringRules, LeadScoreBreakdown, LeadPriority } from '../types';

export const DEFAULT_SCORING_RULES: ScoringRules = {
  noWebsiteWeight: 30,
  poorWebsiteWeight: 25,
  activePresenceWeight: 20,
  publicContactWeight: 10,
  socialPresenceWeight: 10,
  nicheRelevanceWeight: 5,
  hotThreshold: 80,
  warmThreshold: 60,
};

export function calculateLeadScore(
  lead: Partial<Lead>,
  rules: ScoringRules = DEFAULT_SCORING_RULES
): { score: number; priority: LeadPriority; breakdown: LeadScoreBreakdown } {
  let noWebsiteScore = 0;
  let poorWebsiteScore = 0;
  let activePresenceScore = 0;
  let contactAvailableScore = 0;
  let socialPresenceScore = 0;
  let relevanceScore = 0;

  // 1. Website status scoring
  if (!lead.website || lead.websiteStatus === 'NO_WEBSITE' || lead.website.trim() === '') {
    noWebsiteScore = rules.noWebsiteWeight;
  } else if (lead.websiteStatus === 'POOR' || lead.websiteStatus === 'NEEDS_IMPROVEMENT') {
    poorWebsiteScore = rules.poorWebsiteWeight;
  }

  // 2. Active business presence (has activity, reviews, or active operations)
  if (lead.businessActivity && lead.businessActivity.toLowerCase().includes('active')) {
    activePresenceScore = rules.activePresenceWeight;
  } else if (lead.businessActivity || lead.googleMapsRef) {
    activePresenceScore = Math.round(rules.activePresenceWeight * 0.75);
  }

  // 3. Public business contact available (phone or email)
  if (lead.phone && lead.phone.trim() !== '') {
    contactAvailableScore += Math.round(rules.publicContactWeight * 0.7);
  }
  if (lead.email && lead.email.trim() !== '') {
    contactAvailableScore += Math.round(rules.publicContactWeight * 0.3);
  }
  contactAvailableScore = Math.min(contactAvailableScore, rules.publicContactWeight);

  // 4. Active social presence (Instagram or Facebook)
  if (lead.instagram || lead.facebook) {
    socialPresenceScore = rules.socialPresenceWeight;
  }

  // 5. Niche relevance to Dhanex Studio core services
  const highValueNiches = ['gym', 'fitness', 'restaurant', 'cafe', 'coaching', 'education', 'salon', 'real estate', 'hotel'];
  const cat = (lead.category || '').toLowerCase();
  if (highValueNiches.some((niche) => cat.includes(niche))) {
    relevanceScore = rules.nicheRelevanceWeight;
  } else {
    relevanceScore = Math.round(rules.nicheRelevanceWeight * 0.5);
  }

  const totalScore = Math.min(
    100,
    noWebsiteScore +
      poorWebsiteScore +
      activePresenceScore +
      contactAvailableScore +
      socialPresenceScore +
      relevanceScore
  );

  let priority: LeadPriority = 'LOW';
  if (totalScore >= rules.hotThreshold) {
    priority = 'HOT';
  } else if (totalScore >= rules.warmThreshold) {
    priority = 'WARM';
  }

  return {
    score: totalScore,
    priority,
    breakdown: {
      noWebsiteScore,
      poorWebsiteScore,
      activePresenceScore,
      contactAvailableScore,
      socialPresenceScore,
      relevanceScore,
      totalScore,
    },
  };
}
