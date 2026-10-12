import React, { useState } from 'react';
import {
  GitPullRequest,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Zap,
  TrendingDown,
  ShieldCheck,
  Activity,
  Layers,
  Terminal,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DRIFT_METRICS, CURRENT_CANARY_STATE } from '../data/mockData';
import { DriftMetric, CanaryDeployment } from '../types';

export const AutonomousMlopsPage: React.FC = () => {
  const [driftMetrics, setDriftMetrics] = useState<DriftMetric[]>(DRIFT_METRICS);
  const [canary, setCanary] = useState<CanaryDeployment>(CURRENT_CANARY_STATE);
  const [canaryTraffic, setCanaryTraffic] = useState<number>(20);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  const handleTrafficChange = (newVal: number) => {
    setCanaryTraffic(newVal);
    setCanary((prev) => ({ ...prev, trafficPercentage: newVal }));
  };

  const handleTriggerRetraining = () => {
    setIsRetraining(true);
    setAlertNotice('خط لوله آموزش مجدد خودکار با نمونه‌بردار Optuna در صف کارگر Celery قرار گرفت...');

    setTimeout(() => {
      setIsRetraining(false);
      setDriftMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          psiScore: Number((m.psiScore * 0.4).toFixed(3)),
          status: 'stable',
        }))
      );
      setAlertNotice('مدل جدید با موفقیت آموزش دید و شاخص‌های رانش به محدوده کاملاً پایدار بازگشتند.');
      setTimeout(() => setAlertNotice(null), 5000);
    }, 2000);
  };

  const handleRollback = () => {
    setCanaryTraffic(0);
    setCanary((prev) => ({
      ...prev,
      trafficPercentage: 0,
      canaryHealth: 'ROLLING_BACK',
    }));
    setAlertNotice('عملیات بازگشت ایمن (Rollback) اجرا شد. ۱۰۰٪ ترافیک به مدل پایدار قبلی (Champion) بازگردانده شد.');
    setTimeout(() => setAlertNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 5 · عملیات خودکار هوش مصنوعی و چرخه حیات مدل (Autonomous MLOps)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-cyan-400" />
            <span>پایش رانش داده‌ها (Drift)، استقرار قناری (Canary) و بازگشت خودکار</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تشخیص تغییر توزیع آماری ورودی‌ها با آزمون KS و PSI، استقرار سایه‌ای (Shadow) و آزمون رقابت مدل‌ها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerRetraining}
            disabled={isRetraining}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'در حال آموزش مجدد...' : 'آموزش خودکار مدل جدید'}</span>
          </button>
        </div>
      </div>

      {alertNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>{alertNotice}</span>
        </div>
      )}

      {/* Canary Deployment & Champion/Challenger Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>استقرار قناری (Canary Rollout) و مسابقه قهرمان در برابر مدعی (Champion vs Challenger)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              هدایت درصدی از ترافیک زنده استنتاج به مدل کاندید جهت تایید پایداری عملیاتی قبل از ترویج کامل
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRollback}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>بازگشت اضطراری (Rollback)</span>
            </button>
          </div>
        </div>

        {/* Traffic Split Slider */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">
              مدل تولید مستقر (Champion: XGBoost v3.2):{' '}
              <strong className="text-emerald-400 font-mono">{100 - canaryTraffic}٪ ترافیک</strong>
            </span>
            <span className="text-slate-300">
              مدل کاندید قناری (Challenger: XGBoost v3.3-rc1):{' '}
              <strong className="text-cyan-400 font-mono">{canaryTraffic}٪ ترافیک</strong>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={canaryTraffic}
            onChange={(e) => handleTrafficChange(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>۰٪ (تمام ترافیک روی مدل اصلی)</span>
            <span>۵۰٪ (آزمون A/B همسان)</span>
            <span>۱۰۰٪ (ارتقای کامل به نسخه جدید)</span>
          </div>
        </div>

        {/* Comparison Cards for Champion vs Challenger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">مدل قهرمان خط تولید (Champion Model)</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                نسخه v3.2.0
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center font-mono pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">خطای WAPE تولید</div>
                <div className="text-emerald-400 font-bold mt-0.5">۴.۸۲٪</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">تاخیر میانگین P95</div>
                <div className="text-slate-200 font-bold mt-0.5">۱۴.۲ میلی‌ثانیه</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-200">مدل کاندید قناری (Canary Challenger)</span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                نسخه v3.3.0-rc1
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center font-mono pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">خطای WAPE آزمایشی</div>
                <div className="text-cyan-400 font-bold mt-0.5">۴.۶۸٪ (بهبود یافته)</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">بودجه خطا (Error Budget)</div>
                <div className="text-emerald-400 font-bold mt-0.5">۹۸.۴٪ باقی‌مانده</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drift Detection Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>پایش رانش توزیع آماری داده‌ها (Data Drift & Concept Drift Monitoring)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              مقایسه توزیع استنتاج ۳۰ روز اخیر با توزیع مرجع آموزش با شاخص PSI و آزمون کلموگروف-اسمیرنوف (KS-Test)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">آستانه هشدار: PSI &gt; ۰.۱۰</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">نام متغیر ورودی</th>
                <th className="py-2.5 px-3">نوع رانش</th>
                <th className="py-2.5 px-3">شاخص پایداری (PSI)</th>
                <th className="py-2.5 px-3">آزمون KS (p-value)</th>
                <th className="py-2.5 px-3">میانگین خط پایه (Train)</th>
                <th className="py-2.5 px-3">میانگین کنونی (Live)</th>
                <th className="py-2.5 px-3">وضعیت پایش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {driftMetrics.map((dm) => (
                <tr key={dm.featureName} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3">
                    <div className="font-bold font-sans text-slate-200">{dm.faLabel}</div>
                    <div className="text-[10px] text-slate-400">{dm.featureName}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {dm.driftType === 'data_drift' ? 'رانش داده ورودی' : 'رانش مفهوم (Concept)'}
                  </td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={dm.psiScore > 0.1 ? 'text-amber-400' : 'text-emerald-400'}>
                      {dm.psiScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{dm.ksPValue}</td>
                  <td className="py-2.5 px-3 text-slate-400">{dm.baselineMean.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-slate-200">{dm.currentMean.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dm.status === 'stable'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {dm.status === 'stable' ? 'پایدار' : 'هشدار رانش (Warning)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
