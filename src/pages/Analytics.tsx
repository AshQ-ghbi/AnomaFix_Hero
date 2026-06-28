/**
 * AnomaFix Analytics Suite - Recharts data visualizers
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, Report } from '../utils/supabase';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { Sparkles, BarChart3, TrendingUp, Clock, Activity, Landmark } from 'lucide-react';

export default function Analytics() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setReports(supabase.getReports());
    const unsub = supabase.subscribe(() => {
      setReports(supabase.getReports());
    });
    return unsub;
  }, []);

  // --- STATS CALCS ---
  const totalReports = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  // 1. Issue Trends Over 30 Days (Simulated granular dates)
  const trendsData = [
    { date: 'Jun 05', 'Road Damage': 4, 'Streetlights': 2, 'Water Leakage': 1 },
    { date: 'Jun 10', 'Road Damage': 6, 'Streetlights': 5, 'Water Leakage': 2 },
    { date: 'Jun 15', 'Road Damage': 10, 'Streetlights': 7, 'Water Leakage': 4 },
    { date: 'Jun 20', 'Road Damage': 14, 'Streetlights': 8, 'Water Leakage': 7 },
    { date: 'Jun 25', 'Road Damage': 19, 'Streetlights': 11, 'Water Leakage': 9 },
    { date: 'Jun 28', 'Road Damage': reports.filter(r => r.category === 'Road Damage' || r.category === 'Potholes').length + 15, 'Streetlights': reports.filter(r => r.category === 'Streetlights').length + 10, 'Water Leakage': reports.filter(r => r.category === 'Water Leakage').length + 8 }
  ];

  // 2. Average Resolution Time by category (simulated hours based on severity logs)
  const avgResolutionTimeData = [
    { category: 'Potholes', hours: 24 },
    { category: 'Streetlights', hours: 18 },
    { category: 'Water Leakage', hours: 36 },
    { category: 'Garbage', hours: 12 },
    { category: 'Illegal Dumping', hours: 48 },
    { category: 'Drainage', hours: 32 }
  ];

  // 3. Ward-wise / Neighborhood Distribution
  const neighborhoodData = [
    { name: 'SOMA', value: 14 },
    { name: 'Mission District', value: 22 },
    { name: 'Haight-Ashbury', value: 18 },
    { name: 'Financial District', value: 9 },
    { name: 'Civic Center', value: 12 }
  ];

  // 4. Department Compliance loads
  const departmentWorkloadData = [
    { name: 'Public Works', active: reports.filter(r => r.department === 'Public Works' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Public Works' && r.status === 'Resolved').length },
    { name: 'Sanitation', active: reports.filter(r => r.department === 'Sanitation' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Sanitation' && r.status === 'Resolved').length },
    { name: 'Water & Sewerage', active: reports.filter(r => r.department === 'Water & Sewerage' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Water & Sewerage' && r.status === 'Resolved').length },
    { name: 'Traffic & Transit', active: reports.filter(r => r.department === 'Traffic & Transit' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Traffic & Transit' && r.status === 'Resolved').length },
    { name: 'Parks & Forestry', active: reports.filter(r => r.department === 'Parks & Forestry' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Parks & Forestry' && r.status === 'Resolved').length }
  ];

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="analytics-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Page Head */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Ward Metrics & Performance</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics mapping civic issue densities, department resolution speeds, and ward compliance performance.
          </p>
        </div>

        {/* Highlight KPI metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 shadow-xs">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Platform Compliance</span>
              <span className="text-xl font-extrabold text-slate-900">{resolutionRate}% Resolved</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 shadow-xs">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Repair Time</span>
              <span className="text-xl font-extrabold text-slate-900">22.4 Hours</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 shadow-xs">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-lg shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Citizen Engagement</span>
              <span className="text-xl font-extrabold text-slate-900">4,250 Reports/Mo</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 shadow-xs">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg shrink-0">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Participating Wards</span>
              <span className="text-xl font-extrabold text-slate-900">7 Districts</span>
            </div>
          </div>
        </div>

        {/* --- MAIN CHARTS GRID --- */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Chart A: Reporting trends over time */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[350px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>Issue Reporting Trends (30 Days)</span>
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData}>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="Road Damage" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="Streetlights" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="Water Leakage" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart B: Department Active vs Completed loads */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[350px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Department Workload & SLA Adherence</span>
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentWorkloadData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="active" name="Active Backlog" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="SLA Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart C: Average Resolution Time (Hours) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[350px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Avg Repair Turnaround (Hours)</span>
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgResolutionTimeData} layout="vertical">
                  <XAxis type="number" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="hours" name="Avg Hours to Resolve" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart D: Neighborhood distribution pie */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[350px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Ward Density Distribution</span>
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={neighborhoodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {neighborhoodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* AI Predictive Dispatch Recommendation banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col gap-3">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="h-4.5 w-4.5 text-blue-400 fill-blue-400/20" />
            <span className="font-mono text-[10px] text-blue-400 tracking-wider uppercase">AI PREDICTIVE MAINTENANCE SUMMARY</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed leading-relaxed">
            Based on historical monthly trends, <strong className="text-white">Water Leakage</strong> spikes consistently during temperature drops in June. Public Works should prioritize diagnostic reviews on deep lines around SOMA to minimize burst hazards and secure municipal water counts.
          </p>
        </div>

      </div>
    </div>
  );
}
