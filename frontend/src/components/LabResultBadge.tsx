'use client';

import React from 'react';
import { LabStatus } from '@/types/report';
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

interface LabResultBadgeProps {
  status: LabStatus | string;
}

export const LabResultBadge: React.FC<LabResultBadgeProps> = ({ status }) => {
  const normalized = (status || '').trim().toLowerCase();

  if (normalized === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
        <ArrowUpCircle className="w-3.5 h-3.5 text-rose-600" />
        High
      </span>
    );
  }

  if (normalized === 'low') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
        <ArrowDownCircle className="w-3.5 h-3.5 text-sky-600" />
        Low
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      Normal
    </span>
  );
};
