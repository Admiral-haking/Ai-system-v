import React from 'react';
import {
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { generateDailySales, CLUSTERS_DATA, FORECAST_MODELS, MLFLOW_RUNS } from '../data/mockData';
import { NavTabId } from '../components/layout/Sidebar';

interface OverviewDashboardProps {
  onNavigate: (tab: NavTabId) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const salesData = React.useMemo(() => generateDailySales('xgboost', 14), []);
  const chartData = React.useMemo(() => {
    return salesData.slice(-35).map((item) => ({
      date: item.date.slice(5),
      'فروش واقعی': item.actualSales > 0 ? Math.round(item.actualSales / 1000000) : null,
      'پیش‌بینی مدل': Math.round(item.predictedSales / 1000000),
      'حد بالای اطمینان ۹۵٪': Math.round(item.upperBound / 1000000),
      'حد پایین اطمینان': Math.round(item.lowerBound / 1000000),
      isForecast: item.isForecast,
    }));
  }, [salesData]);

  const kpis = [
    {
      title: 'فروش ۳۰ روز اخیر',
      value: '۵۵۴.۲ میلیون تومان',
      change: '+۱۲.۴٪ نسبت به ماه قبل',
      isPositive: true,
      subtext: 'بر اساس ۳,۱۸۰ سفارش ثبت شده',
      icon: TrendingUp,
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'دقت مدل پیش‌بینی (WAPE)',
      value: '۴.۸۲٪',
      change: '-۲.۱٪ کاهش خطای مدل',
      isPositive: true,
      subtext: 'مدل XGBoost v3.2 با بهینه‌سازی Optuna',
      icon: Target,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'کل مشتریان تحلیل‌شده',
      value: '۴,۳۷۲ مشتری',
      change: '۴ بخش رفتاری (RFM)',
      isPositive: true,
      subtext: 'شاخص Silhouette معادل ۰.۶۴۲',
      icon: Users,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    },
    {
      title: 'شاخص ROC-AUC خرید مجدد',
      value: '۰.۸۹۲',
      change: 'کالیبراسیون Isotonic',
      isPositive: true,
      subtext: 'Brier Score معادل ۰.۱۱۸',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              سامانه تولیدی آنلاین · دفاعیه کارشناسی مهندسی هوش مصنوعی
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              سامانه هوشمند پیش‌بینی تقاضا و رفتار مشتریان
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ترکیب الگوریتم‌های یادگیری ماشین نظارت‌شده (XGBoost) و بدون نظارت (K-Means/DBSCAN) 
              با قابلیت تبیین‌پذیری به روش ارزش شپلی (SHAP) و ردیابی آزمایش‌ها با MLflow بر روی لینوکس.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('decision-center')}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Target className="h-4 w-4" />
              <span>اتاق تصمیم‌گیری خودکار</span>
            </button>
            <button
              onClick={() => onNavigate('sales-forecast')}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <TrendingUp className="h-4 w-4" />
              <span>پیش‌بینی ۳۰ روزه</span>
            </button>
            <button
              onClick={() => onNavigate('ai-copilot')}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>دستیار هوشمند (Copilot)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border bg-gradient-to-b ${kpi.color} bg-slate-900/80 p-5 shadow-sm transition-all hover:border-slate-600`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-100 tracking-tight font-mono">
                {kpi.value}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`flex items-center gap-0.5 font-medium ${kpi.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {kpi.change}
                </span>
                <span className="text-slate-400">{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart Section: Actual vs Predicted Sales with 95% Confidence Band */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>روند فروش روزانه و پیش‌بینی افق آینده (میلیون تومان)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              مقایسه داده‌های واقعی با پیش‌بینی مدل منتخب XGBoost همراه با فواصل اطمینان ۹۵٪
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span>فروش واقعی</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
              <span>پیش‌بینی مدل</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2.5 w-6 rounded bg-indigo-500/20 border border-dashed border-indigo-400/40"></span>
              <span>بازه اطمینان ۹۵٪</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
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
              <Area
                type="monotone"
                dataKey="حد بالای اطمینان ۹۵٪"
                stroke="transparent"
                fill="url(#bandGrad)"
              />
              <Area
                type="monotone"
                dataKey="حد پایین اطمینان"
                stroke="transparent"
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="فروش واقعی"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#actualGrad)"
                dot={{ r: 2, fill: '#06b6d4' }}
              />
              <Area
                type="monotone"
                dataKey="پیش‌بینی مدل"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#predGrad)"
                dot={{ r: 3, fill: '#818cf8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Customer Clusters Distribution & Linux Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Segmentation Overview */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span>توزیع خوشه‌های مشتریان (RFM)</span>
              </h3>
              <button
                onClick={() => onNavigate('customer-segmentation')}
                className="text-xs text-cyan-400 hover:underline"
              >
                مشاهده جزییات
              </button>
            </div>
            <div className="h-48 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CLUSTERS_DATA}
                    dataKey="customerCount"
                    nameKey="clusterName"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {CLUSTERS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} مشتری`, 'تعداد']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                      direction: 'rtl',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {CLUSTERS_DATA.map((cluster) => (
                <div key={cluster.clusterId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cluster.color }}></span>
                    <span className="text-slate-300 truncate">{cluster.clusterName}</span>
                  </div>
                  <span className="font-mono text-slate-400">{cluster.percentage}٪</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>الگوریتم K-Means</span>
            <span className="font-mono text-emerald-400">Silhouette: ۰.۶۴۲</span>
          </div>
        </div>

        {/* System Stack & Model Leaderboard */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>وضعیت سرویس‌های زیرساخت لینوکس و مدل‌های فعال</span>
            </h3>
            <button
              onClick={() => onNavigate('model-comparison')}
              className="text-xs text-cyan-400 hover:underline"
            >
              جدول مقایسه تمام مدل‌ها
            </button>
          </div>

          {/* Linux Architecture Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">سرویس API</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="font-bold text-slate-200">FastAPI 0.111</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Python 3.12 · Uvicorn</div>
            </div>

            <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">پایگاه داده</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="font-bold text-slate-200">PostgreSQL 16</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Alembic Migration</div>
            </div>

            <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">صف وظایف</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="font-bold text-slate-200">Celery + Redis</div>
              <div className="text-[10px] text-slate-400 mt-0.5">آموزش در پس‌زمینه</div>
            </div>

            <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">کانتینرسازی</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="font-bold text-slate-200">Docker Compose</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ubuntu Host</div>
            </div>
          </div>

          {/* Top 3 Models Snapshot */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400">
              رتبه‌بندی خطای مدل‌های پیش‌بینی (آزمون Out-of-Time):
            </div>
            <div className="space-y-2">
              {FORECAST_MODELS.slice(0, 3).map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${model.status === 'production' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span className="font-bold text-slate-200">{model.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({model.version})</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-slate-300">
                      WAPE: <strong className={model.wape < 5 ? 'text-emerald-400' : 'text-cyan-300'}>{model.wape}٪</strong>
                    </span>
                    <span className="text-slate-400">R²: {model.r2}</span>
                    <span className="text-slate-400">{model.trainingTimeSec}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
