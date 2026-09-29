import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve Dynamic HTML Template Projects
app.use('/templates/gym', express.static(path.resolve('GYM - Copy')));
app.use('/templates/restaurant', express.static(path.resolve('Restaurant - Copy')));
app.use('/templates/education', express.static(path.resolve('Education - Copy')));

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; padding: 40px; background: #0b0f19; color: white; min-height: 100vh;">
      <h1 style="color: #6366f1;">⚡ Dhanex Studio Backend Server</h1>
      <p style="color: #94a3b8;">Frontend Web App running at <a href="http://localhost:5173" style="color: #38bdf8;">http://localhost:5173</a></p>
      <h3 style="margin-top: 30px;">🌐 Dynamic Live Templates:</h3>
      <ul>
        <li><a href="/templates/gym/?business_name=Target+Fitness&location=Hyderabad" style="color: #facc15;">Gym & Fitness Template</a></li>
        <li><a href="/templates/restaurant/?business_name=SavorCraft+Bistro&location=Hyderabad" style="color: #f97316;">Restaurant Template</a></li>
        <li><a href="/templates/education/?business_name=EduPeak+Academy&location=Hyderabad" style="color: #60a5fa;">Education Template</a></li>
      </ul>
      <h3 style="margin-top: 30px;">🩺 Health Check:</h3>
      <a href="/api/health" style="color: #34d399;">/api/health</a>
    </div>
  `);
});

// Console logging helper with timestamps & colors
const log = {
  info: (msg) => console.log(`\x1b[36m[${new Date().toLocaleTimeString()}] [INFO]\x1b[0m ${msg}`),
  ai: (msg) => console.log(`\x1b[35m[${new Date().toLocaleTimeString()}] [GROQ AI]\x1b[0m ${msg}`),
  maps: (msg) => console.log(`\x1b[33m[${new Date().toLocaleTimeString()}] [GEOAPIFY]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[${new Date().toLocaleTimeString()}] [SUCCESS]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[${new Date().toLocaleTimeString()}] [WARN]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[${new Date().toLocaleTimeString()}] [ERROR]\x1b[0m ${msg}`),
};

const getEffectiveKeys = () => {
  return {
    groq: (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '').trim(),
    geoapify: (process.env.GEOAPIFY_API_KEY || process.env.VITE_GEOAPIFY_API_KEY || '').trim(),
    gemini: (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim(),
  };
};

// 1. Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  const keys = getEffectiveKeys();
  res.json({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      groqAi: {
        configured: !!keys.groq,
        model: 'qwen/qwen3.8-27b',
        keySnippet: keys.groq ? `${keys.groq.substring(0, 8)}...` : 'Not Configured',
      },
      geoapifyPlaces: {
        configured: !!keys.geoapify,
        keySnippet: keys.geoapify ? `${keys.geoapify.substring(0, 8)}...` : 'Not Configured',
      },
      geminiAi: {
        configured: !!keys.gemini,
        keySnippet: keys.gemini ? `${keys.gemini.substring(0, 8)}...` : 'Not Configured',
      },
      liveVercelSites: {
        gym: 'https://gym-project1-pi.vercel.app/',
        restaurant: 'https://restuarant-project2.vercel.app/',
        education: 'https://education-project3.vercel.app/',
      },
    },
  });
});

// 2. Groq AI Opportunity Analysis Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  const { lead, apiKey } = req.body;
  const keys = getEffectiveKeys();
  const effectiveKey = (apiKey || keys.groq).trim();

  if (!lead || !lead.businessName) {
    log.error('Analyze request missing lead data');
    return res.status(400).json({ error: 'Lead data is required' });
  }

  log.ai(`Analyzing lead: "${lead.businessName}" (${lead.category}, ${lead.location})`);

  if (!effectiveKey) {
    log.warn('No Groq API key available for analysis');
    return res.status(401).json({ error: 'Groq API Key is not configured' });
  }

  const prompt = `You are a strategic freelance web agency advisor for Dhanex Studio.
Analyze the following local business prospect factual data:
- Business Name: ${lead.businessName}
- Category: ${lead.category}
- Location: ${lead.location}
- Current Website: ${lead.website || 'No website'}
- Website Status: ${lead.websiteStatus || 'NO_WEBSITE'}
- Public Phone: ${lead.phone || 'N/A'}
- Instagram: ${lead.instagram || 'N/A'}
- Description: ${lead.description || 'N/A'}
- Services: ${lead.services?.join(', ') || 'N/A'}

Rules:
1. Strictly DO NOT hallucinate awards, revenue numbers, customer counts, or fake reviews.
2. Return ONLY a raw JSON object (no markdown, no backticks) with keys:
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

  const model = 'qwen/qwen3.8-27b';
  const start = Date.now();

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an agency strategist. Output strictly raw valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    const ms = Date.now() - start;

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      log.error(`Groq API returned HTTP ${groqRes.status}: ${errText}`);
      return res.status(groqRes.status).json({ error: 'Groq API error', details: errText });
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;
    const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    log.success(`AI analysis completed for "${lead.businessName}" in ${ms}ms [Priority: ${parsed.priority}]`);
    return res.json({ success: true, latencyMs: ms, model, data: parsed });
  } catch (err) {
    log.error(`AI analysis exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

// 3. Groq AI Outreach Pitch Drafting Endpoint
app.post('/api/ai/outreach', async (req, res) => {
  const { lead, tone = 'friendly', demoUrl = '', apiKey, settings } = req.body;
  const keys = getEffectiveKeys();
  const effectiveKey = (apiKey || settings?.groqApiKey || keys.groq).trim();

  if (!lead || !lead.businessName) {
    return res.status(400).json({ error: 'Lead data is required' });
  }

  log.ai(`Drafting ${tone} outreach message for "${lead.businessName}"`);

  if (!effectiveKey) {
    log.warn('No Groq API key configured for outreach drafting');
    return res.status(401).json({ error: 'Groq API key required' });
  }

  const prompt = `You are writing a personalized client outreach message for Dhanex Studio (freelance web agency).
Business Info:
- Name: ${lead.businessName}
- Category: ${lead.category}
- Location: ${lead.location}
- Current Website Status: ${lead.websiteStatus || 'NO_WEBSITE'}
- Concept Demo URL: ${demoUrl}
- Requested Tone: ${tone}
- Sender: Dhanush from Dhanex Studio (${settings?.portfolioUrl || 'https://business-portfolio-bice.vercel.app/'})

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

  const model = 'qwen/qwen3.8-27b';
  const start = Date.now();

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You write high-converting agency outreach copy. Output strictly raw JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    });

    const ms = Date.now() - start;

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      log.error(`Groq outreach error: HTTP ${groqRes.status}`);
      return res.status(groqRes.status).json({ error: errText });
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;
    const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    log.success(`Generated outreach draft for "${lead.businessName}" in ${ms}ms`);
    return res.json({
      success: true,
      latencyMs: ms,
      message: {
        id: `msg-${Date.now()}`,
        status: 'GENERATED',
        tone,
        subject: parsed.subject || `Website concept for ${lead.businessName}`,
        body: parsed.body || '',
        channel: lead.phone ? 'whatsapp' : 'email',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    log.error(`Outreach exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

// 4. Geoapify Places Search Endpoint
app.post('/api/places/search', async (req, res) => {
  const { category, location, limit = 10, apiKey } = req.body;
  const keys = getEffectiveKeys();
  const effectiveKey = (apiKey || keys.geoapify).trim();

  log.maps(`Searching live places: "${category}" in "${location}" (limit: ${limit})`);

  if (!effectiveKey) {
    log.warn('Geoapify API key is missing');
    return res.status(401).json({ error: 'Geoapify API key required' });
  }

  const start = Date.now();
  try {
    // 1. Geocode
    const geocodeRes = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${effectiveKey}`
    );
    if (!geocodeRes.ok) {
      log.error(`Geocoding failed: HTTP ${geocodeRes.status}`);
      return res.status(geocodeRes.status).json({ error: 'Geocoding failed' });
    }

    const geocodeData = await geocodeRes.json();
    const cityFeature = geocodeData?.features?.[0];
    if (!cityFeature) {
      log.warn(`Location not found: "${location}"`);
      return res.json({ success: true, count: 0, places: [] });
    }

    const [lon, lat] = cityFeature.geometry.coordinates;

    // 2. Map category
    let geoCat = 'catering.restaurant,sport.fitness,education.school';
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('gym') || catLower.includes('fitness')) geoCat = 'sport.fitness,sport.sports_centre';
    else if (catLower.includes('restaurant') || catLower.includes('caf')) geoCat = 'catering.restaurant,catering.cafe';
    else if (catLower.includes('coaching') || catLower.includes('education')) geoCat = 'education.school,education.college';

    const placesUrl = `https://api.geoapify.com/v2/places?categories=${geoCat}&filter=circle:${lon},${lat},20000&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${effectiveKey}`;
    const placesRes = await fetch(placesUrl);
    const ms = Date.now() - start;

    if (!placesRes.ok) {
      log.error(`Places fetch failed: HTTP ${placesRes.status}`);
      return res.status(placesRes.status).json({ error: 'Places search failed' });
    }

    const placesData = await placesRes.json();
    const features = placesData?.features || [];

    log.success(`Discovered ${features.length} live places in "${location}" in ${ms}ms`);
    return res.json({
      success: true,
      latencyMs: ms,
      count: features.length,
      features,
    });
  } catch (err) {
    log.error(`Places search exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n\x1b[1m\x1b[32m======================================================\x1b[0m`);
  console.log(`\x1b[1m\x1b[32m   ⚡ Dhanex Lead Agent - Backend Server Running      \x1b[0m`);
  console.log(`\x1b[1m\x1b[32m   🌐 Listening on: http://localhost:${PORT}          \x1b[0m`);
  console.log(`\x1b[1m\x1b[32m======================================================\x1b[0m\n`);
  log.info(`Health check live at: http://localhost:${PORT}/api/health`);
  log.info(`Monitoring Groq AI, Geoapify Maps, and live business API requests...\n`);
});
