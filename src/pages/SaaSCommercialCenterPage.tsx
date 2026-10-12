import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  FileText,
  Download,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Layers,
  Building2,
  ChevronRight,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  SUBSCRIPTION_PLANS,
  CURRENT_TENANT_SUBSCRIPTION,
  CURRENT_USAGE_QUOTAS,
  SAMPLE_INVOICES,
} from '../data/mockData';
import { SubscriptionTier, SubscriptionPlan, InvoiceRecord } from '../types';

export const SaaSCommercialCenterPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(
    CURRENT_TENANT_SUBSCRIPTION.planId
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(SAMPLE_INVOICES);
  const [quotas, setQuotas] = useState(CURRENT_USAGE_QUOTAS);
  const [upgradedNotice, setUpgradedNotice] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan) || SUBSCRIPTION_PLANS[1];

  const handleUpgradePlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.id);
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setUpgradedNotice(
        `پلن سازمانی شما با موفقیت به «${plan.nameFa}» ارتقا یافت. تمامی سهمیه‌های مصرفی و دسترسی‌های جدید بلافاصله فعال شدند.`
      );

      // Dynamically adjust quotas based on new plan
      setQuotas((prev) =>
        prev.map((q) => {
          if (q.metricName === 'active_connectors') return { ...q, quotaLimit: plan.maxConnectors, percentageUsed: Math.round((q.currentUsage / plan.maxConnectors) * 100) };
          if (q.metricName === 'synced_records_monthly') return { ...q, quotaLimit: plan.maxSyncedRecordsPerMonth, percentageUsed: Math.round((q.currentUsage / plan.maxSyncedRecordsPerMonth) * 100) };
          if (q.metricName === 'api_requests') return { ...q, quotaLimit: plan.maxApiRequestsPerMonth, percentageUsed: Math.round((q.currentUsage / plan.maxApiRequestsPerMonth) * 100) };
          if (q.metricName === 'training_jobs') return { ...q, quotaLimit: plan.maxTrainingJobsPerMonth, percentageUsed: Math.round((q.currentUsage / plan.maxTrainingJobsPerMonth) * 100) };
          if (q.metricName === 'ai_tokens') return { ...q, quotaLimit: plan.maxAiTokensPerMonth, percentageUsed: Math.round((q.currentUsage / plan.maxAiTokensPerMonth) * 100) };
          if (q.metricName === 'storage_usage') return { ...q, quotaLimit: plan.storageGb, percentageUsed: Math.round((q.currentUsage / plan.storageGb) * 100) };
          return q;
        })
      );

      setTimeout(() => setUpgradedNotice(null), 6000);
    }, 1200);
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const newInvoice: InvoiceRecord = {
        id: `INV-${Date.now()}`,
        invoiceNumber: `صورتحساب شارژ آنی دوره فعلی`,
        tenantId: 'tenant-hq-01',
        tenantName: 'فروشگاه اینترنتی افق داده‌گستر',
        amountToman: activePlan.pricePerMonthToman,
        status: 'paid',
        periodStart: 'هم‌اکنون',
        periodEnd: 'یک ماه آینده',
        issuedAt: 'هم‌اکنون',
        paidAt: 'هم‌اکنون',
        paymentGateway: 'zarinpal',
        receiptUrl: '/receipts/latest.pdf',
      };
      setInvoices([newInvoice, ...invoices]);
      setUpgradedNotice('پرداخت با درگاه زرین‌پال تایید شد و فاکتور رسمی دوره صادر گردید.');
      setTimeout(() => setUpgradedNotice(null), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              COMMERCIAL SAAS 2.0 · مرکز اشتراک، سهمیه‌های مصرفی و صورتحساب
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              مدیریت اشتراک تجاری سازمانی و سهمیه‌های مصرفی بلادرنگ (Metered Billing)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              پایش بلادرنگ سهمیه‌های اتصال درگاه‌ها، حجم رکوردهای همگام‌شده، فراخوانی‌های هوش مصنوعی و فضای ذخیره‌سازی، به همراه چرخه پرداخت ایدمپوتنت و فاکتورهای رسمی.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ماهانه
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>سالانه</span>
                <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ۲۰٪ تخفیف
                </span>
              </button>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessingPayment}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isProcessingPayment ? 'در حال ثبت در درگاه...' : 'شارژ آنی اعتبار (زرین‌پال)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {upgradedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 shadow-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{upgradedNotice}</span>
        </div>
      )}

      {/* Real-time Metered Quotas Overview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>سهمیه‌های مصرفی در دوره جاری (Metered Usage Quotas)</span>
            </h3>
            <p className="text-xs text-slate-400">
              دوره از {CURRENT_TENANT_SUBSCRIPTION.currentPeriodStart} تا {CURRENT_TENANT_SUBSCRIPTION.currentPeriodEnd} · تمدید خودکار فعال
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            پلن فعال: {activePlan.nameFa}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quotas.map((quota) => (
            <div
              key={quota.metricName}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{quota.metricLabelFa}</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {quota.percentageUsed}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    quota.percentageUsed > 90
                      ? 'bg-rose-500'
                      : quota.percentageUsed > 70
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(quota.percentageUsed, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>مصرف: {quota.currentUsage.toLocaleString('fa-IR')} {quota.unit}</span>
                <span>سقف: {quota.quotaLimit.toLocaleString('fa-IR')} {quota.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Pricing Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>پلن‌های اشتراک تجاری و بسته‌های سازمانی (Subscription Tiers):</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = selectedPlan === plan.id;
            const price =
              billingCycle === 'yearly'
                ? Math.round(plan.pricePerYearToman / 12)
                : plan.pricePerMonthToman;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                  isCurrent
                    ? 'bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold shadow">
                    محبوب‌ترین انتخاب کسب‌وکارها
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100">{plan.nameFa}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed min-h-[34px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-100 font-mono">
                        {price.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-xs text-slate-400">تومان / ماه</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-[10px] text-emerald-400 mt-1">
                        پرداخت سالانه: {plan.pricePerYearToman.toLocaleString('fa-IR')} تومان
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 text-xs pt-2">
                    <div className="text-[11px] font-bold text-slate-300">امکانات و سهمیه‌ها:</div>
                    <ul className="space-y-2 text-slate-300 text-[11px]">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>تعداد کانکتورها:</span>
                      <span className="font-mono text-slate-200">{plan.maxConnectors} عدد</span>
                    </div>
                    <div className="flex justify-between">
                      <span>سقف رکورد ماهانه:</span>
                      <span className="font-mono text-slate-200">{plan.maxSyncedRecordsPerMonth.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>فضای ذخیره‌سازی:</span>
                      <span className="font-mono text-slate-200">{plan.storageGb} گیگابایت</span>
                    </div>
                    <div className="flex justify-between">
                      <span>پشتیبانی:</span>
                      <span className="text-[10px] text-slate-300 truncate max-w-[140px]">{plan.supportSla}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleUpgradePlan(plan)}
                    disabled={isCurrent || isProcessingPayment}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        <span>پلن فعال سازمان شما</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4" />
                        <span>ارتقا و فعال‌سازی این پلن</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices and Billing History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>تاریخچه صورتحساب‌ها و فاکتورهای رسمی (Invoices & Receipts)</span>
            </h3>
            <p className="text-xs text-slate-400">
              فاکتورهای رسمی با شناسه مالیاتی و دانلود PDF برای ارائه به حسابداری
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">عنوان صورتحساب</th>
                <th className="py-2.5 px-3">مبلغ پرداختی</th>
                <th className="py-2.5 px-3">وضعیت</th>
                <th className="py-2.5 px-3">دوره زمانی</th>
                <th className="py-2.5 px-3">تاریخ پرداخت</th>
                <th className="py-2.5 px-3">درگاه</th>
                <th className="py-2.5 px-3 text-center">دریافت فایل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-100 font-sans">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-bold">
                    {inv.amountToman.toLocaleString('fa-IR')} تومان
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      پرداخت‌شده
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-sans">
                    {inv.periodStart} تا {inv.periodEnd}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {inv.paidAt || inv.issuedAt}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    {inv.paymentGateway === 'zarinpal' ? 'زرین‌پال' : 'درگاه آزمایشی'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => alert(`دانلود صورتحساب رسمی شماره ${inv.id}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors inline-flex items-center gap-1 text-[11px]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </button>
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
