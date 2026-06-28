/**
 * Contact Support & Municipal Inquiries Page
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Landmark, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Partnership Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
      alert("Thank you! Your municipal support ticket has been logged. Our dispatch clerk will contact you shortly.");
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="contact-page-root">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="text-center flex flex-col items-center gap-3 mb-10">
          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            Get in Touch
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact AnomaFix Support
          </h2>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed mt-1">
            Interested in deploying AnomaFix in your local municipality? Drop our technical team a message below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Side Info details */}
          <div className="flex flex-col gap-5 text-xs text-slate-500 leading-normal">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col gap-3">
              <Landmark className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-slate-900">Ward Headquarters</span>
              <p>
                AnomaFix Civic Labs<br />
                845 Market St, Suite 500<br />
                San Francisco, CA 94103
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col gap-3">
              <Mail className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-slate-900">Digital Queries</span>
              <p>
                Partnerships: partner@anomafix.gov<br />
                Security Audits: security@anomafix.gov
              </p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="Partnership Inquiry">Deploy in my City / Ward</option>
                  <option value="Technical Support">Technical Bug or API error</option>
                  <option value="General Inquiries">General feedback</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Message details</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your city, typical department backlog sizes, and volume of potholes..."
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                />
              </div>

              {sent && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl p-3.5 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Sending dispatch message...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
