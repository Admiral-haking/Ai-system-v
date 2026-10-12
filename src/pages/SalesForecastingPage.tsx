import React, { useState } from 'react';
import {
  LineChart,
  Calendar,
  Layers,
  Cpu,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { generateDailySales, FORECAST_MODELS } from '../data/mockData';
import { ForecastHorizon, ForecastModelType } from '../types';

export const SalesForecastingPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ForecastModelType>('xgboost');
  const [horizon, setHorizon] = useState<ForecastHorizon>(30);
  const [showConfidence, setShowConfidence] = useState(true);

  // Model details from master registry
  const currentModelInfo = React.useMemo(() => {
    return (
      FORECAST_MODELS.find((m) => m.id.includes(selectedModel.split('_')[0])) ||
      FORECAST_MODELS[0]
    );
  }, [selectedModel]);

  // Generate sales forecast series dynamically based on model and horizon
  const salesData = React.useMemo(() => {
    const raw = generateDailySales(selectedModel, horizon);
    return raw.map((item) => ({
      date: item.date.slice(5),
      fullDate: item.date,
      'فروش واقعی': item.actualSales > 0 ? Number((item.actualSales / 1000000).toFixed(2)) : null,
      'پیش‌بینی مدل': Number((item.predictedSales / 1000000).toFixed(2)),
      'حد بالای اطمینان ۹۵٪': Number((item.upperBound / 1000000).toFixed(2)),
      'حد پایین اطمینان ۹۵٪': Number((item.lowerBound / 1000000).toFixed(2)),
      isForecast: item.isForecast,
    }));
  }, [selectedModel, horizon]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-cyan-400" />
            <span>ماژول پیش‌بینی فروش و تقاضا با الگوریتم‌های سری زمانی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مقایسه الگوریتم‌های رگرسیون، اعمال پنجره‌های بازگشتی (Rolling-Origin) و ارزیابی با خطای WAPE
          </p>
        </div>

        {/* Horizon selector button tabs */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">افق پیش‌بینی (Horizon):</span>
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            {([7, 14, 30] as ForecastHorizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1 rounded transition-colors font-medium ${
                  horizon === h
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h} روزه
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'xgboost' as ForecastModelType,
            title: 'XGBoost Regressor',
            sub: 'بهینه‌سازی شده با Optuna (مدل تولید)',
            wape: '۴.۸۲٪',
            isBest: true,
          },
          {
            id: 'random_forest' as ForecastModelType,
            title: 'Random Forest',
            sub: 'جنگل تصادفی (۲۰۰ درخت تصمیم)',
            wape: '۶.۷۵٪',
            isBest: false,
          },
          {
            id: 'linear_regression' as ForecastModelType,
            title: 'Ridge Linear Reg',
            sub: 'رگرسیون خطی قانونمند L2',
            wape: '۱۳.۸٪',
            isBest: false,
          },
          {
            id: 'seasonal_naive' as ForecastModelType,
            title: 'Seasonal Naive',
            sub: 'پایه مقایسه (انتقال دوره ۷ روز قبل)',
            wape: '۱۸.۹٪',
            isBest: false,
          },
        ].map((algo) => (
          <button
            key={algo.id}
            onClick={() => setSelectedModel(algo.id)}
            className={`p-3.5 rounded-xl text-right transition-all border ${
              selectedModel === algo.id
                ? 'bg-cyan-500/10 border-cyan-500 text-slate-100 shadow-md ring-1 ring-cyan-500/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{algo.title}</span>
              {algo.isBest && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                  برترین دقت
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{algo.sub}</div>
            <div className="mt-2 text-sm font-mono font-bold text-cyan-400">
              خطای WAPE: {algo.wape}
            </div>
          </button>
        ))}
      </div>

      {/* Main Forecast Chart with Confidence Band */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>پیش‌بینی مقادیر فروش برای افق {horizon} روز آینده (میلیون تومان)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ترسیم مقادیر واقعی ۴۵ روز اخیر + امتداد پیش‌بینی با الگوریتم {currentModelInfo.name}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showConfidence}
                onChange={(e) => setShowConfidence(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
              />
              <span>نمایش فواصل اطمینان ۹۵٪</span>
            </label>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span>فروش گذشته</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
              <span>پیش‌بینی آینده</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="futureSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ciBandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" م" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  direction: 'rtl',
                }}
              />
              {showConfidence && (
                <Area
                  type="monotone"
                  dataKey="حد بالای اطمینان ۹۵٪"
                  stroke="transparent"
                  fill="url(#ciBandGrad)"
                />
              )}
              {showConfidence && (
                <Area
                  type="monotone"
                  dataKey="حد پایین اطمینان ۹۵٪"
                  stroke="transparent"
                  fill="transparent"
                />
              )}
              <Area
                type="monotone"
                dataKey="فروش واقعی"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#actualSalesGrad)"
                dot={{ r: 2, fill: '#06b6d4' }}
              />
              <Area
                type="monotone"
                dataKey="پیش‌بینی مدل"
                stroke="#818cf8"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                fill="url(#futureSalesGrad)"
                dot={{ r: 3, fill: '#818cf8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table & Scientific Formula Definition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Evaluation Metric Cards */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>شاخص‌های ارزیابی (Out-of-Time Test Set)</span>
            <span className="font-mono text-cyan-400">{currentModelInfo.version}</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="text-slate-400">خطای وزنی (WAPE)</div>
              <div className="text-lg font-black font-mono text-emerald-400 mt-1">
                {currentModelInfo.wape}٪
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="text-slate-400">ضریب تبیین (R²)</div>
              <div className="text-lg font-black font-mono text-cyan-400 mt-1">
                {currentModelInfo.r2}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="text-slate-400">ریشه خطای مربعات (RMSE)</div>
              <div className="text-xs font-black font-mono text-slate-200 mt-1">
                {(currentModelInfo.rmse / 1000000).toFixed(2)} م تومان
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="text-slate-400">تاخیر استنتاج (Latency)</div>
              <div className="text-xs font-black font-mono text-slate-200 mt-1">
                {currentModelInfo.inferenceLatencyMs} میلی‌ثانیه
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            تعداد ویژگی‌های استفاده شده: <strong className="text-slate-200 font-mono">{currentModelInfo.featuresUsed} متغیر</strong> (شامل متغیرهای تاخیری ۱ تا ۲۸ روزه و میانگین‌های متحرک).
          </div>
        </div>

        {/* Scientific Rationale for Thesis Examiners */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Info className="h-4 w-4 text-cyan-400" />
            <span>ملاحظات روش‌شناسی پایان‌نامه: پیشگیری از نشت اطلاعات (Data Leakage)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            در این سیستم، تمام ویژگی‌های سری زمانی با شیفت یک‌روزه (<code>shift(1)</code>) ساخته شده‌اند. 
            برای پیش‌بینی روز t، تنها داده‌های روزهای t-1 و قبل‌تر در پنجره متحرک و ویژگی‌های تاخیری محاسبه می‌شوند.
          </p>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
            <div># فرمول محاسبه شاخص WAPE برای جلوگیری از خطای تقسیم بر صفر:</div>
            <div className="text-emerald-400">WAPE = ( ∑ | y_true - y_pred | / ∑ y_true ) × 100</div>
          </div>
          <p className="text-[11px] text-slate-400">
            روش ارزیابی: ارزیابی با ۶ پنجره زمانی مستقل به روش <strong>Rolling-Origin Backtesting</strong> بدون مخلوط‌سازی تصادفی (No Shuffle) تایید شده است.
          </p>
        </div>
      </div>
    </div>
  );
};
