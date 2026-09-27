import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  Users,
  Globe,
  Sparkles,
  LayoutTemplate,
  Send,
  CalendarClock,
  BarChart3,
  Settings,
  Flame,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, leads, settings, resetToDefaultSeedData } = useApp();

  const hotCount = leads.filter((l) => l.priority === 'HOT').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const followUpsDueCount = leads.flatMap((l) => l.followUps || []).filter((f) => !f.completed && f.scheduledDate <= todayStr).length;
  const messageReadyCount = leads.filter((l) => l.status === 'MESSAGE_READY' || l.status === 'DEMO_APPROVED').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-leads', label: 'Find Leads', icon: Search, badge: 'Discovery' },
    { id: 'leads', label: 'Leads CRM', icon: Users, count: leads.length },
    { id: 'analyzer', label: 'Website Analyzer', icon: Globe },
    { id: 'demo-generator', label: 'Demo Generator', icon: Sparkles, hot: true },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'outreach', label: 'Outreach Studio', icon: Send, count: messageReadyCount > 0 ? messageReadyCount : undefined },
    { id: 'follow-ups', label: 'Follow-ups', icon: CalendarClock, count: followUpsDueCount > 0 ? followUpsDueCount : undefined, alert: followUpsDueCount > 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0F172A]/95 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">{settings.agencyName || 'Dhanex Studio'}</span>
              </div>
              <p className="text-[11px] font-semibold text-indigo-400">AI Lead & Demo Agent</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Hot Pipeline
            </span>
            <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {hotCount} Leads
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.alert
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Agency Footer Controls */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Online
          </span>
          <button
            onClick={resetToDefaultSeedData}
            title="Reset to initial curated dataset"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        <a
          href={settings.portfolioUrl || 'https://dhanexstudio.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors"
        >
          <div className="truncate">
            <p className="font-semibold text-white truncate">{settings.agencyName}</p>
            <p className="text-[10px] text-slate-500 truncate">{settings.portfolioUrl || 'dhanexstudio.com'}</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </a>
      </div>
    </aside>
  );
};
