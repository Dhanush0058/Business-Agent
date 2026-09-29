import { DemoCustomization, Lead, ServiceItem } from '../types';

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
  externalBaseUrl?: string;
  variables: string[];
  defaultCustomization: Partial<DemoCustomization>;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'fitness',
    name: 'PulseFit Pro — Gym & Studio Template',
    category: 'Fitness & Wellness',
    description: 'High-energy, mobile-first design with dynamic class schedules, trainer highlights, membership tiers, and WhatsApp 1-tap trial booking.',
    previewImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    externalBaseUrl: 'https://gym-project1-pi.vercel.app',
    version: '2.4.0',
    status: 'active',
    demoCount: 14,
    lastUpdated: '2026-09-20',
    variables: [
      '{{business_name}}',
      '{{tagline}}',
      '{{hero_headline}}',
      '{{hero_description}}',
      '{{primary_color}}',
      '{{cta_whatsapp}}',
      '{{cta_phone}}',
      '{{location}}',
      '{{opening_hours}}',
      '{{services}}',
      '{{features}}',
      '{{hero_image}}',
    ],
    defaultCustomization: {
      templateId: 'fitness',
      tagline: 'Transform Your Body & Mind',
      heroHeadline: 'Premium Fitness & Personal Training Experience',
      heroDescription: 'Join our welcoming community with state-of-the-art equipment, personalized workout plans, and certified expert trainers.',
      badgeText: '✨ Now Offering Complimentary Trial Sessions',
      primaryColor: '#6366f1',
      secondaryColor: '#ec4899',
      accentColor: '#10b981',
      ctaText: 'Claim Free 1-Day Pass via WhatsApp',
      location: 'Hyderabad, India',
      openingHours: 'Mon - Sat: 5:30 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM',
      aboutTitle: 'Why Choose Our Fitness Studio',
      aboutStory: 'Founded with a passion for holistic health and strength, we provide a clean, modern, and supportive environment tailored to all fitness levels—from beginners to advanced athletes.',
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
      ],
      features: [
        'Certified Elite Personal Trainers',
        'Dedicated Strength & Cardio Zones',
        'Zumba, Yoga & HIIT Group Classes',
        'Clean Locker Rooms & Steam Facilities',
        'Personalized Diet & Nutrition Guidance',
      ],
      disclaimerText: 'Website Concept prepared exclusively by Dhanex Studio. Independent demonstration of modern online presence capabilities.',
    },
  },
  {
    id: 'restaurant',
    name: 'SavorCraft — Restaurant & Café Template',
    category: 'Food & Hospitality',
    description: 'Sensory, appetite-inducing restaurant layout with interactive digital menu categories, chef specials, online table reservation, and WhatsApp ordering.',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    externalBaseUrl: 'https://restuarant-project2.vercel.app',
    version: '2.2.1',
    status: 'active',
    demoCount: 19,
    lastUpdated: '2026-09-22',
    variables: [
      '{{business_name}}',
      '{{tagline}}',
      '{{hero_headline}}',
      '{{hero_description}}',
      '{{primary_color}}',
      '{{cta_whatsapp}}',
      '{{location}}',
      '{{opening_hours}}',
      '{{services}}',
      '{{hero_image}}',
    ],
    defaultCustomization: {
      templateId: 'restaurant',
      tagline: 'Authentic Flavors & Memorable Moments',
      heroHeadline: 'Exquisite Culinary Dining & Fresh Comfort Bites',
      heroDescription: 'Experience handcrafted delicacies made with fresh locally-sourced ingredients in a cozy, vibrant atmosphere.',
      badgeText: '🍽️ Table Reservations & Takeaway Orders Available',
      primaryColor: '#ea580c',
      secondaryColor: '#b45309',
      accentColor: '#eab308',
      ctaText: 'Reserve Table via WhatsApp',
      location: 'Bengaluru, India',
      openingHours: 'Everyday: 11:30 AM - 11:00 PM',
      aboutTitle: 'A Passion for Extraordinary Dining',
      aboutStory: 'We bring together traditional recipes and contemporary cooking techniques to create dining experiences that delight every palate. From cozy family gatherings to celebratory evenings.',
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
      ],
      features: [
        'Fresh Handcrafted Daily Menu',
        'Hygienic Open Kitchen Preparation',
        'Outdoor & Indoor Family Seating',
        'Express WhatsApp Table Booking',
        'Catering for Private Events',
      ],
      disclaimerText: 'Website Concept prepared exclusively by Dhanex Studio. Independent demonstration of modern online presence capabilities.',
    },
  },
  {
    id: 'education',
    name: 'EduPeak — Academy & Coaching Template',
    category: 'Education & Training',
    description: 'Structured, high-trust academic design featuring course curricula, faculty credentials, batch schedules, student reviews, and instant demo class registration.',
    previewImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    externalBaseUrl: 'https://education-project3.vercel.app',
    version: '2.1.0',
    status: 'active',
    demoCount: 11,
    lastUpdated: '2026-09-18',
    variables: [
      '{{business_name}}',
      '{{tagline}}',
      '{{hero_headline}}',
      '{{hero_description}}',
      '{{primary_color}}',
      '{{cta_whatsapp}}',
      '{{location}}',
      '{{opening_hours}}',
      '{{services}}',
      '{{hero_image}}',
    ],
    defaultCustomization: {
      templateId: 'education',
      tagline: 'Guiding Bright Minds to Academic Excellence',
      heroHeadline: 'Comprehensive Coaching & Expert Mentorship',
      heroDescription: 'Empowering students with structured curricula, small interactive batches, and personalized doubt-clearing sessions to achieve top results.',
      badgeText: '🎓 Admissions Open for Upcoming Academic Batch',
      primaryColor: '#2563eb',
      secondaryColor: '#0284c7',
      accentColor: '#10b981',
      ctaText: 'Book a Free Demo Class via WhatsApp',
      location: 'Hyderabad, India',
      openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM',
      aboutTitle: 'Excellence in Pedagogy & Mentorship',
      aboutStory: 'Our seasoned educators are dedicated to building deep conceptual clarity and problem-solving agility. We track individual student progress to ensure consistent improvement and confidence.',
      heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=600&auto=format&fit=crop',
      ],
      features: [
        'Concept-Driven Interactive Teaching',
        'Regular Mock Tests & Performance Analytics',
        'Small Batch Sizes for Individual Attention',
        'Comprehensive Study Material & Question Banks',
        'Dedicated 1-on-1 Doubt Clarification Hours',
      ],
      disclaimerText: 'Website Concept prepared exclusively by Dhanex Studio. Independent demonstration of modern online presence capabilities.',
    },
  },
];

