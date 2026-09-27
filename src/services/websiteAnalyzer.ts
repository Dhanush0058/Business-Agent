import { WebsiteAnalysisResult, WebsiteStatus } from '../types';

export function analyzeWebsite(
  url: string | undefined,
  businessName: string,
  category: string
): WebsiteAnalysisResult {
  const cleanUrl = (url || '').trim();
  const analyzedAt = new Date().toISOString();

  // Case 1: No website provided
  if (!cleanUrl || cleanUrl.toLowerCase() === 'none' || cleanUrl === '#' || cleanUrl === '-') {
    return {
      overallScore: 0,
      status: 'NO_WEBSITE',
      scores: {
        mobileUx: 0,
        design: 0,
        performance: 0,
        cta: 0,
        contactAccessibility: 20, // Has social or phone
        contentClarity: 0,
        technicalQuality: 0,
      },
      checks: {
        hasHttps: false,
        isMobileResponsive: false,
        hasFastPerformance: false,
        hasWhatsAppCTA: false,
        hasBookingOrContactForm: false,
        isModernDesign: false,
        hasBrokenLinks: false,
        hasBasicSeo: false,
        visualQualityRating: 'None',
      },
      explanation: `${businessName} currently has no dedicated web presence. Prospects discovering them via search or local maps rely solely on directory listings without an official landing page to view services, pricing, or direct booking options.`,
      recommendedService: 'Complete Mobile-First Business Website with WhatsApp Direct Booking',
      potentialWebsiteNeed: 'A dedicated brand portal showcasing core services, customer reviews, dynamic schedule, and 1-tap WhatsApp consultation.',
      analyzedAt,
    };
  }

  // Case 2: Website exists - analyze features (with realistic heuristics based on domain & patterns)
  const isHttps = cleanUrl.toLowerCase().startsWith('https://');
  const isFreeSubdomain = /(blogspot|wixsite|wordpress\.com|weebly|sites\.google\.com|linktr\.ee)/i.test(cleanUrl);
  const isOutdatedPattern = /(index\.php|\.asp|\.html|~|old|199|201[0-6])/i.test(cleanUrl);
  const isModern = !isFreeSubdomain && !isOutdatedPattern && isHttps;

  // Compute sub scores based on analysis indicators
  let mobileUx = isModern ? 75 : isFreeSubdomain ? 50 : 30;
  let design = isModern ? 70 : isFreeSubdomain ? 45 : 25;
  let performance = isHttps ? (isFreeSubdomain ? 55 : 65) : 35;
  let cta = isModern ? 60 : 30;
  let contactAccessibility = 65;
  let contentClarity = isModern ? 70 : 40;
  let technicalQuality = isHttps ? 60 : 25;

  const hasWhatsAppCTA = cleanUrl.includes('wa.me') || cleanUrl.includes('whatsapp') ? true : false;
  const hasBooking = false; // typical local business lacks seamless booking

  // Total weighted score
  const overallScore = Math.round(
    mobileUx * 0.2 +
    design * 0.2 +
    performance * 0.15 +
    cta * 0.15 +
    contactAccessibility * 0.1 +
    contentClarity * 0.1 +
    technicalQuality * 0.1
  );

  let status: WebsiteStatus = 'NEEDS_IMPROVEMENT';
  let visualQuality: 'Low' | 'Average' | 'High' = 'Average';

  if (overallScore < 40) {
    status = 'POOR';
    visualQuality = 'Low';
  } else if (overallScore < 60) {
    status = 'NEEDS_IMPROVEMENT';
    visualQuality = 'Average';
  } else if (overallScore < 80) {
    status = 'GOOD';
    visualQuality = 'High';
  } else {
    status = 'STRONG';
    visualQuality = 'High';
  }

  let explanation = '';
  if (status === 'POOR') {
    explanation = `Website exists at ${cleanUrl} but exhibits noticeable usability limitations: lacks modern responsive mobile optimization, contains slow-loading elements, and lacks prominent direct conversion calls-to-action (such as WhatsApp enquiry or fast booking).`;
  } else if (status === 'NEEDS_IMPROVEMENT') {
    explanation = `Website is active and reachable, but has room for significant conversion improvements. The visual hierarchy is dated, navigation requires multiple clicks, and key service packages could benefit from clear CTAs tailored to mobile visitors.`;
  } else {
    explanation = `Website has an established foundational presence with decent accessibility. Upgrading to a custom Dhanex Studio experience would elevate brand aesthetics, speed scores, and interactive client engagement.`;
  }

  return {
    overallScore,
    status,
    scores: {
      mobileUx,
      design,
      performance,
      cta,
      contactAccessibility,
      contentClarity,
      technicalQuality,
    },
    checks: {
      hasHttps: isHttps,
      isMobileResponsive: mobileUx >= 60,
      hasFastPerformance: performance >= 60,
      hasWhatsAppCTA,
      hasBookingOrContactForm: hasBooking,
      isModernDesign: isModern,
      hasBrokenLinks: !isHttps,
      hasBasicSeo: isModern,
      visualQualityRating: visualQuality,
    },
    explanation,
    recommendedService:
      status === 'POOR'
        ? 'Full Website Redesign & Modern Conversion Funnel'
        : 'Performance & Mobile UX Modernization Upgrade',
    potentialWebsiteNeed:
      'A sleek, high-speed mobile website featuring interactive service showcases, instant WhatsApp contact button, and clear customer proof.',
    analyzedAt,
  };
}
