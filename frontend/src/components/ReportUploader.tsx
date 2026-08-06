'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import { ReportSimplifyResponse } from '@/types/report';

interface ReportUploaderProps {
  onReportProcessed: (report: ReportSimplifyResponse) => void;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({ onReportProcessed }) => {
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
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-teal-600" />
        Upload Medical Report
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Upload your lab report or clinical document (PDF, PNG, JPEG, WebP) for instant AI breakdown.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            file
              ? 'border-teal-500 bg-teal-50/30'
              : 'border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-slate-50'
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
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace file
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Drag & drop your medical document here, or <span className="text-teal-600 font-semibold underline">browse</span>
              </p>
              <p className="text-xs text-slate-400">Supports PDF, PNG, JPG, WEBP (Up to 25MB)</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing & Simplifying Report...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Simplify Report Now
            </>
          )}
        </button>
      </form>
    </div>
  );
};
