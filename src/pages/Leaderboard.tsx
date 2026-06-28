/**
 * Leaderboard & Gamification Hub
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, User } from '../utils/supabase';
import { Award, Medal, Trophy, Zap, Sparkles, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaders, setLeaders] = useState<User[]>([]);

  useEffect(() => {
    setCurrentUser(supabase.getCurrentUser());
    setLeaders(supabase.getLeaderboard());

    const unsub = supabase.subscribe(() => {
      setCurrentUser(supabase.getCurrentUser());
      setLeaders(supabase.getLeaderboard());
    });
    return unsub;
  }, []);

  const getRankEmoji = (idx: number) => {
    switch (idx) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${idx + 1}`;
    }
  };

  const getRankBadgeColor = (idx: number) => {
    switch (idx) {
      case 0: return 'bg-amber-100 text-amber-800 border-amber-200';
      case 1: return 'bg-slate-100 text-slate-800 border-slate-200';
      case 2: return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const badgesCabinet = [
    { name: 'First Responder', desc: 'Filing your very first verified street report.', unlocked: true },
    { name: 'Pothole Patrol', desc: 'Logging 3+ pothole tickets resolved by crews.', unlocked: currentUser ? currentUser.level >= 3 : false },
    { name: 'Street Guardian', desc: 'Accumulating over 2000 total community points.', unlocked: currentUser ? currentUser.points >= 2000 : false },
    { name: 'Civic Architect', desc: 'Top rank contributor on the weekly challenge board.', unlocked: currentUser ? currentUser.role === 'Admin' : false }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="leaderboard-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Head */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Community Leaderboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track community heroes, unlock contribution badges, and join weekly challenges to protect your city.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUMN A & B: Main Leaderboard roster */}
          <div className="lg:col-span-2 flex flex-col gap-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
            
            <div className="flex items-center gap-2.5 border-b border-slate-50 pb-4">
              <Trophy className="h-5 w-5 text-amber-500 fill-amber-500/10" />
              <h3 className="font-bold text-slate-950 text-base">Top Ward Contributors</h3>
            </div>

            <div className="space-y-3.5">
              {leaders.map((user, idx) => {
                const isMe = user.id === currentUser?.id;
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isMe 
                        ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                        : 'border-slate-50 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4.5">
                      {/* Rank Medal */}
                      <span className={`w-9 h-9 rounded-full border flex items-center justify-center font-extrabold text-xs shrink-0 ${getRankBadgeColor(idx)}`}>
                        {getRankEmoji(idx)}
                      </span>

                      {/* Avatar */}
                      <img
                        src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg'}
                        className="h-10 w-10 rounded-full border border-slate-100 object-cover"
                        alt="Avatar"
                      />

                      {/* Info text */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-950 text-xs md:text-sm">{user.name}</h4>
                          {isMe && (
                            <span className="bg-blue-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Me
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                          Level {user.level} • {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Points Total */}
                    <div className="text-right flex flex-col items-end gap-0.5">
                      <span className="text-xs md:text-sm font-extrabold text-slate-900">{user.points} pts</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Karma</span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* COLUMN C: My Achievements Gallery & Badge Progression */}
          <div className="flex flex-col gap-6">
            
            {/* Progression details card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">My Progression</span>
                <span className="text-xs font-extrabold text-blue-600">Level {currentUser?.level}</span>
              </div>

              {/* Progress visual bar */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Level Up Progress</span>
                  <span>{currentUser ? `${currentUser.points % 500} / 500` : '0 / 500'} pts</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${currentUser ? ((currentUser.points % 500) / 500) * 100 : 0}%` }} 
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-50 text-[11px] text-slate-500 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500 shrink-0 fill-blue-500/10" />
                <span>Gain 100 points for filing any potholes or streetlight logs!</span>
              </div>
            </div>

            {/* Badges Cabinet */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <Award className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />
                <h3 className="font-bold text-slate-950 text-sm">Badge Cabinet</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {badgesCabinet.map((badge, bIdx) => (
                  <div
                    key={bIdx}
                    className={`p-3 rounded-xl border flex flex-col gap-1 text-center items-center transition-all ${
                      badge.unlocked 
                        ? 'bg-slate-50/50 border-slate-100 shadow-2xs' 
                        : 'bg-slate-50/20 border-slate-100/50 opacity-40'
                    }`}
                  >
                    <span className="text-2xl mb-1">{badge.unlocked ? '🏆' : '🔒'}</span>
                    <span className="font-bold text-slate-900 text-[10px] leading-snug">{badge.name}</span>
                    <span className="text-[9px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
