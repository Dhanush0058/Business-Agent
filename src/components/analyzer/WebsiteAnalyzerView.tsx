import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeWebsite } from '../../services/websiteAnalyzer';
import {
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Zap,
  MessageSquare,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const WebsiteAnalyzerView: React.FC = () => {
  const { leads, selectedLeadId, setSelectedLeadId, updateLead, generateDemoForLead, setActiveTab, showToast } = useApp();

  const [activeLeadId, setActiveLeadId] = useState<string>(selectedLeadId || (leads[0]?.id || ''));
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customName, setCustomName] = useState<string>('Sample Prospect');
  const [customCategory, setCustomCategory] = useState<string>('Local Business');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const currentLead = leads.find((l) => l.id === activeLeadId);

  const activeAnalysis = currentLead?.websiteAnalysis || (
    currentLead ? analyzeWebsite(currentLead.website, currentLead.businessName, currentLead.category) : null
  );

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLead) return;

    setIsAuditing(true);
    setTimeout(() => {
      const result = analyzeWebsite(currentLead.website, currentLead.businessName, currentLead.category);
      updateLead(currentLead.id, {
        websiteAnalysis: result,
        websiteStatus: result.status,
      });
      setIsAuditing(false);
      showToast(`Website audit completed for ${currentLead.businessName}`, 'success');
    }, 400);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Selector Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Website Quality & Conversion Audit
            </h2>
            <p className="text-xs text-slate-400">
              Diagnostic inspection of mobile responsiveness, conversion funnels, speed, and contact CTAs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Select Prospect:</span>
            <select
              value={activeLeadId}
              onChange={(e) => {
                setActiveLeadId(e.target.value);
                setSelectedLeadId(e.target.value);
              }}
              className="bg-slate-950 border border-slate-750 text-white font-bold text-xs rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none max-w-xs"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName} ({l.websiteStatus})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentLead && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-300">
              <span><strong>URL:</strong> {currentLead.website || '<No Website Listed>'}</span>
              <span><strong>Category:</strong> {currentLead.category}</span>
              <span><strong>Location:</strong> {currentLead.location}</span>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Re-run Audit</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {activeAnalysis && currentLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Score & Status Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Web Health</span>

              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border font-black ${getScoreColor(activeAnalysis.overallScore)}`}>
                  <span className="text-3xl leading-none">{activeAnalysis.overallScore}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">/ 100</span>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      activeAnalysis.status === 'NO_WEBSITE'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : activeAnalysis.status === 'POOR'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : activeAnalysis.status === 'NEEDS_IMPROVEMENT'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {activeAnalysis.status.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Audit Score for {currentLead.businessName}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Diagnostic Explanation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{activeAnalysis.explanation}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Recommended Dhanex Solution</p>
                <p className="text-xs font-bold text-indigo-300 mt-0.5">{activeAnalysis.recommendedService}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedLeadId(currentLead.id);
                  if (!currentLead.demoCustomization) {
                    generateDemoForLead(currentLead.id);
                  }
                  setActiveTab('demo-generator');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Personalize & Preview Concept Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-Scores & Check Matrix */}
          <div className="lg:col-span-8 space-y-6">
            {/* Sub-Score Bars */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-white tracking-tight">Performance & UX Dimension Scores</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(activeAnalysis.scores).map(([key, val]) => {
                  const labelMap: Record<string, string> = {
                    mobileUx: 'Mobile Responsiveness & UX',
                    design: 'Visual Design & Modernity',
                    performance: 'Loading Speed & Optimization',
                    cta: 'Call to Action & Conversion Funnel',
                    contactAccessibility: 'Contact Information Clarity',
                    contentClarity: 'Services & Content Presentation',
                    technicalQuality: 'HTTPS & Technical Standards',
                  };

                  return (
                    <div key={key} className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{labelMap[key] || key}</span>
                        <span className="font-extrabold text-white">{val} / 100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            val >= 70 ? 'bg-emerald-500' : val >= 45 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checklist Matrix */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Feature & Security Diagnostic Matrix</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  {activeAnalysis.checks.hasHttps ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">HTTPS Secure</p>
                    <p className="text-[10px] text-slate-400">{activeAnalysis.checks.hasHttps ? 'Encrypted' : 'Insecure'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  {activeAnalysis.checks.isMobileResponsive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">Mobile Viewport</p>
                    <p className="text-[10px] text-slate-400">{activeAnalysis.checks.isMobileResponsive ? 'Responsive' : 'Desktop Only'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  {activeAnalysis.checks.hasWhatsAppCTA ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">WhatsApp CTA</p>
                    <p className="text-[10px] text-slate-400">{activeAnalysis.checks.hasWhatsAppCTA ? 'Present' : 'Missing'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  {activeAnalysis.checks.isModernDesign ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">Modern Layout</p>
                    <p className="text-[10px] text-slate-400">{activeAnalysis.checks.isModernDesign ? 'Contemporary' : 'Outdated UI'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
