import React from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  Terminal,
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
import { SERVICE_SLOS } from '../data/mockData';

export const ObservabilityPage: React.FC = () => {
  // Simulated 24-hour latency trend (P95 and P99)
  const latencyTrend = [
    { hour: '00:00', p95: 22, p99: 38 },
    { hour: '03:00', p95: 18, p99: 32 },
    { hour: '06:00', p95: 19, p99: 34 },
    { hour: '09:00', p95: 28, p99: 46 }, // Morning traffic peak
    { hour: '12:00', p95: 26, p99: 42 },
    { hour: '15:00', p95: 24, p99: 40 },
    { hour: '18:00', p95: 29, p99: 48 }, // Evening orders
    { hour: '21:00', p95: 25, p99: 44 },
    { hour: '24:00', p95: 21, p99: 36 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 11 · پایش همه‌جانبه، رصدپذیری و اهداف سطح خدمت (Observability & SLOs)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <span>رصد سلامت سامانه، معیارهای OpenTelemetry و بودجه خطای SLO</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پایش تاخیر صدک‌های P95 و P99، عمق صف کارگرهای Celery و وضعیت استخر اتصالات دیتابیس
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="h-4 w-4" />
          <span>تمام ۴ شاخص SLO در وضعیت هدف (MET) قرار دارند</span>
        </div>
      </div>

      {/* Resource Utilization Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>مصرف پردازنده (CPU)</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۱۸.۴٪</div>
          <div className="text-[11px] text-emerald-400 mt-1">۴ هسته مجازی لینوکس</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>حافظه رم (RAM)</span>
            <Server className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۴۱۰ مگابایت</div>
          <div className="text-[11px] text-slate-400 mt-1">از ۱.۲ گیگابایت تخصیص داده شده</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>استخر اتصالات دیتابیس</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۱۴ / ۵۰ اتصال</div>
          <div className="text-[11px] text-cyan-400 mt-1">PostgreSQL 16 AsyncPool</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>عمق صف کارهای Celery</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۴ تسک</div>
          <div className="text-[11px] text-slate-400 mt-1">نرخ پردازش ۱۴۲ تسک در دقیقه</div>
        </div>
      </div>

      {/* Latency Chart (P95 vs P99) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              روند تاخیر پاسخگویی سرویس‌ها در طول ۲۴ ساعت گذشته (میلی‌ثانیه)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              مقایسه صدک‌های ۹۵ و ۹۹ بر اساس تله‌متری OpenTelemetry
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              P95 Latency
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              P99 Latency
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyTrend}>
              <defs>
                <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" ms" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '11px',
                  direction: 'rtl',
                }}
              />
              <Area type="monotone" dataKey="p95" name="صدک P95 (ms)" stroke="#06b6d4" strokeWidth={2} fill="url(#p95Grad)" />
              <Area type="monotone" dataKey="p99" name="صدک P99 (ms)" stroke="#818cf8" strokeWidth={2} fill="url(#p99Grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service SLOs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">
            اهداف سطح خدمت سازمانی (Service Level Objectives & Error Budget)
          </h3>
          <span className="text-xs font-mono text-emerald-400">پایش بلادرنگ ۳۰ روزه</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">سرویس / مولفه</th>
                <th className="py-2.5 px-3">هدف تعریف‌شده (SLO)</th>
                <th className="py-2.5 px-3">مقدار در دسترس کنونی</th>
                <th className="py-2.5 px-3">بودجه خطای باقی‌مانده</th>
                <th className="py-2.5 px-3">تاخیر P95</th>
                <th className="py-2.5 px-3">تاخیر P99</th>
                <th className="py-2.5 px-3">وضعیت هدف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {SERVICE_SLOS.map((slo, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-200">{slo.serviceName}</td>
                  <td className="py-2.5 px-3 text-slate-400">{slo.sloName}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{slo.currentValue}٪</td>
                  <td className="py-2.5 px-3 text-cyan-300">{slo.errorBudgetRemainingPct}٪</td>
                  <td className="py-2.5 px-3 text-slate-300">{slo.p95LatencyMs}ms</td>
                  <td className="py-2.5 px-3 text-slate-400">{slo.p99LatencyMs}ms</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      محقق شده (MET)
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
