import { Lead, AIQualification, OutreachMessage, AgencySettings } from '../types';
import { matchTemplateForCategory } from './templateRegistry';

// Active Groq models in prioritized order
const GROQ_PRIMARY_MODEL = 'qwen/qwen3.8-27b';
const GROQ_FALLBACK_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

export async function runLiveGroqAnalysis(
  lead: Lead,
  apiKey?: string
): Promise<AIQualification | null> {
  const effectiveKey = (
    apiKey ||
    (import.meta as any).env?.VITE_GROQ_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('groq_api_key') : '') ||
    ''
  ).trim();

  if (!effectiveKey) {
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
2. Return ONLY a raw, valid JSON object (no markdown, no backticks, no extra text) matching this schema:
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

  const modelsToTry = [GROQ_PRIMARY_MODEL, ...GROQ_FALLBACK_MODELS];

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert agency advisor. Output strictly raw JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        console.warn(`Groq API (${model}) returned status:`, response.status);
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
          businessSummary: parsed.businessSummary || `${lead.businessName} in ${lead.location}`,
          onlinePresenceSummary: parsed.onlinePresenceSummary || `Verified local presence in ${lead.location}`,
          mainOpportunity: parsed.mainOpportunity || 'Mobile-responsive website with 1-tap WhatsApp booking',
          potentialWebsiteNeed: parsed.potentialWebsiteNeed || 'Modern high-speed conversion website',
          recommendedService: parsed.recommendedService || 'Mobile-First Business Website & WhatsApp Funnel',
          recommendedTemplate: parsed.recommendedTemplate || matchTemplateForCategory(lead.category),
          priority: parsed.priority || (lead.leadScore >= 80 ? 'HOT' : 'WARM'),
          priorityReason: parsed.priorityReason || 'High-intent local business with strong growth opportunity',
        };
      }
    } catch (err) {
      console.warn(`Groq model ${model} attempt failed:`, err);
    }
  }

  return null;
}

export async function runLiveGroqOutreach(
  lead: Lead,
  settings: AgencySettings,
  tone: 'professional' | 'friendly' | 'short',
  demoUrl: string,
  apiKey?: string
): Promise<OutreachMessage | null> {
  const effectiveKey = (
    apiKey ||
    settings.groqApiKey ||
    (import.meta as any).env?.VITE_GROQ_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('groq_api_key') : '') ||
    ''
  ).trim();

  if (!effectiveKey) {
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

Return ONLY a raw JSON object (no backticks, no markdown):
{
  "subject": "string",
  "body": "string"
}`;

  const modelsToTry = [GROQ_PRIMARY_MODEL, ...GROQ_FALLBACK_MODELS];

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You write high-converting, honest agency outreach copy. Output strictly raw JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.4,
          response_format: { type: 'json_object' },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
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
      console.warn(`Groq model ${model} outreach attempt failed:`, err);
    }
  }

  return null;
}
