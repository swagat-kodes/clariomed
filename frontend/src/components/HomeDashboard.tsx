'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ReportUploader } from '@/components/ReportUploader';
import { ReportSummary } from '@/components/ReportSummary';
import { Sparkles, ShieldCheck, Zap, HeartHandshake, Bot, FileText, ArrowRight } from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { t, activeReport, setActiveReport, addReport, setActiveTab } = useApp();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Hero Section with Login Page Warm Color Theme */}
      <section className="text-center max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#fefee3] dark:bg-[#2c6e49]/30 text-[#2c6e49] dark:text-[#4c956c] border border-[#4c956c]/30 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#4c956c]" />
          <span>{t.heroBadge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1c2b22] dark:text-white leading-tight">
          {t.heroTitle}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          {t.heroSubtitle}
        </p>
      </section>

      {/* Upload Section */}
      <section className="max-w-3xl mx-auto">
        <ReportUploader
          onReportProcessed={(report) => {
            addReport(report);
            setActiveReport(report);
          }}
        />
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveTab('ai-assistant')}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm hover:border-[#2c6e49] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#2c6e49]/10 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c2b22] dark:text-white group-hover:text-[#2c6e49] transition-colors">
                {t.menuAiAssistant}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ask questions about your lab values
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#2c6e49] transition-all" />
        </div>

        <div
          onClick={() => setActiveTab('reports')}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm hover:border-[#d68c45] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#d68c45]/15 text-[#d68c45] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c2b22] dark:text-white group-hover:text-[#d68c45] transition-colors">
                {t.menuReports}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                View stored history & analysis
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#d68c45] transition-all" />
        </div>
      </section>

      {/* Results Summary Section */}
      {activeReport && (
        <section className="max-w-4xl mx-auto">
          <ReportSummary report={activeReport} />
        </section>
      )}

      {/* Trust Badges matching Login Page */}
      <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#4c956c]/20 dark:border-slate-800 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#2c6e49]/10 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c2b22] dark:text-white">{t.secureTitle}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.secureDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#4c956c]/20 dark:border-slate-800 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#d68c45]/15 text-[#d68c45] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c2b22] dark:text-white">{t.aiEngineTitle}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.aiEngineDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#4c956c]/20 dark:border-slate-800 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#ffc9b9]/30 text-[#b54a32] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c2b22] dark:text-white">{t.doctorFriendlyTitle}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.doctorFriendlyDesc}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
