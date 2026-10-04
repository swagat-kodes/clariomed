'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/i18n';
import { Globe, Check, Sparkles, X } from 'lucide-react';

interface LanguageModalProps {
  onClose?: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ onClose }) => {
  const { language, setLanguage, t, setShowLangModal } = useApp();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleConfirm = () => {
    setShowLangModal(false);
    if (onClose) onClose();
  };

  const languageOptions: { id: Language; label: string; nativeName: string; flag: string; desc: string }[] = [
    {
      id: 'en',
      label: 'English',
      nativeName: 'English (Default)',
      flag: '🇬🇧',
      desc: 'Default full app experience in English.',
    },
    {
      id: 'hi',
      label: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      desc: 'पूरा ऐप, मेडिकल रिपोर्ट्स और AI उत्तर हिंदी में देखें।',
    },
    {
      id: 'mr',
      label: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      desc: 'संपूर्ण ॲप, अहवाल आणि AI उत्तरे मराठीत मिळवा.',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-[#4c956c]/30 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#2c6e49]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-[#d68c45]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2c6e49]/10 dark:bg-[#2c6e49]/20 text-[#2c6e49] dark:text-[#4c956c] flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {t.langModalTitle}
                <Sparkles className="w-4 h-4 text-[#d68c45]" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.langModalSubtitle}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={() => {
                setShowLangModal(false);
                onClose();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Language Options Cards */}
        <div className="space-y-3">
          {languageOptions.map((opt) => {
            const isSelected = language === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-[#2c6e49] bg-[#fefee3]/60 dark:bg-[#2c6e49]/20 shadow-md shadow-[#2c6e49]/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-[#4c956c]/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{opt.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {opt.nativeName}
                      </span>
                      {opt.id === 'en' && (
                        <span className="text-[10px] font-semibold bg-[#2c6e49]/15 text-[#2c6e49] dark:text-[#4c956c] px-2 py-0.5 rounded-md">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-[#2c6e49] text-white border-[#2c6e49]'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#2c6e49] hover:bg-[#23593a] text-white font-bold text-xs shadow-lg shadow-[#2c6e49]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {t.langModalConfirm}
        </button>
      </div>
    </div>
  );
};
