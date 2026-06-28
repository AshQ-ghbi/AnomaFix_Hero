/**
 * About Page - Mission & Civic engineering principles
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Users, Landmark, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="about-page-root">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* Header display */}
        <div className="text-center flex flex-col items-center gap-3">
          <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Re-architecting Hyperlocal Civic Action
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed mt-2">
            AnomaFix links citizens, volunteers, and municipal departments through spatial databases and server-side machine intelligence.
          </p>
        </div>

        {/* Visual Pillars layout */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg w-fit">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Automated AI Routing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Google Gemini Models classify upload details, routing incident reports to correct municipal bureaus autonomously in seconds.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg w-fit">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Community Audits</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Decentralized consensus guarantees authenticity. Citizen verification votes prevent duplicates and reduce city inspection loads.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg w-fit">
              <Landmark className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Department Compliance</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dedicated interfaces let city officials assign repair teams, coordinate schedules, and post verification notes in real-time.
            </p>
          </div>
        </div>

        {/* Narrative Block */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col gap-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <h3 className="font-extrabold text-lg md:text-xl tracking-wide">Civic engineering, built with purpose.</h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Every year, municipal departments waste millions on double-vetted audits, unrouted paperwork, and misclassified traffic schedules. AnomaFix establishes a robust, paperless, real-time feedback loop. By combining state-of-the-art multimodal vision models with local volunteer coordination, we transform municipal reports from slow paper complaint queues into fast, automated spatial work orders.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-blue-400 mt-2">
            <span>✓ 94% Auto-routing Accuracy</span>
            <span>✓ OpenStreetMap Geospatial Pins</span>
            <span>✓ Zero User Data Brokering</span>
          </div>
        </div>

      </div>
    </div>
  );
}
