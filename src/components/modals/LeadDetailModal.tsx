import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Send,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';

interface Props {
  leadId: string | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<Props> = ({ leadId, onClose }) => {
  const { leads, updateLead, generateDemoForLead, setActiveTab, setSelectedLeadId, showToast } = useApp();
  const [activeTab, setActiveTabLocal] = useState<'overview' | 'audit' | 'ai' | 'notes'>('overview');

  const lead = leads.find((l) => l.id === leadId);
  if (!leadId || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{lead.businessName}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    lead.priority === 'HOT'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {lead.priority} ({lead.leadScore} pts)
                </span>
              </div>
              <p className="text-xs text-slate-400">{lead.category} • {lead.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedLeadId(lead.id);
                if (!lead.demoCustomization) generateDemoForLead(lead.id);
                onClose();
                setActiveTab('demo-generator');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Studio</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActiveTabLocal('overview')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'hover:text-white'
            }`}
          >
            Overview & Contacts
          </button>
          <button
            onClick={() => setActiveTabLocal('audit')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'audit' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'hover:text-white'
            }`}
          >
            Website Quality Audit
          </button>
          <button
            onClick={() => setActiveTabLocal('ai')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'ai' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'hover:text-white'
            }`}
          >
            AI Opportunity & Strategy
          </button>
          <button
            onClick={() => setActiveTabLocal('notes')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'notes' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'hover:text-white'
            }`}
          >
            Notes & Timeline
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Contact Details</span>
                  <div className="space-y-1.5 text-slate-200">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {lead.phone || 'Not available'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      {lead.email || 'Not available'}
                    </p>
                    <p className="flex items-center gap-2">
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      {lead.instagram || 'Not available'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Pipeline Details</span>
                  <div className="space-y-1 text-slate-200">
                    <p><strong>Status:</strong> {lead.status}</p>
                    <p><strong>Assigned Template:</strong> {lead.assignedTemplate}</p>
                    <p><strong>Demo Generated:</strong> {lead.demoUrl ? 'Yes (Live)' : 'No'}</p>
                    <p><strong>Human Approval:</strong> {lead.demoApproved ? 'Approved' : 'Pending Review'}</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Services & Offerings</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lead.services?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-750">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">Audit Diagnosis</span>
                <p className="text-slate-300 leading-relaxed">{lead.websiteAnalysis?.explanation}</p>
              </div>

              {lead.websiteAnalysis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400">Mobile UX</p>
                    <p className="text-lg font-black text-indigo-400">{lead.websiteAnalysis.scores.mobileUx}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400">Design</p>
                    <p className="text-lg font-black text-indigo-400">{lead.websiteAnalysis.scores.design}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400">Speed</p>
                    <p className="text-lg font-black text-indigo-400">{lead.websiteAnalysis.scores.performance}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400">CTA Funnel</p>
                    <p className="text-lg font-black text-indigo-400">{lead.websiteAnalysis.scores.cta}%</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-indigo-400">Main Opportunity</span>
                <p className="text-slate-200 leading-relaxed">{lead.aiQualification?.mainOpportunity}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-indigo-400">Recommended Service</span>
                <p className="text-slate-200 leading-relaxed">{lead.aiQualification?.recommendedService}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-indigo-400">Priority Justification</span>
                <p className="text-slate-200 leading-relaxed">{lead.aiQualification?.priorityReason}</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={lead.notes}
                onChange={(e) => updateLead(lead.id, { notes: e.target.value })}
                placeholder="Add custom notes from client interactions..."
                className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => showToast('Lead notes updated', 'success')}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm"
              >
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
