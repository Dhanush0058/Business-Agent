import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Sliders,
  Send,
  Globe,
  Cpu,
  Save,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  MapPin,
  Key,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [formData, setFormData] = useState(settings);
  const [geoapifyKey, setGeoapifyKey] = useState<string>(() => {
    return localStorage.getItem('geoapify_api_key') || (import.meta as any).env?.VITE_GEOAPIFY_API_KEY || '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    localStorage.setItem('geoapify_api_key', geoapifyKey.trim());
    showToast('All settings and API keys successfully saved!', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Agency Settings & Scoring Engine
          </h2>
          <p className="text-xs text-slate-400">
            Configure agency branding, API keys (Gemini, Geoapify), customize lead prioritization scoring weights, and manage deployment providers.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dhanex Agency Branding */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Dhanex Studio Profile & Branding
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Agency Name</label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Portfolio Website URL</label>
              <input
                type="text"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Agency WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Official Contact Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Default Pricing Tier Label</label>
              <input
                type="text"
                value={formData.defaultPricing}
                onChange={(e) => setFormData({ ...formData, defaultPricing: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Configurable Lead Scoring Weights */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-500" />
              Configurable Lead Scoring Weights
            </h3>
            <span className="text-[10px] text-slate-400">Total Max: 100 pts</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>No Website Weight:</span>
                <span className="text-indigo-400 font-bold">+{formData.scoringRules.noWebsiteWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={formData.scoringRules.noWebsiteWeight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scoringRules: { ...formData.scoringRules, noWebsiteWeight: Number(e.target.value) },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Poor Website Weight:</span>
                <span className="text-indigo-400 font-bold">+{formData.scoringRules.poorWebsiteWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={formData.scoringRules.poorWebsiteWeight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scoringRules: { ...formData.scoringRules, poorWebsiteWeight: Number(e.target.value) },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Active Business Operations:</span>
                <span className="text-indigo-400 font-bold">+{formData.scoringRules.activePresenceWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={formData.scoringRules.activePresenceWeight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scoringRules: { ...formData.scoringRules, activePresenceWeight: Number(e.target.value) },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Public Contact Available:</span>
                <span className="text-indigo-400 font-bold">+{formData.scoringRules.publicContactWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={formData.scoringRules.publicContactWeight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scoringRules: { ...formData.scoringRules, publicContactWeight: Number(e.target.value) },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Hot Lead Threshold</label>
                <input
                  type="number"
                  value={formData.scoringRules.hotThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoringRules: { ...formData.scoringRules, hotThreshold: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Warm Lead Threshold</label>
                <input
                  type="number"
                  value={formData.scoringRules.warmThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoringRules: { ...formData.scoringRules, warmThreshold: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Provider Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            Concept Preview Deployment
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Deployment Target Provider</label>
              <select
                value={formData.deploymentProvider}
                onChange={(e) => setFormData({ ...formData, deploymentProvider: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="local">Dhanex Internal Live Engine (Hash Routing)</option>
                <option value="vercel">Vercel Serverless Edge</option>
                <option value="netlify">Netlify Edge Previews</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Demo Base Domain</label>
              <input
                type="text"
                value={formData.customDomain}
                onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                placeholder="demo.dhanexstudio.com"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Concept Disclaimer Banner Text</label>
              <textarea
                rows={2}
                value={formData.demoDisclaimer}
                onChange={(e) => setFormData({ ...formData, demoDisclaimer: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* AI Engine Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-purple-400" />
            AI Strategy Engine & Guardrails
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">AI Intelligence Provider</label>
              <select
                value={formData.aiProvider}
                onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="local-smart">Local Smart Qualification Engine (Offline & Fast)</option>
                <option value="gemini">Google Gemini 2.0 / 1.5 Flash API</option>
                <option value="openai">OpenAI GPT-4o Mini API</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Google Gemini / AI API Key (Optional)</label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="AIzaSy... (or sk-...)"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                You can also set this in your <code className="text-slate-300">.env</code> file as <code className="text-indigo-400">VITE_GEMINI_API_KEY</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Anti-Hallucination Guardrails Active
              </span>
              <p>AI copy generation is strictly constrained by factual verified lead input. No fabricated awards, review numbers, or fake statistics.</p>
            </div>
          </div>
        </div>

        {/* Live Maps & Geoapify Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-amber-400" />
            Live Maps & Geoapify API Provider
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center justify-between">
                <span>Geoapify API Key</span>
                <span className="text-[10px] text-amber-400 font-normal">Free 3,000 req/day</span>
              </label>
              <input
                type="password"
                value={geoapifyKey}
                onChange={(e) => setGeoapifyKey(e.target.value)}
                placeholder="Paste your Geoapify API Key here..."
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                You can also set this in your <code className="text-slate-300">.env</code> file as <code className="text-amber-400">VITE_GEOAPIFY_API_KEY</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Real-Time Local Maps Search Active
              </span>
              <p>When configured, "Find Leads" queries live businesses with real GPS coordinates, verified phone numbers, and categories via Geoapify Places API.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
