'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ReportUploader } from '@/components/ReportUploader';
import { ReportSummary } from '@/components/ReportSummary';
import { ReportSimplifyResponse } from '@/types/report';
import { HeartHandshake, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [activeReport, setActiveReport] = useState<ReportSimplifyResponse | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Hero Section */}
        <section className="text-center max-w-3xl mx-auto pt-4 pb-2 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100/80 text-teal-800 border border-teal-200">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            Instant Patient-Friendly AI Explanations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Understand your medical reports with complete clarity.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Upload lab reports, blood work, or physician summaries. ClarioMed transforms complex medical jargon into clear, reassuring insights.
          </p>
        </section>

        {/* Upload Section */}
        <section className="max-w-3xl mx-auto">
          <ReportUploader onReportProcessed={(report) => setActiveReport(report)} />
        </section>

        {/* Results Section */}
        {activeReport && (
          <section className="max-w-4xl mx-auto">
            <ReportSummary report={activeReport} />
          </section>
        )}

        {/* Trust Badges */}
        <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Secure & Confidential</h4>
              <p className="text-[11px] text-slate-500">Your documents are processed securely.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">PyMuPDF + Gemini 2.5</h4>
              <p className="text-[11px] text-slate-500">Page-by-page visual document parsing.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Doctor-Friendly</h4>
              <p className="text-[11px] text-slate-500">Generates questions for your next visit.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ClarioMed. Medical Report Simplifier. All rights reserved.</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Disclaimer: ClarioMed provides simplified educational summaries and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}
