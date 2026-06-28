/**
 * Live Map Hub - Hyperlocal civic issue tracker with address search
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Report } from '../utils/supabase';
import InteractiveMap from '../components/InteractiveMap';
import { Search, MapPin, Activity, SlidersHorizontal, Sparkles, Navigation, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

export default function LiveMap() {
  const [searchParams] = useSearchParams();
  const highlightedReportId = searchParams.get('reportId') || undefined;

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(highlightedReportId);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  useEffect(() => {
    setReports(supabase.getReports());
    const unsub = supabase.subscribe(() => {
      setReports(supabase.getReports());
    });
    return unsub;
  }, []);

  const handleSelectReportFromList = (repId: string) => {
    setSelectedReportId(repId);
  };

  // Perform search & filter matching
  const filteredList = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || r.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleToggleVote = (id: string) => {
    supabase.toggleVote(id);
    setReports(supabase.getReports());
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="live-map-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Head */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Live Geospatial Map</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and monitor infrastructure tickets registered across your municipal district. Select pins to coordinate volunteering dispatch.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100vh-220px)]">
          
          {/* LEFT SIDEBAR: Search Directory */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4.5 flex flex-col gap-4 shadow-xs h-[450px] lg:h-full">
            
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by address, street, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Micro Filters */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-600 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Potholes">Potholes</option>
                <option value="Streetlights">Streetlights</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Illegal Dumping">Illegal Dumping</option>
                <option value="Garbage">Garbage</option>
                <option value="Trees">Trees</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-600 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical Only</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Scrollable list directory */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Nearby Issues ({filteredList.length})
              </span>

              {filteredList.map((rep) => {
                const isSelected = selectedReportId === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => handleSelectReportFromList(rep.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative group ${
                      isSelected 
                        ? 'bg-blue-50/40 border-blue-200 shadow-sm' 
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {rep.title}
                      </h4>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 uppercase tracking-wide ${
                        rep.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                        rep.severity === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {rep.severity}
                      </span>
                    </div>

                    {/* Meta geocode */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-300" />
                      <span className="truncate">{rep.address.split(',')[1] || rep.address}</span>
                    </div>

                    {/* Description excerpt */}
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {rep.description}
                    </p>

                    {/* Bottom stats & voting */}
                    <div className="flex items-center justify-between border-t border-slate-100/50 pt-2 text-[10px]">
                      <span className={`font-semibold ${rep.status === 'Resolved' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {rep.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVote(rep.id);
                        }}
                        className={`px-2 py-1 rounded border flex items-center gap-1 font-semibold text-[9px] cursor-pointer transition-all ${
                          rep.is_upvoted_by_me 
                            ? 'bg-blue-600 text-white border-blue-500' 
                            : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        <span>▲ Verify</span>
                        <span>{rep.upvotes_count || 0}</span>
                      </button>
                    </div>

                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-400 italic">
                  No issues matches your filter criteria.
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: Fully interactive vector map dashboard */}
          <div className="lg:col-span-2 h-[450px] lg:h-full">
            <InteractiveMap
              interactive={true}
              highlightReportId={selectedReportId}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