export function matchTemplateForCategory(category: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('gym') || cat.includes('fitness') || cat.includes('yoga') || cat.includes('crossfit') || cat.includes('trainer') || cat.includes('sports') || cat.includes('salon') || cat.includes('spa')) {
    return 'fitness';
  }
  if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('bistro') || cat.includes('bakery') || cat.includes('food') || cat.includes('hotel') || cat.includes('bar')) {
    return 'restaurant';
  }
  if (cat.includes('coaching') || cat.includes('education') || cat.includes('institute') || cat.includes('academy') || cat.includes('school') || cat.includes('tutor') || cat.includes('training')) {
    return 'education';
  }
  return 'fitness'; // Default fallback
}

export function generateLiveDemoUrl(lead: Lead, templateId?: string): string {
  const chosenTemplateId = templateId || lead.assignedTemplate || matchTemplateForCategory(lead.category);
  const tpl = TEMPLATES.find((t) => t.id === chosenTemplateId) || TEMPLATES[0];
  const baseUrl = tpl.externalBaseUrl || 'https://gym-project1-pi.vercel.app';

  const params = new URLSearchParams({
    business_name: lead.businessName,
    category: lead.category,
    location: lead.location,
    phone: lead.phone || '',
    whatsapp: (lead.phone || '').replace(/[^0-9]/g, ''),
    concept: 'true',
    agency: 'Dhanex Studio',
  });

  return `${baseUrl}/?${params.toString()}`;
}

