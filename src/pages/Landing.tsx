/**
 * AnomaFix Landing Page
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, CheckCircle, Shield, Award, Users, FileText, ArrowRight, Activity, HelpCircle, HeartHandshake, Eye } from 'lucide-react';

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Issues Resolved", value: "14,845+", icon: CheckCircle, color: "text-emerald-500" },
    { label: "AI Routing Accuracy", value: "98.4%", icon: Sparkles, color: "text-blue-500" },
    { label: "Community Members", value: "24,000+", icon: Users, color: "text-indigo-500" },
    { label: "Avg Resolution Time", value: "32 hrs", icon: Activity, color: "text-amber-500" }
  ];

  const features = [
    {
      title: "AI Image Verification",
      desc: "Our custom Gemini integration immediately recognizes the exact damage type, writes descriptive logs, and assigns severity, removing manual dispatch overhead.",
      icon: Sparkles
    },
    {
      title: "Hyperlocal Pinpointing",
      desc: "Pins issues directly to municipal grids with immediate address lookup and smart coordinate verification.",
      icon: MapPin
    },
    {
      title: "Consensus-Driven Trust",
      desc: "Residents verify reports, vote on critical priorities, flag duplicates, and collaboratively solve urban blindspots.",
      icon: Users
    },
    {
      title: "Unified Department Dispatch",
      desc: "Direct integration with public work structures. Issues route instantly to Sanitation, Parks, or Transit crews.",
      icon: Shield
    }
  ];

  const workflowSteps = [
    { title: "Spot a Problem", desc: "Take a photo of a broken streetlight, pothole, or garbage leak and upload it from your browser.", icon: Eye },
    { title: "AI Dispatcher Assessment", desc: "Gemini processes the image, classifies categories, routing, and scores priority in 2 seconds.", icon: Sparkles },
    { title: "Community Verification", desc: "Nearby volunteers check the coordinates to avoid duplicate or malicious filing.", icon: Users },
    { title: "Municipal Resolution", desc: "Government crews inspect the public queue, deploy crews, and submit photo confirmation of resolve.", icon: CheckCircle }
  ];

  const benefits = [
    { title: "For Citizens", desc: "Receive immediate progress logs of your filed complaints instead of black-hole municipal emails." },
    { title: "For Volunteers", desc: "Earn community achievements, redeem karma points, and organize local cleanups on weekends." },
    { title: "For Officials", desc: "Receive clean, verified, prioritized geo-mapped damage files with automatic duplicate filtering." }
  ];

  const faqs = [
    { q: "Is AnomaFix sponsored by the government?", a: "AnomaFix acts as a standard collaborative middleman. It can be utilized privately by community volunteers or directly synchronized with standard government municipal APIs to route work tickets automatically." },
    { q: "How are duplicate reports filtered?", a: "When you upload an issue, Gemini evaluates nearby reports within a 50-meter radius based on coordinates and visual descriptions, auto-flagging potentials for admin merge." },
    { q: "What rewards can I earn?", a: "By reporting authentic issues and verifying others, citizens earn points and community badges like 'Street Guardian'. These establish leaderboard ranks and local authority status." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="landing-page-root">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-600 mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3 text-blue-500 fill-blue-500/20" />
            <span>AI-Powered Hyperlocal Civic Dispatch</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight">
            Spot. Report. Resolve. <br />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Repairing Public Spaces Together
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
            AnomaFix connects citizens, community volunteers, and municipal governments. Leverage Gemini AI, real-time geolocation tracking, and collaborative voting to fix streetlights, potholes, and civic infrastructure in hours—not weeks.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/15 transition-all flex items-center gap-2 group cursor-pointer text-sm w-full sm:w-auto justify-center"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/report"
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all text-sm w-full sm:w-auto justify-center text-center"
            >
              Report a Civic Issue
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE STATISTICS */}
      <section className="py-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-xs">
                <div className={`p-3 rounded-xl bg-slate-50 ${stat.color} mb-3.5`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Platform Capabilities</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">Built with next-gen tools to ensure transparent reporting and rapid municipal turnaround.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 flex flex-col hover:border-blue-500/20 transition-all group">
                <div className="bg-white rounded-xl p-3 border border-slate-100 w-12 h-12 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm tracking-wide">{feat.title}</h3>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (STORY FLOW) */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">Simple, bullet-proof, and accountable four-step loop.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative group">
                {/* Visual Circle Line connector */}
                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-slate-200 z-0" />
                )}
                
                <div className="w-14 h-14 bg-white rounded-full border border-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg shadow-sm z-10 group-hover:border-blue-600 group-hover:text-blue-600 transition-all">
                  <step.icon className="h-5 w-5" />
                </div>
                
                <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase mt-5">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-2.5 max-w-[200px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI WORKFLOW DEMONSTRATION */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual AI Card Mock */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col gap-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4.5 w-4.5 text-blue-400 fill-blue-400/20" />
                  <span className="font-mono text-[10px] text-blue-400 tracking-widest uppercase">AnomaFix Gemini Core</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  Online
                </span>
              </div>

              {/* Step checklist logs */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[10px]">100ms</div>
                  <div>
                    <span className="font-semibold text-slate-200">Image Classification:</span>
                    <p className="text-slate-400 mt-0.5">Identified category: <strong className="text-white font-semibold">Pothole</strong> (98.6% confidence).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[10px]">250ms</div>
                  <div>
                    <span className="font-semibold text-slate-200">Dynamic Title Generation:</span>
                    <p className="text-slate-400 mt-0.5">"Deep road surface damage near central crosswalk posing traffic hazards"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[10px]">480ms</div>
                  <div>
                    <span className="font-semibold text-slate-200">Duplicate Check:</span>
                    <p className="text-slate-400 mt-0.5">Scanned reports within 100m. No duplicate visual matches discovered.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[10px]">620ms</div>
                  <div>
                    <span className="font-semibold text-slate-200">Routing & Severity dispatch:</span>
                    <p className="text-slate-400 mt-0.5">Routed to <strong className="text-blue-400 font-semibold">Public Works</strong>. Severity marked <strong className="text-red-400 font-semibold">Critical</strong>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="font-mono text-slate-500 block text-[10px] mb-1">AUTOMATED GEMINI RECOMMENDATION</span>
                <p className="text-slate-300 italic">"Highly active arterial lane with deep cratering; high collision probability. Recommend urgent deployment of work crew Bravo."</p>
              </div>
            </div>

            {/* Explanatory text */}
            <div className="flex flex-col gap-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Autonomous Pipeline</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                Gemini AI Powers Your Reporting Flow Behind the Scenes
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                No more filing static, unformatted tickets. AnomaFix uses Google's Gemini models to transcribe descriptions, clean up informal speech, predict urgency, choose appropriate government bureaus, and flag duplicate entries immediately.
              </p>
              
              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Eliminates 90% of manual civil screening labor.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Auto-translates submissions from multilingual citizens.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Filters trolls and duplicates instantly using image hashes.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PLATFORM BENEFITS */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Designed for Everyone</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">Bridging the divide between neighborhood streets and City Hall dashboards.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col shadow-xs hover:shadow-md transition-all">
                <div className="bg-blue-50 text-blue-600 h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs mb-4.5">
                  0{i+1}
                </div>
                <h3 className="font-bold text-slate-950 text-sm tracking-wide">{b.title}</h3>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">What People Are Saying</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">Empowering active local leaders with data and collaborative efficiency.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "AnomaFix completely reformed how our green volunteer team maps hazardous neighborhood areas. We organized a three-ward cleanup using the Live Map coordinates, resolving 14 illegal dump hotspots in a single weekend!"
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="h-9 w-9 rounded-full object-cover" alt="User avatar" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Elena Rostova</h4>
                  <span className="text-[10px] text-slate-400">Volunteer Coordinator, Ward 4</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "As a civil inspector, sorting through duplicate phone call complaints used to take 20 hours a week. With AnomaFix, I receive a clean, filtered dashboard pre-routed to our Sanitation and Transit crews."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="h-9 w-9 rounded-full object-cover" alt="User avatar" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Officer Mark Chen</h4>
                  <span className="text-[10px] text-slate-400">Department of Civil Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm mt-3">Everything you need to know about getting involved.</p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4.5 font-semibold text-slate-800 text-xs md:text-sm text-left hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-slate-400 text-lg">{activeFaq === i ? '−' : '+'}</span>
                </button>
                
                {activeFaq === i && (
                  <div className="px-11 pb-4.5 text-xs text-slate-500 leading-relaxed border-t border-slate-50/55 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="bg-blue-50 text-blue-600 rounded-full p-3 mb-6 border border-blue-100">
            <HeartHandshake className="h-6 w-6" />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 max-w-2xl leading-tight">
            Ready to Build a Better Neighborhood?
          </h2>
          
          <p className="text-slate-500 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
            Register your citizen account, explore unresolved street logs in your ward, and collaborate with your local council instantly.
          </p>

          <div className="mt-8">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xl shadow-blue-500/15 cursor-pointer"
            >
              Get Started with AnomaFix
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
