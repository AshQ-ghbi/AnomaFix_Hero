/**
 * Notifications Page - Realtime status alerts
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, Notification } from '../utils/supabase';
import { Bell, Check, Trash2, Mail, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    setNotifications(supabase.getNotifications());
    const unsub = supabase.subscribe(() => {
      setNotifications(supabase.getNotifications());
    });
    return unsub;
  }, []);

  const handleMarkRead = (id: string) => {
    supabase.markNotificationRead(id);
    setNotifications(supabase.getNotifications());
  };

  const handleMarkAllRead = () => {
    supabase.markAllNotificationsRead();
    setNotifications(supabase.getNotifications());
  };

  const getNotificationIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('submitted') || t.includes('resolved')) {
      return <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />;
    } else if (t.includes('assigned')) {
      return <Clock className="h-4.5 w-4.5 text-blue-500" />;
    } else {
      return <Bell className="h-4.5 w-4.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="notifications-page-root">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Head */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Platform Notifications</h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time updates regarding your submitted tickets, comment replies, and localized maintenance assignments.
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUMN A & B: Notification List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-3.5">
              
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <Bell className="h-4.5 w-4.5 text-blue-500" />
                <h3 className="font-bold text-slate-950 text-sm">Inbox Updates</h3>
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 items-start ${
                      notif.read 
                        ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                        : 'bg-blue-50/20 border-blue-100 shadow-2xs'
                    }`}
                  >
                    {/* Icon indicator */}
                    <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-3xs shrink-0 mt-0.5">
                      {getNotificationIcon(notif.title)}
                    </div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2.5">
                        <span className={`font-bold text-xs ${notif.read ? 'text-slate-700' : 'text-slate-950'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium shrink-0">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {notif.message}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                    )}
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 italic">
                    Your notifications inbox is completely clear.
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* COLUMN C: Notification Preferences (Email Placeholders) */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-4.5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <Mail className="h-4.5 w-4.5 text-blue-500" />
                <h3 className="font-bold text-slate-950 text-sm">Email Notifications</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Choose how AnomaFix coordinates municipal schedules with your external email accounts.
              </p>

              {/* Toggles */}
              <div className="space-y-4">
                
                <div className="flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Weekly Digest Email</span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">Receive overall summaries of ward resolves on Friday mornings.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Immediate Ticket Resolves</span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">Email instantly when an officer uploads a resolve verification photo.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />
                </div>

              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-400 leading-normal">
                Email services are mock placeholders. Notification dispatches are broadcasted visually to the in-app inbox in real-time.
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
