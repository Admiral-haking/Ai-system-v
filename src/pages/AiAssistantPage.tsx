import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  Package,
  Users,
  Compass,
  ArrowRight,
  Database,
  Terminal,
  Zap,
} from 'lucide-react';
import { CopilotMessage } from '../types';

export const AiAssistantPage: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: '۱۱:۲۰',
      text: 'سلام! من دستیار هوشمند سازمانی (Enterprise AI Copilot) شما هستم. می‌توانم به سوالات شما درباره پیش‌بینی‌های فروش، خوشه‌بندی رفتار مشتریان، هشدارهای کسری انبار و تبیین‌پذیری مدل‌ها پاسخ دهم. برای شروع می‌توانید یکی از سوالات پرتکرار زیر را انتخاب کنید یا سوال دلخواه خود را بنویسید.',
      dataReferences: [
        { title: 'مدل پیش‌بینی فروش', value: 'WAPE: ۴.۸۲٪', linkToTab: 'sales-forecast' },
        { title: 'مشتریان فعال', value: '۴,۳۷۲ مشتری (۴ بخش)', linkToTab: 'customer-segmentation' },
        { title: 'هشدارهای اتاق تصمیم', value: '۴ مورد بررسی', linkToTab: 'decision-center' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const predefinedPrompts = [
    'دقت مدل پیش‌بینی فروش و خطای WAPE چقدر است و چه پیشرفتی داشته؟',
    'کدام مشتریان بیشترین ریسک ریزش را دارند و چه پیشنهادی وجود دارد؟',
    'آیا در حال حاضر کسری موجودی کالا در انبار برای روزهای آینده پیش‌بینی می‌شود؟',
    'الگوی فروش در روزهای هفته چگونه است و چرا روز جمعه افت تقاضا داریم؟',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Context-aware grounded response logic
    setTimeout(() => {
      let replyText = '';
      let references: Array<{ title: string; value: string; linkToTab?: string }> = [];

      if (text.includes('دقت') || text.includes('WAPE') || text.includes('پیش‌بینی')) {
        replyText = `بر اساس ارزیابی مستقل مجموعه داده آزمون (Out-of-Time Test Set)، مدل منتخب **XGBoost Regressor v3.2** به همراه بهینه‌سازی بیزی Optuna موفق به دستیابی به خطای WAPE معادل **۴.۸۲ درصد** و ضریب تبیین $R^2 = ۰.۹۳۸$ شده است. این عملکرد در مقایسه با مدل پایه فصلی (با خطای ۱۸.۹٪)، نشان‌دهنده بهبودی بیش از **۷۴.۵ درصد** در دقت برآورد تقاضای زنجیره تامین است.`;
        references = [
          { title: 'مدل قهرمان (Champion)', value: 'XGBoost v3.2', linkToTab: 'sales-forecast' },
          { title: 'کاهش خطای WAPE', value: '-۷۴.۵٪ نسبت به مبنا', linkToTab: 'model-comparison' },
        ];
      } else if (text.includes('ریزش') || text.includes('مشتریان') || text.includes('مشتری')) {
        replyText = `در ماژول طبقه‌بندی خرید مجدد و تحلیل RFM، حدود **۳۰ درصد از مشتریان (۱,۳۱۴ نفر)** در بخش «در معرض خطر ریزش» یا «غیرفعال» قرار دارند. برای نمونه، شرکت تجهیزات صنعتی رادمهر (Recency=122 روز) دارای احتمال بازگشت تنها ۱۲ درصد است. در **اتاق تصمیم‌گیری (Decision Center)**، یک بسته پیشنهاد اعتباری ۳۰ روزه اختصاصی برای حفظ ۶ مشتری استراتژیک عمده ثبت شده است.`;
        references = [
          { title: 'مشتریان در معرض خطر', value: '۱,۳۱۴ مشتری (۳۰٪)', linkToTab: 'customer-analytics' },
          { title: 'ارزش گردش سالانه در معرض ریسک', value: '۴۲۰ میلیون تومان', linkToTab: 'decision-center' },
        ];
      } else if (text.includes('موجودی') || text.includes('کسری') || text.includes('انبار')) {
        replyText = `بله، بر اساس ترکیب پیش‌بینی تقاضای ۳۰ روزه با مانده موجودی سیستم ERP سپیدار، برای محصول **شمع تزیینی قلبی (StockCode: 85123A)** در ۴ روز آینده خطر کسری موجودی قطعی (Stockout) شناسایی شده است. پیشنهاد شارژ اضطراری ۴۰۰ عدد در اتاق تصمیم‌گیری آماده تایید توسط مدیر انبار می‌باشد.`;
        references = [
          { title: 'کالای بحرانی', value: 'کد 85123A', linkToTab: 'decision-center' },
          { title: 'زمان تا اتمام موجودی', value: '۴ روز کاری', linkToTab: 'decision-center' },
        ];
      } else {
        replyText = `الگوی فصلی فروش نشان می‌دهد که روزهای **چهارشنبه با میانگین ۲۴.۸ میلیون تومان** اوج ثبت فاکتورهای عمده B2B بوده و روزهای **جمعه با ۱۱.۶ میلیون تومان** کف هفتگی را تشکیل می‌دهند. این نوسان ۲۸ درصدی با اعمال متغیر تاخیری ۷ روزه (Lag 7) و متغیر دوتایی تعطیلات به طور کامل توسط مدل یاد گرفته شده است.`;
        references = [
          { title: 'اوج فروش هفتگی', value: 'چهارشنبه‌ها (+۳۴٪)', linkToTab: 'sales-analytics' },
          { title: 'مهم‌ترین متغیر در SHAP', value: 'Lag 7 (۰.۴۲ سهم)', linkToTab: 'explainable-ai' },
        ];
      }

      const botMsg: CopilotMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        dataReferences: references,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 4 · دستیار هوشمند گفتگومحور و همکار تحلیل داده (Enterprise AI Copilot)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-400" />
            <span>دستیار هوشمند سازمانی تحلیل فروش، تبیین مدل و تصمیم‌یاری</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پرسش به زبان طبیعی، فراخوانی امن ابزارهای تحلیلی فقط‌خواندنی و ارجاع دقیق به داده‌های مستند سامانه
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/60">
          <ShieldCheck className="h-4 w-4" />
          <span>دسترسی امن: فقط‌خواندنی (Read-Only Safety Guard)</span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col h-[600px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600'
                      : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 space-y-2.5 shadow-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-300/70">
                    <span className="font-bold">{isUser ? 'کاربر' : 'دستیار هوشمند سازمانی'}</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="text-justify text-xs sm:text-sm whitespace-pre-wrap">{msg.text}</p>

                  {/* Data References Badges */}
                  {!isUser && msg.dataReferences && msg.dataReferences.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-2 text-[11px]">
                      {msg.dataReferences.map((ref, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                        >
                          <span className="text-slate-400">{ref.title}:</span>
                          <span className="text-cyan-400 font-bold font-mono">{ref.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 text-xs items-center">
              <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>دستیار در حال جستجو در پایگاه دانش و خط لوله استنتاج است...</span>
              </div>
            </div>
          )}
        </div>

        {/* Predefined Quick Prompts Carousel */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-bold">پیشنهادها:</span>
          {predefinedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="سوال خود درباره پیش‌بینی‌ها، مشتریان یا موجودی را بپرسید..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow"
            >
              <Send className="h-4 w-4" />
              <span>ارسال</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
