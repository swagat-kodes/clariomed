'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ReportSimplifyResponse } from '@/types/report';
import { ReportSummary } from '@/components/ReportSummary';
import { LabResultBadge } from '@/components/LabResultBadge';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  PlusCircle,
  Calendar,
  FlaskConical,
  AlertTriangle,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
  const { t, savedReports, removeReport, setActiveTab, setActiveReport } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'attention' | 'normal'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportSimplifyResponse | null>(null);

  // Helper check if report contains high or low lab results
  const requiresAttention = (report: ReportSimplifyResponse): boolean => {
    if (!report.summary?.lab_results) return false;
    return report.summary.lab_results.some(
      (lab) => lab.status === 'High' || lab.status === 'Low'
    );
  };

  const filteredReports = savedReports.filter((rep) => {
    const matchesSearch =
      rep.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.summary?.simplification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.summary?.lab_results?.some((l) =>
        l.test_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (filterCategory === 'attention') return requiresAttention(rep);
    if (filterCategory === 'normal') return !requiresAttention(rep);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2c6e49]/10 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {t.reportsTitle}
              <span className="text-xs bg-[#fefee3] dark:bg-[#2c6e49]/30 text-[#2c6e49] dark:text-[#4c956c] font-bold px-2.5 py-0.5 rounded-full border border-[#4c956c]/20">
                {savedReports.length} {t.reportsTitle}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.reportsSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="px-4 py-2.5 rounded-xl bg-[#2c6e49] hover:bg-[#23593a] text-white text-xs font-bold shadow-md shadow-[#2c6e49]/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4c956c]/30 focus:border-[#2c6e49] transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setFilterCategory('attention')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              filterCategory === 'attention'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.filterAttention}</span>
          </button>
          <button
            onClick={() => setFilterCategory('normal')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              filterCategory === 'normal'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t.filterNormal}</span>
          </button>
        </div>
      </div>

      {/* Reports Gallery / List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-[#4c956c]/20 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#fefee3] dark:bg-slate-800 text-[#2c6e49] dark:text-[#4c956c] mx-auto flex items-center justify-center border border-[#4c956c]/30">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.noReportsFound}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              {t.uploadFirstReport}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 rounded-xl bg-[#2c6e49] hover:bg-[#23593a] text-white text-xs font-bold shadow-md shadow-[#2c6e49]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Go to Upload Dashboard</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const hasAlert = requiresAttention(report);
            const labCount = report.summary?.lab_results?.length || 0;

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm hover:border-[#4c956c] transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2c6e49]/10 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[200px]">
                          {report.filename}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(report.processed_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {hasAlert ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                        <AlertTriangle className="w-3 h-3" />
                        Attention
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                        <CheckCircle className="w-3 h-3" />
                        Normal
                      </span>
                    )}
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-[#fdfdf9] dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {report.summary?.simplification || 'Simplified medical analysis.'}
                  </p>

                  {/* Lab Results Badges Sample */}
                  {report.summary?.lab_results && report.summary.lab_results.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">
                        {labCount} {t.labItemsCount}:
                      </span>
                      {report.summary.lab_results.slice(0, 3).map((lab, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono"
                        >
                          {lab.test_name}: <strong className="text-[#2c6e49] dark:text-[#4c956c]">{lab.value}</strong>
                        </span>
                      ))}
                      {labCount > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{labCount - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setActiveReport(report);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#2c6e49]/10 hover:bg-[#2c6e49] text-[#2c6e49] hover:text-white dark:text-[#4c956c] dark:hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.viewDetails}</span>
                  </button>

                  <button
                    onClick={() => removeReport(report.id)}
                    title={t.deleteReport}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-[#4c956c]/30 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2c6e49] text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {selectedReport.filename}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {selectedReport.id} • Processed: {new Date(selectedReport.processed_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ReportSummary report={selectedReport} />
          </div>
        </div>
      )}
    </div>
  );
};
