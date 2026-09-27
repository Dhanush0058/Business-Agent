import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Send,
  Building2,
  MapPin,
  Flame,
  PieChart,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { leads } = useApp();

  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.priority === 'HOT').length;
  const demosBuilt = leads.filter((l) => l.demoCustomization !== undefined).length;
  const demosApproved = leads.filter((l) => l.demoApproved).length;
  const messagesSent = leads.filter((l) => ['CONTACTED', 'REPLIED', 'INTERESTED', 'DEMO_SENT', 'CALL_SCHEDULED', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
  const repliesReceived = leads.filter((l) => ['REPLIED', 'INTERESTED', 'DEMO_SENT', 'CALL_SCHEDULED', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
  const dealsWon = leads.filter((l) => l.status === 'WON').length;

  const totalRevenueWon = leads
    .filter((l) => l.status === 'WON')
    .reduce((acc, l) => acc + (l.dealValue || 25000), 0);

  const replyRate = messagesSent > 0 ? Math.round((repliesReceived / messagesSent) * 100) : 0;
  const winRate = messagesSent > 0 ? Math.round((dealsWon / messagesSent) * 100) : 0;

  // Niche performance calculation
  const niches = ['Gym & Fitness', 'Restaurant & Café', 'Coaching Centre', 'Salon & Spa'];
  const nicheStats = niches.map((niche) => {
    const nicheLeads = leads.filter((l) => l.category.includes(niche.split(' ')[0]));
    const nicheTotal = nicheLeads.length;
    const nicheHot = nicheLeads.filter((l) => l.priority === 'HOT').length;
    const nicheWon = nicheLeads.filter((l) => l.status === 'WON').length;
    const nicheContacted = nicheLeads.filter((l) => ['CONTACTED', 'REPLIED', 'INTERESTED', 'WON'].includes(l.status)).length;

    return {
      niche,
      total: nicheTotal,
      hot: nicheHot,
      contacted: nicheContacted,
      won: nicheWon,
      winRate: nicheContacted > 0 ? Math.round((nicheWon / nicheContacted) * 100) : 0,
    };
  });

  // Location breakdown
  const locations = ['Hyderabad', 'Bengaluru', 'Mumbai'];
  const locationStats = locations.map((city) => {
    const cityLeads = leads.filter((l) => l.location.toLowerCase().includes(city.toLowerCase()));
    const cityWon = cityLeads.filter((l) => l.status === 'WON').length;
    return {
      city,
      count: cityLeads.length,
      won: cityWon,
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Agency Intelligence & Performance Metrics
          </h2>
          <p className="text-xs text-slate-400">
            Data-backed visibility into niche conversions, reply rates, and pipeline ROI for Dhanex Studio.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-right">
          <p className="text-[10px] uppercase font-bold text-emerald-400">Total Closed Revenue</p>
          <p className="text-xl font-black text-emerald-300">₹{totalRevenueWon.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Response Rate</span>
          <p className="text-3xl font-black text-indigo-400">{replyRate}%</p>
          <span className="text-[10px] text-slate-500">{repliesReceived} replies from {messagesSent} pitches</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Pitch-to-Close Rate</span>
          <p className="text-3xl font-black text-emerald-400">{winRate}%</p>
          <span className="text-[10px] text-slate-500">{dealsWon} closed accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Demo Approval Rate</span>
          <p className="text-3xl font-black text-purple-400">
            {demosBuilt > 0 ? Math.round((demosApproved / demosBuilt) * 100) : 0}%
          </p>
          <span className="text-[10px] text-slate-500">{demosApproved} of {demosBuilt} approved</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">High-Intent Leads</span>
          <p className="text-3xl font-black text-rose-400">{hotLeads}</p>
          <span className="text-[10px] text-slate-500">{Math.round((hotLeads / (totalLeads || 1)) * 100)}% of total discovered</span>
        </div>
      </div>

      {/* Niche Conversion Comparison */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Performance Breakdown by Client Niche
          </h3>
          <p className="text-xs text-slate-400">
            Identifies which business verticals yield the highest reply interest and close probability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nicheStats.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{item.niche}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                  {item.total} Prospects
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Hot Leads:</span>
                  <span className="text-rose-400 font-bold">{item.hot}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pitched:</span>
                  <span className="text-slate-200 font-semibold">{item.contacted}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Won Clients:</span>
                  <span className="text-emerald-400 font-bold">{item.won}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Win Rate:</span>
                <span className="font-black text-emerald-400">{item.winRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            Geographical Hub Distribution
          </h3>
          <div className="space-y-3">
            {locationStats.map((loc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{loc.city}</p>
                  <p className="text-[10px] text-slate-400">{loc.count} Total Discovered Leads</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">{loc.won} Won Deals</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Strategic Insight Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Agency Growth Recommendation
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Top Opportunity: Gym & Fitness Studios in Hyderabad
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fitness businesses in Hyderabad exhibit the highest rate of missing or poor websites (82%), while demonstrating intense local customer interest for WhatsApp membership trials. Personalized PulseFit demos achieve strong 40%+ response engagement.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            💡 <strong>Pro Tip:</strong> Keep outreach messages to under 3 sentences for busy gym owners and salon managers.
          </div>
        </div>
      </div>
    </div>
  );
};
