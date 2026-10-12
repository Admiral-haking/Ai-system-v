import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  BarChart2,
  Info,
  CheckCircle2,
  Award,
  User,
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
import { SHAP_FEATURES } from '../data/mockData';

export const ExplainableAiPage: React.FC = () => {
  const [selectedCustomerCase, setSelectedCustomerCase] = useState<'high_value' | 'at_risk'>('high_value');

  // Global feature importance chart data
  const globalChartData = React.useMemo(() => {
    return SHAP_FEATURES.map((f) => ({
      name: f.faLabel,
      featureKey: f.feature,
      meanAbsShap: f.meanAbsShap,
      correlation: f.correlation,
      color: f.correlation === 'positive' ? '#06b6d4' : '#f43f5e',
    }));
  }, []);

  // Local Waterfall Breakdown for selected case
  const waterfallData = React.useMemo(() => {
    if (selectedCustomerCase === 'high_value') {
      return {
        customerName: 'فروشگاه پخش آریا (مشتری طلایی)',
        baseValue: 18.5, // Base expected value (million)
        prediction: 28.2,
        contributions: [
          { feature: 'فروش هفت روز گذشته (Lag 7)', delta: +4.8, isPositive: true },
          { feature: 'تازگی خرید بالا (Recency=3 روز)', delta: +3.2, isPositive: true },
          { feature: 'میانگین متحرک ۱۴ روزه', delta: +2.1, isPositive: true },
          { feature: 'بسامد خرید بالا (Frequency=34)', delta: +1.4, isPositive: true },
          { feature: 'روز غیرتعطیل کاری', delta: +0.6, isPositive: true },
          { feature: 'میانگین قیمت متوسط اقلام', delta: -2.4, isPositive: false },
        ],
      };
    } else {
      return {
        customerName: 'تجهیزات صنعتی رادمهر (مشتری در معرض ریزش)',
        baseValue: 18.5,
        prediction: 7.9,
        contributions: [
          { feature: 'عدم ثبت سفارش طولانی (Recency=122 روز)', delta: -5.4, isPositive: false },
          { feature: 'کاهش شدید فروش هفته گذشته', delta: -3.8, isPositive: false },
          { feature: 'بسامد خرید پایین (تنها ۳ سفارش)', delta: -2.2, isPositive: false },
          { feature: 'افت میانگین متحرک سفارشات', delta: -1.6, isPositive: false },
          { feature: 'تعطیلی تقویمی', delta: -0.8, isPositive: false },
          { feature: 'ثبت سبد گران‌قیمت قبلی', delta: +3.2, isPositive: true },
        ],
      };
    }
  }, [selectedCustomerCase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span>ماژول توضیح‌پذیری هوش مصنوعی با مقادیر SHAP</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تبیین تصمیمات جعبه سیاه مدل بر پایه نظریه بازی‌های همیارانه و ارزش شپلی (Shapley Values)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">سناریوی تبیین محلی:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedCustomerCase('high_value')}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                selectedCustomerCase === 'high_value'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مشتری با پیش‌بینی بالا
            </button>
            <button
              onClick={() => setSelectedCustomerCase('at_risk')}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                selectedCustomerCase === 'at_risk'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مشتری در معرض ریزش
            </button>
          </div>
        </div>
      </div>

      {/* Global Feature Importance Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-cyan-400" />
              <span>اهمیت سراسری ویژگی‌ها (Global Feature Importance — Mean |SHAP|)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              میانگین قدر مطلق مقادیر SHAP در کل مجموعه داده؛ رنگ فیروزه‌ای اثر افزایشی و قرمز اثر کاهشی دارد.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-3 w-3 rounded bg-cyan-500"></span>
              همبستگی مثبت با تقاضا
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-3 w-3 rounded bg-rose-500"></span>
              همبستگی معکوس / کاهنده
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={globalChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                width={180}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '11px',
                  direction: 'rtl',
                }}
              />
              <Bar dataKey="meanAbsShap" name="میانگین سهم SHAP" radius={[0, 4, 4, 0]}>
                {globalChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Local Prediction Waterfall Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                <span>تبیین محلی تک‌پیش‌بینی (Local Waterfall Explanation)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{waterfallData.customerName}</p>
            </div>
            <div className="text-xs font-mono">
              پیش‌بینی نهایی: <strong className="text-emerald-400">{waterfallData.prediction} م</strong>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center font-mono">
            <span className="text-slate-400">میانگین مورد انتظار پایه (E[f(x)]):</span>
            <span className="text-slate-200 font-bold">{waterfallData.baseValue} میلیون تومان</span>
          </div>

          <div className="space-y-2.5">
            {waterfallData.contributions.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  {c.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-rose-400 shrink-0" />
                  )}
                  <span className="text-slate-200 truncate">{c.feature}</span>
                </div>
                <div className="font-mono font-bold shrink-0">
                  <span className={c.isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                    {c.delta > 0 ? `+${c.delta}` : c.delta} م تومان
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theoretical Justification for Thesis Examination */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Info className="h-4 w-4 text-cyan-400" />
              <span>مبانی ریاضی ارزش شپلی (Shapley Values) در جلسه دفاع</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-3">
              بر خلاف معیارهای متداول مانند Gini Importance در رندوم فارست که دچار تورش شدید هستند، 
              روش SHAP چهار اصل موضوعه ریاضی را تضمین می‌نماید:
            </p>
            <ul className="text-xs text-slate-300 space-y-2.5 mt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>خاصیت کارایی (Efficiency):</strong> مجموع سهم تک‌تک ویژگی‌ها دقیقاً برابر با تفاضل پیش‌بینی مدل از میانگین جامعه است.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>تقارن (Symmetry):</strong> دو متغیر با سهم مساوی در تمام ائتلاف‌ها ارزش شپلی یکسانی دریافت می‌کنند.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>جمع‌پذیری (Additivity):</strong> در مدلهای تجمیعی مانند بوستینگ، سهم کل ویژگی مجموع سهم آن در تک‌تک درختان است.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200">
            <strong>نکته مهم دفاعیه:</strong> مقادیر SHAP نقش همبستگی تفسیری ویژگی‌ها را تبیین می‌کنند و نباید ادعای علیت فیزیکی (Causal Relationship) از آنها برداشت شود.
          </div>
        </div>
      </div>
    </div>
  );
};
