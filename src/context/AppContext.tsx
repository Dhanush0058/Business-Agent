import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  LeadStatus,
  AgencySettings,
  DemoCustomization,
  OutreachMessage,
  FollowUpItem,
} from '../types';
import { DEFAULT_SCORING_RULES, calculateLeadScore } from '../services/scoringEngine';
import { analyzeWebsite } from '../services/websiteAnalyzer';
import { runAIQualification, generateOutreachMessage } from '../services/aiAdvisor';
import { generatePersonalizedDemoData } from '../services/templateRegistry';
import { DEPLOYMENT_PROVIDERS } from '../services/deploymentProviders';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  leads: Lead[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  settings: AgencySettings;
  updateSettings: (updates: Partial<AgencySettings>) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Lead actions
  addLead: (lead: Partial<Lead>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  batchImportLeads: (newLeads: Lead[]) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;

  // Workflow actions
  analyzeLeadWebsite: (id: string) => void;
  generateDemoForLead: (id: string, templateId?: string, overrideData?: Partial<DemoCustomization>) => Promise<void>;
  approveDemoForLead: (id: string) => void;
  generateOutreachForLead: (id: string, tone?: 'professional' | 'friendly' | 'short') => void;
  approveOutreachForLead: (id: string) => void;
  markContacted: (id: string, channel?: string) => void;

  // Follow-up actions
  addFollowUp: (leadId: string, item: Partial<FollowUpItem>) => void;
  completeFollowUp: (leadId: string, followUpId: string) => void;
  rescheduleFollowUp: (leadId: string, followUpId: string, newDate: string) => void;
  deleteFollowUp: (leadId: string, followUpId: string) => void;

  // State reset
  resetToDefaultSeedData: () => void;
}

const DEFAULT_SETTINGS: AgencySettings = {
  agencyName: 'Dhanex Studio',
  agencyTagline: 'Bespoke High-Converting Websites & Digital Fronts',
  portfolioUrl: 'https://dhanexstudio.com',
  whatsappNumber: '+91 98765 43210',
  email: 'dhanush@dhanexstudio.com',
  instagramHandle: '@dhanexstudio',
  defaultTone: 'friendly',
  defaultCTA: 'Schedule 10-Min Walkthrough via WhatsApp',
  defaultPricing: '₹15,000 - ₹35,000 per bespoke website concept',
  demoDisclaimer: 'Website Concept prepared exclusively by Dhanex Studio. Independent demonstration of modern online presence capabilities.',
  deploymentProvider: 'local',
  customDomain: 'demo.dhanexstudio.com',
  aiProvider: 'local-smart',
  apiKey: '',
  scoringRules: DEFAULT_SCORING_RULES,
};

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-sky9-fitness',
    businessName: 'Sky9 Female Fitness Studio',
    category: 'Gym & Fitness',
    location: 'Attapur, Hyderabad',
    website: '',
    websiteStatus: 'NO_WEBSITE',
    phone: '+91 98490 12345',
    email: 'contact@sky9fitness.in',
    instagram: '@sky9_fitness_hyd',
    facebook: '',
    otherLinks: [],
    description: 'Exclusive women-only fitness center offering weight loss, Zumba, cross-training and certified female trainers.',
    services: ['Female Strength Training', 'Zumba Dance Fitness', 'Postpartum Weight Management', 'Personalized Diet Plans'],
    businessActivity: 'Active daily operations (4.8 stars on Google with 120+ ratings)',
    googleMapsRef: 'https://maps.google.com/?q=Sky9+Female+Fitness+Studio+Attapur',
    source: 'Discovery Engine',
    dateAdded: '2026-09-24T10:00:00.000Z',
    lastResearched: '2026-09-26T14:30:00.000Z',
    leadScore: 90,
    scoreBreakdown: {
      noWebsiteScore: 30,
      poorWebsiteScore: 0,
      activePresenceScore: 20,
      contactAvailableScore: 10,
      socialPresenceScore: 10,
      relevanceScore: 5,
      totalScore: 90,
    },
    priority: 'HOT',
    status: 'QUALIFIED',
    assignedTemplate: 'fitness',
    demoApproved: false,
    notes: 'Very active on Instagram with regular workout stories, but potential clients currently have nowhere to see full program details or book consultations.',
    followUps: [
      {
        id: 'fu-1',
        step: 1,
        label: 'Initial Demo Outreach',
        scheduledDate: new Date().toISOString().split('T')[0], // Today
        completed: false,
        notes: 'Send personalized concept demo showing female fitness programs & WhatsApp instant join.',
        suggestedMessage: 'Hi Sky9 team, I noticed you do not have an official website yet, so I put together a quick interactive concept...',
      }
    ],
  },
  {
    id: 'lead-royal-spice',
    businessName: 'Royal Spice Biryani & Grill House',
    category: 'Restaurant & Café',
    location: 'Indiranagar, Bengaluru',
    website: 'http://royalspicebiryani-old.ind.in/index.php',
    websiteStatus: 'POOR',
    phone: '+91 80 4123 7890',
    email: 'orders@royalspicegrill.com',
    instagram: '@royalspice_blr',
    facebook: '',
    otherLinks: [],
    description: 'Traditional Dum Biryani and charcoal grilled kebabs serving authentic Hyderabadi and Awadhi cuisine.',
    services: ['Dum Biryani Specialties', 'Tandoor & Charcoal Grill', 'Family Dining & Banquets', 'Outdoor Catering'],
    businessActivity: 'Active busy restaurant with 2,400+ dine-in customers monthly',
    googleMapsRef: 'https://maps.google.com/?q=Royal+Spice+Biryani+Indiranagar',
    source: 'Discovery Engine',
    dateAdded: '2026-09-22T08:30:00.000Z',
    lastResearched: '2026-09-25T11:00:00.000Z',
    leadScore: 85,
    scoreBreakdown: {
      noWebsiteScore: 0,
      poorWebsiteScore: 25,
      activePresenceScore: 20,
      contactAvailableScore: 10,
      socialPresenceScore: 10,
      relevanceScore: 5,
      totalScore: 85,
    },
    priority: 'HOT',
    status: 'DEMO_GENERATED',
    assignedTemplate: 'restaurant',
    demoApproved: false,
    demoUrl: 'https://demo.dhanexstudio.com/royal-spice-biryani',
    notes: 'Existing website has slow HTTP and unreadable mobile menu PDF. Needs sensory digital menu and 1-tap WhatsApp table booking.',
    followUps: [],
  },
  {
    id: 'lead-apex-academy',
    businessName: 'Apex IIT-JEE & NEET Academy',
    category: 'Coaching Centre',
    location: 'Madhapur, Hyderabad',
    website: 'http://apexacademy2014.wixsite.com/main',
    websiteStatus: 'POOR',
    phone: '+91 99887 65432',
    email: 'admissions@apexacademy.edu.in',
    instagram: '@apex_academy_hyd',
    facebook: '',
    otherLinks: [],
    description: 'Premier coaching institute with specialized faculty for IIT-JEE Advanced and NEET entrance examinations.',
    services: ['IIT-JEE 2-Year Integrated Batch', 'NEET Repeaters & Crash Course', 'Weekend Foundation Series', '1-on-1 Mentorship'],
    businessActivity: 'Active coaching institute with 350+ enrolled students',
    googleMapsRef: 'https://maps.google.com/?q=Apex+Academy+Madhapur',
    source: 'Discovery Engine',
    dateAdded: '2026-09-20T14:15:00.000Z',
    lastResearched: '2026-09-26T09:00:00.000Z',
    leadScore: 85,
    scoreBreakdown: {
      noWebsiteScore: 0,
      poorWebsiteScore: 25,
      activePresenceScore: 20,
      contactAvailableScore: 10,
      socialPresenceScore: 10,
      relevanceScore: 5,
      totalScore: 85,
    },
    priority: 'HOT',
    status: 'MESSAGE_READY',
    assignedTemplate: 'education',
    demoApproved: true,
    demoApprovedAt: '2026-09-26T10:00:00.000Z',
    demoUrl: 'https://demo.dhanexstudio.com/apex-iit-jee-academy',
    notes: 'Admissions open for new batch next month. Approved concept demo highlighting syllabus and free demo class registration.',
    followUps: [
      {
        id: 'fu-2',
        step: 1,
        label: 'Send Approved Pitch',
        scheduledDate: new Date().toISOString().split('T')[0],
        completed: false,
        notes: 'Message is ready and demo approved. Send via WhatsApp / Email.',
        suggestedMessage: 'Hi Apex Academy team, I created an interactive website concept for your upcoming admissions batch...',
      }
    ],
  },
  {
    id: 'lead-glow-grace',
    businessName: 'Glow & Grace Luxury Hair Salon',
    category: 'Salon & Spa',
    location: 'Bandra West, Mumbai',
    website: '',
    websiteStatus: 'NO_WEBSITE',
    phone: '+91 98200 55441',
    email: 'appointments@glowandgrace.com',
    instagram: '@glowandgrace_bandra',
    facebook: '',
    otherLinks: [],
    description: 'Boutique hair styling and organic skin treatment salon featuring senior creative stylists.',
    services: ['Balayage & Hair Coloring', 'Keratin & Botox Treatments', 'Bridal Makeover', 'Organic Skin Facials'],
    businessActivity: 'High footfall weekend bookings, active Instagram stories daily',
    googleMapsRef: 'https://maps.google.com/?q=Glow+Grace+Salon+Bandra',
    source: 'Discovery Engine',
    dateAdded: '2026-09-23T11:20:00.000Z',
    lastResearched: '2026-09-25T16:00:00.000Z',
    leadScore: 80,
    scoreBreakdown: {
      noWebsiteScore: 30,
      poorWebsiteScore: 0,
      activePresenceScore: 20,
      contactAvailableScore: 10,
      socialPresenceScore: 10,
      relevanceScore: 5,
      totalScore: 80,
    },
    priority: 'HOT',
    status: 'CONTACTED',
    assignedTemplate: 'fitness',
    demoApproved: true,
    demoUrl: 'https://demo.dhanexstudio.com/glow-and-grace-salon',
    notes: 'Contacted owner via WhatsApp with demo link on Sep 25. Awaiting reply.',
    followUps: [
      {
        id: 'fu-3',
        step: 2,
        label: 'Follow-up Check-in',
        scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        completed: false,
        notes: 'Check if they had a chance to view the salon lookbook concept.',
        suggestedMessage: 'Hi Glow & Grace team, just checking in to see if you had a chance to look at the concept demo...',
      }
    ],
  },
  {
    id: 'lead-urban-pulse',
    businessName: 'Urban Pulse CrossFit Arena',
    category: 'Gym & Fitness',
    location: 'Gachibowli, Hyderabad',
    website: 'http://urbanpulse-crossfit.blogspot.com',
    websiteStatus: 'POOR',
    phone: '+91 97000 88990',
    email: 'hello@urbanpulse.fit',
    instagram: '@urbanpulsecrossfit',
    facebook: '',
    otherLinks: [],
    description: 'High intensity functional fitness facility with certified CrossFit Level-2 coaches and open turf area.',
    services: ['CrossFit WOD Sessions', 'Olympic Weightlifting', 'Endurance & Mobility Bootcamps', 'Body Composition Tracking'],
    businessActivity: 'Active morning and evening batches with 180+ community members',
    googleMapsRef: 'https://maps.google.com/?q=Urban+Pulse+CrossFit+Gachibowli',
    source: 'Discovery Engine',
    dateAdded: '2026-09-18T10:00:00.000Z',
    lastResearched: '2026-09-24T12:00:00.000Z',
    leadScore: 85,
    scoreBreakdown: {
      noWebsiteScore: 0,
      poorWebsiteScore: 25,
      activePresenceScore: 20,
      contactAvailableScore: 10,
      socialPresenceScore: 10,
      relevanceScore: 5,
      totalScore: 85,
    },
    priority: 'HOT',
    status: 'WON',
    assignedTemplate: 'fitness',
    demoApproved: true,
    demoUrl: 'https://demo.dhanexstudio.com/urban-pulse-crossfit',
    notes: 'Client signed ₹28,000 website package after loving the live mobile preview demo! Deployment scheduled.',
    dealValue: 28000,
    followUps: [],
  },
];

