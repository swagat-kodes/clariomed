'use client';

import React from 'react';
import { ReportSimplifyResponse } from '@/types/report';
import { LabResultBadge } from './LabResultBadge';
import { useApp } from '@/context/AppContext';
import { Sparkles, HelpCircle, CheckCircle, FlaskConical, Download } from 'lucide-react';

interface ReportSummaryProps {
  report: ReportSimplifyResponse;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  const { t } = useApp();
  const { summary, filename, processed_at } = report;

  const handleDownload = () => {
    const textContent = `CLARIOMED MEDICAL REPORT SUMMARY
Document: ${filename}
Processed Date: ${new Date(processed_at).toLocaleString()}

--- PATIENT-FRIENDLY SUMMARY ---
${summary.simplification}

--- KEY OBSERVATIONS ---
${summary.key_findings ? summary.key_findings.map((f, i) => `${i + 1}. ${f}`).join('\n') : 'N/A'}

--- LABORATORY TEST RESULTS ---
${
  summary.lab_results
    ? summary.lab_results
        .map(
          (l) =>
            `- ${l.test_name}: ${l.value} (Range: ${l.reference_range || 'N/A'}) [${l.status}] => ${l.explanation}`
        )
        .join('\n')
    : 'N/A'
}

--- QUESTIONS FOR DOCTOR VISIT ---
${summary.actionable_questions ? summary.actionable_questions.map((q, i) => `${i + 1}. ${q}`).join('\n') : 'N/A'}
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, '')}_simplified_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2c6e49] dark:text-[#4c956c]" />
              {t.summaryTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.documentLabel}: {filename}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-[#fefee3] dark:bg-slate-800 px-3 py-1 rounded-lg border border-[#4c956c]/20 dark:border-slate-700">
              {new Date(processed_at).toLocaleString()}
            </span>
            <button
              onClick={handleDownload}
              className="px-3 py-1 rounded-lg bg-[#2c6e49]/10 hover:bg-[#2c6e49] text-[#2c6e49] hover:text-white dark:text-[#4c956c] dark:hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadSummary}</span>
            </button>
          </div>
        </div>

        {/* AI Plain Language Summary */}
        <div className="prose max-w-none text-slate-900 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-line bg-[#fefee3]/70 dark:bg-slate-800/80 p-5 rounded-2xl border border-[#4c956c]/25 dark:border-slate-700 mb-6 shadow-2xs">
          <p className="font-bold text-[#2c6e49] dark:text-[#4c956c] text-xs uppercase tracking-wider mb-2">
            {t.patientFriendlySummary}
          </p>
          {summary.simplification}
        </div>

        {/* Key Findings */}
        {summary.key_findings && summary.key_findings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2c6e49] dark:text-[#4c956c] mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4c956c]" />
              {t.keyObservations}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {summary.key_findings.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-xs text-slate-800 dark:text-slate-200 border border-[#4c956c]/15 dark:border-slate-700/60"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2c6e49] dark:bg-[#4c956c] mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lab Results Breakdown Table */}
        {summary.lab_results && summary.lab_results.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2c6e49] dark:text-[#4c956c] mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#4c956c]" />
              {t.labResultsBreakdown}
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-[#4c956c]/20 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fefee3]/80 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-[#4c956c]/20 dark:border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">{t.testNameCol}</th>
                    <th className="py-3.5 px-4">{t.observedValueCol}</th>
                    <th className="py-3.5 px-4">{t.referenceRangeCol}</th>
                    <th className="py-3.5 px-4">{t.statusCol}</th>
                    <th className="py-3.5 px-4">{t.explanationCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-900">
                  {summary.lab_results.map((lab, index) => (
                    <tr key={index} className="hover:bg-[#fefee3]/30 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{lab.test_name}</td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#2c6e49] dark:text-[#4c956c]">{lab.value}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono">{lab.reference_range || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <LabResultBadge status={lab.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">{lab.explanation}</td>
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
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#d68c45] mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#d68c45]" />
              {t.doctorQuestionsTitle}
            </h3>
            <div className="space-y-2.5">
              {summary.actionable_questions.map((question, qIdx) => (
                <div
                  key={qIdx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#ffc9b9]/25 dark:bg-amber-950/30 text-slate-900 dark:text-slate-100 text-xs border border-[#ffc9b9]/60 dark:border-amber-800/50"
                >
                  <span className="w-6 h-6 rounded-full bg-[#d68c45] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {qIdx + 1}
                  </span>
                  <span className="font-medium">{question}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
