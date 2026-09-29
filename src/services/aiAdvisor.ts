import { Lead, AIQualification, OutreachMessage, AgencySettings } from '../types';
import { matchTemplateForCategory } from './templateRegistry';

export function runAIQualification(lead: Lead): AIQualification {
  const hasWebsite = lead.website && lead.website.trim() !== '' && lead.websiteStatus !== 'NO_WEBSITE';
  const recTemplate = matchTemplateForCategory(lead.category);

  let onlineSummary = '';
  let mainOpportunity = '';
  let potentialWebsiteNeed = '';
  let recommendedService = '';

  if (!hasWebsite) {
    onlineSummary = lead.instagram
      ? `Active social media presence (${lead.instagram}) with engaged local audience, but lacks an official dedicated website destination.`
      : `Listed on local directories with contact details, but has no dedicated web presence for search queries.`;
    mainOpportunity = `Create a mobile-first website with clear service highlights, pricing/programs, customer location, and direct 1-tap WhatsApp enquiry CTA.`;
    potentialWebsiteNeed = `A fast, branded web presence that converts casual searchers and social followers into direct paying clients.`;
    recommendedService = `Mobile-First Business Website & WhatsApp Conversion Funnel`;
  } else if (lead.websiteStatus === 'POOR') {
    onlineSummary = `Existing website (${lead.website}) is outdated, slow to load on mobile devices, and lacks modern interactive elements or instant WhatsApp inquiry buttons.`;
    mainOpportunity = `Modernize the entire digital storefront with high-speed performance, clean visual hierarchy, and frictionless mobile conversion triggers.`;
    potentialWebsiteNeed = `Complete modern redesign with responsive mobile menus, modern typography, and immediate inquiry CTAs.`;
    recommendedService = `Full Website Redesign & Modern Conversion Funnel`;
  } else {
    onlineSummary = `Active online presence with existing website (${lead.website}), with potential for conversion optimization and premium branding uplift.`;
    mainOpportunity = `Elevate user experience with interactive service catalogues, digital booking capabilities, and high-performance loading.`;
    potentialWebsiteNeed = `Brand enhancement, faster load times, and streamlined lead capture workflows.`;
    recommendedService = `Website Performance & Visual Modernization Upgrade`;
  }

  // Priority logic
  const priority = lead.leadScore >= 80 ? 'HOT' : lead.leadScore >= 60 ? 'WARM' : 'LOW';
  const priorityReason =
    priority === 'HOT'
      ? `High-priority prospect: Active local business in high-intent niche (${lead.category}) with clear website void or severe mobile UX gap and reachable public contact.`
      : priority === 'WARM'
      ? `Good prospect: Established local operation with potential for website upgrade, needs targeted outreach demonstration.`
      : `Moderate prospect: Has functional online presence or limited public contact information.`;

  return {
    businessSummary: `${lead.businessName} is a local ${lead.category} operating in ${lead.location}. Known for ${lead.services?.join(', ') || 'quality community services'}.`,
    onlinePresenceSummary: onlineSummary,
    mainOpportunity,
    potentialWebsiteNeed,
    recommendedService,
    recommendedTemplate: recTemplate,
    priority,
    priorityReason,
  };
}

export function generateOutreachMessage(
  lead: Lead,
  settings: AgencySettings,
  tone: 'professional' | 'friendly' | 'short' = 'friendly',
  demoUrl?: string
): OutreachMessage {
  const url = demoUrl || lead.demoUrl || `https://demo.dhanexstudio.com/${lead.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const agencyName = settings.agencyName || 'Dhanex Studio';
  const senderName = 'Dhanush from Dhanex Studio';
  const loc = lead.location ? ` in ${lead.location}` : '';
  const noSite = !lead.website || lead.websiteStatus === 'NO_WEBSITE';

  let subject = '';
  let body = '';

  if (tone === 'professional') {
    subject = `Website concept created for ${lead.businessName}`;
    body = `Hi ${lead.businessName} Team,

I recently came across ${lead.businessName}${loc} while researching established ${lead.category.toLowerCase()} businesses.

${
  noSite
    ? `I noticed that you don't currently have a dedicated, mobile-friendly website where prospective clients can view your services, timings, and get in touch directly.`
    : `I reviewed your current website and noticed a few key opportunities to significantly improve mobile speed and direct customer enquiries.`
}

To demonstrate what a modern online presence could look like for ${lead.businessName}, I put together a quick, interactive website concept:

👉 Concept Preview: ${url}

This demo is designed specifically for mobile visitors with fast loading and direct WhatsApp enquiry integration.

If you like the direction and would like to explore putting a dedicated website live for ${lead.businessName}, I would be happy to discuss details with you.

Best regards,
${senderName}
${agencyName} | ${settings.portfolioUrl || 'https://business-portfolio-bice.vercel.app/'}
${settings.whatsappNumber ? `WhatsApp: ${settings.whatsappNumber}` : ''}`;
  } else if (tone === 'friendly') {
    subject = `Quick website concept for ${lead.businessName} 👋`;
    body = `Hi there! 👋

I came across ${lead.businessName} while looking at top ${lead.category.toLowerCase()} spots${loc}. Love what you're doing!

${
  noSite
    ? `I noticed you don't have an official website yet, so I went ahead and created a clean website concept to show how your brand and services could look online.`
    : `I took a look at your website and noticed a few ways we could give your online presence a fresh, ultra-fast modern upgrade.`
}

You can take a quick look at the live preview here:
🔗 ${url}

It's fully responsive and includes a 1-tap WhatsApp booking button for your customers.

No obligation at all—just wanted to share the idea. If you find it interesting and want to chat about customizing it for your business, feel free to reply right here!

Cheers,
${senderName}
${agencyName}`;
  } else {
    // Short / High-impact tone
    subject = `Quick website demo for ${lead.businessName}`;
    body = `Hi! I put together a free mobile website concept for ${lead.businessName} to show how your services and WhatsApp bookings could look online:

🔗 ${url}

Would love to know your thoughts if you're open to exploring a modern web presence!

Best,
${senderName} (${agencyName})`;
  }

  return {
    id: `msg-${Date.now()}`,
    status: 'GENERATED',
    tone,
    subject,
    body,
    channel: lead.phone ? 'whatsapp' : 'email',
    generatedAt: new Date().toISOString(),
  };
}

export function generateFollowUpMessage(
  lead: Lead,
  settings: AgencySettings,
  step: number = 1
): string {
  const url = lead.demoUrl || `https://demo.dhanexstudio.com/${lead.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const senderName = 'Dhanush from Dhanex Studio';

  if (step === 1) {
    return `Hi ${lead.businessName} Team,

Just following up on my note earlier regarding the custom website concept I created for ${lead.businessName}.

In case you missed the link, here is the interactive preview:
🔗 ${url}

Let me know if you'd like to make any adjustments to the layout or services shown!

Best,
${senderName}`;
  }

  return `Hi ${lead.businessName} Team,

Hope you're having a productive week! 

Just checking in one final time to see if you had a chance to view the website concept demo for ${lead.businessName} (${url}).

If you're currently focused on other priorities, no worries at all! I'm always available whenever you're ready to enhance your web presence.

Warm regards,
${senderName}`;
}
