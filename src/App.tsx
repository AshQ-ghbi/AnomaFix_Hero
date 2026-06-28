/**
 * AnomaFix React App Root & Navigation Router
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, User, UserRole } from './utils/supabase';

// Page Imports
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import LiveMap from './pages/LiveMap';
import CommunityFeed from './pages/CommunityFeed';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Global component imports
import GeminiChat from './GeminiChat';
import { Bell, Sparkles, MapPin, Layers, Award, Landmark, MessageSquare, Shield, Info, HelpCircle, LogOut, Menu, X } from 'lucide-react';

function GlobalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(supabase.getCurrentUser());
    const notifs = supabase.getNotifications();
    setUnreadCount(notifs.filter(n => !n.read).length);

    const unsub = supabase.subscribe(() => {
      setCurrentUser(supabase.getCurrentUser());
      const updatedNotifs = supabase.getNotifications();
      setUnreadCount(updatedNotifs.filter(n => !n.read).length);
    });
    return unsub;
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    supabase.switchRole(role);
    alert(`Switched preview context to role: [${role}]. Dashboards and actions are updated dynamically.`);
  };

  // Hide header/footer on Landing/About/Contact pages to preserve marketing aesthetics if desired,
  // but let's show an beautiful sticky header universally for seamless navigation.
  const isLanding = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans" id="applet-viewport-root">
      
      {/* GLOBAL HIGH-CONTRAST FLOATING HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/80 px-4 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Brand block */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-blue-600 group-hover:bg-blue-700 text-white p-1.5 rounded-lg shadow-md shadow-blue-500/15 transition-all">
              <Layers className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm flex items-center gap-1 leading-none">
                <span>AnomaFix</span>
                <span className="text-[8px] bg-blue-50 text-blue-600 px-1 py-0.2 rounded-full font-bold uppercase tracking-wider font-mono">
                  Beta
                </span>
              </h1>
              <span className="text-[8px] text-slate-400 font-medium leading-none mt-0.5 hidden xs:inline">Spot. Report. Resolve.</span>
            </div>
          </Link>

          {/* Right actions: Compact unified group in a single row */}
          <div className="flex items-center gap-2">
            
            {/* Active role badge (only shown on md screens up, on mobile/tablet it will be shown inside the Menu dropdown!) */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-1.5 bg-blue-50 border border-blue-100/60 rounded-lg px-2 py-0.5 text-[10px] shadow-3xs">
                <span className="font-mono font-extrabold text-blue-500 uppercase tracking-wider text-[8px]">Session:</span>
                <span className="font-extrabold text-blue-800">
                  {currentUser.role}
                </span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 bg-slate-100 border border-slate-200/50 rounded-lg px-2 py-0.5 text-[10px] shadow-3xs">
                <span className="font-mono font-extrabold text-slate-400 uppercase tracking-wider text-[8px]">Session:</span>
                <span className="font-extrabold text-slate-500">Guest Mode</span>
              </div>
            )}

            {/* Login Portal Link */}
            <Link to="/login" className="px-2 py-1.5 md:px-3.5 md:py-1.5 rounded-lg text-[11px] md:text-xs font-bold text-blue-600 bg-blue-50/75 hover:bg-blue-100/75 border border-blue-200/40 transition-all shadow-3xs whitespace-nowrap">
              Login Portal
            </Link>

            {/* Notifications Alert Bell */}
            <Link to="/notifications" className="relative p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all" title="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-red-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center animate-pulse leading-none">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile link avatar */}
            {currentUser && (
              <Link to="/profile" className="flex items-center hover:opacity-80 transition-opacity shrink-0" title="My Profile">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'}
                  className="h-6.5 w-6.5 rounded-full object-cover border border-slate-200"
                  alt="Profile"
                />
              </Link>
            )}

            {/* Dropdown Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-3xs"
                title="Explore Menu"
              >
                {menuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
                <span className="text-[9px] font-extrabold uppercase tracking-wide pr-0.5 hidden sm:inline">Menu</span>
              </button>

              {menuOpen && (
                <>
                  {/* Click outside backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  
                  {/* Dropdown Menu Overlay */}
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50">
                    
                    {/* Compact session info inside the dropdown specifically for mobile/tablet users */}
                    <div className="px-3 py-1.5 border-b border-slate-50 mb-1 bg-slate-50/50">
                      <div className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Active Session</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        {currentUser ? `${currentUser.role} (${currentUser.name})` : 'Guest Mode'}
                      </div>
                    </div>

                    <div className="px-3 py-1 mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Navigation</span>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all gap-2"
                    >
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/report"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all gap-2"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      <span>Report Issue</span>
                    </Link>

                    <Link
                      to="/map"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all gap-2"
                    >
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>Live Map</span>
                    </Link>

                    <Link
                      to="/feed"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all gap-2"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                      <span>Community</span>
                    </Link>

                    <Link
                      to="/analytics"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all gap-2"
                    >
                      <Landmark className="h-3.5 w-3.5 text-slate-400" />
                      <span>Analytics</span>
                    </Link>

                    <Link
                      to="/leaderboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all gap-2"
                    >
                      <Award className="h-3.5 w-3.5 text-slate-400" />
                      <span>Leaderboard</span>
                    </Link>

                    {/* Government Officers & Admins only link */}
                    {(currentUser?.role === 'Admin' || currentUser?.role === 'Government Officer') && (
                      <div className="border-t border-slate-50 mt-1 pt-1">
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all gap-2"
                        >
                          <Shield className="h-3.5 w-3.5 text-rose-500" />
                          <span>Admin Controls</span>
                        </Link>
                      </div>
                    )}

                    {/* Sign Out inside menu */}
                    {currentUser && (
                      <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            supabase.logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center px-4 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 transition-all gap-2 text-left cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5 text-slate-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* MAIN VIEW CANVAS WITH TRANSITION ANIMATION */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DYNAMIC STICKY FLOATING GEMINI ASSISTANT */}
      <GeminiChat />

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100/80 py-8 px-6 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Layers className="h-4.5 w-4.5 text-slate-300" />
            <div>
              <span className="font-bold text-slate-900">AnomaFix Civic Platform</span>
              <p className="text-[10px] mt-0.5">Spot. Report. Resolve. • Hyperlocal infrastructure monitoring</p>
            </div>
          </div>

          <div className="flex gap-6 font-bold text-slate-500">
            <Link to="/about" className="hover:text-blue-600 transition-colors">Mission</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Support contact</Link>
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Studio Cloud Core Sandbox</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/feed" element={<CommunityFeed />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalLayout>
    </BrowserRouter>
  );
}
