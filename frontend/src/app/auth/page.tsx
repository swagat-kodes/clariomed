'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Activity, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submit from aborting in-flight fetch request
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      setError('Supabase environment variables are missing. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are saved in frontend/.env.local and restart npm run dev.');
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpErr) throw signUpErr;

        if (data.session) {
          sessionStorage.setItem('clariomed_just_authenticated', 'true');
          router.push('/');
          router.refresh();
        } else {
          setSuccessMessage('Account created! Please check your email to confirm your sign up.');
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInErr) throw signInErr;

        sessionStorage.setItem('clariomed_just_authenticated', 'true');
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('failed to fetch')) {
        setError('Unable to connect to Supabase project (Failed to fetch). Please verify your network connection and Supabase URL.');
      } else {
        setError(errMsg || 'An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdf9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-[#1c2b22]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2c6e49] flex items-center justify-center text-white shadow-lg shadow-[#2c6e49]/25">
            <Activity className="w-7 h-7" />
          </div>
          <span className="text-3xl font-extrabold text-[#1c2b22] tracking-tight">
            ClarioMed
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#1c2b22]">
          {mode === 'signin' ? 'Welcome back to ClarioMed' : 'Create your ClarioMed account'}
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Sign in or create an account to access the AI Medical Report Simplifier.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#4c956c]/20 rounded-2xl sm:px-10 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#fefee3]/80 rounded-xl border border-[#4c956c]/20">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#2c6e49] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#2c6e49]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#2c6e49] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#2c6e49]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#ffc9b9]/30 border border-[#ffc9b9] text-[#b54a32] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fefee3] border border-[#4c956c]/40 text-[#2c6e49] text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4c956c]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Swagat Kochrekar"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#fdfdf9] border border-slate-200 rounded-xl text-xs text-[#1c2b22] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4c956c]/30 focus:border-[#2c6e49] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fdfdf9] border border-slate-200 rounded-xl text-xs text-[#1c2b22] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4c956c]/30 focus:border-[#2c6e49] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fdfdf9] border border-slate-200 rounded-xl text-xs text-[#1c2b22] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4c956c]/30 focus:border-[#2c6e49] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2c6e49] hover:bg-[#23593a] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#2c6e49]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In to ClarioMed' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4c956c]" />
          <span>Protected by Supabase Auth with Row-Level Security</span>
        </div>
      </div>
    </div>
  );
}
