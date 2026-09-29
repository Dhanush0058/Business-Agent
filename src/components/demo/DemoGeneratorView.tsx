import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TEMPLATES, generatePersonalizedDemoData } from '../../services/templateRegistry';
import { LiveTemplateRenderer } from '../templates/LiveTemplateRenderer';
import { DemoCustomization } from '../../types';
import {
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Copy,
  ExternalLink,
  Edit3,
  Sliders,
  Send,
  Eye,
  Check,
  AlertCircle,
  Palette,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const DemoGeneratorView: React.FC = () => {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    generateDemoForLead,
    approveDemoForLead,
    updateLead,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeLeadId, setActiveLeadId] = useState<string>(selectedLeadId || (leads[0]?.id || ''));
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'dynamic' | 'vercel'>('dynamic');
  const [activeTab, setActiveSidebarTab] = useState<'preview' | 'customize' | 'approval'>('preview');

  const currentLead = leads.find((l) => l.id === activeLeadId);

  // Editable custom copy
  const [editData, setEditData] = useState<DemoCustomization | null>(null);

  useEffect(() => {
    if (currentLead) {
      if (!currentLead.demoCustomization) {
        generateDemoForLead(currentLead.id);
      } else {
        setEditData(currentLead.demoCustomization);
      }
    }
  }, [currentLead?.id, currentLead?.demoCustomization]);

  const handleTemplateChange = (newTemplateId: string) => {
    if (!currentLead) return;
    const newData = generatePersonalizedDemoData(currentLead, newTemplateId);
    setEditData(newData);
    generateDemoForLead(currentLead.id, newTemplateId, newData);
  };

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLead || !editData) return;
    updateLead(currentLead.id, {
      demoCustomization: editData,
    });
    showToast('Demo customizations saved successfully!', 'success');
  };

  const handleRegenerate = () => {
    if (!currentLead) return;
    generateDemoForLead(currentLead.id, currentLead.assignedTemplate);
    showToast('Regenerated fresh demo copy from lead research!', 'info');
  };

  const handleCopyLink = () => {
    const url = currentLead?.demoUrl || `https://demo.dhanexstudio.com/${currentLead?.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    navigator.clipboard.writeText(url);
    showToast('Demo preview URL copied to clipboard!', 'success');
  };

  const handleApprove = () => {
    if (!currentLead) return;
    approveDemoForLead(currentLead.id);
  };

  const getDeviceWidth = () => {
    if (device === 'mobile') return 'max-w-[375px]';
    if (device === 'tablet') return 'max-w-[768px]';
    return 'max-w-full';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Lead & Template Selection */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Selected Prospect</span>
            <select
              value={activeLeadId}
              onChange={(e) => {
                setActiveLeadId(e.target.value);
                setSelectedLeadId(e.target.value);
              }}
              className="bg-slate-950 border border-slate-750 text-white font-bold text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName} ({l.category})
                </option>
              ))}
            </select>
          </div>

          {currentLead && (
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Template</span>
              <select
                value={currentLead.assignedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="bg-slate-950 border border-slate-750 text-indigo-400 font-bold text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Device Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start lg:self-center">
          <button
            onClick={() => setDevice('desktop')}
            title="Desktop View (1280px)"
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tablet View (768px)"
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            title="Mobile View (375px)"
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Approval & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            title="Copy Shareable Demo URL"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={handleRegenerate}
            title="Regenerate Copy"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {currentLead && !currentLead.demoApproved ? (
            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Demo</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved
              </span>
              <button
                onClick={() => {
                  setSelectedLeadId(currentLead?.id || null);
                  setActiveTab('outreach');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Write Outreach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Preview Container & Customizer Tabs */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side: Live Interactive Viewport */}
        <div className="xl:col-span-8 flex flex-col items-center">
          <div
            className={`w-full ${getDeviceWidth()} transition-all duration-300 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950`}
          >
            {/* Render Mode Switcher Bar */}
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <div className="ml-2 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono truncate max-w-xs">
                  {previewMode === 'dynamic' ? `${editData?.businessName || currentLead?.businessName} • Live Dynamic Preview` : (currentLead?.demoUrl || 'https://gym-project1-pi.vercel.app')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('dynamic')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      previewMode === 'dynamic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dynamic Concept
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('vercel')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      previewMode === 'vercel' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    External Vercel
                  </button>
                </div>

                <a
                  href={currentLead?.demoUrl || `https://gym-project1-pi.vercel.app/?business_name=${encodeURIComponent(currentLead?.businessName || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Rendered Template Viewport */}
            <div className="h-[720px] overflow-y-auto bg-slate-950 relative">
              {previewMode === 'dynamic' && editData ? (
                <div className="w-full">
                  <LiveTemplateRenderer data={editData} />
                </div>
              ) : (
                <iframe
                  src={currentLead?.demoUrl || (currentLead?.assignedTemplate === 'restaurant' ? 'https://restuarant-project2.vercel.app' : currentLead?.assignedTemplate === 'education' ? 'https://education-project3.vercel.app' : 'https://gym-project1-pi.vercel.app')}
                  title="Live Vercel Concept Demo"
                  className="w-full h-full border-0 bg-slate-950"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Customizer & Human Verification Drawer */}
        <div className="xl:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Live Customizer & Review
              </h3>
              <span className="text-[10px] font-mono text-slate-500">v{editData?.version || 1}</span>
            </div>

            {editData && (
              <form onSubmit={handleSaveCustomization} className="space-y-4 text-xs">
                {/* Business Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Business Name</label>
                  <input
                    type="text"
                    value={editData.businessName}
                    onChange={(e) => setEditData({ ...editData, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Tagline / Badge */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hero Badge Text</label>
                  <input
                    type="text"
                    value={editData.badgeText}
                    onChange={(e) => setEditData({ ...editData, badgeText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Hero Headline */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hero Headline</label>
                  <input
                    type="text"
                    value={editData.heroHeadline}
                    onChange={(e) => setEditData({ ...editData, heroHeadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Hero Description */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={editData.heroDescription}
                    onChange={(e) => setEditData({ ...editData, heroDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* WhatsApp & CTA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editData.ctaWhatsapp}
                      onChange={(e) => setEditData({ ...editData, ctaWhatsapp: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editData.primaryColor}
                        onChange={(e) => setEditData({ ...editData, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <span className="font-mono text-slate-400">{editData.primaryColor}</span>
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-colors"
                >
                  Save Live Adjustments
                </button>
              </form>
            )}
          </div>

          {/* Compliance & Safeguards Checklist Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Human Quality Verification
            </h4>

            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Concept watermark banner clearly displayed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>No fabricated revenue or fake awards generated</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Legitimate public business contact info verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
