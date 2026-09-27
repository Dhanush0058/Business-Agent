import React from 'react';
import { DemoCustomization } from '../../types';
import { Dumbbell, Clock, MapPin, Phone, MessageSquare, CheckCircle, Flame, Star, ShieldCheck, HeartPulse } from 'lucide-react';

interface Props {
  data: DemoCustomization;
}

export const FitnessTemplateView: React.FC<Props> = ({ data }) => {
  const primaryColor = data.primaryColor || '#6366f1';

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Concept Watermark Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-indigo-200 text-xs px-4 py-2 text-center font-medium border-b border-indigo-500/30 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Concept Demo • Prepared by Dhanex Studio for <strong>{data.businessName}</strong></span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-white block leading-tight">{data.businessName}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fitness & Wellness</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <a href="#services" className="hover:text-white transition-colors">Programs</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#schedule" className="hover:text-white transition-colors">Timings</a>
          <a href="#contact" className="hover:text-white transition-colors">Location</a>
        </div>

        <a
          href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20saw%20your%20website%20and%20would%20like%20to%20enquire%20about%20membership.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white shadow-md hover:brightness-110 transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">{data.ctaText || 'WhatsApp Enquiry'}</span>
          <span className="sm:hidden">Enquire</span>
        </a>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 pb-20 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-indigo-300 shadow-inner">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{data.badgeText || 'Transform Your Body Today'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {data.heroHeadline || `Level Up Your Strength at ${data.businessName}`}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {data.heroDescription || 'State-of-the-art strength machinery, certified trainers, and customized fitness programs designed to achieve real transformation.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20want%20to%20claim%20a%20free%20trial%20session.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <MessageSquare className="w-4 h-4" />
                {data.ctaText || 'Claim Free 1-Day Trial'}
              </a>

              <a
                href={`tel:${data.ctaPhone}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{data.ctaPhone || 'Call Us'}</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Certified Coaches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hygienic Equipment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span>Custom Diet Support</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
              <img
                src={data.heroImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'}
                alt={data.businessName}
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Located at</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {data.location}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Open Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <section id="services" className="py-16 px-4 md:px-8 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Our Programs & Memberships</h2>
            <p className="text-slate-400 text-sm">Targeted training solutions structured around your personal health and physique milestones.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services?.map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="rounded-2xl bg-slate-950/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="space-y-3">
                  {srv.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {srv.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{srv.price || 'Flexible Plans'}</span>
                  <a
                    href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20am%20interested%20in%20${encodeURIComponent(srv.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Join Program →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Schedule */}
      <section id="about" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{data.aboutTitle || `About ${data.businessName}`}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{data.aboutStory}</p>

            <div className="space-y-2.5 pt-2">
              {data.features?.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Operating Hours
            </h3>
            <div className="space-y-3 text-xs text-slate-300 divide-y divide-slate-800">
              <div className="pt-2 flex justify-between font-medium">
                <span>Working Schedule</span>
                <span className="text-white font-semibold">{data.openingHours}</span>
              </div>
              <div className="pt-3 flex justify-between font-medium">
                <span>Location</span>
                <span className="text-white font-semibold">{data.location}</span>
              </div>
              <div className="pt-3 flex justify-between font-medium">
                <span>Direct Contact</span>
                <span className="text-white font-semibold">{data.ctaPhone}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20have%20a%20quick%20question.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageSquare className="w-4 h-4" />
              Instant WhatsApp Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>© {new Date().getFullYear()} {data.businessName}. All rights reserved.</p>
        <p className="text-[11px] text-slate-600">{data.disclaimerText}</p>
      </footer>
    </div>
  );
};
