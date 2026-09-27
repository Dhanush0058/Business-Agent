import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Flame,
  Globe2,
  AlertTriangle,
  Sparkles,
  Send,
  MessageSquare,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  PhoneCall,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { leads, setActiveTab, setSelectedLeadId, generateDemoForLead, approveDemoForLead, completeFollowUp, showToast } = useApp();

  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.priority === 'HOT').length;
  const warmLeads = leads.filter((l) => l.priority === 'WARM').length;
  const noWebsiteLeads = leads.filter((l) => !l.website || l.websiteStatus === 'NO_WEBSITE').length;
  const poorWebsiteLeads = leads.filter((l) => l.websiteStatus === 'POOR').length;
  const demosGenerated = leads.filter((l) => l.demoCustomization !== undefined).length;
  const messagesReady = leads.filter((l) => l.status === 'MESSAGE_READY' || l.outreachMessage?.status === 'APPROVED').length;
  const contacted = leads.filter((l) => ['CONTACTED', 'REPLIED', 'INTERESTED', 'DEMO_SENT', 'CALL_SCHEDULED', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
  const replies = leads.filter((l) => ['REPLIED', 'INTERESTED', 'DEMO_SENT', 'CALL_SCHEDULED', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
  const interested = leads.filter((l) => ['INTERESTED', 'DEMO_SENT', 'CALL_SCHEDULED', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
  const proposals = leads.filter((l) => ['PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
  const won = leads.filter((l) => l.status === 'WON').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const followUpsDue = leads.flatMap((lead) =>
    (lead.followUps || [])
      .filter((fu) => !fu.completed && fu.scheduledDate <= todayStr)
      .map((fu) => ({ ...fu, lead }))
  );

  const recentLeads = [...leads].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 5);
  const recentDemos = leads.filter((l) => l.demoCustomization).slice(0, 4);

  // Funnel steps calculation
  const funnelSteps = [
    { label: 'Total Leads', count: totalLeads, color: 'bg-indigo-500' },
    { label: 'Qualified', count: leads.filter((l) => l.status !== 'NEW').length, color: 'bg-blue-500' },
    { label: 'Contacted', count: contacted, color: 'bg-cyan-500' },
    { label: 'Replied', count: replies, color: 'bg-teal-500' },
    { label: 'Interested', count: interested, color: 'bg-emerald-500' },
    { label: 'Demo Sent', count: leads.filter((l) => l.demoUrl && contacted > 0).length, color: 'bg-amber-500' },
    { label: 'Proposal', count: proposals, color: 'bg-orange-500' },
    { label: 'Won', count: won, color: 'bg-rose-500' },
  ];

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Follow-up text copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 10-Minute Workflow Guide Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The 10-Minute Prospect-to-Demo Workflow</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            High-Touch, Personalized Freelance Client Acquisition
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Discover verified local businesses with no website or poor mobile UX → Run automated quality audit → Personalize a high-converting Dhanex template → Deploy live concept demo → Review and send compliant outreach with human approval.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('find-leads')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Discover New Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('demo-generator')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-750 font-semibold text-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Demo Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 12 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Leads</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalLeads}</p>
          <span className="text-[10px] text-slate-400 font-medium">In Active Pipeline</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold">Hot Leads</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-400">{hotLeads}</p>
          <span className="text-[10px] text-rose-300/80 font-medium">Score ≥ 80 / 100</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold">Warm Leads</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-400">{warmLeads}</p>
          <span className="text-[10px] text-amber-300/80 font-medium">Score 60 - 79</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">No Website</span>
            <Globe2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-300">{noWebsiteLeads}</p>
          <span className="text-[10px] text-purple-400/80 font-medium">High Urgency Voids</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Poor Website</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300">{poorWebsiteLeads}</p>
          <span className="text-[10px] text-amber-400/80 font-medium">Outdated / Non-Mobile</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold">Demos Generated</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-300">{demosGenerated}</p>
          <span className="text-[10px] text-indigo-400/80 font-medium">Live Previews Built</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Messages Ready</span>
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-300">{messagesReady}</p>
          <span className="text-[10px] text-blue-400/80 font-medium">Approved for Sending</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Contacted</span>
            <Send className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300">{contacted}</p>
          <span className="text-[10px] text-cyan-400/80 font-medium">Initial Pitch Sent</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Replies</span>
            <MessageSquare className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-black text-teal-300">{replies}</p>
          <span className="text-[10px] text-teal-400/80 font-medium">{contacted > 0 ? Math.round((replies / contacted) * 100) : 0}% Response Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Interested</span>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-300">{interested}</p>
          <span className="text-[10px] text-emerald-400/80 font-medium">Demo Walkthroughs</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Proposals</span>
            <FileCheck className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-orange-300">{proposals}</p>
          <span className="text-[10px] text-orange-400/80 font-medium">Custom Quotes</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold">Won Deals</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{won}</p>
          <span className="text-[10px] text-emerald-300 font-bold">Closed Clients</span>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Conversion Funnel Pipeline</h3>
            <p className="text-xs text-slate-400">Step-by-step conversion tracking from initial discovery to closed business.</p>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Detailed Analytics →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {funnelSteps.map((step, idx) => {
            const maxVal = Math.max(...funnelSteps.map((s) => s.count), 1);
            const heightPercent = Math.max(12, Math.round((step.count / maxVal) * 100));

            return (
              <div key={idx} className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="w-full h-24 flex items-end justify-center bg-slate-900/50 rounded-lg p-2">
                  <div
                    className={`w-full rounded-md ${step.color} transition-all duration-500 shadow-lg`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-base font-black text-white">{step.count}</p>
                  <p className="text-[11px] font-semibold text-slate-400">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Follow-ups Due Today & Active Demos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Follow-ups Due Today */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Follow-ups Due Today</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {followUpsDue.length} Actionable
              </span>
            </div>
            <button
              onClick={() => setActiveTab('follow-ups')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              View All
            </button>
          </div>

          {followUpsDue.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-850 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              All follow-ups are up to date for today!
            </div>
          ) : (
            <div className="space-y-3">
              {followUpsDue.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.lead.businessName}</h4>
                      <p className="text-[11px] text-slate-400">{item.label} • {item.lead.category}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      Step {item.step}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    {item.suggestedMessage && (
                      <button
                        onClick={() => handleCopyMessage(item.suggestedMessage)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-750"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Copy Pitch</span>
                      </button>
                    )}
                    <button
                      onClick={() => completeFollowUp(item.lead.id, item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Demos Generated */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Concept Demos</h3>
            </div>
            <button
              onClick={() => setActiveTab('demo-generator')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              Demo Studio →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentDemos.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {lead.assignedTemplate}
                    </span>
                    {lead.demoApproved ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold">Pending Review</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{lead.businessName}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{lead.location}</p>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedLeadId(lead.id);
                      setActiveTab('demo-generator');
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Inspect Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {!lead.demoApproved && (
                    <button
                      onClick={() => approveDemoForLead(lead.id)}
                      className="text-[11px] px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-sm"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Discovered Prospects</h3>
            <p className="text-xs text-slate-400">Newly added business targets with calculated priority and website status.</p>
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            Open Full CRM Table →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Website Status</th>
                <th className="py-3 px-4">Lead Score</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {lead.businessName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 block">{lead.category}</span>
                    <span className="text-[10px] text-slate-500">{lead.location}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {lead.websiteStatus === 'NO_WEBSITE' ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        NO WEBSITE
                      </span>
                    ) : lead.websiteStatus === 'POOR' ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        POOR SITE
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {lead.websiteStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white">
                    {lead.leadScore} / 100
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        lead.priority === 'HOT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : lead.priority === 'WARM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">
                    {lead.status}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        if (!lead.demoCustomization) {
                          generateDemoForLead(lead.id);
                        }
                        setActiveTab('demo-generator');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm"
                    >
                      Demo Studio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
