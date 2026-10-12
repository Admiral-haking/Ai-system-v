import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  HelpCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  BookOpen,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { THESIS_SLIDES, DEFENSE_QUESTIONS, ThesisSlide } from '../data/thesisContent';

export const ThesisDefenseCompanion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'slides' | 'questions' | 'demo_scenario' | 'speech_script'>('slides');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(1);
  const [questionCategory, setQuestionCategory] = useState<string>('all');

  const currentSlide = THESIS_SLIDES[currentSlideIdx];

  const filteredQuestions = React.useMemo(() => {
    if (questionCategory === 'all') return DEFENSE_QUESTIONS;
    return DEFENSE_QUESTIONS.filter((q) => q.category === questionCategory);
  }, [questionCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-cyan-400" />
            <span>مرکز جامع آمادگی جلسه دفاع و مستندات پایان‌نامه</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            اسلایدهای ارائه‌ی استاندارد، سناریوی اجرای دموی زنده، متن سخنرانی و پاسخ به پرسش‌های داوران
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3 py-1.5 rounded transition-colors font-medium flex items-center gap-1.5 ${
              activeTab === 'slides' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>اسلایدهای دفاع ({THESIS_SLIDES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded transition-colors font-medium flex items-center gap-1.5 ${
              activeTab === 'questions' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>سوالات داوران و پاسخ‌ها</span>
          </button>
          <button
            onClick={() => setActiveTab('demo_scenario')}
            className={`px-3 py-1.5 rounded transition-colors font-medium flex items-center gap-1.5 ${
              activeTab === 'demo_scenario' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>سناریوی دموی زنده (۱۰ دقیقه)</span>
          </button>
          <button
            onClick={() => setActiveTab('speech_script')}
            className={`px-3 py-1.5 rounded transition-colors font-medium flex items-center gap-1.5 ${
              activeTab === 'speech_script' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>متن نطق شفاهی ارائه</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Presentation Slides */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          {/* Main Slide Projector Canvas */}
          <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            {/* Top Bar of Slide */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/60">
                  اسلاید {currentSlide.id} از {THESIS_SLIDES.length}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {currentSlide.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>زمان پیشنهادی: {currentSlide.timeAllocation}</span>
              </div>
            </div>

            {/* Slide Body */}
            <div className="py-6 space-y-5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {currentSlide.title}
              </h1>

              <div className="space-y-3 pt-2">
                {currentSlide.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 mt-2"></span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Presenter Speaking Cue / Notes */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-start gap-3">
              <UserCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5 text-amber-300">نکته طلایی برای ارائه شفاهی شما در جلسه:</strong>
                <span>{currentSlide.presenterNotes}</span>
              </div>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              <span>اسلاید قبلی</span>
            </button>

            {/* Thumbnails indicator */}
            <div className="flex items-center gap-1 overflow-x-auto px-2 max-w-md">
              {THESIS_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIdx(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlideIdx === idx ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlideIdx((prev) => Math.min(THESIS_SLIDES.length - 1, prev + 1))}
              disabled={currentSlideIdx === THESIS_SLIDES.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors"
            >
              <span>اسلاید بعدی</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Defense Questions & Expert Answers */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400">فیلتر موضوعی:</span>
            {[
              { id: 'all', label: 'همه پرسش‌ها' },
              { id: 'Data & Leakage', label: 'داده‌ها و نشت اطلاعات (Data Leakage)' },
              { id: 'Machine Learning', label: 'الگوریتم‌های یادگیری ماشین' },
              { id: 'Software Architecture', label: 'معماری و لینوکس' },
              { id: 'Security & DevOps', label: 'امنیت و استقرار' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setQuestionCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  questionCategory === cat.id
                    ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="w-full p-4 text-right flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">
                        {q.id}
                      </span>
                      <div className="text-xs sm:text-sm font-bold text-slate-100">
                        {q.question}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                        {q.difficulty}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-800/60 bg-slate-950/40 text-xs space-y-2">
                      <div className="text-[11px] font-mono text-cyan-400">{q.sourceChapter}</div>
                      <p className="text-slate-200 leading-relaxed text-justify">{q.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Live Demo Scenario (10 minutes) */}
      {activeTab === 'demo_scenario' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Play className="h-5 w-5 text-cyan-400" />
              <span>سناریوی اجرای دموی زنده ۱۰ دقیقه‌ای در جلسه دفاعیه</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              مراحل گام‌به‌گام برای تحت تاثیر قرار دادن داوران با نمایش زنده و اجرای بدون وقفه
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>مرحله ۱: داشبورد کلان و معماری سیستم لینوکس</span>
                <span className="font-mono">دقیقه ۰ تا ۲</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                صفحه داشبورد را باز کرده و نشان دهید که سرویس‌ها (PostgreSQL، Celery و مدل تولید XGBoost) به صورت برخط در حال اجرا هستند. 
                کارت‌های KPI را معرفی کرده و اشاره کنید ۵۵۴ میلیون تومان فروش ۳۰ روزه با خطای WAPE تنها ۴.۸۲٪ مدل‌سازی شده است.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>مرحله ۲: پیش‌بینی تقاضا، فواصل اطمینان و مقایسه افق‌ها</span>
                <span className="font-mono">دقیقه ۲ تا ۵</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                به صفحه <strong>پیش‌بینی هوشمند فروش</strong> بروید. افق پیش‌بینی را بین ۷ روزه و ۳۰ روزه سوئیچ کنید. 
                به داوران نشان دهید که فواصل اطمینان ۹۵٪ با پیشروی در زمان گسترده‌تر می‌شوند (Heteroscedasticity). سپس مدل را به Seasonal Naive تغییر دهید تا جهش خطای WAPE از ۴.۸۲٪ به ۱۸.۹٪ به صورت مشهود نمایان شود.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>مرحله ۳: خوشه‌بندی مشتریان و پیش‌بینی خرید مجدد</span>
                <span className="font-mono">دقیقه ۵ تا ۷</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                به صفحه <strong>خوشه‌بندی مشتریان</strong> رفته و نمودار اسکتر دوبعدی و ضریب شبح ۰.۶۴۲ را نشان دهید. 
                سپس در صفحه <strong>پیش‌بینی خرید مجدد</strong>، اسلایدر آستانه تصمیم‌گیری (Threshold) را جابجا کنید و تغییرات ماتریس درهم‌ریختگی و دادوستد بین Precision و Recall را به داوران نشان دهید.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>مرحله ۴: تبیین‌پذیری با SHAP و اثبات عدم نشت داده‌ها</span>
                <span className="font-mono">دقیقه ۷ تا ۱۰</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                به صفحه <strong>توضیح‌پذیری هوش مصنوعی</strong> رفته و نمودار آبشاری تک‌پیش‌بینی را برای یک مشتری خاص باز کنید. 
                نشان دهید که چگونه سهم ویژگی‌های گذشته (Lag 7) مدل را شفاف می‌کند و در انتها خروجی رسمی PDF را در <strong>مرکز گزارش‌ها</strong> دانلود نمایید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Speech Script (متن نطق شفاهی) */}
      {activeTab === 'speech_script' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span>متن سخنرانی شفاهی ارائه‌دهنده (Speech Transcript)</span>
            </h3>
            <p className="text-slate-400 mt-1">
              متن تمرین‌شده برای ادای روان و تسلط کلامی کامل در مقابل هیئت داوران در ۱۰ دقیقه
            </p>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed text-justify">
            <p>
              «به نام خداوند جان و خرد. با سلام و عرض ادب خدمت استاد راهنمای گرامی، داوران محترم و حضار ارجمند. 
              موضوع پایان‌نامه اینجانب، <strong>طراحی و پیاده‌سازی سامانه هوشمند پیش‌بینی فروش و تحلیل رفتار مشتریان با الگوریتم‌های یادگیری ماشین و داشبورد تحت وب</strong> است.»
            </p>
            <p>
              «در این پروژه تلاش کردیم تا چالشی اساسی در صنعت خرده‌فروشی مدرن را حل کنیم: ناتوانی روش‌های خطی در پیش‌بینی دقیق نوسانات تقاضا و نبود شفافیت در تصمیم‌گیری‌های هوش مصنوعی. 
              ما خط لوله جامعی را در محیط لینوکس با پایتون ۳.۱۲ و FastAPI پیاده‌سازی کردیم که با اتکا به ۵۴۱ هزار تراکنش واقعی تجاری، الگوریتم‌های مختلف را در بوته آزمایش قرار می‌دهد.»
            </p>
            <p>
              «مهم‌ترین دستاورد فنی این پژوهش، پیشگیری دقیق از نشت داده‌ها با استفاده از اعتبارسنجی بازگشتی زمانی (Rolling-Origin Backtesting) و دستیابی به خطای وزنی WAPE معادل ۴.۸۲ درصد در مدل XGBoost بهینه‌شده با Optuna است؛ یعنی بیش از ۷۴ درصد کاهش خطا در مقایسه با روش‌های معمول. 
              همچنین با ادغام مقادیر ارزش شپلی (SHAP)، مدل را از حالت جعبه سیاه خارج کرده و برای مدیران سازمان کاملاً تفسیرپذیر ساختیم.»
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
