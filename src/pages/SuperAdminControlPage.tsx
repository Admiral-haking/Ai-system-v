import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ToggleLeft,
  ToggleRight,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Lock,
  Layers,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { COMMERCIAL_SAAS_KPIS, TENANTS } from '../data/mockData';
import { CommercialSaaSKpis, Tenant } from '../types';

export const SuperAdminControlPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(TENANTS);
  const [featureFlags, setFeatureFlags] = useState({
    deepSeekDiagnostics: true,
    deepLearningForecasting: true,
    realtimeOutboxAutomation: true,
    zarinpalAutoDebit: true,
    multiTenantRlsEnforced: true,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFeature = (flagKey: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [flagKey]: !prev[flagKey] }));
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
              SUPER ADMIN CONTROL CENTER & PRODUCT ANALYTICS (PHASE 9 & 10)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              مرکز کنترل کلان مدیریت پلتفرم تجاری SaaS، شاخص‌های مالی و پرچم‌های قابلیت (Feature Flags)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              پایش درآمدهای تکرارشونده ماهانه و سالانه (MRR / ARR)، نرخ ریزش (Churn Rate)، هزینه زیرساخت هوش مصنوعی به ازای هر مشتری، و تفکیک دسترسی‌های سطح مدیر سامانه.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              نقش: Platform Super Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Commercial Product Analytics & SaaS KPIs (Phase 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>درآمد مکرر ماهانه (MRR):</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black font-mono text-emerald-400">
            {COMMERCIAL_SAAS_KPIS.mrrToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">تومان</span>
          </div>
          <div className="text-[10px] text-slate-500">
            معادل سالانه (ARR): {COMMERCIAL_SAAS_KPIS.arrToman.toLocaleString('fa-IR')} تومان
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>سازمان‌های فعال / پرداختی:</span>
            <Building2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-lg font-black font-mono text-cyan-400">
            {COMMERCIAL_SAAS_KPIS.payingTenantsCount} <span className="text-xs font-normal text-slate-400">از {COMMERCIAL_SAAS_KPIS.activeTenantsCount} سازمان</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            تبدیل آزمایشی به پرداختی: {COMMERCIAL_SAAS_KPIS.conversionRatePct}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>نرخ ریزش مشتری (Churn Rate):</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-lg font-black font-mono text-amber-400">
            {COMMERCIAL_SAAS_KPIS.churnRatePct}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            ارزش طول‌عمر (LTV): {COMMERCIAL_SAAS_KPIS.customerLifetimeValueToman.toLocaleString('fa-IR')} تومان
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>حاشیه سود ناخالص / هزینه AI:</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-lg font-black font-mono text-purple-300">
            {COMMERCIAL_SAAS_KPIS.grossMarginPct}%
          </div>
          <div className="text-[10px] text-slate-500">
            هزینه AI هر سازمان: {COMMERCIAL_SAAS_KPIS.aiInfraCostPerTenantToman.toLocaleString('fa-IR')} تومان
          </div>
        </div>
      </div>

      {/* Feature Flags Manager (Phase 9 & 11) */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <ToggleRight className="h-4 w-4 text-cyan-400" />
              <span>مدیریت سوئیچ قابلیت‌ها و انتشار تدریجی (Feature Flags Manager):</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              فعال‌سازی یا خاموش‌سازی بلادرنگ ماژول‌های سامانه بدون نیاز به استقرار مجدد کدهای بک‌اند
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">عیب‌یابی هوشمند DeepSeek:</span>
              <div className="text-[10px] text-slate-400 font-mono">deepseek-coder-v2</div>
            </div>
            <button
              onClick={() => toggleFeature('deepSeekDiagnostics')}
              className={`p-1 rounded-lg transition-colors ${
                featureFlags.deepSeekDiagnostics ? 'text-emerald-400' : 'text-slate-600'
              }`}
            >
              {featureFlags.deepSeekDiagnostics ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">مدل‌های عمیق N-BEATS & TCN:</span>
              <div className="text-[10px] text-slate-400 font-mono">pytorch-dl-engine</div>
            </div>
            <button
              onClick={() => toggleFeature('deepLearningForecasting')}
              className={`p-1 rounded-lg transition-colors ${
                featureFlags.deepLearningForecasting ? 'text-emerald-400' : 'text-slate-600'
              }`}
            >
              {featureFlags.deepLearningForecasting ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">شارژ خودکار کیف‌پول زرین‌پال:</span>
              <div className="text-[10px] text-slate-400 font-mono">zarinpal-recurring-debit</div>
            </div>
            <button
              onClick={() => toggleFeature('zarinpalAutoDebit')}
              className={`p-1 rounded-lg transition-colors ${
                featureFlags.zarinpalAutoDebit ? 'text-emerald-400' : 'text-slate-600'
              }`}
            >
              {featureFlags.zarinpalAutoDebit ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Organizations & Tenant Accounts Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <span>فهرست کل سازمان‌ها و مستاجران پلتفرم (Tenant Directory):</span>
            </h3>
            <p className="text-xs text-slate-400">
              مدیریت حساب مشتریان، حجم سفارش‌ها، پلن اشتراک و وضعیت ایزولاسیون دیتابیس
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی نام یا شناسه سازمان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">شناسه و نام سازمان</th>
                <th className="py-2.5 px-3">دامنه / ساب‌دومین</th>
                <th className="py-2.5 px-3">پلن اشتراک</th>
                <th className="py-2.5 px-3">کاربران فعال</th>
                <th className="py-2.5 px-3">تعداد سفارش‌ها</th>
                <th className="py-2.5 px-3">طرحواره دیتابیس (RLS)</th>
                <th className="py-2.5 px-3">وضعیت حساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-sans">
                    <div className="font-bold text-slate-100">{tenant.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tenant.id}</div>
                  </td>
                  <td className="py-3 px-3 text-cyan-300">
                    {tenant.subdomain}.app.internal
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700 uppercase">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    {tenant.activeUsers} کاربر
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {tenant.ordersVolume.toLocaleString('fa-IR')}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {tenant.dbSchema}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>فعال</span>
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
