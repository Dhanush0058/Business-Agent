import { Lead, AIQualification, OutreachMessage, AgencySettings } from '../types';
import { matchTemplateForCategory } from './templateRegistry';

export async function runLiveGeminiAnalysis(
  lead: Lead,
  apiKey: string
): Promise<AIQualification | null> {
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  const prompt = `You are a strategic freelance web agency advisor for Dhanex Studio.
Analyze the following local business prospect factual data:
- Business Name: ${lead.businessName}
- Category: ${lead.category}
- Location: ${lead.location}
- Current Website: ${lead.website || 'No website'}
- Website Status: ${lead.websiteStatus}
- Public Phone: ${lead.phone || 'N/A'}
- Instagram: ${lead.instagram || 'N/A'}
- Description: ${lead.description || 'N/A'}
- Services: ${lead.services?.join(', ') || 'N/A'}

Rules:
1. Strictly DO NOT hallucinate awards, revenue numbers, customer counts, or fake reviews.
2. Return ONLY a valid JSON object matching this schema:
{
  "businessSummary": "string",
  "onlinePresenceSummary": "string",
  "mainOpportunity": "string",
  "potentialWebsiteNeed": "string",
  "recommendedService": "string",
  "recommendedTemplate": "fitness" | "restaurant" | "education",
  "priority": "HOT" | "WARM" | "LOW",
  "priorityReason": "string"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API returned error status:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      const parsed = JSON.parse(text);
      return {
        businessSummary: parsed.businessSummary || `${lead.businessName} in ${lead.location}`,
        onlinePresenceSummary: parsed.onlinePresenceSummary || 'Analyzed web presence',
        mainOpportunity: parsed.mainOpportunity || 'Modern mobile website with WhatsApp CTA',
        potentialWebsiteNeed: parsed.potentialWebsiteNeed || 'Mobile-first conversion website',
        recommendedService: parsed.recommendedService || 'Mobile-First Business Website',
        recommendedTemplate: parsed.recommendedTemplate || matchTemplateForCategory(lead.category),
        priority: parsed.priority || 'HOT',
        priorityReason: parsed.priorityReason || 'High intent business prospect',
      };
    }
  } catch (err) {
    console.error('Gemini API call failed:', err);
  }

  return null;
}

export async function runLiveGeminiOutreach(
  lead: Lead,
  settings: AgencySettings,
  tone: 'professional' | 'friendly' | 'short',
  demoUrl: string,
  apiKey: string
): Promise<OutreachMessage | null> {
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  const prompt = `You are writing a personalized client outreach message for Dhanex Studio (freelance web agency).
Business Info:
- Name: ${lead.businessName}
- Category: ${lead.category}
- Location: ${lead.location}
- Current Website Status: ${lead.websiteStatus}
- Concept Demo URL: ${demoUrl}
- Requested Tone: ${tone}
- Sender: Dhanush from Dhanex Studio (${settings.portfolioUrl || 'dhanexstudio.com'})

Strict Compliance Guidelines:
1. Clearly disclose that the link is an independent "Website Concept" created by Dhanex Studio.
2. Do NOT promise guaranteed revenue increases.
3. Do NOT pretend to have a preexisting relationship with the business.
4. Keep it concise, friendly, and respectful.

Return ONLY a JSON object:
{
  "subject": "string",
  "body": "string"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          id: `msg-${Date.now()}`,
          status: 'GENERATED',
          tone,
          subject: parsed.subject || `Website concept for ${lead.businessName}`,
          body: parsed.body || '',
          channel: lead.phone ? 'whatsapp' : 'email',
          generatedAt: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.error('Gemini API outreach generation error:', err);
  }

  return null;
}
