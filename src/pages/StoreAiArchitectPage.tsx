import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Database,
  FileCode,
  CheckCircle2,
  Share2,
  HelpCircle,
  Cpu,
  Clock,
  Layers,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_STORE_AI_CHAT_MESSAGES } from '../data/mockData';
import { StoreAiArchitectMessage } from '../types';

export const StoreAiArchitectPage: React.FC = () => {
  const [messages, setMessages] = useState<StoreAiArchitectMessage[]>(INITIAL_STORE_AI_CHAT_MESSAGES);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const suggestedQuestions = [
    'محصولات فروشگاه من در کدام کالکشن MongoDB هستند؟',
    'سفارش‌ها چطور به محصولات و مشتریان وصل شده‌اند؟',
    'وقتی سفارشی ثبت می‌شود، موجودی از کجا کم می‌شود؟',
    'کدام API فروشگاه کند است و گلوگاه کجاست؟',
    'کدام محصولات در ماه آینده احتمال کمبود موجودی دارند؟',
    'برای افزایش سرعت فروشگاه و جلوگیری از خطا چه تغییراتی پیشنهاد می‌کنی؟',
  ];

  const handleSendQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: StoreAiArchitectMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let citations = undefined;

      if (questionText.includes('محصولات') || questionText.includes('کالکشن')) {
        replyText = `محصولات در کالکشن **products** نگهداری می‌شوند. در فروشگاه شما مدل مانگوس \`src/models/Product.ts\` دارای فیلدهای \`title\`, \`basePrice\`, \`slug\`, و آرایه \`variants\` است.
واریانت‌ها شامل SKU، رنگ، سایز و موجودی هستند و با الگوریتم Unnesting برای پیش‌بینی فروش تفکیک می‌شوند.`;
        citations = [
          { title: 'مدل مانگوس محصولات', source: 'src/models/Product.ts', snippet: 'Collection: products · 3,680 documents' },
        ];
      } else if (questionText.includes('وصل') || questionText.includes('ارتباط')) {
        replyText = `ارتباط سفارش‌ها در کالکشن **orders** به شرح زیر است:
1. **ارتباط با مشتری:** فیلد \`customerId\` با نوع \`ObjectId\` به کلید \`_id\` در کالکشن **customers** ارجاع دارد.
2. **ارتباط با محصولات:** سفارش‌ها از آرایه تو در توی \`items\` استفاده می‌کنند. هر آیتم دارای فیلد \`productId\` (ارجاع به products) و \`variantSku\` (ارجاع به موجودی انبار) است.`;
        citations = [
          { title: 'کالکشن orders', source: 'MongoDB Schema: orders', snippet: 'customerId -> customers._id · items[].productId -> products._id' },
        ];
      } else if (questionText.includes('موجودی') || questionText.includes('کم')) {
        replyText = `کسر موجودی به صورت دو مرحله‌ای انجام می‌شود:
1. در زمان پرداخت: متد \`reserveInventory\` در \`order.service.ts\` موجودی را در کالکشن **inventory** رزرو موقت می‌کند.
2. با تایید درگاه بانکی در \`/api/payment/verify\`: دستور \`Inventory.updateOne({ variantSku }, { $inc: { availableStock: -qty } })\` اجرا شده و سند سفارش در کالکشن orders به حالت \`PAID_CONFIRMED\` تغییر وضعیت می‌دهد.`;
        citations = [
          { title: 'سرویس مدیریت انبار', source: 'src/lib/inventory/stock-manager.ts' },
        ];
      } else if (questionText.includes('کند') || questionText.includes('گلوگاه')) {
        replyText = `تحلیلگر عملکرد پلتفرم نشان می‌دهد که اندپوینت \`/api/products/search\` به دلیل فقدان ایندکس متنی ترکیبی (Compound Text Index) روی فیلدهای \`title\` و \`description\` در MongoDB کندترین نقطه با تاخیر ۴۸۰ میلی‌ثانیه است.
پیشنهاد ما ایجاد ایندکس \`{ title: "text", slug: 1 }\` و کش‌گذاری نتایج در Redis است تا تاخیر به کمتر از ۴۵ میلی‌ثانیه کاهش یابد.`;
        citations = [
          { title: 'لاگ‌های تله‌متری', source: 'OpenTelemetry Spans: /api/products/search' },
        ];
      } else if (questionText.includes('کمبود موجودی')) {
        replyText = `بر اساس مدل پیش‌بینی سری زمانی N-BEATS و تقاضای ثبت‌شده در ۳۰ روز اخیر:
- محصول «کفش ورزشی اسپرینت سایز ۴۲» (SKU: SPRT-BLK-42) با موجودی فعلی ۱۵ عدد و تقاضای پیش‌بینی‌شده ۳۸ عدد در ۱۴ روز آینده با خطر کسری قطعی انبار روبرو است.
توصیه می‌شود دستور تامین مجدد (Restock Order) حداقل برای ۳۰ عدد صادر شود.`;
        citations = [
          { title: 'موتور پیش‌بینی تقاضا', source: 'PyTorch N-BEATS Forecast Model v2.4' },
        ];
      } else {
        replyText = `تحلیل پرسش شما با استناد به گراف دانشی فروشگاه:
معماری Next.js 14 و کالکشن‌های MongoDB فروشگاه شما بررسی شد. این موضوع با متدهای ثبت سفارش در سرویس‌های نود و ساختار ایندکس‌های فعال همخوانی کامل دارد. برای اعمال هرگونه تغییر، پیشنهاد می‌شود از طریق شبیه‌ساز تست رگرسیون تایید نهایی را انجام دهید.`;
        citations = [
          { title: 'مدل دانشی نسخه v2.4', source: 'Store Knowledge Graph' },
        ];
      }

      const botMsg: StoreAiArchitectMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        citations,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              STORE AI ARCHITECT & BUSINESS INTELLIGENCE ASSISTANT
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              دستیار هوشمند معمار و تحلیلگر دیتابیس فروشگاه شما (Next.js + MongoDB)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              پاسخ مستند به پرسش‌های ساختاری درباره کالکشن‌ها، فیلدها، چرخه کسر موجودی، سرعت APIها و پیش‌بینی کمبود کالا، 
              با تکیه بر مدل دانشی استخراج‌شده و استناد دقیق به خطوط کد سورس و اسناد دیتابیس.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>موتور تحلیل: DeepSeek + Store Graph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>پرسش‌های پیشنهادی بر اساس معماری فروشگاه شما:</span>
          </span>
          <span className="text-[11px] font-mono">یک کلیک برای پاسخ</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors text-right"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 border border-slate-700 text-cyan-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`space-y-2 rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600/20 border border-cyan-500/30 text-slate-100'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold">مستندات و مراجع استناد شده:</div>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300"
                        >
                          {c.title} ({c.source})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono text-left" dir="ltr">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-lg">
              <div className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl p-3 bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                <span>در حال واکشی مستندات از گراف دانشی فروشگاه و تحلیل پاسخ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(inputQuestion);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="هر سوالی درباره ساختار دیتابیس، ارتباط سفارش‌ها یا منطق فروشگاه دارید بپرسید..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputQuestion.trim() || isTyping}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-40"
            >
              <Send className="h-4 w-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
