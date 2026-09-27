import React from 'react';
import { DemoCustomization } from '../../types';
import { GraduationCap, Clock, MapPin, Phone, MessageSquare, CheckCircle, BookOpen, Award, Users, FileText } from 'lucide-react';

interface Props {
  data: DemoCustomization;
}

export const EducationTemplateView: React.FC<Props> = ({ data }) => {
  const primaryColor = data.primaryColor || '#2563eb';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Concept Watermark Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 text-blue-200 text-xs px-4 py-2 text-center font-medium border-b border-blue-500/30 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
        <span>Concept Demo • Prepared by Dhanex Studio for <strong>{data.businessName}</strong></span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-white block leading-tight">{data.businessName}</span>
            <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Academy & Test Prep</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <a href="#courses" className="hover:text-blue-400 transition-colors">Courses & Batches</a>
          <a href="#pedagogy" className="hover:text-blue-400 transition-colors">Methodology</a>
          <a href="#admissions" className="hover:text-blue-400 transition-colors">Free Demo Class</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Campus</a>
        </div>

        <a
          href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20want%20to%20enquire%20about%20admissions.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white shadow-md hover:brightness-110 transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{data.ctaText || 'Book Free Demo'}</span>
        </a>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-12 pb-24 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs font-semibold text-blue-300 shadow-inner">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>{data.badgeText || 'Admissions Open for New Academic Session'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {data.heroHeadline || `Empowering Academic Excellence at ${data.businessName}`}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {data.heroDescription || 'Structured curriculum, experienced educators, small batch sizes, and proven test methodologies to guarantee conceptual clarity and top ranks.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20would%20like%20to%20register%20for%20a%20free%20demo%20class.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <MessageSquare className="w-4 h-4" />
                {data.ctaText || 'Register for Free Demo Class'}
              </a>

              <a
                href={`tel:${data.ctaPhone}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{data.ctaPhone || 'Call Admissions'}</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Small Batch Sizes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>1-on-1 Doubt Sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Comprehensive Mock Tests</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
              <img
                src={data.heroImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800'}
                alt={data.businessName}
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Campus Location</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {data.location}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  Batches Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Courses Grid */}
      <section id="courses" className="py-16 px-4 md:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Academic Programs & Batches</h2>
            <p className="text-slate-400 text-sm">Targeted courses designed to build strong foundations and peak exam confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services?.map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/40 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="space-y-3">
                  {srv.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {srv.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400">{srv.price || 'Enrollment Open'}</span>
                  <a
                    href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20want%20details%20for%20${encodeURIComponent(srv.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    View Curriculum →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology & Contact */}
      <section id="pedagogy" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{data.aboutTitle || `Our Teaching Methodology`}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{data.aboutStory}</p>

            <div className="space-y-2.5 pt-2">
              {data.features?.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div id="admissions" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Admissions & Class Schedule
            </h3>
            <div className="space-y-3 text-xs text-slate-300 divide-y divide-slate-800">
              <div className="pt-2 flex justify-between font-medium">
                <span>Timings</span>
                <span className="text-white font-semibold">{data.openingHours}</span>
              </div>
              <div className="pt-3 flex justify-between font-medium">
                <span>Campus Address</span>
                <span className="text-white font-semibold">{data.location}</span>
              </div>
              <div className="pt-3 flex justify-between font-medium">
                <span>Counselor Hotline</span>
                <span className="text-white font-semibold">{data.ctaPhone}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20would%20like%20to%20book%20a%20free%20trial%20class.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageSquare className="w-4 h-4" />
              Instant WhatsApp Demo Booking
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
