/**
 * User Profile Page - Stats & Filed Reports directory
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, User, Report } from '../utils/supabase';
import { User as UserIcon, Mail, Shield, Award, MapPin, Calendar, CheckCircle, FileText, LogOut } from 'lucide-react';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const user = supabase.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // Filter reports matching user id
      const all = supabase.getReports();
      setReports(all.filter(r => r.user_id === user.id));
    }

    const unsub = supabase.subscribe(() => {
      const u = supabase.getCurrentUser();
      setCurrentUser(u);
      if (u) {
        setName(u.name);
        setEmail(u.email);
        const all = supabase.getReports();
        setReports(all.filter(r => r.user_id === u.id));
      }
    });
    return unsub;
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Simulate saving profile by registering/replacing user details
    supabase.register(name, email, currentUser.role);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-[80vh] flex flex-col items-center justify-center p-6 text-center" id="profile-restricted-view">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 max-w-md shadow-sm space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sign in Required</h3>
          <p className="text-xs text-slate-400">
            To view your personal filed reports, earned points level, and manage account credentials, please authenticate.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="profile-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Head */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Citizen Profile</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your credentials, audit your community karma history, and monitor your personal submissions logs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUMN A: Account Editor details */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-5 h-fit">
            <div className="flex flex-col items-center text-center gap-2 border-b border-slate-50 pb-5">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'}
                className="h-20 w-20 rounded-full border-4 border-slate-50 shadow-md object-cover"
                alt="Avatar"
              />
              <h3 className="font-extrabold text-slate-950 text-base mt-2">{currentUser?.name}</h3>
              <span className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                {currentUser?.role}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                Level {currentUser?.level} • Joined {currentUser ? new Date(currentUser.created_at).toLocaleDateString() : 'Today'}
              </span>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Display Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                  />
                  <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                  />
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {isSaved && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl p-3 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Save Details
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  supabase.logout();
                  window.location.href = '/login';
                }}
                className="w-full py-2.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out Securely</span>
              </button>
            </div>

          </div>

          {/* COLUMN B & C: Personal filed reports history */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <h3 className="font-extrabold text-slate-950 text-base">My Filed Reports History ({reports.length})</h3>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs flex flex-col md:flex-row gap-4.5"
                >
                  {/* Photo thumbnail */}
                  <img
                    src={report.image_url || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=200'}
                    className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                    alt={report.title}
                  />

                  {/* Text Description */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-slate-900 text-xs md:text-sm truncate">{report.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                        report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-semibold mt-1">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">
                        {report.category}
                      </span>
                      <span>📍 {report.address.split(',')[1] || report.address}</span>
                      <span>•</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                </div>
              ))}

              {reports.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs italic">
                  You haven't filed any street complaints yet. Navigate to 'Report Issue' to help your neighbors.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
