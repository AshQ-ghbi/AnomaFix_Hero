/**
 * Administrative Control & Incident Moderation Panel
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, Report, User, ReportStatus, getSupabaseCredentials } from '../utils/supabase';
import { ShieldCheck, SlidersHorizontal, Settings, Users, AlertOctagon, CheckCircle, RefreshCcw, Landmark } from 'lucide-react';

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activePane, setActivePane] = useState<'reports' | 'users' | 'settings'>('reports');
  const [resolvingNotes, setResolvingNotes] = useState<Record<string, string>>({});

  // Settings mock states
  const [autoRouting, setAutoRouting] = useState(true);
  const [confidenceLimit, setConfidenceLimit] = useState(85);
  const [duplicateRadius, setDuplicateRadius] = useState(100);

  useEffect(() => {
    setCurrentUser(supabase.getCurrentUser());
    setReports(supabase.getReports());

    const unsub = supabase.subscribe(() => {
      setCurrentUser(supabase.getCurrentUser());
      setReports(supabase.getReports());
    });
    return unsub;
  }, []);

  const handleUpdateStatus = (reportId: string, status: ReportStatus) => {
    const notes = resolvingNotes[reportId];
    supabase.updateReportStatus(reportId, status, notes);
    setResolvingNotes(prev => ({ ...prev, [reportId]: '' }));
    setReports(supabase.getReports());
    alert(`Ticket status successfully upgraded to: [${status}]. Reporter has been notified.`);
  };

  const handleUpdateDepartment = (reportId: string, dept: string) => {
    supabase.updateReportDepartment(reportId, dept);
    setReports(supabase.getReports());
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-100';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Government Officer')) {
    return (
      <div className="bg-slate-50 min-h-[80vh] flex flex-col items-center justify-center p-6 text-center" id="admin-restricted-view">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 max-w-md shadow-sm space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-400">
            Only verified Municipal Government Officers or Admin users are permitted to access the Incident Command Center. Please sign in with an official city account.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Go to Login Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="admin-panel-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Head */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Incident Command Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch assigned incidents to city crews, monitor municipal performance logs, and configure Gemini platform thresholds.
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-5 text-sm font-semibold">
          <button
            onClick={() => setActivePane('reports')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activePane === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-800'}`}
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>Manage Incidents Queue</span>
          </button>
          <button
            onClick={() => setActivePane('users')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activePane === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-800'}`}
          >
            <Users className="h-4.5 w-4.5" />
            <span>User Accounts & Roles</span>
          </button>
          <button
            onClick={() => setActivePane('settings')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activePane === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-800'}`}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Gemini AI Parameters</span>
          </button>
        </div>

        {/* --- INCIDENTS QUEUE PANE --- */}
        {activePane === 'reports' && (
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Municipal Work Orders ({reports.length})
            </span>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col lg:flex-row gap-5"
                >
                  {/* Photo evidence preview */}
                  <img
                    src={rep.image_url || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=200'}
                    className="h-24 w-24 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                    alt="Proof"
                  />

                  {/* Incident Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h4 className="font-extrabold text-slate-950 text-sm leading-snug">{rep.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">📍 {rep.address}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border tracking-wider shrink-0 ${getSeverityStyle(rep.severity)}`}>
                          {rep.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-semibold bg-slate-100 border border-slate-100 text-slate-600">
                          Status: {rep.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{rep.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-semibold mt-1">
                      <span>Category: <strong className="text-slate-700 font-semibold uppercase">{rep.category}</strong></span>
                      <span>•</span>
                      <span>Assigned division: <strong className="text-slate-700 font-semibold">{rep.department}</strong></span>
                    </div>
                  </div>

                  {/* Operational dispatch actions */}
                  <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-5 flex flex-col gap-3">
                    
                    {/* Department reassigner */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Reassign Bureau</span>
                      <select
                        value={rep.department}
                        onChange={(e) => handleUpdateDepartment(rep.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[11px] text-slate-700 focus:outline-none"
                      >
                        <option value="Public Works">Public Works</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Water & Sewerage">Water & Sewerage</option>
                        <option value="Traffic & Transit">Traffic & Transit</option>
                        <option value="Parks & Forestry">Parks & Forestry</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>

                    {/* Operational update input and action buttons */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Resolution Update Notes</span>
                      <input
                        type="text"
                        placeholder="E.g. dispatching crew Charlie with asphalt bags..."
                        value={resolvingNotes[rep.id] || ''}
                        onChange={(e) => setResolvingNotes(prev => ({ ...prev, [rep.id]: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none"
                      />

                      <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                        <button
                          onClick={() => handleUpdateStatus(rep.id, 'In Progress')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-[10px] transition-all cursor-pointer text-center"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(rep.id, 'Resolved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded text-[10px] transition-all cursor-pointer text-center"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- USER GOVERNANCE PANE --- */}
        {activePane === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-slate-950 text-sm">Citizen Governance Directory</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Verify platform accounts, modify roles, and track active contribution metrics. Use the role selection bar at the very top of the window to simulate individual role perspectives instantly.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">Level</th>
                    <th className="py-2.5">Karma points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="text-slate-700">
                    <td className="py-3 font-semibold">Sarah Jenkins</td>
                    <td className="py-3 text-blue-600 font-bold">Citizen</td>
                    <td className="py-3">Level 2</td>
                    <td className="py-3 font-semibold">350 pts</td>
                  </tr>
                  <tr className="text-slate-700">
                    <td className="py-3 font-semibold">Liam Carter</td>
                    <td className="py-3 text-emerald-600 font-bold">Volunteer</td>
                    <td className="py-3">Level 9</td>
                    <td className="py-3 font-semibold">2,450 pts</td>
                  </tr>
                  <tr className="text-slate-700">
                    <td className="py-3 font-semibold">David Miller</td>
                    <td className="py-3 text-amber-600 font-bold">Government Officer</td>
                    <td className="py-3">Level 5</td>
                    <td className="py-3 font-semibold">1,200 pts</td>
                  </tr>
                  <tr className="text-slate-700">
                    <td className="py-3 font-semibold">Amara Vance</td>
                    <td className="py-3 text-purple-600 font-bold">Admin</td>
                    <td className="py-3">Level 15</td>
                    <td className="py-3 font-semibold">4,500 pts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SYSTEM SETTINGS PANEL --- */}
        {activePane === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Settings className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-slate-950 text-sm">Gemini AI Engine Parameters</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-slate-900 block">Automatic Dispatch Routing</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">Let Gemini assign departments, priority and categories autonomously upon filing.</span>
                <input
                  type="checkbox"
                  checked={autoRouting}
                  onChange={(e) => setAutoRouting(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 mt-2 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-900 block">AI Classification confidence limit ({confidenceLimit}%)</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">Minimum rating required to bypass manual vetting by dispatch officers.</span>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidenceLimit}
                  onChange={(e) => setConfidenceLimit(Number(e.target.value))}
                  className="w-full bg-slate-100 rounded-lg cursor-pointer h-1.5 mt-2 accent-blue-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-900 block">Duplicate Radius constraint ({duplicateRadius} meters)</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">Alerts dispatch of overlap when coordinates and visual descriptions match.</span>
                <input
                  type="range"
                  min="20"
                  max="500"
                  value={duplicateRadius}
                  onChange={(e) => setDuplicateRadius(Number(e.target.value))}
                  className="w-full bg-slate-100 rounded-lg cursor-pointer h-1.5 mt-2 accent-blue-600"
                />
              </div>

              <div className="bg-blue-50/50 border border-blue-50 rounded-xl p-4 flex flex-col gap-1">
                <span className="font-bold text-slate-950 block">Gemini API Connection status</span>
                <span className="text-emerald-600 font-semibold block mt-1">● Active & Secure (Server-Side)</span>
                <p className="text-[10px] text-slate-400 mt-1">Headers matching user-agent: 'aistudio-build'. Secrets panel handles credentials safely.</p>
              </div>

              <div className={`border rounded-xl p-4 flex flex-col gap-1 ${
                getSupabaseCredentials().isConfigured 
                  ? 'bg-emerald-50/50 border-emerald-100'
                  : 'bg-amber-50/50 border-amber-100'
              }`}>
                <span className="font-bold text-slate-950 block">Supabase Sync Engine Status</span>
                <span className={`font-semibold block mt-1 ${
                  getSupabaseCredentials().isConfigured ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {getSupabaseCredentials().isConfigured ? '● Connected & Active' : '○ Local Mock Sandbox Active'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  {getSupabaseCredentials().isConfigured 
                    ? "Your custom database is connected. Reports, comments, upvotes, and users are saving directly to your PostgreSQL instance."
                    : "The application is running in local sandbox mode. You can connect your live Supabase credentials on the Login Portal screen."}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
