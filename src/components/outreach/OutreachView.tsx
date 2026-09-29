import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateOutreachMessage, generateFollowUpMessage } from '../../services/aiAdvisor';
import { OutreachMessage } from '../../types';
import {
  Send,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Mail,
  ShieldCheck,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Phone,
} from 'lucide-react';

export const OutreachView: React.FC = () => {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    settings,
    updateLead,
    approveOutreachForLead,
    markContacted,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeLeadId, setActiveLeadId] = useState<string>(selectedLeadId || (leads[0]?.id || ''));
  const [tone, setTone] = useState<'professional' | 'friendly' | 'short'>('friendly');
  const [activeFollowUpStep, setActiveFollowUpStep] = useState<number>(1);

  const currentLead = leads.find((l) => l.id === activeLeadId);

  // Editable body & phone
  const [editedBody, setEditedBody] = useState<string>('');
  const [editedSubject, setEditedSubject] = useState<string>('');
  const [targetPhone, setTargetPhone] = useState<string>(currentLead?.phone || '');

  useEffect(() => {
    if (currentLead) {
      setTargetPhone(currentLead.phone || '');
      if (!currentLead.outreachMessage) {
        const msg = generateOutreachMessage(currentLead, settings, tone, currentLead.demoUrl);
        updateLead(currentLead.id, { outreachMessage: msg });
        setEditedSubject(msg.subject);
        setEditedBody(msg.body);
      } else {
        setEditedSubject(currentLead.outreachMessage.subject);
        setEditedBody(currentLead.outreachMessage.body);
      }
    }
  }, [currentLead?.id, currentLead?.outreachMessage, currentLead?.phone]);

  const handleToneChange = (newTone: 'professional' | 'friendly' | 'short') => {
    if (!currentLead) return;
    setTone(newTone);
    const newMsg = generateOutreachMessage(currentLead, settings, newTone, currentLead.demoUrl);
    setEditedSubject(newMsg.subject);
    setEditedBody(newMsg.body);
    updateLead(currentLead.id, { outreachMessage: newMsg });
    showToast(`Switched tone to ${newTone}`, 'info');
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLead || !currentLead.outreachMessage) return;
    updateLead(currentLead.id, {
      outreachMessage: {
        ...currentLead.outreachMessage,
        subject: editedSubject,
        body: editedBody,
        status: 'REVIEWED',
      },
    });
    showToast('Outreach pitch changes saved!', 'success');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(editedBody);
    showToast('Outreach message copied to clipboard!', 'success');
  };

  const handleApprove = () => {
    if (!currentLead) return;
    approveOutreachForLead(currentLead.id);
  };

  const handleOpenWhatsApp = () => {
    const rawNumber = (targetPhone || currentLead?.phone || '').trim();
    if (!rawNumber) {
      showToast('Please enter a WhatsApp phone number for this prospect', 'warning');
      return;
    }
    const cleanPhone = rawNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'warning');
      return;
    }
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const encodedText = encodeURIComponent(editedBody);
    const waUrl = `https://wa.me/${fullPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');

    if (currentLead && currentLead.phone !== rawNumber) {
      updateLead(currentLead.id, { phone: rawNumber });
    }
    showToast(`Opened WhatsApp chat with +${fullPhone}`, 'info');
  };

  const handleOpenMailto = () => {
    if (!currentLead || !currentLead.email) {
      showToast('No email address for this prospect', 'warning');
      return;
    }
    const mailtoUrl = `mailto:${currentLead.email}?subject=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`;
    window.open(mailtoUrl, '_blank');
    showToast('Opened default mail client', 'info');
  };

  const handleMarkContacted = (channel: string) => {
    if (!currentLead) return;
    markContacted(currentLead.id, channel);
  };

  const followUpMessageText = currentLead ? generateFollowUpMessage(currentLead, settings, activeFollowUpStep) : '';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-400" />
            Personalized Outreach Studio
          </h2>
          <p className="text-xs text-slate-400">
            Craft, review, and approve compliant, high-touch messages with customized live demo links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Prospect:</span>
          <select
            value={activeLeadId}
            onChange={(e) => {
              setActiveLeadId(e.target.value);
              setSelectedLeadId(e.target.value);
            }}
            className="bg-slate-950 border border-slate-750 text-white font-bold text-xs rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.businessName} ({l.outreachMessage?.status || 'Draft'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Message Editor Panel */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              {/* Tone Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Tone:</span>
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => handleToneChange('friendly')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      tone === 'friendly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Friendly 👋
                  </button>
                  <button
                    onClick={() => handleToneChange('professional')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      tone === 'professional' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Professional 💼
                  </button>
                  <button
                    onClick={() => handleToneChange('short')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      tone === 'short' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Short ⚡
                  </button>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Approval State:</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    currentLead.outreachMessage?.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : currentLead.outreachMessage?.status === 'SENT'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {currentLead.outreachMessage?.status || 'GENERATED'}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDraft} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Subject Line (for Email)</label>
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Outreach Message Body</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Live Demo Link Included</span>
                </label>
                <textarea
                  rows={10}
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3.5 text-xs text-white font-mono leading-relaxed focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Save Draft Edits
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-750 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Pitch</span>
                  </button>
                </div>

                {currentLead.outreachMessage?.status !== 'APPROVED' ? (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Outreach Pitch</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-750">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter phone (e.g. 9848496829)"
                        value={targetPhone}
                        onChange={(e) => setTargetPhone(e.target.value)}
                        className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-36 font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send WhatsApp</span>
                    </button>

                    {currentLead.email && (
                      <button
                        type="button"
                        onClick={handleOpenMailto}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Send Email</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleMarkContacted(targetPhone ? 'WhatsApp' : 'Email')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      Mark as Contacted
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Side: Follow-up Templates & Compliance Safeguards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Follow-up Sequence Helper */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Follow-up Sequences
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveFollowUpStep(1)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeFollowUpStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    Step 1 (+3d)
                  </button>
                  <button
                    onClick={() => setActiveFollowUpStep(2)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeFollowUpStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    Step 2 (+7d)
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {followUpMessageText}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(followUpMessageText);
                    showToast(`Follow-up Step ${activeFollowUpStep} text copied!`, 'success');
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-750 flex items-center justify-center gap-1 mt-2"
                >
                  <Copy className="w-3 h-3 text-indigo-400" />
                  <span>Copy Follow-up Step {activeFollowUpStep}</span>
                </button>
              </div>
            </div>

            {/* Compliance & Safeguards Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Compliant Outreach Safeguards
              </h3>

              <div className="space-y-2 text-[11px] text-slate-400">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">No Automated Spamming</p>
                  <p className="text-[10px] text-slate-400">Every message requires manual human review and explicit click to send.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">Concept Disclaimer</p>
                  <p className="text-[10px] text-slate-400">Previews are clearly marked as independent concepts by Dhanex Studio.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">Authentic Positioning</p>
                  <p className="text-[10px] text-slate-400">No exaggerated revenue promises or fake customer guarantees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
