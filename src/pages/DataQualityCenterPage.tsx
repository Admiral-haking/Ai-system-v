import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Sliders,
  Database,
  ArrowRight,
  Filter,
  Eye,
  Check,
  X,
  Layers,
  FileCheck,
  Info,
} from 'lucide-react';
import { QUARANTINED_DATA_RECORDS } from '../data/mockData';
import { QuarantinedDataRecord, FeatureScalingConfig } from '../types';

export const DataQualityCenterPage: React.FC = () => {
  const [quarantineRecords, setQuarantineRecords] = useState<QuarantinedDataRecord[]>(QUARANTINED_DATA_RECORDS);
  const [selectedScaler, setSelectedScaler] = useState<'StandardScaler' | 'RobustScaler' | 'QuantileTransformer'>('RobustScaler');
  const [outlierStrategy, setOutlierStrategy] = useState<'robust_iqr' | 'clip' | 'drop'>('robust_iqr');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleApplyAiCorrection = (recordId: string) => {
    setQuarantineRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'CORRECTED' } : r))
    );
    setActionNotice(`اصلاحیه هوشمند برای رکورد ${recordId} اعمال و به خط لوله استاندارد منتقل شد.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDiscardRecord = (recordId: string) => {
    setQuarantineRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'DISCARDED' } : r))
    );
    setActionNotice(`رکورد ${recordId} به عنوان داده نامعتبر آرشیو و حذف شد.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              DATA QUALITY & FEATURE ENGINEERING CENTER · مرکز بهداشت و مهندسی ویژگی‌ها
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              پایش کیفیت داده‌ها، مدیریت قرنطینه و خط‌لوله‌های نرمال‌سازی بدون نشتی
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              جداسازی رکوردهای مخدوش در بخش قرنطینه، پیشنهاد اصلاح با هوش مصنوعی (Reversible Operations)، 
              و مقیاس‌بندی مقاوم ویژگی‌ها (RobustScaler) جهت جلوگیری از نشتی داده‌های تست به آموزش (Data Leakage).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              شاخص سلامت داده: ۹۸.۶٪
            </span>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 shadow-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Feature Engineering & Scaling Selection (Part A) */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <span>پیکربندی خط‌لوله مهندسی ویژگی‌ها و نرمال‌سازی عددی (Feature Scaling Pipeline):</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              * تمام تبدیل‌ها تنها روی مجموعه Train برازش (Fit) شده و روی Test صرفاً اعمال (Transform) می‌گردند.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="block text-slate-300 font-bold">روش مقیاس‌بندی (Scaler):</label>
            <select
              value={selectedScaler}
              onChange={(e) => setSelectedScaler(e.target.value as any)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
            >
              <option value="RobustScaler">RobustScaler (مقاوم در برابر داده‌های پرت بر پایه میانه و IQR)</option>
              <option value="StandardScaler">StandardScaler (نرمال استاندارد بر پایه میانگین و واریانس)</option>
              <option value="QuantileTransformer">QuantileTransformer (تبدیل به توزیع یکنواخت یا نرمال)</option>
            </select>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              به دلیل وجود تخفیف‌های فصلی بزرگ (Black Friday)، استفاده از RobustScaler مانع مخدوش شدن مقادیر استاندارد می‌شود.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="block text-slate-300 font-bold">مدیریت داده‌های پرت (Outlier Strategy):</label>
            <select
              value={outlierStrategy}
              onChange={(e) => setOutlierStrategy(e.target.value as any)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
            >
              <option value="robust_iqr">برش مقاوم بر اساس دامنه بین‌چارکی (Winsorization 1.5x IQR)</option>
              <option value="clip">محدودسازی به صدک‌های ۱ و ۹۹ (Percentile Clipping)</option>
              <option value="drop">حذف ردیف‌های فراتر از ۳ انحراف معیار</option>
            </select>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              روش Winsorization به جای حذف رکورد، مقادیر افراطی را به مرزهای آماری چارک‌ها مهار می‌کند.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="block text-slate-300 font-bold">قوانین یکپارچه‌سازی ارز و زمان:</label>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>واحد پول استاندارد:</span>
                <span className="font-mono text-emerald-400 font-bold">ریال ایران (IRR)</span>
              </div>
              <div className="flex justify-between">
                <span>ناحیه زمانی مرجع:</span>
                <span className="font-mono text-slate-200">UTC (ISO-8601)</span>
              </div>
              <div className="flex justify-between">
                <span>حفظ دقت مالی:</span>
                <span className="text-emerald-400">Decimal(18, 2)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quarantined Records Ledger (Phase 8) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>کارتابل رکوردهای قرنطینه و پیشنهادهای اصلاح با هوش مصنوعی (Quarantine Ledger):</span>
            </h3>
            <p className="text-xs text-slate-400">
              رکوردهایی که قوانین اعتبارسنجی را نقض کرده‌اند، تا زمان بررسی انسانی از خط لوله اصلی تفکیک شده‌اند.
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {quarantineRecords.filter((r) => r.status === 'QUARANTINED').length} رکورد در انتظار تصمیم
          </span>
        </div>

        <div className="space-y-3">
          {quarantineRecords.map((record) => (
            <div
              key={record.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                record.status === 'QUARANTINED'
                  ? 'bg-slate-950/80 border-slate-800'
                  : record.status === 'CORRECTED'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-cyan-400">{record.id}</span>
                  <span className="text-xs text-slate-400">منبع: {record.sourceSystem}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      record.violationSeverity === 'CRITICAL'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {record.violationSeverity}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{record.receivedAt}</span>
                </div>

                <div className="text-xs font-bold text-slate-200">
                  علت عدم پذیرش: <span className="text-rose-300 font-normal">{record.failureReason}</span>
                </div>

                {/* AI Suggestion Box */}
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>پیشنهاد اصلاحی هوش مصنوعی (Reversible AI Fix):</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {record.aiSuggestedFix.action}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {record.status === 'QUARANTINED' ? (
                  <>
                    <button
                      onClick={() => handleApplyAiCorrection(record.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>تأیید و اعمال اصلاح</span>
                    </button>
                    <button
                      onClick={() => handleDiscardRecord(record.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors border border-slate-700"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>حذف رکورد</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-400">
                    وضعیت: {record.status === 'CORRECTED' ? 'اصلاح‌شده و منتقل به انبار' : 'حذف‌شده'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
