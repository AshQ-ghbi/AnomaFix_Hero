/**
 * AnomaFix Main Dashboard Component
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, Report, User, UserRole } from '../utils/supabase';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, CheckCircle, ShieldAlert, Clock, Award, Users, FileText,
  Sparkles, Calendar, ArrowRight, UserCheck, AlertTriangle, Play, HelpCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(supabase.getCurrentUser());
    setReports(supabase.getReports());

    const unsub = supabase.subscribe(() => {
      setCurrentUser(supabase.getCurrentUser());
      setReports(supabase.getReports());
    });
    return unsub;
  }, []);

  // AI Recommendation trigger calling server-side API
  const handleFetchAiRecommendation = async () => {
    setAiLoading(true);
    try {
      const summaryText = reports.map(r => `[Category: ${r.category}, Severity: ${r.severity}, Status: ${r.status}, Neighborhood: ${r.address.split(',')[1] || ''}]`).join('\n');
      const prompt = `Based on the following real-time municipal reports queue, summarize the critical hotspots, identify the single most urgent issue that requires priority dispatch, suggest preventive maintenance tasks, and summarize the overall health of the ward:\n${summaryText}`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });

      if (!response.ok) throw new Error('Failed to fetch AI feedback');
      const data = await response.json();
      setAiAdvice(data.text);
    } catch (err) {
      console.error(err);
      setAiAdvice("Failed to fetch custom dispatch recommendation. Ensure your GEMINI_API_KEY is configured in Secrets. In the meantime, based on our rules: 'Massive road pothole on main commercial crossing' is the most critical ticket requiring rapid Public Works patching.");
    } finally {
      setAiLoading(false);
    }
  };

  // Run automatically on load if reports are available
  useEffect(() => {
    if (reports.length > 0 && !aiAdvice) {
      handleFetchAiRecommendation();
    }
  }, [reports]);

  // Core counter stats
  const totalOpen = reports.filter(r => r.status !== 'Resolved' && r.status !== 'Closed').length;
  const totalResolved = reports.filter(r => r.status === 'Resolved').length;
  const totalPending = reports.filter(r => r.status === 'Pending' || r.status === 'AI Reviewed').length;
  const totalCritical = reports.filter(r => r.severity === 'Critical' && r.status !== 'Resolved').length;
  const myReports = reports.filter(r => r.user_id === currentUser?.id);
  const myReportsCount = myReports.length;

  // --- CHART DATA COMPILATIONS ---
  
  // 1. Reports by Category
  const categoryCounts = reports.reduce((acc: Record<string, number>, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  const categoryChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // 2. Monthly Reports (Simulated history for trends)
  const monthlyData = [
    { name: 'Jan', Resolved: 12, Filed: 18 },
    { name: 'Feb', Resolved: 19, Filed: 25 },
    { name: 'Mar', Resolved: 28, Filed: 32 },
    { name: 'Apr', Resolved: 45, Filed: 48 },
    { name: 'May', Resolved: 58, Filed: 64 },
    { name: 'Jun', Resolved: totalResolved + 70, Filed: reports.length + 80 }
  ];

  // 3. Department performance
  const deptPerformanceData = [
    { department: 'Public Works', active: reports.filter(r => r.department === 'Public Works' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Public Works' && r.status === 'Resolved').length },
    { department: 'Sanitation', active: reports.filter(r => r.department === 'Sanitation' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Sanitation' && r.status === 'Resolved').length },
    { department: 'Traffic & Transit', active: reports.filter(r => r.department === 'Traffic & Transit' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Traffic & Transit' && r.status === 'Resolved').length },
    { department: 'Water & Sewerage', active: reports.filter(r => r.department === 'Water & Sewerage' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Water & Sewerage' && r.status === 'Resolved').length },
    { department: 'Parks & Forestry', active: reports.filter(r => r.department === 'Parks & Forestry' && r.status !== 'Resolved').length, resolved: reports.filter(r => r.department === 'Parks & Forestry' && r.status === 'Resolved').length }
  ];

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  const handleToggleVote = (id: string) => {
    supabase.toggleVote(id);
    setReports(supabase.getReports());
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="dashboard-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Dynamic Welcomer Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'}
              className="h-14 w-14 rounded-full object-cover border-2 border-slate-100 shadow-sm"
              alt="Avatar"
            />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Welcome, {currentUser?.name || 'Citizen'}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Role: <strong className="text-blue-600 font-semibold">{currentUser?.role}</strong> • Level {currentUser?.level} • {currentUser?.points} Community Points
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/report"
              className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Report New Issue</span>
            </Link>
            <Link
              to="/map"
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              View Live Map
            </Link>
          </div>
        </div>

        {/* --- DYNAMIC ROLE ADVISORIES --- */}
        {currentUser?.role === 'Citizen' && (
          <div className="bg-blue-50/50 border border-blue-100/70 rounded-xl p-4.5 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-blue-600 animate-bounce" />
              <div>
                <span className="font-bold text-slate-950 block">Earn 500 Points for Next Level Up!</span>
                <p className="text-slate-500 mt-0.5">Help verify issues reported nearby. Each community verification vote yields 10 points.</p>
              </div>
            </div>
            <Link to="/feed" className="text-blue-600 font-bold hover:underline shrink-0 flex items-center gap-1">
              <span>Go to Community Feed</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {currentUser?.role === 'Volunteer' && (
          <div className="bg-emerald-50/50 border border-emerald-100/70 rounded-xl p-4.5 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-950 block">Volunteer Challenge Active</span>
                <p className="text-slate-500 mt-0.5">"Streetlights Patrol": Verify 3 streetlight issues in Mission District to unlock the Street Guardian badge!</p>
              </div>
            </div>
            <Link to="/leaderboard" className="text-emerald-600 font-bold hover:underline shrink-0 flex items-center gap-1">
              <span>Leaderboard Rank</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {currentUser?.role === 'Government Officer' && (
          <div className="bg-amber-50/50 border border-amber-100/70 rounded-xl p-4.5 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <span className="font-bold text-slate-950 block">Department Operations Queue</span>
                <p className="text-slate-500 mt-0.5">You have {totalCritical} active critical tickets assigned to your ward division. Dispatch teams immediately.</p>
              </div>
            </div>
            <Link to="/admin" className="text-amber-600 font-bold hover:underline shrink-0 flex items-center gap-1">
              <span>Manage Assignments</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* --- KPI STATS METRIC GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4.5 flex flex-col shadow-xs relative overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open Reports</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1">{totalOpen}</span>
            <div className="absolute top-4 right-4 text-slate-200">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4.5 flex flex-col shadow-xs relative overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Resolved</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1">{totalResolved}</span>
            <div className="absolute top-4 right-4 text-emerald-100">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4.5 flex flex-col shadow-xs relative overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending</span>
            <span className="text-2xl font-extrabold text-slate-500 mt-1">{totalPending}</span>
            <div className="absolute top-4 right-4 text-slate-200">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4.5 flex flex-col shadow-xs relative overflow-hidden">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Critical</span>
            <span className="text-2xl font-extrabold text-red-600 mt-1">{totalCritical}</span>
            <div className="absolute top-4 right-4 text-red-100">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4.5 flex flex-col shadow-xs relative overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">My Reports</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1">{myReportsCount}</span>
            <div className="absolute top-4 right-4 text-slate-200">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4.5 flex flex-col shadow-xs bg-gradient-to-br from-blue-50/30 to-white relative overflow-hidden border-blue-50">
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">My Karma Score</span>
            <span className="text-2xl font-extrabold text-blue-600 mt-1">{currentUser?.points || 0}</span>
            <div className="absolute top-4 right-4 text-blue-200">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* --- GEMINI AI REAL-TIME HOTSPOT & DISPATCH RECOMMENDATIONS --- */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col gap-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/20 p-1.5 rounded-lg">
                <Sparkles className="h-4.5 w-4.5 text-blue-400 fill-blue-400/10 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Gemini Dispatch Intelligence</h3>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-mono">Live Ward Analyzer</span>
              </div>
            </div>
            
            <button
              onClick={handleFetchAiRecommendation}
              disabled={aiLoading}
              className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer disabled:opacity-50 transition-all"
            >
              {aiLoading ? 'Analyzing...' : 'Recalculate Insights'}
            </button>
          </div>

          {aiAdvice ? (
            <div className="text-xs leading-relaxed text-slate-300 space-y-2 whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              {aiAdvice}
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center py-6 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              <span>Synthesizing city hotspot logs...</span>
            </div>
          )}
        </div>

        {/* --- CHARTS DASHBOARD SECTION --- */}
        <div className="grid lg:grid-cols-3 gap-6" id="dashboard-charts-container">
          
          {/* Chart 1: Reports by Category */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[320px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>Reports by Category</span>
            </h3>
            <div className="flex-1 min-h-0">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
              )}
            </div>
          </div>

          {/* Chart 2: Monthly Resolution Rate Trends */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[320px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Monthly Volume & Resolution</span>
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="Filed" stroke="#2563EB" fillOpacity={1} fill="url(#colorFiled)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Department Performance */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[320px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Department Loads</span>
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptPerformanceData}>
                  <XAxis dataKey="department" stroke="#94A3B8" fontSize={8} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="active" name="Active Tickets" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* --- DUAL GRID PANELS: RECENT REPORTS VS UPCOMING TASKS --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Column A: Reports Feed Log */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-slate-900 text-base">Active Issues Log</h3>
                <div className="flex border border-slate-100 rounded-lg p-0.5 bg-slate-100">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${activeTab === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    All reports
                  </button>
                  <button
                    onClick={() => setActiveTab('my')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${activeTab === 'my' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    Mine ({myReportsCount})
                  </button>
                </div>
              </div>

              <Link to="/feed" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <span>View Feed</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {(activeTab === 'all' ? reports : myReports).slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  onClick={() => navigate(`/feed?reportId=${report.id}`)}
                  className="bg-white hover:border-slate-200 border border-slate-100 rounded-xl p-4.5 transition-all shadow-xs flex flex-col md:flex-row gap-4.5 cursor-pointer group"
                >
                  {/* Photo Preview Thumbnail */}
                  <img
                    src={report.image_url || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=200'}
                    className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-100"
                    alt={report.title}
                  />

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                        {report.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 uppercase tracking-wide ${
                        report.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' :
                        report.severity === 'High' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {report.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5 text-[10px] text-slate-400 font-medium">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[9px] uppercase tracking-wide">
                        {report.category}
                      </span>
                      <span>{report.address.split(',')[1] || report.address}</span>
                      <span>•</span>
                      <span className={`font-semibold ${report.status === 'Resolved' ? 'text-emerald-600' : 'text-slate-600'}`}>
                        Status: {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-3.5 border-t md:border-t-0 md:border-l border-slate-50 pt-3 md:pt-0 md:pl-4.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVote(report.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all ${
                        report.is_upvoted_by_me 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <span>▲</span>
                      <span>{report.upvotes_count || 0}</span>
                    </button>
                    
                    <span className="text-[10px] text-slate-400 font-mono">
                      {report.comments_count || 0} Comments
                    </span>
                  </div>
                </div>
              ))}

              {reports.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-400 text-xs">
                  No reports logged in this ward. Be the first to spot and report an issue!
                </div>
              )}
            </div>
          </div>

          {/* Column B: Upcoming Tasks / Challenges */}
          <div className="flex flex-col gap-5">
            <h3 className="font-extrabold text-slate-900 text-base">Community Challenges</h3>
            
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-4">
              
              <div className="p-3.5 rounded-xl border border-blue-50 bg-blue-50/20 text-xs flex flex-col gap-2 relative">
                <span className="absolute top-3 right-3 text-blue-500 animate-pulse">● Active</span>
                <span className="font-bold text-slate-950 block">Sanitation Clean Up</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">Map and verify 3 garbage piles in the SOMA district to unlock 300 bonus points and the "Clean Streets Badge".</p>
                
                {/* ProgressBar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    <span>Progress</span>
                    <span>1 / 3 Verified</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '33.3%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-50 bg-emerald-50/20 text-xs flex flex-col gap-2 relative">
                <span className="font-bold text-slate-950 block">Parks Patrol Challenge</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">Verify streetlight outages inside Haight-Ashbury municipal gardens before Wednesday afternoon.</p>
                <div className="mt-2.5">
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    <span>Progress</span>
                    <span>Completed!</span>
                  </div>
                  <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-400 font-semibold block">WEEKLY CONTRIBUTION CHALLENGE</span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Top contributor this week earns the coveted title of <strong className="text-slate-900 font-semibold">"Community Mayor"</strong> on the leaderboard.</p>
                <Link to="/leaderboard" className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mt-3">
                  <span>View Weekly Leaders</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
