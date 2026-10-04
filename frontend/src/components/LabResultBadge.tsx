'use client';

import React from 'react';
import { LabStatus } from '@/types/report';
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

interface LabResultBadgeProps {
  status: LabStatus | string;
}

export const LabResultBadge: React.FC<LabResultBadgeProps> = ({ status }) => {
  const normalized = (status || '').trim().toLowerCase();

  if (normalized === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ffc9b9]/40 text-[#b54a32] border border-[#ffc9b9] shadow-2xs">
        <ArrowUpCircle className="w-3.5 h-3.5 text-[#b54a32]" />
        High
      </span>
    );
  }

  if (normalized === 'low') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d68c45]/15 text-[#9e5716] border border-[#d68c45]/30 shadow-2xs">
        <ArrowDownCircle className="w-3.5 h-3.5 text-[#d68c45]" />
        Low
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4c956c]/15 text-[#2c6e49] border border-[#4c956c]/30 shadow-2xs">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#4c956c]" />
      Normal
    </span>
  );
};
