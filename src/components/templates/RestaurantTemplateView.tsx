import React, { useState } from 'react';
import { DemoCustomization } from '../../types';
import { UtensilsCrossed, Clock, MapPin, Phone, MessageSquare, CheckCircle, Sparkles, ChefHat } from 'lucide-react';

interface Props {
  data: DemoCustomization;
}

export const RestaurantTemplateView: React.FC<Props> = ({ data }) => {
  const primaryColor = data.primaryColor || '#ea580c';
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Concept Watermark Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-orange-950 to-amber-950 text-amber-200 text-xs px-4 py-2 text-center font-medium border-b border-orange-500/30 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span>Concept Demo • Prepared by Dhanex Studio for <strong>{data.businessName}</strong></span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-stone-100 block leading-tight">{data.businessName}</span>
            <span className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold">Dining & Culinary</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-stone-300 font-medium">
          <a href="#menu" className="hover:text-amber-400 transition-colors">Menu Highlights</a>
          <a href="#story" className="hover:text-amber-400 transition-colors">Our Story</a>
          <a href="#reservation" className="hover:text-amber-400 transition-colors">Table Booking</a>
          <a href="#location" className="hover:text-amber-400 transition-colors">Contact</a>
        </div>

        <a
          href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20would%20like%20to%20reserve%20a%20table.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white shadow-md hover:brightness-110 transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{data.ctaText || 'Reserve Table'}</span>
        </a>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-12 pb-24 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-stone-950 to-stone-950 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-orange-500/30 text-xs font-semibold text-amber-300 shadow-inner">
              <ChefHat className="w-3.5 h-3.5 text-orange-400" />
              <span>{data.badgeText || 'Freshly Crafted Culinary Delights'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-100 tracking-tight leading-[1.15]">
              {data.heroHeadline || `Savor Exceptional Dining at ${data.businessName}`}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {data.heroDescription || 'Immerse your senses in authentic flavors, handcrafted chef specials, and hospitable dining prepared with finest local ingredients.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20would%20like%20to%20book%20a%20table%20for%20dinner.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <MessageSquare className="w-4 h-4" />
                {data.ctaText || 'Book Table on WhatsApp'}
              </a>

              <a
                href={`tel:${data.ctaPhone}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{data.ctaPhone || 'Call Restaurant'}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 group">
              <img
                src={data.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'}
                alt={data.businessName}
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">Serving in</p>
                  <p className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    {data.location}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                  Dine-in & Takeaway
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Specialties */}
      <section id="menu" className="py-16 px-4 md:px-8 bg-stone-900/50 border-y border-stone-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight">Signature Offerings</h2>
            <p className="text-stone-400 text-sm">Crafted with passion by seasoned chefs using farm-fresh seasonal produce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services?.map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="rounded-2xl bg-stone-950 border border-stone-800/90 p-6 flex flex-col justify-between space-y-4 hover:border-orange-500/40 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="space-y-3">
                  {srv.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {srv.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-stone-100 group-hover:text-orange-300 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400">{srv.price || 'Specialty'}</span>
                  <a
                    href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20would%20like%20to%20order%20or%20enquire%20about%20${encodeURIComponent(srv.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-orange-400 hover:text-orange-300"
                  >
                    Enquire Order →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Timings */}
      <section id="story" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight">{data.aboutTitle || `Our Hospitality & Heritage`}</h2>
            <p className="text-stone-300 text-sm leading-relaxed">{data.aboutStory}</p>

            <div className="space-y-2.5 pt-2">
              {data.features?.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div id="reservation" className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Dining Hours & Booking
            </h3>
            <div className="space-y-3 text-xs text-stone-300 divide-y divide-stone-800">
              <div className="pt-2 flex justify-between font-medium">
                <span>Opening Hours</span>
                <span className="text-stone-100 font-semibold">{data.openingHours}</span>
              </div>
              <div className="pt-3 flex justify-between font-medium">
                <span>Location</span>
                <span className="text-stone-100 font-semibold">{data.location}</span>
              </div>
              <div className="pt-3 flex justify-between font-medium">
                <span>Phone Booking</span>
                <span className="text-stone-100 font-semibold">{data.ctaPhone}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${data.ctaWhatsapp}?text=Hi%20${encodeURIComponent(data.businessName)},%20I%20would%20like%20to%20reserve%20a%20table.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageSquare className="w-4 h-4" />
              Direct WhatsApp Table Booking
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-8 px-4 text-center text-xs text-stone-500 space-y-2">
        <p>© {new Date().getFullYear()} {data.businessName}. All rights reserved.</p>
        <p className="text-[11px] text-stone-600">{data.disclaimerText}</p>
      </footer>
    </div>
  );
};
