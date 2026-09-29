import fs from 'fs';

let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch {}

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=([^\\r\\n]+)`));
  return (match ? match[1].trim() : process.env[key] || '').trim();
};

const geoKey = getEnv('VITE_GEOAPIFY_API_KEY');

async function findGymsWithPhone() {
  const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=Hyderabad&apiKey=${geoKey}`;
  const geoRes = await fetch(geocodeUrl);
  const geoData = await geoRes.json();
  const [lon, lat] = geoData?.features?.[0]?.geometry?.coordinates || [78.4867, 17.3850];

  const placesUrl = `https://api.geoapify.com/v2/places?categories=sport.fitness&filter=circle:${lon},${lat},25000&limit=30&apiKey=${geoKey}`;
  const placesRes = await fetch(placesUrl);
  const placesData = await placesRes.json();

  console.log(`Found ${placesData?.features?.length || 0} gyms in Hyderabad:\n`);
  placesData?.features?.forEach((f, i) => {
    const p = f.properties;
    console.log(`${i + 1}. Name: ${p.name || 'Unnamed'}`);
    console.log(`   Address: ${p.formatted || p.street || 'N/A'}`);
    console.log(`   Phone: ${p.datasource?.raw?.phone || p.datasource?.raw?.['contact:phone'] || p.contact?.phone || 'No phone on map entry'}`);
    console.log(`   Coordinates: ${f.geometry?.coordinates}`);
    console.log('---');
  });
}

findGymsWithPhone();
