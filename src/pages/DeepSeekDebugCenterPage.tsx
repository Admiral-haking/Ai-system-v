import React, { useState } from 'react';
import {
  Bug,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  Cpu,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Lock,
} from 'lucide-react';
import { SANITIZED_INCIDENTS, SAMPLE_DEEPSEEK_DIAGNOSTICS } from '../data/mockData';
import { SanitizedIncident, DeepSeekDiagnosticReport } from '../types';

export const DeepSeekDebugCenterPage: React.FC = () => {
  const [incidents, setIncidents] = useState<SanitizedIncident[]>(SANITIZED_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<SanitizedIncident>(SANITIZED_INCIDENTS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosticsMap, setDiagnosticsMap] = useState<Record<string, DeepSeekDiagnosticReport>>(
    SAMPLE_DEEPSEEK_DIAGNOSTICS
  );
  const [copiedDiff, setCopiedDiff] = useState<boolean>(false);
  const [copiedTest, setCopiedTest] = useState<boolean>(false);
  const [sandboxRunning, setSandboxRunning] = useState<boolean>(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [sandboxSuccess, setSandboxSuccess] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'patch' | 'test' | 'sandbox'>('analysis');

  const currentReport = diagnosticsMap[selectedIncident.id];

  const handleSelectIncident = (inc: SanitizedIncident) => {
    setSelectedIncident(inc);
    setSandboxSuccess(null);
    setSandboxLogs([]);
  };

  const handleRunDeepSeekAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // In case report wasn't generated yet
      if (!diagnosticsMap[selectedIncident.id]) {
        const generatedReport: DeepSeekDiagnosticReport = {
          incidentId: selectedIncident.id,
          modelUsed: 'DeepSeek-Coder-V2-Enterprise (0128-Context)',
          analyzedAt: 'هم‌اکنون',
          rootCauseSummary: `تحلیل هوشمند رخداد ${selectedIncident.title}: ناشی از همزمانی درخواست‌ها و عدم مدیریت بهینه کلیدهای شاخص یا خطای اتصال.`,
          probableCauses: [
            {
              cause: 'تداخل رکوردهای همزمان در پایپ‌لاین و عدم استفاده از ON CONFLICT DO UPDATE',
              probabilityPct: 88,
              technicalDetail: 'فراخوانی همزمان چند ورکر برای یک سفارش مشترک باعث خطای یکتایی کلید شده است.',
            },
            {
              cause: 'عدم تطابق شماره فاکتور سیستم مبدا با شناسه هش شده داخلی',
              probabilityPct: 12,
              technicalDetail: 'درگاه خارجی سفارش اصلاح‌شده را با همان شماره فاکتور مجدداً ارسال کرده است.',
            },
          ],
          impactAnalysis: 'این خطا باعث توقف موقت ورود داده سفارش‌ها گردیده است.',
          suggestedPatch: {
            fileTarget: 'backend/app/db/repositories/order_repo.py',
            explanation: 'تبدیل دستور INSERT به عبارت Upsert با PostgreSQL ON CONFLICT DO UPDATE و به‌روزرسانی فیلدهای اصلاحی.',
            riskScore: 2,
            unifiedDiff: `--- a/backend/app/db/repositories/order_repo.py
+++ b/backend/app/db/repositories/order_repo.py
@@ -45,4 +45,8 @@ async def save_order(session: AsyncSession, order: CanonicalOrder):
-    stmt = insert(OrderModel).values(**order.dict())
+    stmt = insert(OrderModel).values(**order.dict()).on_conflict_do_update(
+        index_elements=['tenant_id', 'invoice_no'],
+        set_={'total_amount': order.total_amount, 'order_status': order.order_status}
+    )
     await session.execute(stmt)`,
          },
          regressionTestCase: {
            language: 'python',
            framework: 'pytest',
            testName: 'test_idempotent_order_upsert_on_conflict',
            testCode: `import pytest
from app.db.repositories.order_repo import save_order

@pytest.mark.asyncio
async def test_idempotent_order_upsert_on_conflict(db_session, sample_order):
    # First insert
    await save_order(db_session, sample_order)
    # Second duplicate insert with updated amount must succeed without throwing IntegrityError
    sample_order.total_amount = 1800000.0
    await save_order(db_session, sample_order)
    assert True`,
          },
          tokenUsage: {
            promptTokens: 1150,
            completionTokens: 720,
            costEstimateToman: 3500,
          },
        };
        setDiagnosticsMap((prev) => ({ ...prev, [selectedIncident.id]: generatedReport }));
      }
    }, 1200);
  };

  const handleApprovePatchAndRunSandbox = () => {
    setSandboxRunning(true);
    setSandboxSuccess(null);
    setSandboxLogs([]);
    setActiveTab('sandbox');

    const logs = [
      `[SANDBOX] ایجاد کانتینر ایزوله آزمایشی: docker run --rm -v sandbox_vol:/app isolated-pytest-runner:v2...`,
      `[GIT] اعمال پچ پیشنهادی DeepSeek روی فایل ${currentReport?.suggestedPatch.fileTarget}...`,
      `[GIT] Patch applied cleanly (0 rejects, 1 file modified, +4 lines, -1 line)`,
      `[DATABASE] اجرای پایگاه داده تستی SQLite / PostgreSQL در حافظه موقت (In-Memory Isolation)...`,
      `[TEST] اجرای فریمورک Pytest برای سناریوی بازگشتی: ${currentReport?.regressionTestCase.testName}...`,
      `[RUNNING] tests/test_regression.py::${currentReport?.regressionTestCase.testName} PASSED [100%]`,
      `[SECURITY] بررسی عدم دسترسی به متغیرهای محرمانه و اعتبارسنجی پالیسی‌های RLS... تایید شد.`,
      `[COMPLETE] کلیه تست‌های رگرسیون با موفقیت پاس شدند! زمان اجرا: 1.42s`,
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setSandboxLogs((prev) => [...prev, logs[step]]);
        step++;
      } else {
        clearInterval(interval);
        setSandboxRunning(false);
        setSandboxSuccess(true);
        // update incident status
        setIncidents((prev) =>
          prev.map((i) => (i.id === selectedIncident.id ? { ...i, status: 'VERIFIED' } : i))
        );
      }
    }, 450);
  };

  const handleCopy = (text: string, type: 'diff' | 'test') => {
    navigator.clipboard.writeText(text);
    if (type === 'diff') {
      setCopiedDiff(true);
      setTimeout(() => setCopiedDiff(false), 2000);
    } else {
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
              DEEPSEEK AI AUTONOMOUS DEBUGGING · مرکز عیب‌یابی و پچ خودکار خطاها
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              تحلیل هوشمند خطاها، لاگ‌های پالایش‌شده و تولید تست‌های رگرسیون با DeepSeek
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              جمع‌آوری خطاهای سیستم، پاکسازی داده‌های حساس و توکن‌ها (Redaction)، کشف ریشه خطا (Root Cause Analysis)، 
              پیشنهاد پچ کد با تفاوت خطوط Git Diff و آزمون امن در Sandbox ایزوله تحت نظارت و تایید انسان.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span>موتور هوش: DeepSeek-Coder-V2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Redaction Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-bold">حفاظت از حریم خصوصی و امنیت سازمانی (PII & Secret Sanitizer):</span>
          <span className="text-slate-400 font-normal">
            تمامی کلمه‌های عبور، توکن‌های JWT، کلیدهای API و شماره تماس‌ها پیش از ارسال به مدل سانسور می‌گردند.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          Active Redaction Filter
        </span>
      </div>

      {/* Main Grid: Incidents List (Left) + DeepSeek Diagnosis (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Bug className="h-4 w-4 text-rose-400" />
              <span>خطاهای ثبت‌شده اخیر (Sanitized Incidents):</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{incidents.length} رخداد</span>
          </div>

          <div className="space-y-2.5">
            {incidents.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc)}
                  className={`w-full p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/20 border-purple-500/60 shadow-md ring-1 ring-purple-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {inc.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                      {inc.title}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      منبع: {inc.source} · {inc.timestamp}
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 w-full">
                    <span>وضعیت:</span>
                    <span
                      className={`font-mono font-bold ${
                        inc.status === 'VERIFIED'
                          ? 'text-emerald-400'
                          : inc.status === 'PATCH_PROPOSED'
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnosis & Action Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Incident Detail Header */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                  <span>{selectedIncident.id}</span>
                  <span>·</span>
                  <span className="text-slate-400">{selectedIncident.traceId}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-100">
                  {selectedIncident.title}
                </h3>
              </div>

              <button
                onClick={handleRunDeepSeekAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-xs font-bold transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    <span>در حال تحلیل با DeepSeek...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>تحلیل عمیق با DeepSeek LLM</span>
                  </>
                )}
              </button>
            </div>

            {/* Sanitized Stack Trace Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Terminal className="h-3.5 w-3.5 text-slate-400" />
                  <span>Sanitized Traceback (اطلاعات محرمانه حذف شدند):</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {selectedIncident.redactedSensitiveFields.length} فیلد امنیتی ماسک شد
                </span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto max-h-36 overflow-y-auto leading-relaxed" dir="ltr">
                <pre>{selectedIncident.sanitizedStackTrace}</pre>
              </div>
            </div>
          </div>

          {/* DeepSeek Diagnostic Results */}
          {currentReport ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden space-y-0">
              {/* Report Tab Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeTab === 'analysis'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>علت ریشه‌ای و احتمالات</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('patch')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeTab === 'patch'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className="h-3.5 w-3.5" />
                    <span>پچ اصلاحی (Git Diff)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('test')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeTab === 'test'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>تست رگرسیون (Pytest)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sandbox')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeTab === 'sandbox'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>آزمون در Sandbox</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                  <span>توکن: {currentReport.tokenUsage.promptTokens + currentReport.tokenUsage.completionTokens}</span>
                  <span>هزینه: ~{currentReport.tokenUsage.costEstimateToman} تومان</span>
                </div>
              </div>

              {/* Tab 1: Root Cause Analysis */}
              {activeTab === 'analysis' && (
                <div className="p-5 space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                    <div className="text-purple-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      <span>خلاصه ارزیابی هوش مصنوعی DeepSeek:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {currentReport.rootCauseSummary}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="font-bold text-slate-200 text-xs">احتمال‌سنجی علل بروز رخداد (Probable Causes):</div>
                    {currentReport.probableCauses.map((prob, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{prob.cause}</span>
                          <span className="font-mono text-purple-400 font-bold text-xs">
                            {prob.probabilityPct}% احتمال
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {prob.technicalDetail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="font-bold text-slate-300">تحلیل تاثیر روی سیستم (Impact Analysis):</div>
                    <p className="leading-relaxed">{currentReport.impactAnalysis}</p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab('patch')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
                    >
                      <span>مشاهده پچ پیشنهادی</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Patch Suggestion & Unified Diff */}
              {activeTab === 'patch' && (
                <div className="p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[11px]">فایل هدف:</div>
                      <div className="font-mono text-cyan-300 font-bold">
                        {currentReport.suggestedPatch.fileTarget}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                        ریسک تخریب: {currentReport.suggestedPatch.riskScore}/۱۰ (بسیار پایین)
                      </span>
                      <button
                        onClick={() => handleCopy(currentReport.suggestedPatch.unifiedDiff, 'diff')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors border border-slate-700"
                      >
                        {copiedDiff ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedDiff ? 'کپی شد' : 'کپی Diff'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {currentReport.suggestedPatch.explanation}
                  </p>

                  {/* Unified Diff View */}
                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-x-auto max-h-56 overflow-y-auto" dir="ltr">
                    <pre className="leading-relaxed">
                      {currentReport.suggestedPatch.unifiedDiff.split('\n').map((line, idx) => {
                        let colorClass = 'text-slate-300';
                        if (line.startsWith('+') && !line.startsWith('+++')) colorClass = 'text-emerald-400 bg-emerald-950/30';
                        if (line.startsWith('-') && !line.startsWith('---')) colorClass = 'text-rose-400 bg-rose-950/30';
                        if (line.startsWith('@@')) colorClass = 'text-cyan-400 font-bold';
                        return (
                          <div key={idx} className={colorClass}>
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>

                  {/* Human Approval Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      * پچ در محیط اصلی اجرا نمی‌شود؛ تنها پس از آزمون در Sandbox و تایید شما به گیت فرستاده خواهد شد.
                    </div>
                    <button
                      onClick={handleApprovePatchAndRunSandbox}
                      disabled={sandboxRunning}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      <span>تأیید پچ و اجرای خودکار در Sandbox</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Regression Test Case */}
              {activeTab === 'test' && (
                <div className="p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[11px]">نام تست رگرسیون تکرارپذیر:</div>
                      <div className="font-mono text-cyan-300 font-bold">
                        {currentReport.regressionTestCase.testName} ({currentReport.regressionTestCase.framework})
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(currentReport.regressionTestCase.testCode, 'test')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors border border-slate-700"
                    >
                      {copiedTest ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedTest ? 'کپی شد' : 'کپی کد تست'}</span>
                    </button>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-60 overflow-y-auto" dir="ltr">
                    <pre className="leading-relaxed">
                      <code>{currentReport.regressionTestCase.testCode}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab 4: Sandbox Isolated Runner */}
              {activeTab === 'sandbox' && (
                <div className="p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-purple-400" />
                      <span className="font-bold text-slate-100">محیط آزمون ایزوله (Sandbox Verification Runner)</span>
                    </div>

                    {sandboxSuccess && (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-mono">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>پچ تایید شد و تست‌ها موفقیت‌آمیز بودند</span>
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 max-h-64 overflow-y-auto space-y-1.5" dir="ltr">
                    {sandboxLogs.length === 0 ? (
                      <div className="text-slate-500">برای اجرای آزمون روی دکمه «تأیید پچ و اجرای خودکار در Sandbox» کلیک کنید...</div>
                    ) : (
                      sandboxLogs.map((log, idx) => (
                        <div key={idx} className={log.includes('PASSED') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                          {log}
                        </div>
                      ))
                    )}
                    {sandboxRunning && (
                      <div className="text-purple-400 animate-pulse">&gt; Running sandbox containers...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-3">
              <Sparkles className="h-8 w-8 text-purple-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">تحلیلی برای این خطا یافت نشد</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                روی دکمه «تحلیل عمیق با DeepSeek LLM» کلیک کنید تا لاگ پالایش‌شده برای مدل ارسال شده و گزارش تشخیصی دریافت شود.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
