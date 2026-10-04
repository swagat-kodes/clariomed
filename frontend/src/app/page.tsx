'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppProvider, useApp } from '@/context/AppContext';
import AuthPage from '@/app/auth/page';
import { Sidebar } from '@/components/Sidebar';
import { HomeDashboard } from '@/components/HomeDashboard';
import { AiAssistantDashboard } from '@/components/AiAssistantDashboard';
import { SettingsDashboard } from '@/components/SettingsDashboard';
import { ReportsDashboard } from '@/components/ReportsDashboard';
import { LanguageModal } from '@/components/LanguageModal';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
  const { user, isLoading } = useAuth();
  const { activeTab, showLangModal, setShowLangModal, t } = useApp();

  // Check if user just signed in/signed up to pop up language selection modal
  useEffect(() => {
    if (user) {
      const justAuth = sessionStorage.getItem('clariomed_just_authenticated');
      if (justAuth === 'true') {
        sessionStorage.removeItem('clariomed_just_authenticated');
        setShowLangModal(true);
      }
    }
  }, [user, setShowLangModal]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfdf9] dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-[#4c956c]/20 dark:border-slate-800 shadow-sm text-center">
          <Loader2 className="w-8 h-8 text-[#2c6e49] dark:text-[#4c956c] animate-spin" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Verifying Authentication...</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Please wait while ClarioMed secures your session.</p>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fdfdf9] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Left Main Menu Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'ai-assistant' && <AiAssistantDashboard />}
          {activeTab === 'settings' && <SettingsDashboard />}
          {activeTab === 'reports' && <ReportsDashboard />}
        </main>

        <footer className="border-t border-[#4c956c]/15 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>© {new Date().getFullYear()} ClarioMed. {t.appSubtitle}. {t.copyright}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t.disclaimer}
            </p>
          </div>
        </footer>
      </div>

      {/* Multilingual Pop-up Language Selection Modal */}
      {showLangModal && <LanguageModal />}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
