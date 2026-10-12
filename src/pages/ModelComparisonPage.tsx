import React from 'react';
import {
  Scale,
  Award,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { FORECAST_MODELS, REPEAT_PURCHASE_MODELS } from '../data/mockData';

export const ModelComparisonPage: React.FC = () => {
  // Chart data comparing WAPE error across models
  const errorChartData = [
    { name: 'XGBoost (Optuna)', wape: 4.82, color: '#10b981' },
    { name: 'Random Forest', wape: 6.75, color: '#06b6d4' },
    { name: 'Ridge Regression', wape: 13.8, color: '#f59e0b' },
    { name: 'Seasonal Naive', wape: 18.9, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Scale className="h-5 w-5 text-cyan-400" />
            <span>مقایسه علمی و اعتبارسنجی مستقل الگوریتم‌های هوش مصنوعی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            جدول نتایج تجربی پایان‌نامه بر روی مجموعه داده آزمون مستقل بدون دست‌خوردگی (Out-of-Time Test Set)
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          کاهش ۷۴.۵٪ خطای WAPE نسبت به مدل مبنا
        </div>
      </div>

      {/* Main Table: Sales Forecasting Models */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">
            جدول مقایسه‌ای الگوریتم‌های پیش‌بینی تقاضا و فروش روزانه
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            آزمون Rolling-Origin Backtesting · ۶ پنجره مستقل
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">مدل الگوریتمی</th>
                <th className="py-3 px-4">نوع معماری</th>
                <th className="py-3 px-4">خطای WAPE (٪)</th>
                <th className="py-3 px-4">ریشه میانگین مربعات (RMSE)</th>
                <th className="py-3 px-4">خطای مطلق (MAE)</th>
                <th className="py-3 px-4">ضریب تبیین (R²)</th>
                <th className="py-3 px-4">زمان آموزش (s)</th>
                <th className="py-3 px-4">تاخیر استنتاج (ms)</th>
                <th className="py-3 px-4">وضعیت سامانه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {FORECAST_MODELS.map((m) => (
                <tr
                  key={m.id}
                  className={`hover:bg-slate-800/30 transition-colors ${
                    m.status === 'production' ? 'bg-cyan-500/5 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      {m.status === 'production' && <Award className="h-3.5 w-3.5 text-emerald-400" />}
                      <span>{m.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.version}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{m.type}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span className={m.wape < 6 ? 'text-emerald-400 text-sm' : m.wape < 10 ? 'text-cyan-400' : 'text-slate-300'}>
                      {m.wape}٪
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{(m.rmse / 1000000).toFixed(2)} م</td>
                  <td className="py-3 px-4 font-mono">{(m.mae / 1000000).toFixed(2)} م</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">{m.r2}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{m.trainingTimeSec}s</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{m.inferenceLatencyMs}ms</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'production'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : m.status === 'candidate'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status === 'production' ? 'مدل فعال تولید' : m.status === 'candidate' ? 'کاندید ذخیره' : 'آرشیو شده'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Grid: WAPE Error Comparison Bar & Repeat Purchase Classifier Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WAPE Bar Comparison */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
            نمودار مقایسه شاخص خطای WAPE (درصد کمتر = دقت بالاتر)
          </h3>
          <p className="text-xs text-slate-400">
            برتری محسوس گرادیان بوستینگ غیرخطی بر پایه‌های خطی و هیوریستیک
          </p>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="٪" />
                <Tooltip
                  formatter={(value: any) => [`${value}٪`, 'خطای WAPE']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Bar dataKey="wape" radius={[4, 4, 0, 0]}>
                  {errorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repeat Purchase Classifiers Comparison */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
            مقایسه الگوریتم‌های طبقه‌بندی خرید مجدد (Supervised Classifier)
          </h3>
          <p className="text-xs text-slate-400">
            معیارهای تفکیک برای کلاس نامتوازن و کالیبراسیون احتمال
          </p>
          <div className="space-y-3 pt-1">
            {REPEAT_PURCHASE_MODELS.map((clf, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{clf.modelName}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ROC-AUC: {clf.rocAuc}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-slate-400 pt-1">
                  <div className="p-1 rounded bg-slate-900">PR-AUC: {clf.prAuc}</div>
                  <div className="p-1 rounded bg-slate-900">F1: {clf.f1Score}</div>
                  <div className="p-1 rounded bg-slate-900">دقت: {clf.precision}</div>
                  <div className="p-1 rounded bg-slate-900">Brier: {clf.brierScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reproducibility Box */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3 text-xs text-slate-300">
        <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-100 block mb-1">تضمین تکرارپذیری علمی (Scientific Reproducibility):</strong>
          تمامی آزمایش‌ها با بذر تصادفی ثابت (<code>random_state = 42</code>)، محیط مجازی Python 3.12، 
          نسخه XGBoost 2.1.1 و Scikit-learn 1.5.0 اجرا شده‌اند. پارامترهای هر اجرا در سرور MLflow ثبت و به صورت هش SHA256 امضا شده‌اند.
        </div>
      </div>
    </div>
  );
};
