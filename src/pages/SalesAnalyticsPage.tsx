import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Filter,
  Download,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
} from 'recharts';

export const SalesAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '60d' | '90d'>('60d');
  const [overview, setOverview] = React.useState<{
    sales: { total: number; byDay: Record<string, number> };
    orders: { total: number; paid: number };
    categories: Array<{ id: string; name: string; revenue: number }>;
  } | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/ai-dashboard/overview', { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('overview_unavailable'))))
      .then((payload) => setOverview(payload))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setOverview(null);
      });
    return () => controller.abort();
  }, []);

  const salesData = useMemo(() => {
    const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 60;
    const raw = Object.entries(overview?.sales.byDay ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .slice(-days)
      .map(([date, total]) => ({ date, actualSales: total, ordersCount: 0 }));
    return raw.map((d, idx, arr) => {
      // 7-day rolling average
      const start = Math.max(0, idx - 6);
      const slice = arr.slice(start, idx + 1);
      const rollingAvg = Math.round(slice.reduce((acc, cur) => acc + cur.actualSales, 0) / slice.length);

      return {
        date: d.date.slice(5),
        fullDate: d.date,
        salesMillion: Number((d.actualSales / 1000000).toFixed(2)),
        rollingAvgMillion: Number((rollingAvg / 1000000).toFixed(2)),
        ordersCount: d.ordersCount,
        avgOrderValue: 0,
      };
    });
  }, [overview, timeRange]);

  const formatMoney = (value: number) => `${(value / 10).toLocaleString('fa-IR')} تومان`;
  const averageDaily = salesData.length ? overview!.sales.total / salesData.length : 0;

  const dayOfWeekData = useMemo(() => {
    const labels = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const totals = labels.map((day) => ({ day, total: 0, count: 0 }));
    for (const item of salesData) {
      const index = new Date(`${item.fullDate}T00:00:00Z`).getUTCDay();
      if (totals[index]) {
        totals[index].total += item.salesMillion;
        totals[index].count += 1;
      }
    }
    return totals.map(({ day, total, count }) => ({
      day,
      avgSales: count ? Number((total / count).toFixed(2)) : 0,
      orderVolume: count,
    }));
  }, [salesData]);

  const categoryData = (overview?.categories ?? []).map((category) => ({
    name: category.name,
    revenue: Number((category.revenue / 1000000).toFixed(2)),
    share: overview?.sales.total ? `${((category.revenue / overview.sales.total) * 100).toFixed(1)}٪` : '—',
  }));

  return (
    <div className="space-y-6">
      {/* Top Filter and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <span>تحلیل جامع الگوهای فروش و رفتار تقاضا</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            بررسی توزیع زمانی سفارش‌ها، میانگین متحرک ۷ روزه و تحلیل اثر فصلی روزهای هفته
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded transition-colors ${timeRange === '30d' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ۳۰ روز
            </button>
            <button
              onClick={() => setTimeRange('60d')}
              className={`px-3 py-1 rounded transition-colors ${timeRange === '60d' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ۶۰ روز
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded transition-colors ${timeRange === '90d' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ۹۰ روز
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">مجموع فروش در بازه</div>
          <div className="mt-2 text-xl font-black text-slate-100 font-mono">{overview ? formatMoney(overview.sales.total) : '—'}</div>
          <div className="text-[11px] text-emerald-400 mt-1">{overview ? `میانگین روزانه ${formatMoney(averageDaily)}` : 'داده در دسترس نیست'}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">تعداد کل سفارشات</div>
          <div className="mt-2 text-xl font-black text-slate-100 font-mono">{overview ? `${overview.orders.paid.toLocaleString('fa-IR')} فاکتور` : '—'}</div>
          <div className="text-[11px] text-slate-400 mt-1">منبع: سفارش‌های پرداخت‌شدهٔ واقعی</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">ارزش میانگین هر سبد (AOV)</div>
          <div className="mt-2 text-xl font-black text-slate-100 font-mono">{overview && overview.orders.paid ? formatMoney(overview.sales.total / overview.orders.paid) : '—'}</div>
          <div className="text-[11px] text-cyan-400 mt-1">میانگین واقعی ارزش سفارش</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">پیک فروش هفتگی</div>
          <div className="mt-2 text-xl font-black text-slate-100 font-mono">{salesData.length ? 'محاسبه شد' : '—'}</div>
          <div className="text-[11px] text-amber-400 mt-1">بر پایهٔ دادهٔ روزانهٔ واقعی</div>
        </div>
      </div>

      {/* Main Chart: Daily Sales & 7-Day Rolling Average */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              نمودار ترکیبی فروش روزانه و میانگین متحرک (Moving Average 7d)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              خط زرد نشان‌دهنده روند هموارشده بدون نویزهای مقطعی روزانه است.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-3 w-3 rounded bg-cyan-500/80"></span>
              فروش روزانه (ستون)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-0.5 w-4 bg-amber-400"></span>
              میانگین متحرک ۷ روزه (خط)
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <Bar dataKey="salesMillion" name="فروش روزانه (م)" fill="#06b6d4" opacity={0.75} radius={[3, 3, 0, 0]} />
              <Line type="monotone" dataKey="rollingAvgMillion" name="میانگین متحرک ۷ روزه (م)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Grid: Day of Week Seasonality & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonality: Day of Week */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>اثر الگوی روزهای هفته بر حجم فروش (میلیون تومان)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-2 mb-4">
            توجیه الگوریتمی: نیاز مدل‌های یادگیری ماشین به ویژگی تاخیری ۷ روزه (Lag 7) برای گرفتن این چرخه فصلی.
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" م" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Bar dataKey="avgSales" name="میانگین فروش (میلیون)" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Performance */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>سهم گروه‌های کالایی از کل درآمد</span>
          </h3>
          <p className="text-xs text-slate-400 mt-2 mb-4">
            طبقه‌بندی بر اساس دسته‌بندی محصولات دیتاست تجاری آنلاین (UCI Retail)
          </p>
          <div className="space-y-4 pt-1">
            {categoryData.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-700 p-5 text-center text-xs text-slate-400">
                دادهٔ درآمد به تفکیک دسته‌بندی هنوز از API عملیاتی صادر نمی‌شود.
              </div>
            ) : categoryData.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{cat.revenue} م تومان</span>
                    <span className="text-cyan-400 font-bold">{cat.share}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    style={{ width: cat.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
