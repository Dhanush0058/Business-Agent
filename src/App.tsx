import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { FindLeadsView } from './components/discovery/FindLeadsView';
import { LeadsView } from './components/crm/LeadsView';
import { WebsiteAnalyzerView } from './components/analyzer/WebsiteAnalyzerView';
import { DemoGeneratorView } from './components/demo/DemoGeneratorView';
import { TemplatesManagementView } from './components/templates/TemplatesManagementView';
import { OutreachView } from './components/outreach/OutreachView';
import { FollowUpsView } from './components/followups/FollowUpsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AddLeadModal } from './components/modals/AddLeadModal';
import { LeadDetailModal } from './components/modals/LeadDetailModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { LiveTemplateRenderer } from './components/templates/LiveTemplateRenderer';

export function AppContent() {
  const { activeTab, setActiveTab, leads } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [detailLeadId, setDetailLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle standalone preview hash e.g. /#preview/lead-123
  const [standalonePreviewId, setStandalonePreviewId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#preview/')) {
        const id = hash.replace('#preview/', '');
        setStandalonePreviewId(id);
      } else {
        setStandalonePreviewId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Standalone Fullscreen Preview Mode
  if (standalonePreviewId) {
    const previewLead = leads.find((l) => l.id === standalonePreviewId) || leads[0];
    if (previewLead && previewLead.demoCustomization) {
      return (
        <div>
          {/* Top Bar for Returning to Studio */}
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
            <span>Viewing Standalone Concept Demo for <strong>{previewLead.businessName}</strong></span>
            <button
              onClick={() => {
                window.location.hash = '';
                setStandalonePreviewId(null);
              }}
              className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              ← Back to Dhanex Studio Dashboard
            </button>
          </div>
          <LiveTemplateRenderer data={previewLead.demoCustomization} />
        </div>
      );
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'find-leads':
        return <FindLeadsView />;
      case 'leads':
        return <LeadsView onOpenLeadDetail={(id) => setDetailLeadId(id)} />;
      case 'analyzer':
        return <WebsiteAnalyzerView />;
      case 'demo-generator':
        return <DemoGeneratorView />;
      case 'templates':
        return <TemplatesManagementView />;
      case 'outreach':
        return <OutreachView />;
      case 'follow-ups':
        return <FollowUpsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'leads') setActiveTab('leads');
          }}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* Modals & Toasts */}
      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <LeadDetailModal leadId={detailLeadId} onClose={() => setDetailLeadId(null)} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
