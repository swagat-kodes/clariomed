'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isMedicalRefusal?: boolean;
}

export const AiAssistantDashboard: React.FC = () => {
  const { t, language, activeReport } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useReportContext, setUseReportContext] = useState<boolean>(!!activeReport);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message from AI
  useEffect(() => {
    if (messages.length === 0) {
      let welcomeText = '';
      if (language === 'hi') {
        welcomeText = `नमस्ते! मैं क्लेरियोमेड का मेडिकल एआई सहायक हूँ। मैं आपके मेडिकल रिपोर्ट्स, लैब रिजल्ट्स या स्वास्थ्य संबंधी प्रश्नों के उत्तर देने के लिए समर्पित हूँ। आप मुझसे क्या पूछना चाहते हैं?`;
      } else if (language === 'mr') {
        welcomeText = `नमस्कार! मी क्लेरिओमेडचा वैद्यकीय एआय सहाय्यक आहे. मी तुमचे वैद्यकीय अहवाल, लॅब निकाल किंवा आरोग्याविषयीच्या प्रश्नांची उत्तरे देण्यासाठी समर्पित आहे. आज मी तुम्हाला कशी मदत करू शकेन?`;
      } else {
        welcomeText = `Hello! I am ClarioMed's AI Medical Assistant. I am specialized strictly to help you understand medical reports, lab test terminology, and health questions. How can I assist you today?`;
      }

      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  // Non-medical filter check (Client side fallback guardrail)
  const isMedicalQuery = (query: string): boolean => {
    const q = query.toLowerCase().trim();
    // Keywords for obvious non-medical topics
    const nonMedicalKeywords = [
      'code python', 'javascript', 'write code', 'football', 'cricket', 'movie', 'actor', 
      'politics', 'capital of', 'weather today', 'recipe', 'cook', 'car repair', 'crypto', 
      'bitcoin', 'who won', 'sing a song', 'tell a joke'
    ];
    for (const kw of nonMedicalKeywords) {
      if (q.includes(kw)) return false;
    }
    return true;
  };

  const getRefusalMessage = (): string => {
    if (language === 'hi') {
      return 'मैं क्लेरियोमेड का एआई मेडिकल सहायक हूँ। मैं केवल चिकित्सा, स्वास्थ्य रिपोर्ट और लैब परीक्षण प्रश्नों का उत्तर देने के लिए विशेषीकृत हूँ। कृपया कोई स्वास्थ्य या मेडिकल रिपोर्ट संबंधी प्रश्न पूछें।';
    }
    if (language === 'mr') {
      return 'मी क्लेरिओमेडचा एआय वैद्यकीय सहाय्यक आहे. मी फक्त वैद्यकीय, आरोग्य अहवाल आणि प्रयोगशाळा चाचणी प्रश्नांची उत्तरे देण्यासाठी समर्पित आहे. कृपया कोणताही आरोग्य किंवा वैद्यकीय अहवाल संबंधित प्रश्न विचारा.';
    }
    return "I am ClarioMed's AI Medical Assistant. I am specialized strictly to answer medical, health report, and laboratory test questions. Please ask me a health or medical report question.";
  };

  const handleSend = async (customPrompt?: string) => {
    const queryText = (customPrompt || input).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    // Client-side medical guardrail check
    if (!isMedicalQuery(queryText)) {
      setTimeout(() => {
        const refusalMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: getRefusalMessage(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMedicalRefusal: true,
        };
        setMessages((prev) => [...prev, refusalMsg]);
        setIsLoading(false);
      }, 500);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${baseUrl}/api/v1/reports/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: language,
          report_context: useReportContext && activeReport ? activeReport.summary : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply || getRefusalMessage(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMedicalRefusal: data.is_refusal,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Backend response error');
      }
    } catch (err) {
      // Fallback simulated medical Gemini response in requested language
      setTimeout(() => {
        let simulatedReply = '';
        if (language === 'hi') {
          simulatedReply = `[एआई मेडिकल उत्तर]\n${queryText} के बारे में:\n\nमेडिकल दृष्टि से, यह पैरामीटर आपके शरीर के मेटाबॉलिज्म और ऑर्गन फ़ंक्शन से संबंधित है। यदि मान सामान्य सीमा से बाहर हैं, तो अपने डॉक्टर से सलाह लें। क्या आप इससे जुड़ा कोई अन्य टेस्ट समझना चाहते हैं?`;
        } else if (language === 'mr') {
          simulatedReply = `[एआय वैद्यकीय उत्तर]\n${queryText} बद्दल:\n\nवैद्यकीय दृष्टिकोनातून, हा घटक तुमच्या शरीरातील चयापचय आणि अवयवांच्या कार्याशी संबंधित आहे। जर चाचणीचा निकाल असामान्य असेल तर कृपया तुमच्या डॉक्टरांचा सल्ला घ्या।`;
        } else {
          simulatedReply = `Medical Analysis for "${queryText}":\n\nIn clinical diagnostics, this parameter reflects specific biochemical functions in the body. If your lab results show deviations outside standard reference intervals, it is recommended to evaluate these findings alongside a complete clinical history with your treating physician.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: simulatedReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  const prompts = [t.prompt1, t.prompt2, t.prompt3, t.prompt4];

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-[#4c956c]/20 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2c6e49] to-[#4c956c] text-white flex items-center justify-center shadow-lg shadow-[#2c6e49]/30 shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {t.aiChatTitle}
              <span className="text-[10px] font-bold bg-[#fefee3] dark:bg-[#2c6e49]/30 text-[#2c6e49] dark:text-[#4c956c] px-2 py-0.5 rounded-full border border-[#4c956c]/30">
                Gemini 2.5 Medical Core
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.aiChatSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeReport && (
            <button
              onClick={() => setUseReportContext(!useReportContext)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                useReportContext
                  ? 'bg-[#2c6e49] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{useReportContext ? 'Using Report Context' : 'Attach Report Context'}</span>
            </button>
          )}

          <button
            onClick={() => setMessages([])}
            title={t.aiClearBtn}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Strict Medical Notice Banner */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#fefee3] dark:bg-amber-950/30 border border-[#d68c45]/30 text-xs text-[#d68c45] dark:text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-[#d68c45]" />
        <span className="font-semibold">{t.aiChatNotice}</span>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#4c956c]/20 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden relative">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-[#2c6e49] text-white'
                      : msg.isMedicalRefusal
                      ? 'bg-amber-500 text-white'
                      : 'bg-gradient-to-tr from-[#2c6e49] to-[#4c956c] text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                      isUser
                        ? 'bg-[#2c6e49] text-white rounded-tr-xs'
                        : msg.isMedicalRefusal
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-tl-xs'
                        : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span
                    className={`text-[10px] text-slate-400 block px-1 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-[#2c6e49] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <Loader2 className="w-4 h-4 animate-spin text-[#2c6e49]" />
                <span>Consulting Medical Knowledge Base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Medical Prompts Bar */}
        {messages.length < 4 && (
          <div className="p-3 bg-[#fdfdf9] dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#d68c45]" />
              {t.suggestedPromptsTitle}
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {prompts.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(promptText)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#2c6e49] hover:text-[#2c6e49] shrink-0 transition-all cursor-pointer shadow-2xs"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.aiInputPlaceholder}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4c956c]/30 focus:border-[#2c6e49] transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-[#2c6e49] hover:bg-[#23593a] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#2c6e49]/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.aiSendBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
