import React, { useState } from 'react';
import {
  Repeat,
  Target,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { REPEAT_PURCHASE_MODELS } from '../data/mockData';

export const RepeatPurchasePage: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(0.5);
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);

  const selectedModel = REPEAT_PURCHASE_MODELS[selectedModelIdx];

  // Simulated ROC curve data for XGBoost vs Random Forest vs Baseline
  const rocCurveData = [
    { fpr: 0.0, xgbTpr: 0.0, rfTpr: 0.0, baseline: 0.0 },
    { fpr: 0.05, xgbTpr: 0.42, rfTpr: 0.35, baseline: 0.05 },
    { fpr: 0.1, xgbTpr: 0.68, rfTpr: 0.58, baseline: 0.1 },
    { fpr: 0.15, xgbTpr: 0.79, rfTpr: 0.71, baseline: 0.15 },
    { fpr: 0.2, xgbTpr: 0.85, rfTpr: 0.78, baseline: 0.2 },
    { fpr: 0.3, xgbTpr: 0.91, rfTpr: 0.86, baseline: 0.3 },
    { fpr: 0.4, xgbTpr: 0.94, rfTpr: 0.9, baseline: 0.4 },
    { fpr: 0.6, xgbTpr: 0.97, rfTpr: 0.95, baseline: 0.6 },
    { fpr: 0.8, xgbTpr: 0.99, rfTpr: 0.98, baseline: 0.8 },
    { fpr: 1.0, xgbTpr: 1.0, rfTpr: 1.0, baseline: 1.0 },
  ];

  // Dynamic confusion matrix based on chosen decision threshold
  const totalTestSamples = 1000;
  const actualPositives = 320; // 32% purchase recurrence
  const actualNegatives = 680;

  // Sensitivity shifts as threshold changes
  const tp = Math.round(actualPositives * Math.max(0.2, 1 - threshold * 0.9));
  const fn = actualPositives - tp;
  const fp = Math.round(actualNegatives * Math.max(0.02, 0.45 * (1 - threshold)));
  const tn = actualNegatives - fp;

  const currentPrecision = tp / (tp + fp);
  const currentRecall = tp / (tp + fn);
  const currentF1 = (2 * currentPrecision * currentRecall) / (currentPrecision + currentRecall);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Repeat className="h-5 w-5 text-cyan-400" />
            <span>پیش‌بینی نظارت‌شده احتمال خرید مجدد در افق ۳۰ روزه</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            طبقه‌بندی دودویی مشتریان، رفع عدم توازن داده‌ها با scale_pos_weight و ارزیابی ماتریس درهم‌ریختگی
          </p>
        </div>

        {/* Model switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
          {REPEAT_PURCHASE_MODELS.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedModelIdx(idx)}
              className={`px-3 py-1.5 rounded transition-colors font-medium ${
                selectedModelIdx === idx
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.modelName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">شاخص ROC-AUC</div>
          <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">
            {selectedModel.rocAuc}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">قدرت تفکیک عالی دو کلاس</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">شاخص PR-AUC</div>
          <div className="mt-1 text-2xl font-black text-cyan-400 font-mono">
            {selectedModel.prAuc}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">ارزیابی برتر برای کلاس نامتوازن</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">شاخص F1-Score</div>
          <div className="mt-1 text-2xl font-black text-indigo-400 font-mono">
            {selectedModel.f1Score}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">تعادل میان دقت (Precision) و بازخوانی</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">امتیاز برایر (Brier Score)</div>
          <div className="mt-1 text-2xl font-black text-amber-400 font-mono">
            {selectedModel.brierScore}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">نشان‌دهنده کالیبره بودن احتمالات</div>
        </div>
      </div>

      {/* Main Grid: Interactive Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix with Interactive Threshold Slider */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>ماتریس درهم‌ریختگی (Confusion Matrix) تعاملی</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تغییر آستانه تصمیم‌گیری (Decision Threshold) جهت تنظیم حساسیت کمپین
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              آستانه: <strong>{threshold.toFixed(2)}</strong>
            </div>
          </div>

          {/* Threshold Slider */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs text-slate-300">
              <span>آستانه پذیرش احتمال پیش‌بینی:</span>
              <span className="font-mono font-bold text-cyan-400">
                {(threshold * 100).toFixed(0)}٪
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>۰.۲۰ (حساسیت بالا، فراخوانی حداکثری)</span>
              <span>۰.۸۰ (دقت بسیار بالا، کاهش هشدارهای کاذب)</span>
            </div>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[11px] text-emerald-400 font-bold">
                مثبت واقعی (True Positive)
              </div>
              <div className="mt-1 text-2xl font-black text-emerald-300 font-mono">{tp}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">مشتریانی که بازگشتند و پیش‌بینی شدند</div>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <div className="text-[11px] text-rose-400 font-bold">
                مثبت کاذب (False Positive)
              </div>
              <div className="mt-1 text-2xl font-black text-rose-300 font-mono">{fp}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">پیش‌بینی بازگشت ولی خرید نکردند</div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="text-[11px] text-amber-400 font-bold">
                منفی کاذب (False Negative)
              </div>
              <div className="mt-1 text-2xl font-black text-amber-300 font-mono">{fn}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">بازگشتند اما مدل تشخیص نداد</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-[11px] text-slate-300 font-bold">
                منفی واقعی (True Negative)
              </div>
              <div className="mt-1 text-2xl font-black text-slate-200 font-mono">{tn}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">به درستی عدم بازگشت تشخیص داده شد</div>
            </div>
          </div>

          <div className="flex items-center justify-around p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono">
            <div>
              دقت (Precision): <strong className="text-cyan-400">{(currentPrecision * 100).toFixed(1)}٪</strong>
            </div>
            <div>
              بازخوانی (Recall): <strong className="text-emerald-400">{(currentRecall * 100).toFixed(1)}٪</strong>
            </div>
            <div>
              شاخص F1: <strong className="text-indigo-400">{(currentF1 * 100).toFixed(1)}٪</strong>
            </div>
          </div>
        </div>

        {/* ROC Curve Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                منحنی مشخصه عملکرد سیستم (ROC Curve)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                نرخ مثبت واقعی (TPR) در برابر نرخ مثبت کاذب (FPR)
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400">AUC: ۰.۸۹۲</div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'FPR (نرخ مثبت کاذب)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'TPR (حساسیت)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="xgbTpr"
                  name="XGBoost Classifier (AUC=0.892)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                />
                <Line
                  type="monotone"
                  dataKey="rfTpr"
                  name="Random Forest (AUC=0.865)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="شیر یا خط تصادفی (AUC=0.5)"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-cyan-400">تذکر علمی پایان‌نامه:</strong> خروجی مدل یک برآورد احتمالاتی کالیبره‌شده است (نه قطعیت تضمینی). تصمیمات تجاری باید بر مبنای هزینه تخفیف در برابر ارزش مشتری اتخاذ گردد.
          </div>
        </div>
      </div>
    </div>
  );
};
