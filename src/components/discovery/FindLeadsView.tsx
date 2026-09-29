import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LEAD_PROVIDERS, DiscoveryCriteria } from '../../services/leadSourceProviders';
import { Lead } from '../../types';
import {
  Search,
  Building2,
  MapPin,
  ListFilter,
  Sparkles,
  Phone,
  RotateCw,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';

export const FindLeadsView: React.FC = () => {
  const {
    batchImportLeads,
    setSelectedLeadId,
    setActiveTab,
    showToast,
    generateDemoForLead,
    discoveredLeads,
    setDiscoveredLeads,
    selectedDiscoveryIds,
    setSelectedDiscoveryIds,
    discoveryOffset,
    setDiscoveryOffset,
    discoveryCategory,
    setDiscoveryCategory,
    discoveryLocation,
    setDiscoveryLocation,
    discoveryLimit,
    setDiscoveryLimit,
    discoveryWebsiteRequirement,
    setDiscoveryWebsiteRequirement,
    discoveryProviderId,
    setDiscoveryProviderId,
  } = useApp();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const executeSearch = async (offsetToUse: number, append: boolean = false) => {
    try {
      const provider = LEAD_PROVIDERS.find((p) => p.id === discoveryProviderId) || LEAD_PROVIDERS[0];
      const criteria: DiscoveryCriteria = {
        category: discoveryCategory,
        location: discoveryLocation,
        limit: discoveryLimit,
        offset: offsetToUse,
        websiteRequirement: discoveryWebsiteRequirement,
        contactPreference: 'all',
      };

      const results = await provider.search(criteria);

      if (results.length === 0) {
        showToast(`No more unique places found for ${discoveryCategory} in ${discoveryLocation} at offset ${offsetToUse}. Try resetting or changing location.`, 'info');
        return;
      }

      if (append) {
        // Merge and deduplicate by name
        const existingNames = new Set(discoveredLeads.map((l) => l.businessName.toLowerCase()));
        const uniqueNew = results.filter((l) => !existingNames.has(l.businessName.toLowerCase()));
        const merged = [...discoveredLeads, ...uniqueNew];
        setDiscoveredLeads(merged);
        setSelectedDiscoveryIds(merged.map((l) => l.id));
        showToast(`Discovered ${uniqueNew.length} new unique prospects (Total: ${merged.length})!`, 'success');
      } else {
        setDiscoveredLeads(results);
        setSelectedDiscoveryIds(results.map((r) => r.id));
        showToast(`Discovered ${results.length} unique prospects in ${discoveryLocation} (Batch offset: ${offsetToUse})!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error discovering leads. Please check your network or server status.', 'error');
    }
  };

  const handleInitialSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDiscoveryOffset(0);
    try {
      await executeSearch(0, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscoverNextBatch = async () => {
    setIsRefreshing(true);
    const nextOffset = discoveryOffset + discoveryLimit;
    setDiscoveryOffset(nextOffset);
    try {
      await executeSearch(nextOffset, false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAppendNextBatch = async () => {
    setIsRefreshing(true);
    const nextOffset = discoveryOffset + discoveryLimit;
    setDiscoveryOffset(nextOffset);
    try {
      await executeSearch(nextOffset, true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetOffset = () => {
    setDiscoveryOffset(0);
    showToast('Reset search offset to 0.', 'info');
  };

  const handleClearResults = () => {
    setDiscoveredLeads([]);
    setSelectedDiscoveryIds([]);
    setDiscoveryOffset(0);
    showToast('Cleared discovered results list.', 'info');
  };

  const handleToggleSelectAll = () => {
    if (selectedDiscoveryIds.length === discoveredLeads.length) {
      setSelectedDiscoveryIds([]);
    } else {
      setSelectedDiscoveryIds(discoveredLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectLead = (id: string) => {
    setSelectedDiscoveryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImportSelected = () => {
    const toImport = discoveredLeads.filter((l) => selectedDiscoveryIds.includes(l.id));
    if (toImport.length === 0) {
      showToast('Please select at least one lead to import', 'warning');
      return;
    }
    batchImportLeads(toImport);
    setDiscoveredLeads((prev) => prev.filter((l) => !selectedDiscoveryIds.includes(l.id)));
    setSelectedDiscoveryIds([]);
    setActiveTab('leads');
  };

  const currentBatchNum = Math.floor(discoveryOffset / discoveryLimit) + 1;

  return (
    <div className="space-y-8 pb-12">
      {/* Search Form Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Real Live Business Discovery (GPS & Maps)
            </h2>
            <p className="text-xs text-slate-400">
              Query real-time live business listings with actual street addresses and verified coordinates in your target city.
            </p>
          </div>

          {/* Provider Abstraction Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Data Source:
            </span>
            <select
              value={discoveryProviderId}
              onChange={(e) => setDiscoveryProviderId(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {LEAD_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleInitialSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Business Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Business Category
            </label>
            <select
              value={discoveryCategory}
              onChange={(e) => {
                setDiscoveryCategory(e.target.value);
                setDiscoveryOffset(0);
              }}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Gym & Fitness">Gym & Fitness Studios</option>
              <option value="Hotel">Hotels & Hospitality (Hotels, Resorts, Lodges)</option>
              <option value="Restaurant & Café">Restaurants & Cafés</option>
              <option value="Coaching Centre">Coaching & Education</option>
              <option value="Salon & Spa">Salons & Spas</option>
              <option value="Real Estate">Real Estate Agencies</option>
              <option value="Photography">Photography Studios</option>
              <option value="Local Business">Other Local Services</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              Target Location
            </label>
            <select
              value={discoveryLocation}
              onChange={(e) => {
                setDiscoveryLocation(e.target.value);
                setDiscoveryOffset(0);
              }}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Goa">Goa</option>
              <option value="London">London, UK</option>
              <option value="New York">New York, USA</option>
            </select>
          </div>

          {/* Website Requirement */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              Website Status Filter
            </label>
            <select
              value={discoveryWebsiteRequirement}
              onChange={(e) => setDiscoveryWebsiteRequirement(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="no_website">No Website (High Opportunity)</option>
              <option value="poor_website">Poor / Outdated Website</option>
              <option value="any">Any (All Prospects)</option>
            </select>
          </div>

          {/* Batch Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-amber-400" />
              Number of Leads
            </label>
            <select
              value={discoveryLimit}
              onChange={(e) => setDiscoveryLimit(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value={10}>10 Prospects</option>
              <option value={20}>20 Prospects</option>
              <option value={50}>50 Prospects</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading || isRefreshing}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Leads (Batch 1)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Discovered Results Table */}
      {discoveredLeads.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Discovered Prospects ({discoveredLeads.length})
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {selectedDiscoveryIds.length} Selected
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  📍 Batch #{currentBatchNum} (Offset: {discoveryOffset})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Persistent search session: Leads remain visible when you navigate between CRM, Analyzer, and Outreach tabs.
              </p>
            </div>

            {/* Pagination & Refresh Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Refresh / Next Batch Button */}
              <button
                type="button"
                onClick={handleDiscoverNextBatch}
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all disabled:opacity-50"
                title="Fetch the next batch of completely different businesses for this category"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Fetching Next...' : `Next Different Batch (Offset +${discoveryLimit})`}</span>
              </button>

              <button
                type="button"
                onClick={handleAppendNextBatch}
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                title="Fetch more and add them to this table without clearing existing leads"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append More</span>
              </button>

              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {selectedDiscoveryIds.length === discoveredLeads.length ? 'Deselect All' : 'Select All'}
              </button>

              <button
                type="button"
                onClick={handleImportSelected}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Import {selectedDiscoveryIds.length} to CRM</span>
              </button>

              <button
                type="button"
                onClick={handleClearResults}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                title="Clear current discovered leads table"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 w-8"></th>
                  <th className="py-3 px-4">Business Details</th>
                  <th className="py-3 px-4">Website Status</th>
                  <th className="py-3 px-4">Contact & Social</th>
                  <th className="py-3 px-4">Lead Score</th>
                  <th className="py-3 px-4">Opportunity Summary</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {discoveredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      selectedDiscoveryIds.includes(lead.id) ? 'bg-indigo-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedDiscoveryIds.includes(lead.id)}
                        onChange={() => handleToggleSelectLead(lead.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{lead.businessName}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{lead.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {lead.location}
                        </span>
                      </div>
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
                    <td className="py-3.5 px-4 space-y-1">
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.instagram && (
                        <div className="flex items-center gap-1.5 text-[11px] text-indigo-400">
                          <InstagramIcon className="w-3 h-3 text-pink-400" />
                          <span>{lead.instagram}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{lead.leadScore}</span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                            lead.priority === 'HOT'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {lead.aiQualification?.mainOpportunity || lead.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          batchImportLeads([lead]);
                          setSelectedLeadId(lead.id);
                          generateDemoForLead(lead.id);
                          setActiveTab('demo-generator');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 ml-auto"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Demo Now</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