// Initialize helper to pre-fill AI qualifications and demo data
function hydrateInitialLeads(leads: Lead[]): Lead[] {
  return leads.map((l) => {
    const analysis = l.websiteAnalysis || analyzeWebsite(l.website, l.businessName, l.category);
    const qual = l.aiQualification || runAIQualification({ ...l, websiteAnalysis: analysis });
    const demo = l.demoCustomization || generatePersonalizedDemoData(l, l.assignedTemplate);
    const outreach = l.outreachMessage || generateOutreachMessage(l, DEFAULT_SETTINGS, 'friendly', l.demoUrl);

    return {
      ...l,
      websiteAnalysis: analysis,
      aiQualification: qual,
      demoCustomization: demo,
      outreachMessage: outreach,
    };
  });
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('dhanex_leads_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return hydrateInitialLeads(INITIAL_LEADS);
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const [settings, setSettings] = useState<AgencySettings>(() => {
    try {
      const saved = localStorage.getItem('dhanex_settings_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist leads
  useEffect(() => {
    try {
      localStorage.setItem('dhanex_leads_v2', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('dhanex_settings_v2', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (updates: Partial<AgencySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      // Re-calculate all lead scores with new scoring rules
      if (updates.scoringRules) {
        setLeads((currentLeads) =>
          currentLeads.map((l) => {
            const scoreResult = calculateLeadScore(l, updated.scoringRules);
            return {
              ...l,
              leadScore: scoreResult.score,
              scoreBreakdown: scoreResult.breakdown,
              priority: scoreResult.priority,
            };
          })
        );
      }
      return updated;
    });
    showToast('Agency settings updated successfully', 'success');
  };

  const addLead = (partial: Partial<Lead>): Lead => {
    const id = `lead-${Date.now()}`;
    const name = partial.businessName || 'New Prospect Business';
    const cat = partial.category || 'Local Business';
    const loc = partial.location || 'Hyderabad, India';
    const web = partial.website || '';

    const analysis = analyzeWebsite(web, name, cat);
    const scoreResult = calculateLeadScore(
      {
        ...partial,
        websiteStatus: analysis.status,
      },
      settings.scoringRules
    );

    const newLead: Lead = {
      id,
      businessName: name,
      category: cat,
      location: loc,
      website: web,
      websiteStatus: analysis.status,
      websiteAnalysis: analysis,
      phone: partial.phone || '',
      email: partial.email || '',
      instagram: partial.instagram || '',
      facebook: partial.facebook || '',
      otherLinks: partial.otherLinks || [],
      description: partial.description || '',
      services: partial.services || [],
      businessActivity: partial.businessActivity || 'Active local business',
      googleMapsRef: partial.googleMapsRef || '',
      source: partial.source || 'Manual Entry',
      dateAdded: new Date().toISOString(),
      lastResearched: new Date().toISOString(),
      leadScore: scoreResult.score,
      scoreBreakdown: scoreResult.breakdown,
      priority: scoreResult.priority,
      status: 'NEW',
      assignedTemplate: partial.assignedTemplate || (cat.toLowerCase().includes('fitness') ? 'fitness' : cat.toLowerCase().includes('restaurant') ? 'restaurant' : 'education'),
      demoApproved: false,
      notes: partial.notes || '',
      followUps: [],
    };

    newLead.aiQualification = runAIQualification(newLead);
    newLead.demoCustomization = generatePersonalizedDemoData(newLead, newLead.assignedTemplate);
    newLead.outreachMessage = generateOutreachMessage(newLead, settings, settings.defaultTone);

    setLeads((prev) => [newLead, ...prev]);
    showToast(`Lead "${name}" created and analyzed successfully!`, 'success');
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...updates };

        // Recalculate score if factors changed
        if (
          updates.website !== undefined ||
          updates.websiteStatus !== undefined ||
          updates.phone !== undefined ||
          updates.instagram !== undefined ||
          updates.businessActivity !== undefined
        ) {
          const res = calculateLeadScore(updated, settings.scoringRules);
          updated.leadScore = res.score;
          updated.scoreBreakdown = res.breakdown;
          updated.priority = res.priority;
        }
        return updated;
      })
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLeadId === id) setSelectedLeadId(null);
    showToast('Lead removed', 'info');
  };

  const batchImportLeads = (newLeads: Lead[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
    showToast(`Imported ${newLeads.length} leads successfully!`, 'success');
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        if (status === 'WON' && l.status !== 'WON') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          showToast(`🎉 Deal Won for ${l.businessName}!`, 'success');
        }
        return { ...l, status };
      })
    );
  };

  const analyzeLeadWebsite = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const analysis = analyzeWebsite(lead.website, lead.businessName, lead.category);
    const scoreResult = calculateLeadScore(
      {
        ...lead,
        websiteStatus: analysis.status,
      },
      settings.scoringRules
    );

    const qual = runAIQualification({
      ...lead,
      websiteStatus: analysis.status,
      websiteAnalysis: analysis,
      leadScore: scoreResult.score,
    });

    updateLead(id, {
      websiteStatus: analysis.status,
      websiteAnalysis: analysis,
      leadScore: scoreResult.score,
      scoreBreakdown: scoreResult.breakdown,
      priority: scoreResult.priority,
      aiQualification: qual,
      lastResearched: new Date().toISOString(),
      status: lead.status === 'NEW' ? 'QUALIFIED' : lead.status,
    });

    showToast(`Completed website audit for ${lead.businessName} (Score: ${analysis.overallScore}/100)`, 'success');
  };

  const generateDemoForLead = async (id: string, templateId?: string, overrideData?: Partial<DemoCustomization>) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const tpl = templateId || lead.assignedTemplate;
    const baseCustomization = generatePersonalizedDemoData(lead, tpl);
    const finalCustomization: DemoCustomization = {
      ...baseCustomization,
      ...(overrideData || {}),
    };

    // Deploy preview via active provider
    const deployer = DEPLOYMENT_PROVIDERS[settings.deploymentProvider] || DEPLOYMENT_PROVIDERS['local'];
    const deployRes = await deployer.deploy(lead, finalCustomization, settings.customDomain);

    finalCustomization.deployedUrl = deployRes.url;

    updateLead(id, {
      assignedTemplate: tpl,
      demoCustomization: finalCustomization,
      demoUrl: deployRes.url,
      status: lead.status === 'NEW' || lead.status === 'QUALIFIED' ? 'DEMO_GENERATED' : lead.status,
    });

    showToast(`Personalized demo generated: ${deployRes.previewSlug}`, 'success');
  };

  const approveDemoForLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const outreach = generateOutreachMessage(lead, settings, settings.defaultTone, lead.demoUrl);

    updateLead(id, {
      demoApproved: true,
      demoApprovedAt: new Date().toISOString(),
      status: 'DEMO_APPROVED',
      outreachMessage: outreach,
    });

    showToast(`Demo approved! Generated outreach pitch for human review.`, 'success');
  };

  const generateOutreachForLead = (id: string, tone: 'professional' | 'friendly' | 'short' = 'friendly') => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const msg = generateOutreachMessage(lead, settings, tone, lead.demoUrl);
    updateLead(id, {
      outreachMessage: msg,
      status: lead.status === 'DEMO_APPROVED' ? 'MESSAGE_READY' : lead.status,
    });

    showToast(`Generated ${tone} outreach draft for ${lead.businessName}`, 'info');
  };

  const approveOutreachForLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || !lead.outreachMessage) return;

    updateLead(id, {
      outreachMessage: {
        ...lead.outreachMessage,
        status: 'APPROVED',
        approvedAt: new Date().toISOString(),
      },
      status: 'MESSAGE_READY',
    });

    showToast(`Outreach message approved by human reviewer. Ready to send!`, 'success');
  };

  const markContacted = (id: string, channel: string = 'WhatsApp') => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const nextFollowUpDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]; // +3 days
    const followUpItem: FollowUpItem = {
      id: `fu-${Date.now()}`,
      step: 1,
      label: 'Follow-up 1 (Check-in)',
      scheduledDate: nextFollowUpDate,
      completed: false,
      notes: `Sent initial ${channel} message with demo concept link. Follow up in 3 days if no response.`,
      suggestedMessage: `Hi ${lead.businessName} Team, just following up to check if you had a moment to preview the custom website demo...`,
    };

    updateLead(id, {
      status: 'CONTACTED',
      outreachMessage: lead.outreachMessage
        ? {
            ...lead.outreachMessage,
            status: 'SENT',
            sentAt: new Date().toISOString(),
          }
        : undefined,
      followUps: [followUpItem, ...(lead.followUps || [])],
    });

    showToast(`Marked as Contacted via ${channel}. Follow-up scheduled for ${nextFollowUpDate}.`, 'success');
  };

  const addFollowUp = (leadId: string, item: Partial<FollowUpItem>) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const newItem: FollowUpItem = {
      id: `fu-${Date.now()}`,
      step: (lead.followUps?.length || 0) + 1,
      label: item.label || 'Follow-up',
      scheduledDate: item.scheduledDate || new Date().toISOString().split('T')[0],
      completed: false,
      notes: item.notes || '',
      suggestedMessage: item.suggestedMessage || '',
    };

    updateLead(leadId, {
      followUps: [newItem, ...(lead.followUps || [])],
      status: 'FOLLOW_UP',
    });

    showToast(`Follow-up scheduled for ${lead.businessName}`, 'success');
  };

  const completeFollowUp = (leadId: string, followUpId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedFollowUps = (lead.followUps || []).map((fu) =>
      fu.id === followUpId ? { ...fu, completed: true, completedAt: new Date().toISOString() } : fu
    );

    updateLead(leadId, {
      followUps: updatedFollowUps,
    });

    showToast('Follow-up task marked as completed!', 'success');
  };

  const rescheduleFollowUp = (leadId: string, followUpId: string, newDate: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedFollowUps = (lead.followUps || []).map((fu) =>
      fu.id === followUpId ? { ...fu, scheduledDate: newDate } : fu
    );

    updateLead(leadId, {
      followUps: updatedFollowUps,
    });

    showToast(`Follow-up rescheduled to ${newDate}`, 'info');
  };

  const deleteFollowUp = (leadId: string, followUpId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    updateLead(leadId, {
      followUps: (lead.followUps || []).filter((fu) => fu.id !== followUpId),
    });
    showToast('Follow-up removed', 'info');
  };

  const resetToDefaultSeedData = () => {
    const fresh = hydrateInitialLeads(INITIAL_LEADS);
    setLeads(fresh);
    setSettings(DEFAULT_SETTINGS);
    showToast('Reset to demo dataset successfully!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        leads,
        activeTab,
        setActiveTab,
        selectedLeadId,
        setSelectedLeadId,
        settings,
        updateSettings,
        toasts,
        showToast,
        dismissToast,
        addLead,
        updateLead,
        deleteLead,
        batchImportLeads,
        updateLeadStatus,
        analyzeLeadWebsite,
        generateDemoForLead,
        approveDemoForLead,
        generateOutreachForLead,
        approveOutreachForLead,
        markContacted,
        addFollowUp,
        completeFollowUp,
        rescheduleFollowUp,
        deleteFollowUp,
        resetToDefaultSeedData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
