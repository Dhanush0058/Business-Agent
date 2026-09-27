import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  Copy,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export const FollowUpsView: React.FC = () => {
  const {
    leads,
    completeFollowUp,
    rescheduleFollowUp,
    deleteFollowUp,
    addFollowUp,
    showToast,
  } = useApp();

  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [newLabel, setNewLabel] = useState<string>('Follow-up Check-in');
  const [newDate, setNewDate] = useState<string>(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Flatten all follow-ups across all leads
  const allFollowUps = leads.flatMap((lead) =>
    (lead.followUps || []).map((fu) => ({
      ...fu,
      lead,
    }))
  );

  const dueToday = allFollowUps.filter((f) => !f.completed && f.scheduledDate <= todayStr);
  const upcoming = allFollowUps.filter((f) => !f.completed && f.scheduledDate > todayStr);
  const completed = allFollowUps.filter((f) => f.completed);

  const handleCopyPitch = (msg: string) => {
    navigator.clipboard.writeText(msg);
    showToast('Follow-up message copied to clipboard!', 'success');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    addFollowUp(selectedLeadId, {
      label: newLabel,
      scheduledDate: newDate,
      notes: newNotes,
      suggestedMessage: `Hi, following up regarding the website concept we prepared for your business...`,
    });

    setIsAdding(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-400" />
            Follow-up Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Never let warm leads go cold. Track timely check-ins, manage responses, and close proposals.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Follow-up</span>
        </button>
      </div>

      {/* Add Follow-up Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 shadow-xl space-y-4 animate-in fade-in duration-300"
        >
          <h3 className="text-sm font-bold text-white">Schedule Custom Follow-up</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Select Prospect</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.businessName} ({l.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Step Title / Reason</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Follow-up 1 (Check-in)"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Target Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Notes / Talking Points</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Remind client about mobile booking button..."
              className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
            >
              Schedule Task
            </button>
          </div>
        </form>
      )}

      {/* Due Today Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-white">Actionable Today ({dueToday.length})</h3>
        </div>

        {dueToday.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            No follow-ups overdue or pending for today. High momentum maintained!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueToday.map((fu) => (
              <div
                key={fu.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-xl space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{fu.lead.businessName}</h4>
                      <p className="text-[11px] text-slate-400">{fu.lead.category} • {fu.lead.location}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                      Due Today
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">{fu.label}</p>

                  {fu.notes && (
                    <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {fu.notes}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    {fu.suggestedMessage && (
                      <button
                        onClick={() => handleCopyPitch(fu.suggestedMessage)}
                        className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Copy Pitch</span>
                      </button>
                    )}

                    <button
                      onClick={() => completeFollowUp(fu.lead.id, fu.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <button
                      onClick={() => rescheduleFollowUp(fu.lead.id, fu.id, new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0])}
                      className="hover:text-indigo-400"
                    >
                      Snooze +2 Days
                    </button>

                    <button
                      onClick={() => deleteFollowUp(fu.lead.id, fu.id)}
                      className="hover:text-rose-400"
                    >
                      Cancel Task
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Follow-ups */}
      {upcoming.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Upcoming Follow-ups ({upcoming.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcoming.map((fu) => (
              <div
                key={fu.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate">{fu.lead.businessName}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">{fu.scheduledDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">{fu.label}</p>
                  {fu.notes && <p className="text-[10px] text-slate-400 mt-1">{fu.notes}</p>}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                  <button
                    onClick={() => completeFollowUp(fu.lead.id, fu.id)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => deleteFollowUp(fu.lead.id, fu.id)}
                    className="text-[11px] text-slate-500 hover:text-rose-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
