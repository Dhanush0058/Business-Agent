import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, LeadPriority, WebsiteStatus } from '../../types';
import {
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Globe,
  Send,
  MoreVertical,
  Flame,
  Phone,
  Mail,
  ExternalLink,
  Trash2,
  Edit,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';

interface Props {
  onOpenLeadDetail: (id: string) => void;
}

export const LeadsView: React.FC<Props> = ({ onOpenLeadDetail }) => {
  const {
    leads,
    updateLeadStatus,
    deleteLead,
    setSelectedLeadId,
    setActiveTab,
    analyzeLeadWebsite,
    generateDemoForLead,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [websiteFilter, setWebsiteFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          searchTerm === '' ||
          lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCat = categoryFilter === 'all' || lead.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
        const matchesWebsite = websiteFilter === 'all' || lead.websiteStatus === websiteFilter;
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        return matchesSearch && matchesCat && matchesPriority && matchesWebsite && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.leadScore - a.leadScore;
        if (sortBy === 'date') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        return a.businessName.localeCompare(b.businessName);
      });
  }, [leads, searchTerm, categoryFilter, priorityFilter, websiteFilter, statusFilter, sortBy]);

  // Unique categories for filter dropdown
  const categories = useMemo(() => {
    return Array.from(new Set(leads.map((l) => l.category)));
  }, [leads]);

  // Kanban pipeline columns
  const kanbanColumns: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'QUALIFIED', label: 'Qualified', color: 'border-blue-500/40 bg-blue-950/10' },
    { id: 'DEMO_GENERATED', label: 'Demo Built', color: 'border-indigo-500/40 bg-indigo-950/10' },
    { id: 'DEMO_APPROVED', label: 'Demo Approved', color: 'border-purple-500/40 bg-purple-950/10' },
    { id: 'MESSAGE_READY', label: 'Pitch Ready', color: 'border-cyan-500/40 bg-cyan-950/10' },
    { id: 'CONTACTED', label: 'Contacted', color: 'border-teal-500/40 bg-teal-950/10' },
    { id: 'INTERESTED', label: 'Interested', color: 'border-emerald-500/40 bg-emerald-950/10' },
    { id: 'PROPOSAL', label: 'Proposal', color: 'border-amber-500/40 bg-amber-950/10' },
    { id: 'WON', label: 'Won 🎉', color: 'border-rose-500/40 bg-rose-950/10' },
  ];

  const handleExportCSV = () => {
    const headers = ['Business Name', 'Category', 'Location', 'Website', 'Website Status', 'Phone', 'Email', 'Score', 'Priority', 'Status', 'Demo URL'];
    const rows = filteredLeads.map((l) => [
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.location}"`,
      `"${l.website || ''}"`,
      `"${l.websiteStatus}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      l.leadScore,
      l.priority,
      l.status,
      `"${l.demoUrl || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dhanex-leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by business name, city, category..."
              className="w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* View Toggle & Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filters:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="HOT">🔥 Hot (Score ≥ 80)</option>
            <option value="WARM">⚡ Warm (Score 60-79)</option>
            <option value="LOW">Low (Score &lt; 60)</option>
          </select>

          <select
            value={websiteFilter}
            onChange={(e) => setWebsiteFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">All Website Statuses</option>
            <option value="NO_WEBSITE">No Website</option>
            <option value="POOR">Poor Website</option>
            <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
            <option value="GOOD">Good Website</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="NEW">New</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="DEMO_GENERATED">Demo Generated</option>
            <option value="DEMO_APPROVED">Demo Approved</option>
            <option value="MESSAGE_READY">Message Ready</option>
            <option value="CONTACTED">Contacted</option>
            <option value="REPLIED">Replied</option>
            <option value="INTERESTED">Interested</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="WON">Won</option>
          </select>

          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-semibold focus:outline-none"
            >
              <option value="score">Highest Score</option>
              <option value="date">Newest First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">
              Showing {filteredLeads.length} of {leads.length} prospects
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Business & Category</th>
                  <th className="py-3 px-4">Website Status</th>
                  <th className="py-3 px-4">Score & Priority</th>
                  <th className="py-3 px-4">Template & Demo</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Business Details */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onOpenLeadDetail(lead.id)}
                        className="font-bold text-white text-sm hover:text-indigo-400 text-left block transition-colors"
                      >
                        {lead.businessName}
                      </button>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{lead.category}</span>
                        <span>•</span>
                        <span>{lead.location}</span>
                      </div>
                    </td>

                    {/* Website Status */}
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
                      {lead.website && (
                        <a
                          href={lead.website.startsWith('http') ? lead.website : `http://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-500 hover:text-indigo-400 flex items-center gap-1 mt-1 truncate max-w-[140px]"
                        >
                          <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      )}
                    </td>

                    {/* Score & Priority */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{lead.leadScore}</span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                            lead.priority === 'HOT'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : lead.priority === 'WARM'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>
                    </td>

                    {/* Template & Demo */}
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {lead.assignedTemplate}
                      </span>
                      {lead.demoUrl ? (
                        <div className="mt-1">
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Live Demo Ready
                          </span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">Not Generated</p>
                      )}
                    </td>

                    {/* Pipeline Stage Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="NEW">New</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="DEMO_GENERATED">Demo Generated</option>
                        <option value="DEMO_APPROVED">Demo Approved</option>
                        <option value="MESSAGE_READY">Message Ready</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="REPLIED">Replied</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="DEMO_SENT">Demo Sent</option>
                        <option value="PROPOSAL">Proposal</option>
                        <option value="WON">Won 🎉</option>
                        <option value="LOST">Lost</option>
                        <option value="FOLLOW_UP">Follow-up</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setActiveTab('demo-generator');
                          }}
                          title="Open Demo Generator"
                          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setActiveTab('outreach');
                          }}
                          title="Generate Outreach Pitch"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenLeadDetail(lead.id)}
                          title="View Full Profile"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3.5 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.id);

            return (
              <div
                key={col.id}
                className={`p-3 rounded-2xl border ${col.color} bg-slate-900/70 min-w-[220px] flex flex-col space-y-3`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">{col.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 hover:border-indigo-500/40 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {lead.category.split(' ')[0]}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                            lead.priority === 'HOT'
                              ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {lead.leadScore} pts
                        </span>
                      </div>

                      <div>
                        <h4
                          onClick={() => onOpenLeadDetail(lead.id)}
                          className="font-bold text-xs text-white hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
                        >
                          {lead.businessName}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{lead.location}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setActiveTab('demo-generator');
                          }}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Demo</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setActiveTab('outreach');
                          }}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Pitch</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="p-4 text-center rounded-xl bg-slate-950/30 border border-dashed border-slate-850 text-slate-500 text-[11px]">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
