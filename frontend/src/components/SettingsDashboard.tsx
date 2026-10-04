'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Language } from '@/lib/i18n';
import {
  Globe,
  User,
  ShieldCheck,
  Check,
  Sliders,
  LogOut,
} from 'lucide-react';

export const SettingsDashboard: React.FC = () => {
  const { t, language, setLanguage, setShowLangModal } = useApp();
  const { user, signOut } = useAuth();

  const languageList: { id: Language; name: string; native: string; flag: string }[] = [
    { id: 'en', name: 'English', native: 'English (Default)', flag: '🇬🇧' },
    { id: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { id: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#4c956c]/20 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2c6e49]/10 text-[#2c6e49] flex items-center justify-center shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1c2b22]">
              {t.settingsTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.settingsSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLangModal(true)}
          className="px-3.5 py-2 rounded-xl bg-[#2c6e49] text-white text-xs font-bold shadow-md shadow-[#2c6e49]/20 flex items-center gap-1.5 cursor-pointer hover:bg-[#23593a] transition-all"
        >
          <Globe className="w-4 h-4" />
          <span>Language Selector</span>
        </button>
      </div>

      {/* Preferred Language Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#4c956c]/20 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2c6e49]/10 text-[#2c6e49] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1c2b22]">{t.languageTitle}</h3>
            <p className="text-xs text-slate-500">{t.languageDesc}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {languageList.map((item) => {
            const active = language === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setLanguage(item.id)}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  active
                    ? 'border-[#2c6e49] bg-[#fefee3]/80 text-[#1c2b22] font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.flag}</span>
                  <span className="text-xs font-semibold">{item.native}</span>
                </div>
                {active && <Check className="w-4 h-4 text-[#2c6e49] stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile & Account Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#4c956c]/20 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d68c45]/15 text-[#d68c45] flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1c2b22]">{t.profileTitle}</h3>
              <p className="text-xs text-slate-500">{t.profileDesc}</p>
            </div>
          </div>

          {user && (
            <button
              onClick={() => signOut()}
              className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.signOut}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {t.emailLabel}
            </p>
            <p className="text-xs font-bold text-[#1c2b22] font-mono truncate">
              {user?.email || 'swagat@clariomed.app'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {t.accountStatusLabel}
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-emerald-600">
                {t.activeStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Security & Privacy Banner */}
        <div className="p-4 rounded-2xl bg-[#fefee3]/80 border border-[#4c956c]/30 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#2c6e49] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[#1c2b22]">{t.privacyTitle}</h4>
            <p className="text-[11px] text-slate-600">{t.privacyDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
