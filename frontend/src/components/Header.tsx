'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Activity, ShieldCheck, LogIn, LogOut, User as UserIcon, HeartPulse } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-[#2c6e49]/15 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#2c6e49] flex items-center justify-center text-white shadow-md shadow-[#2c6e49]/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1c2b22] tracking-tight flex items-center gap-2">
              ClarioMed
              <span className="text-xs bg-[#fefee3] text-[#2c6e49] font-semibold px-2 py-0.5 rounded-md border border-[#4c956c]/30 shadow-2xs">
                v0.1.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              AI Medical Report Simplifier & Lab Results Explainer
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1.5 text-xs text-[#2c6e49] bg-[#fefee3]/80 px-3 py-1.5 rounded-lg border border-[#4c956c]/20 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#4c956c]" />
            HIPAA Privacy First
          </span>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#fefee3]/60 px-3 py-1.5 rounded-xl border border-[#4c956c]/20 text-xs font-medium text-[#1c2b22]">
                <UserIcon className="w-3.5 h-3.5 text-[#2c6e49]" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">{user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#ffc9b9]/30 text-[#b54a32] hover:bg-[#ffc9b9]/60 border border-[#ffc9b9] transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2c6e49] hover:bg-[#23593a] text-white shadow-md shadow-[#2c6e49]/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
