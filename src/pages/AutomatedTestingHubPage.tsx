import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Clock,
  Terminal,
  Activity,
  Award,
  Layers,
  FileCode,
  Lock,
  Cpu,
} from 'lucide-react';
import { TEST_SUITE_REGISTRY, QUALITY_GATE_METRICS } from '../data/mockData';
import { TestSuiteRegistryItem, QualityGateMetrics } from '../types';

export const AutomatedTestingHubPage: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuiteRegistryItem[]>(TEST_SUITE_REGISTRY);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [runningSuiteId, setRunningSuiteId] = useState<string | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<TestSuiteRegistryItem>(TEST_SUITE_REGISTRY[0]);

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    setTestLogs([
      `[CI/CD] آغاز خط‌لوله اعتبارسنجی کیفیت و تست‌های سرتاسری پروژه...`,
      `[ENVIRONMENT] لود کردن متغیرهای تست در کانتینر ایزوله تست لینوکس...`,
    ]);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < testSuites.length) {
        const suite = testSuites[idx];
        setRunningSuiteId(suite.id);
        setTestLogs((prev) => [
          ...prev,
          `[RUNNING] ${suite.framework.toUpperCase()}: ${suite.name} (${suite.totalTests} تست)...`,
          `[RESULT] ${suite.name} -> ${suite.totalTests} passed in ${(suite.durationMs / 1000).toFixed(2)}s (100% OK)`,
        ]);
        idx++;
      } else {
        clearInterval(interval);
        setRunningSuiteId(null);
        setIsRunningAll(false);
        setTestLogs((prev) => [
          ...prev,
          `[COVERAGE] پوشش کد کلی: ۸۸.۴٪ (فراتر از تارگت ۸۵٪).`,
          `[GATE] کلیه گیت‌های کیفی Release Gate تایید شدند: آماده انتشار در تولید (Production-Ready).`,
        ]);
      }
    }, 500);
  };

  const totalTestsCount = testSuites.reduce((acc, s) => acc + s.totalTests, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
              AUTOMATED TESTING & QUALITY ENGINEERING PLATFORM (PHASE 5)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              مرکز مدیریت آزمون‌های خودکار و دروازه کنترل کیفیت انتشار (Quality Gates)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              اجرا و رصد همزمان تست‌های واحد، تست‌های ایزولاسیون داده مستاجران (Tenant Isolation RLS)، 
              تست‌های چرخه مالی، تست‌های بار k6 با ۵۰۰ کاربر همزمان، و خط لوله تست مرورگر Playwright.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className="flex items-center gap-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {isRunningAll ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span>در حال اجرای کلیه تست‌ها...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>اجرای تمامی مجموعه‌تست‌ها (Run All Suites)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quality Gate Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-slate-400">پوشش کل کدها (Code Coverage):</div>
          <div className="text-lg font-black font-mono text-emerald-400 flex items-center justify-between">
            <span>{QUALITY_GATE_METRICS.totalCoveragePct}%</span>
            <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">
              تارگت &gt; ۸۵٪
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-slate-400">تست تفکیک داده مستاجران (RLS):</div>
          <div className="text-lg font-black font-mono text-emerald-400 flex items-center justify-between">
            <span>Pass (100%)</span>
            <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">
              Zero Leakage
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-slate-400">تست انطباق مالی و وب‌هوک زرین‌پال:</div>
          <div className="text-lg font-black font-mono text-emerald-400 flex items-center justify-between">
            <span>Pass (Idempotent)</span>
            <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">
              Reconciled
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-slate-400">دروازه نهایی انتشار (Release Gate):</div>
          <div className="text-lg font-black font-mono text-cyan-400 flex items-center justify-between">
            <span>APPROVED</span>
            <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-300">
              Ready for Prod
            </span>
          </div>
        </div>
      </div>

      {/* Test Suites Register & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test Suites List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-400" />
              <span>مجموعه‌تست‌های رجیسترشده در سیستم ({totalTestsCount} تست):</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">۷ مجموعه رسمی</span>
          </div>

          <div className="space-y-2.5">
            {testSuites.map((suite) => {
              const isRunning = runningSuiteId === suite.id;
              const isSelected = selectedSuite.id === suite.id;
              return (
                <div
                  key={suite.id}
                  onClick={() => setSelectedSuite(suite)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/60 border-teal-500/60 shadow ring-1 ring-teal-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100 font-sans">{suite.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                        {suite.framework}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {suite.totalTests} تست · زمان اجرا: {(suite.durationMs / 1000).toFixed(2)}s · آخرین اجرا: {suite.lastRun}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRunning ? (
                      <span className="text-xs text-teal-400 font-mono animate-pulse">Running...</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>PASSED</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Test Execution Terminal (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 shadow-inner flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
                <Terminal className="h-4 w-4" />
                <span>کنسول اجرای لایو CI/CD و تست‌های لینوکس</span>
              </div>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-slate-300 max-h-80 overflow-y-auto" dir="ltr">
              {testLogs.length === 0 ? (
                <div className="text-slate-500">برای اجرای خودکار روی دکمه «اجرای تمامی مجموعه‌تست‌ها» کلیک کنید...</div>
              ) : (
                testLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('PASSED') || log.includes('100% OK') || log.includes('APPROVED') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {log}
                  </div>
                ))
              )}
              {isRunningAll && (
                <div className="text-teal-400 animate-pulse">&gt; Executing test workers...</div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>محیط: Linux Debian x86_64</span>
            <span>ایزولاسیون: Docker Container</span>
          </div>
        </div>
      </div>
    </div>
  );
};
