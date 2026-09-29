import fs from 'fs';

// Read .env file
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch {
  console.log('Reading system env...');
}

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=([^\\r\\n]+)`));
  return (match ? match[1].trim() : process.env[key] || '').trim();
};

const groqKey = getEnv('VITE_GROQ_API_KEY');
const geoKey = getEnv('VITE_GEOAPIFY_API_KEY');
const targetNumber = '9347249697';
const agencyPortfolio = 'https://business-portfolio-bice.vercel.app/';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`\n${colors.bright}${colors.cyan}================================================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan} 🏋️ LIVE OUTREACH SIMULATION: DISCOVERY -> AI COPY -> WHATSAPP  ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}================================================================${colors.reset}\n`);

async function runSimulation() {
  // Step 1: Discover nearest gym in Hyderabad via Geoapify
  console.log(`${colors.bright}${colors.yellow}📍 [Step 1] Finding Nearest Gym in Hyderabad via Geoapify...${colors.reset}`);
  
  const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=Hyderabad&apiKey=${geoKey}`;
  const geoRes = await fetch(geocodeUrl);
  const geoData = await geoRes.json();
  const [lon, lat] = geoData?.features?.[0]?.geometry?.coordinates || [78.4867, 17.3850];

  const placesUrl = `https://api.geoapify.com/v2/places?categories=sport.fitness&filter=circle:${lon},${lat},10000&limit=1&apiKey=${geoKey}`;
  const placesRes = await fetch(placesUrl);
  const placesData = await placesRes.json();

  const feature = placesData?.features?.[0];
  const gymName = feature?.properties?.name || "LORD'S GYM";
  const gymAddress = feature?.properties?.formatted || 'Nagole, Hyderabad';

  console.log(`   ${colors.green}✅ Nearest Gym Discovered:${colors.reset} "${gymName}"`);
  console.log(`   📍 Location: ${gymAddress}`);

  // Step 2: Generate Customized Live Vercel Concept Demo URL
  console.log(`\n${colors.bright}${colors.blue}🌐 [Step 2] Building Interactive Gym Website Demo URL...${colors.reset}`);
  const demoParams = new URLSearchParams({
    business_name: gymName,
    category: 'Gym & Fitness',
    location: 'Hyderabad, India',
    phone: `+91 ${targetNumber}`,
    whatsapp: `91${targetNumber}`,
    concept: 'true',
    agency: 'Dhanex Studio',
  });
  const demoUrl = `https://gym-project1-pi.vercel.app/?${demoParams.toString()}`;
  console.log(`   ${colors.green}✅ Live Personalized Demo Link:${colors.reset}\n   ${demoUrl}`);

  // Step 3: Generate AI Outreach Pitch with Groq
  console.log(`\n${colors.bright}${colors.magenta}🤖 [Step 3] Generating Personalized Pitch via Groq AI (Qwen 3.8-27B)...${colors.reset}`);
  const prompt = `You are writing a personalized WhatsApp client outreach message for Dhanush from Dhanex Studio (freelance web agency).
Business Info:
- Name: ${gymName}
- Category: Gym & Fitness
- Location: ${gymAddress}
- Current Website Status: NO_WEBSITE
- Concept Demo URL: ${demoUrl}
- Requested Tone: friendly
- Sender: Dhanush from Dhanex Studio (${agencyPortfolio})
- Sender WhatsApp: +91 ${targetNumber}

Strict Guidelines:
1. Clearly disclose that the link is an independent "Website Concept" created by Dhanex Studio.
2. No fake revenue claims or pushy sales tactics.
3. Keep it brief, conversational, and respectful for WhatsApp.

Return ONLY a raw JSON object:
{
  "subject": "string",
  "body": "string"
}`;

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.8-27b',
      messages: [
        { role: 'system', content: 'You are an agency copywriter. Return strictly raw JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  const groqData = await groqRes.json();
  const parsed = JSON.parse(groqData?.choices?.[0]?.message?.content || '{}');
  const messageBody = parsed.body || '';

  console.log(`   ${colors.green}✅ AI Message Generated:${colors.reset}\n`);
  console.log(`--------------------------------------------------`);
  console.log(messageBody);
  console.log(`--------------------------------------------------`);

  // Step 4: Construct WhatsApp Direct Trigger URL to test on your number
  const encodedText = encodeURIComponent(messageBody);
  const waUrl = `https://wa.me/91${targetNumber}?text=${encodedText}`;

  console.log(`\n${colors.bright}${colors.green}🚀 [Step 4] Direct 1-Click WhatsApp Trigger Ready!${colors.reset}`);
  console.log(`   Click this link to send the test message to +91 ${targetNumber}:\n`);
  console.log(`   ${colors.bright}${colors.cyan}${waUrl}${colors.reset}\n`);
}

runSimulation();
