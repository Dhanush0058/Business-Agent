import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, ShieldCheck, Sparkles, User } from 'lucide-react';

interface Props {
  onOpenAddModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const TopBar: React.FC<Props> = ({ onOpenAddModal, searchQuery, setSearchQuery }) => {
  const { activeTab, settings } = useApp();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Overview', desc: 'Real-time pipeline metrics, lead discovery status, and active concepts.' };
      case 'find-leads':
        return { title: 'Discover High-Intent Leads', desc: 'Legitimate business discovery across target categories and geographical hubs.' };
      case 'leads':
        return { title: 'Prospects CRM & Pipeline', desc: 'Manage prospect research, scores, qualification stages, and demo status.' };
      case 'analyzer':
        return { title: 'Website Quality & UX Analyzer', desc: 'Multi-dimensional diagnostic audit of mobile performance and conversion CTAs.' };
      case 'demo-generator':
        return { title: 'Personalized Demo Studio', desc: 'Generate, customize, and inspect interactive responsive concept previews.' };
      case 'templates':
        return { title: 'Template Architecture', desc: 'Manage reusable high-converting templates for Fitness, Dining, and Education.' };
      case 'outreach':
        return { title: 'Personalized Outreach Studio', desc: 'Human-in-the-loop review and approval for compliant, high-touch messages.' };
      case 'follow-ups':
        return { title: 'Follow-up Command Center', desc: 'Track scheduled touches and maintain warm relationship momentum.' };
      case 'analytics':
        return { title: 'Agency Intelligence & Analytics', desc: 'Measure win rates by niche, location, and message resonance.' };
      case 'settings':
        return { title: 'Agency Settings & Integrations', desc: 'Configure Dhanex Studio branding, scoring weights, and API providers.' };
      default:
        return { title: 'Dhanex Lead Agent', desc: 'Client acquisition & personalized concept generator.' };
    }
  };

  const info = getTabTitle();

  return (
    <header className="h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-30 sticky top-0">
      <div>
        <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          {info.title}
          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            Human Approval Enabled
          </span>
        </h1>
        <p className="text-[11px] text-slate-400 hidden sm:block">{info.desc}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prospects..."
            className="w-full bg-slate-900/90 border border-slate-750 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Add Lead Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs shadow-inner">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white leading-tight">Dhanush</p>
            <p className="text-[10px] text-slate-400 leading-tight">{settings.agencyName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
