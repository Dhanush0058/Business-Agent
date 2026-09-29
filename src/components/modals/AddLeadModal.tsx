import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Building2, MapPin, Globe, Phone, Mail, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addLead, setSelectedLeadId, setActiveTab } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Gym & Fitness');
  const [location, setLocation] = useState('Hyderabad');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [description, setDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const services = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const created = addLead({
      businessName,
      category,
      location,
      website,
      phone,
      email,
      instagram,
      description,
      services: services.length > 0 ? services : [`Standard ${category} Service`],
      businessActivity: 'Active local operations',
      source: 'Manual Addition',
    });

    setSelectedLeadId(created.id);
    onClose();
    setActiveTab('analyzer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Prospect</h3>
              <p className="text-xs text-slate-400">Enter public business details for instant automated analysis & demo generation.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. IronPulse Fitness Studio"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Gym & Fitness">Gym & Fitness</option>
                <option value="Restaurant & Café">Restaurant & Café</option>
                <option value="Coaching Centre">Coaching & Education</option>
                <option value="Salon & Spa">Salon & Spa</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Local Business">Other Local Business</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Location</label>
              <input
                type="text"
                placeholder="e.g. Gachibowli, Hyderabad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Current Website (Leave blank if No Website)</label>
            <input
              type="text"
              placeholder="https://example.com or leave blank"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Public Phone / WhatsApp</label>
              <input
                type="text"
                placeholder="+91 93472 49697"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Instagram Handle</label>
              <input
                type="text"
                placeholder="@business_handle"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Services (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Weight Loss, CrossFit, Personal Training"
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Notes / Brief Description</label>
            <textarea
              rows={2}
              placeholder="Factual notes on local presence, current offerings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add & Analyze Prospect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
