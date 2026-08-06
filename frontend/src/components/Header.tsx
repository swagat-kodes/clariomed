'use client';

import React from 'react';
import { Activity, ShieldCheck, Stethoscope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              ClarioMed
              <span className="text-xs bg-teal-50 text-teal-700 font-medium px-2 py-0.5 rounded-md border border-teal-200">
                v0.1.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              AI Medical Report Simplifier & Lab Results Explainer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            HIPAA Privacy First
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
            <Stethoscope className="w-4 h-4" />
            Powered by Gemini 2.5 Flash
          </span>
        </div>
      </div>
    </header>
  );
};
