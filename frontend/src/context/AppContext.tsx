'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '@/lib/i18n';
import { ReportSimplifyResponse } from '@/types/report';

export type AppTab = 'home' | 'ai-assistant' | 'settings' | 'reports';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  showLangModal: boolean;
  setShowLangModal: (show: boolean) => void;
  savedReports: ReportSimplifyResponse[];
  addReport: (report: ReportSimplifyResponse) => void;
  removeReport: (id: string) => void;
  activeReport: ReportSimplifyResponse | null;
  setActiveReport: (report: ReportSimplifyResponse | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_LANG = 'clariomed_lang';
const STORAGE_KEY_REPORTS = 'clariomed_reports';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showLangModal, setShowLangModal] = useState<boolean>(false);
  const [savedReports, setSavedReports] = useState<ReportSimplifyResponse[]>([]);
  const [activeReport, setActiveReport] = useState<ReportSimplifyResponse | null>(null);

  // Initial load from localStorage
  useEffect(() => {
    try {
      // Enforce clean light theme
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('clariomed_theme');

      const storedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (storedLang && ['en', 'hi', 'mr'].includes(storedLang)) {
        setLanguageState(storedLang);
      }

      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (storedReports) {
        setSavedReports(JSON.parse(storedReports));
      }
    } catch (e) {
      console.error('Error loading preferences from localStorage:', e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.error('Error saving language preference:', e);
    }
  };

  const addReport = (report: ReportSimplifyResponse) => {
    setSavedReports((prev) => {
      const filtered = prev.filter((r) => r.id !== report.id);
      const updated = [report, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving report to localStorage:', e);
      }
      return updated;
    });
    setActiveReport(report);
  };

  const removeReport = (id: string) => {
    setSavedReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating reports in localStorage:', e);
      }
      return updated;
    });
    if (activeReport?.id === id) {
      setActiveReport(null);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        showLangModal,
        setShowLangModal,
        savedReports,
        addReport,
        removeReport,
        activeReport,
        setActiveReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
