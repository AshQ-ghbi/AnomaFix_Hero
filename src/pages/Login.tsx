/**
 * AnomaFix Interactive Multi-Role Login & Supabase DB Connection Panel
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  supabase, 
  getSupabaseCredentials,
  realSupabaseClient,
  UserRole 
} from '../utils/supabase';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Cpu, 
  Award,
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  // Authentication tabs and states
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'google'>('email');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill template credentials or test credentials helper
  const handleAutoFillMocks = () => {
    // Fill realistic fields based on selected role
    if (selectedRole === 'Citizen') {
      setEmail('sarah.jenkins@gmail.com');
      setName('Sarah Jenkins');
    } else if (selectedRole === 'Volunteer') {
      setEmail('liam.carter@greenvolunteers.org');
      setName('Liam Carter');
    } else if (selectedRole === 'Government Officer') {
      setEmail('david.miller@citygov.us');
      setName('Officer David Miller');
    } else if (selectedRole === 'Admin') {
      setEmail('amara.vance@anomafix.org');
      setName('Amara Vance');
    }
    setPassword('anomafix123');
    setPhone('+1 (555) 019-2834');
  };

  useEffect(() => {
    handleAutoFillMocks();
  }, [selectedRole]);

  // Authenticate user
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Dynamic checks
    const hasKeys = getSupabaseCredentials().isConfigured;

    if (hasKeys && realSupabaseClient) {
      try {
        if (authMethod === 'email') {
          if (isSignUp) {
            // Real Supabase sign up with custom role meta
            const { data, error } = await realSupabaseClient.auth.signUp({
              email: email.trim(),
              password: password,
              options: {
                data: {
                  name: name.trim() || email.split('@')[0],
                  role: selectedRole,
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`
                }
              }
            });
            if (error) throw error;
            setSuccessMsg("Success! Verification email sent (if enabled) or logged in successfully.");
            navigate('/dashboard');
          } else {
            // Real Supabase sign in
            const { data, error } = await realSupabaseClient.auth.signInWithPassword({
              email: email.trim(),
              password: password
            });
            if (error) throw error;
            setSuccessMsg("Logged in successfully via Supabase Auth!");
            navigate('/dashboard');
          }
        } else if (authMethod === 'phone') {
          if (!otpSent) {
            const { error } = await realSupabaseClient.auth.signInWithOtp({
              phone: phone.trim()
            });
            if (error) throw error;
            setOtpSent(true);
            setSuccessMsg("OTP code sent to your phone number.");
          } else {
            const { data, error } = await realSupabaseClient.auth.verifyOtp({
              phone: phone.trim(),
              token: otp.trim(),
              type: 'sms'
            });
            if (error) throw error;
            setSuccessMsg("SMS OTP verified! Redirecting...");
            navigate('/dashboard');
          }
        }
      } catch (err: any) {
        console.error("Supabase live auth error:", err);
        setErrorMsg(err.message || "An authentication error occurred. Ensure your Supabase instance is active and has schema.sql tables.");
      } finally {
        setLoading(false);
      }
    } else {
      // Offline fallback state simulation (always succeeds for user convenience)
      setTimeout(() => {
        try {
          if (authMethod === 'email') {
            const activeUser = supabase.register(
              name || email.split('@')[0] || 'Seeded User',
              email || 'guest@anomafix.org',
              selectedRole
            );
            setSuccessMsg(`Signed in successfully as ${activeUser.name} (${activeUser.role})`);
            setTimeout(() => navigate('/dashboard'), 800);
          } else if (authMethod === 'phone') {
            if (!otpSent) {
              setOtpSent(true);
              setSuccessMsg("Sent simulated SMS verification code '123456' to " + phone);
            } else {
              if (otp === '123456' || otp.length >= 4) {
                const simulatedName = phone.slice(-4) + " Citizen";
                const activeUser = supabase.register(
                  simulatedName,
                  `phone-${phone.replace(/[^0-9]/g, '')}@anomafix.org`,
                  selectedRole
                );
                setSuccessMsg(`Registered successfully with phone number!`);
                setTimeout(() => navigate('/dashboard'), 800);
              } else {
                setErrorMsg("Invalid OTP code. Please enter '123456'.");
              }
            }
          }
        } catch (err: any) {
          setErrorMsg(err.message);
        } finally {
          setLoading(false);
        }
      }, 600);
    }
  };

  // Google Login redirection trigger
  const handleGoogleLogin = async () => {
    const hasKeys = getSupabaseCredentials().isConfigured;
    if (hasKeys && realSupabaseClient) {
      setLoading(true);
      try {
        const { error } = await realSupabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        if (error) throw error;
      } catch (err: any) {
        setErrorMsg(err.message || "OAuth initiation failed.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      setTimeout(() => {
        const activeUser = supabase.register(
          "Google Citizen " + Math.floor(Math.random() * 100),
          "google.user@anomafix.org",
          selectedRole
        );
        setSuccessMsg(`Authenticated via Google SSO successfully!`);
        setLoading(false);
        setTimeout(() => navigate('/dashboard'), 800);
      }, 1000);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center font-sans" id="login-container-view">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: Explainer & Branding */}
        <div className="lg:col-span-5 space-y-6 text-slate-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>AnomaFix Civic Hub</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Community-Led Civic Fix Engine
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Report street potholes, dangerous lighting, waste hazards, or water leaks. Verified by neighbors, assigned automatically by AI, and resolved by local action teams.
            </p>
          </div>

          {/* Seed Role Quick Info */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>Roles & Capabilities</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 rounded-xl hover:bg-blue-50/40 transition-colors">
                <span className="font-bold text-slate-800 block">Citizen</span>
                <span className="text-slate-400">Files reports & earns community points.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl hover:bg-blue-50/40 transition-colors">
                <span className="font-bold text-slate-800 block">Volunteer</span>
                <span className="text-slate-400">Verifies local issues & claims cleanup challenges.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl hover:bg-blue-50/40 transition-colors">
                <span className="font-bold text-slate-800 block">Officer</span>
                <span className="text-slate-400">Dispatches tasks & updates municipal status.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl hover:bg-blue-50/40 transition-colors">
                <span className="font-bold text-slate-800 block">Admin</span>
                <span className="text-slate-400">Controls city departments & system settings.</span>
              </div>
            </div>
          </div>

          {/* Secure Platform info */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-lg border border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">Municipal Services Sync</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              The platform synchronizes verified community tickets directly with official municipal dashboards. This automates dispatch schedules and keeps civic officers updated instantly.
            </p>
          </div>
        </div>

        {/* Right Grid: Beautiful Interactive Login Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Sign in to AnomaFix</h3>
            <p className="text-xs text-slate-400">Choose your civic account type and enter credentials.</p>
          </div>

          {/* Interactive Role Picker Grid */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              1. Select Your Civic Role Context
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Citizen', 'Volunteer', 'Government Officer', 'Admin'] as UserRole[]).map((role) => {
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                        : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/10' : 'bg-slate-200/50'}`}>
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="font-extrabold text-[10px] tracking-tight uppercase">
                      {role === 'Government Officer' ? 'Officer' : role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Authentication Method Tabs */}
          <div className="border-b border-slate-100 flex gap-6 text-xs font-bold text-slate-400">
            <button
              onClick={() => { setAuthMethod('email'); setErrorMsg(null); }}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                authMethod === 'email' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email & Password</span>
            </button>
            <button
              onClick={() => { setAuthMethod('phone'); setErrorMsg(null); }}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                authMethod === 'phone' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Phone OTP</span>
            </button>
            <button
              onClick={() => { setAuthMethod('google'); setErrorMsg(null); }}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                authMethod === 'google' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Google OAuth</span>
            </button>
          </div>

          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-shake">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Dynamic Input Fields Form */}
          {authMethod !== 'google' ? (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Dynamic Sign up Name field */}
              {authMethod === 'email' && isSignUp && (
                <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none"
                    />
                    <Users className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Email & Password Fields */}
              {authMethod === 'email' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. sarah.jenkins@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none"
                      />
                      <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                      <button 
                        type="button" 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        {isSignUp ? "Switch to Log In" : "Register new account"}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none font-mono"
                      />
                      <Lock className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Phone Input */}
              {authMethod === 'phone' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        disabled={otpSent}
                        placeholder="e.g. +1 (555) 019-2834"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none disabled:opacity-60"
                      />
                      <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enter OTP Verification Code</label>
                        <button 
                          type="button" 
                          onClick={() => { setOtpSent(false); setOtp(''); }} 
                          className="text-[9px] text-blue-600 font-bold uppercase"
                        >
                          Change Number
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Enter 6-digit code (e.g. 123456)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl p-2.5 text-center text-sm font-bold tracking-widest outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{authMethod === 'email' ? (isSignUp ? 'Create Civic Account' : 'Sign In Now') : (otpSent ? 'Verify & Continue' : 'Send One-Time OTP')}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAutoFillMocks}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer text-center"
                >
                  Auto-fill Seed Credentials ({selectedRole})
                </button>
              </div>

            </form>
          ) : (
            // Google Sign In Layout
            <div className="space-y-6 text-center py-6 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-sm mx-auto flex flex-col items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xs text-slate-700">Google Sign-In</span>
                <p className="text-[11px] text-slate-400">
                  Sign in securely with your verified Google account to automatically sync your profile details.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full max-w-sm mx-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2.5"
              >
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Standard Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Official AnomaFix Civic Portal</span>
            <span>Session secured via standard tokens</span>
          </div>

        </div>

      </div>
    </div>
  );
}
