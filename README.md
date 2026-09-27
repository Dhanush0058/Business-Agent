# Dhanex Lead Agent — AI Lead Discovery & Personalized Demo Platform

A production-quality internal agency platform built for **Dhanex Studio** to discover local business clients, diagnose their web & mobile presence, generate live interactive concept website demos across Fitness, Dining, and Education niches, and draft personalized outreach pitches with strict human-in-the-loop approval.

---

## 🚀 Key Features

### 1. Executive Dashboard & 12-KPI Pipeline
- Real-time pipeline metrics: Total Leads, Hot Leads (Score ≥ 80), Warm Leads, No Website, Poor Website, Demos Generated, Messages Ready, Contacted, Replies, Interested, Proposals, and Won Deals.
- Interactive Conversion Funnel visualization tracking discovery-to-close dropoffs.
- Follow-ups Due Today action widget with 1-click pitch copying and completion tracking.

### 2. Targeted Prospect Discovery (`LeadSourceProvider` Abstraction)
- Legitimate discovery engine querying business categories (Gyms, Restaurants, Academies, Salons, Real Estate, Local Services) across major geographical hubs (Hyderabad, Bengaluru, Mumbai, Delhi, etc.).
- Pluggable provider architecture allowing instant swap with Google Places API, OpenStreetMap, or CSV/JSON batch importers.

### 3. Deep Website Quality & UX Analyzer
- Multi-dimensional scoring (0–100) across Mobile UX, Visual Design, Performance & Speed, CTA Funnel, Contact Accessibility, Content Clarity, and Technical Standards (HTTPS).
- Transparent diagnostic classification: `NO_WEBSITE`, `POOR`, `NEEDS_IMPROVEMENT`, `GOOD`, `STRONG`.
- Professional, objective explanations without degrading language.

### 4. Configurable Lead Scoring Engine
- Real-time transparent scoring formula:
  - Missing Website: `+30 pts`
  - Poor/Outdated Website: `+25 pts`
  - Active Operations: `+20 pts`
  - Public Contact Available: `+10 pts`
  - Active Social Presence: `+10 pts`
  - Dhanex Niche Relevance: `+5 pts`
- Fully editable score weights and Hot/Warm threshold sliders in Settings.

### 5. Reusable Website Template Architecture
- **PulseFit Pro** (Fitness & Gym Studio Template): High-energy hero, schedule/classes grid, trainer spotlight, membership tiers, WhatsApp 1-tap trial booking.
- **SavorCraft** (Restaurant & Café Template): Sensory culinary layout, interactive menu categories, chef specials, online table reservation, WhatsApp takeaway order.
- **EduPeak** (Academy & Coaching Template): Academic design, course curricula, batch schedules, faculty credentials, free demo class registration.
- Dynamic variable placeholder replacement (`{{business_name}}`, `{{tagline}}`, `{{hero_headline}}`, `{{cta_whatsapp}}`, `{{services}}`, etc.).

### 6. Interactive Demo Studio & Device Switcher
- Live responsive viewport with instant toggling between Desktop (1280px), Tablet (768px), and Mobile (375px).
- Prominent non-intrusive concept banner & watermark: *"Concept Demo • Prepared by Dhanex Studio for [Business Name]"*.
- Real-time customizer to edit copy, colors, WhatsApp numbers, services, and hero images.
- Full human review & approval gates (`Approve Demo`, `Regenerate`, `Copy Preview Link`).
- Standalone shareable full-screen route via `#preview/:leadId` or custom subdomains.

### 7. Personalized Outreach Studio & Human Safeguards
- Multi-tone generator: **Friendly** 👋, **Professional** 💼, and **Short** ⚡.
- Follow-up step sequences (Follow-up 1 after 3 days, Follow-up 2 after 7 days).
- Direct actions: Copy to clipboard, Open WhatsApp Web (`wa.me`), Open Default Mail (`mailto:`), and Mark as Contacted.
- Anti-spam & anti-hallucination guardrails: No false revenue claims, no fabricated reviews, and explicit concept disclaimer.

### 8. Follow-up Command Center
- Automated scheduling (+3 days on initial contact).
- Due today alerts, snooze options, and task history.

### 9. Agency Intelligence & Analytics
- Win rates and reply rates by business niche and geographical hub.
- Closed revenue tracking in Indian Rupees (₹).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphic UI Tokens, Lucide Icons, Canvas Confetti
- **State & Storage**: AppContext with LocalStorage synchronization
- **Routing**: Standalone concept preview hash router (`#preview/:leadId`)

---

## 📦 Setup & Running Locally

```bash
# Clone the repository
git clone https://github.com/Dhanush0058/Business-Agent.git
cd Business-Agent

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License & Ownership
Created for internal freelance client acquisition operations by **Dhanex Studio**.
