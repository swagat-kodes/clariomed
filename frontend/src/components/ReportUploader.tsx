'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import { ReportSimplifyResponse } from '@/types/report';
import { useApp } from '@/context/AppContext';

interface ReportUploaderProps {
  onReportProcessed: (report: ReportSimplifyResponse) => void;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({ onReportProcessed }) => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a medical report file (PDF or image).');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${baseUrl}/api/v1/reports/simplify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process report.' }));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const data: ReportSimplifyResponse = await response.json();
      onReportProcessed(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to the ClarioMed backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm transition-all hover:border-[#4c956c]/40">
      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-[#2c6e49] dark:text-[#4c956c]" />
        {t.uploadTitle}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        {t.uploadSubtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            file
              ? 'border-[#2c6e49] bg-[#fefee3]/50 dark:bg-[#2c6e49]/15'
              : 'border-slate-200 dark:border-slate-700 hover:border-[#4c956c] bg-slate-50/50 dark:bg-slate-800/40 hover:bg-[#fefee3]/30 dark:hover:bg-slate-800'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          {file ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#4c956c]/15 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace file
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fefee3] dark:bg-slate-800 border border-[#4c956c]/20 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {t.dragDropText} <span className="text-[#2c6e49] dark:text-[#4c956c] font-bold underline">{t.browseText}</span>
              </p>
              <p className="text-xs text-slate-400">{t.supportedFormats}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[#ffc9b9]/30 dark:bg-red-950/40 text-[#b54a32] dark:text-red-300 text-xs border border-[#ffc9b9] dark:border-red-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#2c6e49] hover:bg-[#23593a] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#2c6e49]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.simplifyingBtn}
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              {t.simplifyBtn}
            </>
          )}
        </button>
      </form>
    </div>
  );
};
