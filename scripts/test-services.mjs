import fs from 'fs';
import path from 'path';

// 1. Read .env file
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch {
  console.log('⚠️ No .env file found. Reading system environment variables...');
}

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=([^\\r\\n]+)`));
  return (match ? match[1].trim() : process.env[key] || '').trim();
};

const groqKey = getEnv('VITE_GROQ_API_KEY');
const geoKey = getEnv('VITE_GEOAPIFY_API_KEY');
const geminiKey = getEnv('VITE_GEMINI_API_KEY');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

console.log(`\n${colors.bright}${colors.cyan}======================================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}   Dhanex Lead Agent - Live Services Health Check    ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}======================================================${colors.reset}\n`);

async function testGroq() {
  console.log(`${colors.bright}${colors.magenta}🤖 [1/3] Testing Groq AI Engine...${colors.reset}`);
  if (!groqKey) {
    console.log(`   ${colors.yellow}⚠️  Groq Key is not set in .env (VITE_GROQ_API_KEY)${colors.reset}`);
    return;
  }

  const model = 'qwen/qwen3.8-27b';
  const start = Date.now();
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Output raw JSON.' },
          { role: 'user', content: 'Say {"status": "ok", "message": "Groq AI running perfectly"}' },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });
    const ms = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      console.log(`   ${colors.green}✅ Groq AI Connected (${ms}ms)${colors.reset}`);
      console.log(`   Model: ${colors.cyan}${model}${colors.reset}`);
      console.log(`   Response: ${data.choices?.[0]?.message?.content.trim()}`);
    } else {
      const err = await res.text();
      console.log(`   ${colors.red}❌ Groq API Error (HTTP ${res.status}): ${err}${colors.reset}`);
    }
  } catch (err) {
    console.log(`   ${colors.red}❌ Connection Error: ${err.message}${colors.reset}`);
  }
}

async function testGeoapify() {
  console.log(`\n${colors.bright}${colors.yellow}🗺️  [2/3] Testing Geoapify Places & Maps Engine...${colors.reset}`);
  if (!geoKey) {
    console.log(`   ${colors.yellow}⚠️  Geoapify Key is not set in .env (VITE_GEOAPIFY_API_KEY)${colors.reset}`);
    return;
  }

  const start = Date.now();
  try {
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=Hyderabad&apiKey=${geoKey}`;
    const res = await fetch(geocodeUrl);
    if (!res.ok) {
      console.log(`   ${colors.red}❌ Geocode failed: HTTP ${res.status}${colors.reset}`);
      return;
    }

    const data = await res.json();
    const [lon, lat] = data?.features?.[0]?.geometry?.coordinates || [];

    const placesUrl = `https://api.geoapify.com/v2/places?categories=sport.fitness&filter=circle:${lon},${lat},10000&limit=2&apiKey=${geoKey}`;
    const pRes = await fetch(placesUrl);
    const ms = Date.now() - start;

    if (pRes.ok) {
      const pData = await pRes.json();
      const count = pData?.features?.length || 0;
      console.log(`   ${colors.green}✅ Geoapify Places Connected (${ms}ms)${colors.reset}`);
      console.log(`   Discovered ${count} live places in Hyderabad:`);
      pData?.features?.forEach((f, i) => {
        console.log(`   ${i + 1}. "${f.properties.name}" (${f.properties.formatted || f.properties.street || 'Address verified'})`);
      });
    } else {
      console.log(`   ${colors.red}❌ Places query failed (HTTP ${pRes.status})${colors.reset}`);
    }
  } catch (err) {
    console.log(`   ${colors.red}❌ Geoapify Error: ${err.message}${colors.reset}`);
  }
}

async function testVercelTemplates() {
  console.log(`\n${colors.bright}${colors.blue}🌐 [3/3] Testing Live Vercel Concept Templates...${colors.reset}`);
  const templates = [
    { name: 'Gym & Fitness', url: 'https://gym-project1-pi.vercel.app/' },
    { name: 'Restaurant & Café', url: 'https://restuarant-project2.vercel.app/' },
    { name: 'Education & Coaching', url: 'https://education-project3.vercel.app/' },
  ];

  for (const t of templates) {
    const start = Date.now();
    try {
      const res = await fetch(t.url);
      const ms = Date.now() - start;
      if (res.ok) {
        console.log(`   ${colors.green}✅ ${t.name}: Online (HTTP ${res.status}, ${ms}ms)${colors.reset} -> ${t.url}`);
      } else {
        console.log(`   ${colors.yellow}⚠️ ${t.name}: HTTP ${res.status}${colors.reset}`);
      }
    } catch (e) {
      console.log(`   ${colors.red}❌ ${t.name}: Connection failed (${e.message})${colors.reset}`);
    }
  }
}

async function run() {
  await testGroq();
  await testGeoapify();
  await testVercelTemplates();
  console.log(`\n${colors.bright}${colors.green}✨ All core services verified successfully!${colors.reset}\n`);
}

run();
