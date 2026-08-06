'use client';

import React from 'react';
import { ReportSimplifyResponse } from '@/types/report';
import { LabResultBadge } from './LabResultBadge';
import { Sparkles, HelpCircle, FileText, CheckCircle, FlaskConical } from 'lucide-react';

interface ReportSummaryProps {
  report: ReportSimplifyResponse;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  const { summary, filename, processed_at } = report;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Simplified Analysis
            </h2>
            <p className="text-xs text-slate-500">Document: {filename}</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(processed_at).toLocaleString()}
          </span>
        </div>

        {/* AI Plain Language Summary */}
        <div className="prose prose-teal max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-teal-50/50 p-5 rounded-xl border border-teal-100 mb-6">
          {summary.simplification}
        </div>

        {/* Key Findings */}
        {summary.key_findings && summary.key_findings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Key Observations
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {summary.key_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border border-slate-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lab Results Breakdown Table */}
        {summary.lab_results && summary.lab_results.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              Laboratory Test Results Breakdown
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Observed Value</th>
                    <th className="py-3 px-4">Reference Range</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Plain Language Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                  {summary.lab_results.map((lab, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{lab.test_name}</td>
                      <td className="py-3 px-4 font-mono font-medium">{lab.value}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{lab.reference_range || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <LabResultBadge status={lab.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">{lab.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actionable Doctor Visit Questions */}
        {summary.actionable_questions && summary.actionable_questions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Recommended Questions for Your Doctor Visit
            </h3>
            <div className="space-y-2">
              {summary.actionable_questions.map((question, qIdx) => (
                <div key={qIdx} className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/60 text-sky-900 text-xs border border-sky-100">
                  <span className="w-6 h-6 rounded-full bg-sky-200/80 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {qIdx + 1}
                  </span>
                  <span>{question}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
