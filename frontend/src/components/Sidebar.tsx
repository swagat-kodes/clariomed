'use client';

import React, { useState } from 'react';
import { useApp, AppTab } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Bot,
  Settings,
  FileText,
  Activity,
  Globe,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, t, language, setShowLangModal } = useApp();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: t.menuHome,
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'ai-assistant',
      label: t.menuAiAssistant,
      icon: <Bot className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t.menuSettings,
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: 'reports',
      label: t.menuReports,
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const handleTabClick = (tab: AppTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const getLanguageLabel = () => {
    if (language === 'hi') return 'हिंदी';
    if (language === 'mr') return 'मराठी';
    return 'English';
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#4c956c]/20 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2c6e49] text-white flex items-center justify-center shadow-md shadow-[#2c6e49]/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base text-[#1c2b22] tracking-tight">
              ClarioMed
            </span>
            <span className="ml-1.5 text-[10px] bg-[#fefee3] text-[#2c6e49] px-1.5 py-0.5 rounded font-semibold border border-[#4c956c]/20">
              v0.1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLangModal(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#2c6e49]" />
            <span>{getLanguageLabel()}</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Menu */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs"
        />
      )}

      {/* Left Sidebar Body */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#4c956c]/20 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2c6e49] text-white flex items-center justify-center shadow-lg shadow-[#2c6e49]/25">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-[#1c2b22] tracking-tight flex items-center gap-1.5">
                  ClarioMed
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  AI Medical Hub
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Main Menu
            </p>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2c6e49] text-white shadow-lg shadow-[#2c6e49]/20'
                      : 'text-slate-600 hover:bg-[#fefee3]/70 hover:text-[#2c6e49]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* App Controls Box */}
          <div className="bg-[#fefee3]/60 p-3.5 rounded-2xl border border-[#4c956c]/20 space-y-2.5">
            <p className="text-[10px] font-bold text-[#2c6e49] uppercase tracking-wider">
              Preferences
            </p>

            {/* Language Switcher Button */}
            <button
              onClick={() => setShowLangModal(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-[#4c956c] transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#2c6e49]" />
                <span className="font-semibold">{getLanguageLabel()}</span>
              </div>
              <span className="text-[10px] bg-[#2c6e49]/10 text-[#2c6e49] px-2 py-0.5 rounded font-bold">
                Change
              </span>
            </button>
          </div>
        </div>

        {/* Footer / User Profile Section */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-[#2c6e49] font-medium px-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>HIPAA Compliant Session</span>
          </div>

          {user && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#2c6e49]/15 text-[#2c6e49] flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#1c2b22] truncate">
                    {user.user_metadata?.full_name || 'Swagat Kochrekar'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                title={t.signOut}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