export function generatePersonalizedDemoData(lead: Lead, templateId?: string): DemoCustomization {
  const chosenTemplateId = templateId || lead.assignedTemplate || matchTemplateForCategory(lead.category);
  const tpl = TEMPLATES.find((t) => t.id === chosenTemplateId) || TEMPLATES[0];
  const defaults = tpl.defaultCustomization;

  // Build services list from lead data or smart category fallbacks
  let services: ServiceItem[] = [];

  if (lead.services && lead.services.length > 0) {
    services = lead.services.map((s, idx) => ({
      id: `srv-${idx + 1}`,
      title: s,
      desc: `Professional ${s.toLowerCase()} tailored to your unique requirements with premium quality assurance.`,
      price: idx === 0 ? 'Popular Choice' : undefined,
      badge: idx === 0 ? 'Featured' : undefined,
    }));
  } else if (chosenTemplateId === 'fitness') {
    services = [
      {
        id: 'srv-1',
        title: 'Complete Fitness & Gym Membership',
        desc: 'Unlimited access to all modern cardio, weight training, and recovery equipment with initial fitness assessment.',
        price: 'Monthly & Annual Plans',
        badge: 'Most Popular',
      },
      {
        id: 'srv-2',
        title: '1-on-1 Personal Training & Nutrition',
        desc: 'Dedicated coaching customized to your transformation goals, form correction, and personalized nutrition plan.',
        price: 'Custom Packages',
      },
      {
        id: 'srv-3',
        title: 'Group HIIT & Zumba Sessions',
        desc: 'High-energy, fun group workouts designed to torch calories and build endurance in a supportive atmosphere.',
        price: 'Flexible Batches',
      },
    ];
  } else if (chosenTemplateId === 'restaurant') {
    services = [
      {
        id: 'srv-1',
        title: 'Chef Special Signature Dishes',
        desc: 'Prepared daily with authentic spices and fresh premium ingredients for an unforgettable taste experience.',
        price: 'A La Carte',
        badge: "Chef's Recommendation",
      },
      {
        id: 'srv-2',
        title: 'Family Dining & Private Gatherings',
        desc: 'Spacious, comfortable seating arrangements with prompt, hospitable service for friends and family.',
        price: 'Table Reservation',
      },
      {
        id: 'srv-3',
        title: 'Direct Takeaway & WhatsApp Ordering',
        desc: 'Fast, secure food packaging keeping your meals piping hot and fresh for home dining.',
        price: 'Instant Pickup',
      },
    ];
  } else {
    services = [
      {
        id: 'srv-1',
        title: 'Comprehensive Classroom Batches',
        desc: 'In-depth syllabus coverage with concept-first lectures, detailed study booklets, and regular assessments.',
        price: 'Full Course',
        badge: 'Top Rated',
      },
      {
        id: 'srv-2',
        title: 'Intensive Test Series & Doubt Clearing',
        desc: 'Weekly simulated exam papers with ranking analytics and dedicated mentor doubt resolution sessions.',
        price: 'Term Plan',
      },
      {
        id: 'srv-3',
        title: 'Foundation & Fast-Track Workshops',
        desc: 'Targeted skill-building modules designed to reinforce core fundamentals for board & entrance success.',
        price: 'Short Term',
      },
    ];
  }

  const cleanPhone = lead.phone || '+91 93472 49697';
  const whatsappNum = cleanPhone.replace(/[^0-9]/g, '');

  return {
    templateId: chosenTemplateId,
    businessName: lead.businessName,
    tagline: defaults.tagline || 'Leading the Way in Quality & Service',
    heroHeadline: `${lead.businessName} — ${lead.category}`,
    heroDescription:
      lead.description ||
      `Experience premier ${lead.category.toLowerCase()} services in ${lead.location}. Dedicated to exceptional customer satisfaction and results.`,
    badgeText: defaults.badgeText || '✨ Welcome to Our Official Concept Experience',
    primaryColor: defaults.primaryColor || '#6366f1',
    secondaryColor: defaults.secondaryColor || '#4f46e5',
    accentColor: defaults.accentColor || '#10b981',
    ctaText: defaults.ctaText || 'Connect via WhatsApp',
    ctaWhatsapp: whatsappNum || '919347249697',
    ctaPhone: cleanPhone,
    location: lead.location || 'Hyderabad, India',
    openingHours: lead.hours || defaults.openingHours || 'Mon - Sat: 9:00 AM - 9:00 PM',
    aboutTitle: `About ${lead.businessName}`,
    aboutStory:
      lead.description ||
      `${lead.businessName} is a recognized local business in ${lead.location}, specializing in high standard ${lead.category.toLowerCase()}. Our focus is on delivering unmatched quality and client satisfaction.`,
    services,
    features: defaults.features || ['Top Quality Standards', 'Verified Customer Satisfaction', 'Direct Support'],
    heroImage: defaults.heroImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200',
    galleryImages: defaults.galleryImages || [],
    disclaimerText: 'Website Concept prepared exclusively by Dhanex Studio. Independent demonstration of modern online presence capabilities.',
    lastGeneratedAt: new Date().toISOString(),
    version: (lead.demoCustomization?.version || 0) + 1,
  };
}
