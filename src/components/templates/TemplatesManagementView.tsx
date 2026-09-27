import React, { useState } from 'react';
import { TEMPLATES } from '../../services/templateRegistry';
import { TemplateDefinition } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  LayoutTemplate,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  Copy,
  CheckCircle2,
  Clock,
  Settings,
} from 'lucide-react';

export const TemplatesManagementView: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition>(TEMPLATES[0]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-indigo-400" />
            Reusable Website Template Architecture
          </h2>
          <p className="text-xs text-slate-400">
            Pre-engineered, high-converting responsive layouts with dynamic token replacement for rapid prospect personalization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
            {TEMPLATES.length} Modular Templates Active
          </span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-indigo-500/40 hover:shadow-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Preview Thumbnail */}
              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 group-hover:border-slate-700 transition-colors">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {tpl.status.toUpperCase()}
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700">
                  v{tpl.version}
                </div>
              </div>

              {/* Template Info */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {tpl.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5 tracking-tight group-hover:text-indigo-300 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">{tpl.description}</p>
              </div>

              {/* Variables Pill List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-indigo-400" />
                  Supported Variables ({tpl.variables.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {tpl.variables.slice(0, 6).map((v, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      {v}
                    </span>
                  ))}
                  {tpl.variables.length > 6 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                      +{tpl.variables.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold">
                {tpl.demoCount} Concepts Built
              </span>

              <button
                onClick={() => {
                  showToast(`Template ${tpl.name} selected as active draft`, 'info');
                  setActiveTab('demo-generator');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
