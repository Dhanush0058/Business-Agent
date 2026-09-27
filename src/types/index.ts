export type LeadStatus =
  | 'NEW'
  | 'RESEARCHING'
  | 'QUALIFIED'
  | 'DEMO_GENERATED'
  | 'DEMO_APPROVED'
  | 'MESSAGE_READY'
  | 'CONTACTED'
  | 'REPLIED'
  | 'INTERESTED'
  | 'DEMO_SENT'
  | 'CALL_SCHEDULED'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'NOT_INTERESTED'
  | 'FOLLOW_UP';

export type LeadPriority = 'HOT' | 'WARM' | 'LOW';

export type WebsiteStatus = 'NO_WEBSITE' | 'POOR' | 'NEEDS_IMPROVEMENT' | 'GOOD' | 'STRONG';

export interface WebsiteAnalysisResult {
  overallScore: number; // 0 - 100
  status: WebsiteStatus;
  scores: {
    mobileUx: number;
    design: number;
    performance: number;
    cta: number;
    contactAccessibility: number;
    contentClarity: number;
    technicalQuality: number;
  };
  checks: {
    hasHttps: boolean;
    isMobileResponsive: boolean;
    hasFastPerformance: boolean;
    hasWhatsAppCTA: boolean;
    hasBookingOrContactForm: boolean;
    isModernDesign: boolean;
    hasBrokenLinks: boolean;
    hasBasicSeo: boolean;
    visualQualityRating: 'Low' | 'Average' | 'High' | 'None';
  };
  explanation: string;
  recommendedService: string;
  potentialWebsiteNeed: string;
  analyzedAt: string;
}

export interface LeadScoreBreakdown {
  noWebsiteScore: number;
  poorWebsiteScore: number;
  activePresenceScore: number;
  contactAvailableScore: number;
  socialPresenceScore: number;
  relevanceScore: number;
  totalScore: number;
}

export interface AIQualification {
  businessSummary: string;
  onlinePresenceSummary: string;
  mainOpportunity: string;
  potentialWebsiteNeed: string;
  recommendedService: string;
  recommendedTemplate: string;
  priority: LeadPriority;
  priorityReason: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  price?: string;
  badge?: string;
  iconName?: string;
  image?: string;
}

export interface DemoCustomization {
  templateId: string;
  businessName: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  badgeText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  ctaText: string;
  ctaWhatsapp: string;
  ctaPhone: string;
  location: string;
  openingHours: string;
  aboutTitle: string;
  aboutStory: string;
  services: ServiceItem[];
  features: string[];
  heroImage: string;
  galleryImages: string[];
  disclaimerText: string;
  deployedUrl?: string;
  lastGeneratedAt: string;
  version: number;
}

export interface OutreachMessage {
  id: string;
  status: 'GENERATED' | 'REVIEWED' | 'APPROVED' | 'SENT';
  tone: 'professional' | 'friendly' | 'short';
  subject: string;
  body: string;
  channel: 'whatsapp' | 'email' | 'instagram';
  generatedAt: string;
  approvedAt?: string;
  sentAt?: string;
}

export interface FollowUpItem {
  id: string;
  step: number;
  label: string;
  scheduledDate: string;
  completed: boolean;
  completedAt?: string;
  notes: string;
  suggestedMessage: string;
}

export interface Lead {
  id: string;
  businessName: string;
  category: string;
  location: string;
  website: string;
  websiteStatus: WebsiteStatus;
  websiteAnalysis?: WebsiteAnalysisResult;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  otherLinks: string[];
  description: string;
  services: string[];
  businessActivity: string;
  googleMapsRef?: string;
  source: string;
  dateAdded: string;
  lastResearched: string;
  leadScore: number;
  scoreBreakdown?: LeadScoreBreakdown;
  priority: LeadPriority;
  status: LeadStatus;
  assignedTemplate: string;
  aiQualification?: AIQualification;
  demoCustomization?: DemoCustomization;
  demoUrl?: string;
  demoApproved: boolean;
  demoApprovedAt?: string;
  outreachMessage?: OutreachMessage;
  outreachHistory?: OutreachMessage[];
  hours?: string;
  notes: string;
  followUps: FollowUpItem[];
  dealValue?: number;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  previewImage: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  demoCount: number;
  lastUpdated: string;
  variables: string[];
  defaultCustomization: Partial<DemoCustomization>;
}

export interface ScoringRules {
  noWebsiteWeight: number;
  poorWebsiteWeight: number;
  activePresenceWeight: number;
  publicContactWeight: number;
  socialPresenceWeight: number;
  nicheRelevanceWeight: number;
  hotThreshold: number;
  warmThreshold: number;
}

export interface AgencySettings {
  agencyName: string;
  agencyTagline: string;
  portfolioUrl: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  defaultTone: 'professional' | 'friendly' | 'short';
  defaultCTA: string;
  defaultPricing: string;
  demoDisclaimer: string;
  deploymentProvider: 'local' | 'vercel' | 'netlify' | 'cloudflare';
  customDomain: string;
  aiProvider: 'local-smart' | 'gemini' | 'groq' | 'openai';
  apiKey: string;
  groqApiKey?: string;
  scoringRules: ScoringRules;
}
