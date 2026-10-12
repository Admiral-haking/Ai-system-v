import React, { useState } from 'react';
import {
  Terminal,
  FolderTree,
  FileCode,
  Copy,
  Check,
  Download,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { LINUX_PROJECT_FILES, ProjectFile } from '../data/linuxFiles';

export const LinuxMonorepoHub: React.FC = () => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile: ProjectFile = LINUX_PROJECT_FILES[selectedFileIdx];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const stagesChecklist = [
    { num: '۰۱', title: 'تحلیل نیازمندی‌ها و طراحی معماری (SRS & Architecture)', status: 'انجام شده' },
    { num: '۰۲', title: 'ساختار Monorepo و محیط لینوکس (Linux Dev Setup)', status: 'انجام شده' },
    { num: '۰۳', title: 'طراحی پایگاه داده و مهاجرت Alembic (PostgreSQL 16)', status: 'انجام شده' },
    { num: '۰۴', title: 'پیاده‌سازی Backend ناهمگام با FastAPI 0.111', status: 'انجام شده' },
    { num: '۰۵', title: 'احراز هویت Argon2id و کنترل دسترسی RBAC', status: 'انجام شده' },
    { num: '۰۶', title: 'ورود داده UCI Retail، اعتبارسنجی و مهندسی ویژگی', status: 'انجام شده' },
    { num: '۰۷', title: 'پیش‌بینی فروش (XGBoost, Random Forest, Lags)', status: 'انجام شده' },
    { num: '۰۸', title: 'خوشه‌بندی مشتریان (K-Means, DBSCAN, RFM)', status: 'انجام شده' },
    { num: '۰۹', title: 'پیش‌بینی خرید مجدد (ROC-AUC, Precision-Recall)', status: 'انجام شده' },
    { num: '۱۰', title: 'بهینه‌سازی با Optuna و توضیح‌پذیری SHAP', status: 'انجام شده' },
    { num: '۱۱', title: 'مدیریت آزمایش‌ها با MLflow و صف Celery/Redis', status: 'انجام شده' },
    { num: '۱۲', title: 'داشبورد وب حرفه‌ای فارسی و واکنش‌گرا (React + Recharts)', status: 'انجام شده' },
    { num: '۱۳', title: 'مرکز گزارش‌گیری علمی و صدور خروجی‌های دفاعیه', status: 'انجام شده' },
    { num: '۱۴', title: 'استقرار کانتینری لینوکس (Docker Compose + Nginx)', status: 'انجام شده' },
    { num: '۱۵', title: 'مستندات پایان‌نامه، اسلایدهای دفاع و ۳۰ سوال داوری', status: 'انجام شده' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-cyan-400" />
            <span>مرکز کدها، اسکریپت‌های لینوکس و ساختار Monorepo (مراحل ۱ تا ۱۵)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده، کپی و اجرای فایل‌های کامل پایتون، FastAPI، اسکریپت‌های Bash، داکر و Makefiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors shadow"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'کد کپی شد!' : 'کپی محتوای فایل فعال'}</span>
          </button>
        </div>
      </div>

      {/* Linux Quick Run Commands Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-2 text-cyan-400 font-bold">
            <Terminal className="h-4 w-4" />
            <span>دستورات اجرای مستقیم روی سرور اوبونتو / دبیان (Ubuntu Linux Terminal):</span>
          </span>
          <span className="text-[10px] text-slate-400">Bash Command Line</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300 space-y-1 overflow-x-auto text-left" dir="ltr">
          <div className="text-emerald-400"># 1. اجرای اسکریپت راه‌اندازی خودکار سرور و بسته‌های پایتون:</div>
          <div>chmod +x scripts/setup.sh && ./scripts/setup.sh</div>
          <div className="text-emerald-400 pt-1"># 2. بالا آوردن تمام کانتینرهای پایگاه داده، ردیس و Nginx:</div>
          <div>docker compose up -d --build</div>
          <div className="text-emerald-400 pt-1"># 3. اجرای تست‌های خودکار Pytest و ارزیابی مدل‌ها:</div>
          <div>make test</div>
        </div>
      </div>

      {/* Grid: Files Selector & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Files List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FolderTree className="h-4 w-4 text-cyan-400" />
              <span>فایل‌های پروژه ({LINUX_PROJECT_FILES.length} فایل اصلی)</span>
            </span>
            <span className="text-[10px] text-slate-400">Monorepo Root</span>
          </div>

          <div className="space-y-1.5">
            {LINUX_PROJECT_FILES.map((file, idx) => {
              const isSelected = selectedFileIdx === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full p-2.5 rounded-lg text-right transition-all flex items-center justify-between text-xs border ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-mono text-[11px] truncate" dir="ltr">
                      {file.path}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 mr-1 font-mono">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-mono font-bold text-cyan-300" dir="ltr">
                  {selectedFile.path}
                </div>
                <div className="text-[11px] text-slate-400">{selectedFile.description}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {selectedFile.category}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="کپی محتوا"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Code Pre Box */}
            <div className="max-h-[500px] overflow-y-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 shadow-inner text-left" dir="ltr">
              <pre className="whitespace-pre">{selectedFile.code}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Stages 1 to 15 Completion Status Checklist */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>چک‌لیست پیاده‌سازی مراحل ۱۵ گانه پایان‌نامه مهندسی هوش مصنوعی</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تطبیق کامل خروجی‌های سیستم با اهداف مرحله‌به‌مرحله تعریف‌شده در پروپوزال
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 font-bold">
            ۱۵ از ۱۵ مرحله تکمیل شد
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {stagesChecklist.map((st) => (
            <div
              key={st.num}
              className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-cyan-400 font-bold text-xs shrink-0">
                  {st.num}
                </span>
                <span className="text-slate-200 truncate">{st.title}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold shrink-0 mr-1">
                ✓ تایید
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
