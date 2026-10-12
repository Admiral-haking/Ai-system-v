import React, { useState } from 'react';
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  Lock,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  INTEGRATION_CATALOG_PROVIDERS,
  CANONICAL_FIELDS,
  INITIAL_AI_MAPPING_RULES,
} from '../data/mockData';
import { IntegrationProviderInfo, FieldMappingRule } from '../types';

interface SmartConnectionWizardPageProps {
  initialProviderId?: string;
  onFinish: () => void;
}

export const SmartConnectionWizardPage: React.FC<SmartConnectionWizardPageProps> = ({
  initialProviderId,
  onFinish,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProviderInfo>(() => {
    return (
      INTEGRATION_CATALOG_PROVIDERS.find((p) => p.id === initialProviderId) ||
      INTEGRATION_CATALOG_PROVIDERS[0]
    );
  });

  // Wizard form states
  const [endpointUrl, setEndpointUrl] = useState<string>('https://shop.company.ir/wp-json/wc/v3');
  const [apiKey, setApiKey] = useState<string>('ck_sec_99482014812a8f9c');
  const [apiSecret, setApiSecret] = useState<string>('cs_priv_e9411fa088921b33');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latency: number; msg: string } | null>(null);
  const [mappingRules, setMappingRules] = useState<FieldMappingRule[]>(INITIAL_AI_MAPPING_RULES);
  const [syncStrategy, setSyncStrategy] = useState<'incremental' | 'full' | 'webhook'>('incremental');
  const [dryRunRunning, setDryRunRunning] = useState<boolean>(false);
  const [dryRunResult, setDryRunResult] = useState<{ inserts: number; updates: number; conflicts: number } | null>(null);

  const stepsList = [
    { num: 1, label: 'انتخاب منبع' },
    { num: 2, label: 'پیکربندی آدرس' },
    { num: 3, label: 'احراز هویت امن' },
    { num: 4, label: 'تست اتصال' },
    { num: 5, label: 'کشف قابلیت‌ها' },
    { num: 6, label: 'پروفایل طرحواره' },
    { num: 7, label: 'تطبیق هوشمند AI' },
    { num: 8, label: 'بررسی تطبیق' },
    { num: 9, label: 'پیش‌نمایش نرمال' },
    { num: 10, label: 'راهبرد همگام‌سازی' },
    { num: 11, label: 'شبیه‌سازی Dry Run' },
    { num: 12, label: 'تایید و فعال‌سازی' },
    { num: 13, label: 'پایش سلامت' },
    { num: 14, label: 'بازیابی خطا' },
  ];

  const handleRunConnectionTest = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        latency: 118,
        msg: `اتصال فقط‌خواندنی به ${selectedProvider.name} برقرار شد. مجوز دسترسی به سفارشات و محصولات تایید گردید.`,
      });
    }, 1200);
  };

  const handleRunDryRun = () => {
    setDryRunRunning(true);
    setTimeout(() => {
      setDryRunRunning(false);
      setDryRunResult({
        inserts: 142,
        updates: 28,
        conflicts: 0,
      });
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            SMART ZERO-CODE WIZARD · ویزارد هوشمند اتصال ۱۴ مرحله‌ای
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Plug className="h-5 w-5 text-cyan-400" />
            <span>راه‌اندازی اتصال سامانه جدید بدون نیاز به برنامه‌نویسی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مرحله {currentStep} از ۱۴: {stepsList[currentStep - 1]?.label}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            منبع فعال: <strong className="text-cyan-400">{selectedProvider.name}</strong>
          </span>
        </div>
      </div>

      {/* Steps Progress Ribbon */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-1.5 min-w-[900px] text-[11px]">
          {stepsList.map((st) => {
            const isDone = st.num < currentStep;
            const isCurrent = st.num === currentStep;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : isDone
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="font-mono text-xs font-bold">{st.num}.</span>
                <span>{st.label}</span>
                {isDone && <Check className="h-3 w-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Body Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl min-h-[420px] flex flex-col justify-between space-y-6">
        {/* STEP 1: SOURCE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام ۱: انتخاب نوع سامانه یا منبع اطلاعاتی
            </h3>
            <p className="text-xs text-slate-400">
              سامانه‌ای که قصد اتصال و استخراج داده‌های فروش، موجودی یا مشتریان از آن را دارید انتخاب کنید:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {INTEGRATION_CATALOG_PROVIDERS.map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => setSelectedProvider(prov)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                    selectedProvider.id === prov.id
                      ? 'bg-cyan-500/15 border-cyan-500 ring-1 ring-cyan-500/30 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>{prov.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{prov.version}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{prov.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: CONFIGURATION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام ۲: تنظیم آدرس و پارامترهای اتصال ({selectedProvider.name})
            </h3>
            <div className="max-w-xl space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">آدرس نقطه انتهایی (Endpoint / Host URL):</label>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono text-left"
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">پورت اتصال (Port):</label>
                  <input
                    type="text"
                    defaultValue="443"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">مهلت زمانی پاسخ (Timeout):</label>
                  <input
                    type="text"
                    defaultValue="15s"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: AUTHENTICATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>گام ۳: احراز هویت امن و رمزنگاری اعتبارسنجی (Vault)</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>AES-256 Encrypted</span>
              </span>
            </h3>
            <div className="max-w-xl space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">کلید دسترسی (API Key / Consumer Key):</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">کلید محرمانه (API Secret):</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono text-left"
                  dir="ltr"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                اطلاعات اعتبارسنجی در محفظه امن HashiCorp Vault ذخیره شده و هرگز در لاگ‌های سیستمی ثبت نخواهند شد.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: CONNECTION TEST */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام ۴: تست اتصال فقط‌خواندنی و بررسی سلامت شبکه
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ارسال پینگ آزمایشی فقط‌خواندنی بدون اعمال هیچ‌گونه تغییر در پایگاه مبدا جهت سنجش تاخیر و اعتبار توکن:
            </p>
            <div className="pt-2">
              <button
                onClick={handleRunConnectionTest}
                disabled={isTesting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow"
              >
                <RefreshCw className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'در حال ارسال درخواست تست...' : 'اجرای تست اتصال'}</span>
              </button>
            </div>

            {testResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تست اتصال با موفقیت انجام شد!</span>
                </div>
                <div className="font-mono text-[11px]">تاخیر پاسخگویی شبکه: {testResult.latency} میلی‌ثانیه</div>
                <p className="text-slate-300 text-[11px]">{testResult.msg}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 & 6: CAPABILITY & SCHEMA DISCOVERY */}
        {(currentStep === 5 || currentStep === 6) && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام {currentStep}: کشف خودکار منابع، جداول و پروفایل طرحواره داده‌ها
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold">موجودیت‌های کشف‌شده در {selectedProvider.name}:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">جدول / منبع</div>
                  <div className="text-slate-100 font-bold">/orders</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">تعداد ستون‌ها</div>
                  <div className="text-slate-100 font-bold">۱۴ فیلد</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">کلید اصلی</div>
                  <div className="text-cyan-400 font-bold">id (Integer)</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">روش صفحه‌بندی</div>
                  <div className="text-emerald-400 font-bold">Cursor Pagination</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7 & 8: AI MAPPING & REVIEW */}
        {(currentStep === 7 || currentStep === 8) && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>گام {currentStep}: تطبیق هوشمند فیلدها با مدل داده یکپارچه (Canonical Entity)</span>
              </h3>
              <span className="text-emerald-400 font-mono">میانگین ضریب اطمینان AI: ۹۵.۵٪</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mappingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-cyan-300 font-bold">{rule.sourceField}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-emerald-300 font-bold">{rule.canonicalField}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-slate-400 font-sans">
                      تبدیل: <strong className="text-slate-300">{rule.transformation}</strong>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300">
                      {rule.confidencePct}٪ اطمینان
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: TRANSFORMATION PREVIEW */}
        {currentStep === 9 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام ۹: پیش‌نمایش تطبیقی سطر خام در برابر سند نرمال‌شده
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px] text-left" dir="ltr">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-bold font-sans">۱. رکورد خام مبدا (Raw Source JSON):</div>
                <pre className="text-slate-300 overflow-x-auto">{`{
  "order_number": "WC-18468",
  "date_created_gmt": "2024-11-15T08:24:10",
  "total_price_toman": 2450000,
  "billing": { "email": "buyer@aria.ir" }
}`}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-1">
                <div className="text-cyan-400 text-xs font-bold font-sans">۲. رکورد نرمال‌شده مدل استاندارد:</div>
                <pre className="text-emerald-300 overflow-x-auto">{`{
  "external_id": "WC-18468",
  "placed_at": "2024-11-15T08:24:10Z",
  "total_amount": 2450000,
  "currency": "IRT",
  "customer_email": "buyer@aria.ir"
}`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: SYNC STRATEGY */}
        {currentStep === 10 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام ۱۰: تعیین راهبرد همگام‌سازی داده‌ها (Synchronization Strategy)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'incremental', title: 'همگام‌سازی افزایشی (Incremental Cursor)', desc: 'فقط رکوردهای ایجاد یا تغییر یافته پس از آخرین نشانگر زمانی واکشی می‌شوند.' },
                { id: 'webhook', title: 'رویدادمحور و وب‌هوک (Real-time Push)', desc: 'دریافت فوری هر سفارش جدید از طریق Webhook endpoint با امضای رمزنگاری.' },
                { id: 'full', title: 'اسنپ‌شات کامل دوره‌ای (Full Snapshot)', desc: 'استخراج کامل جداول در ساعات کم‌ترافیک شب (مناسب برای مانده انبار).' },
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSyncStrategy(s.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    syncStrategy === s.id
                      ? 'bg-cyan-500/15 border-cyan-500 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-slate-200">{s.title}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 11: DRY RUN */}
        {currentStep === 11 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              گام ۱۱: شبیه‌سازی ورود داده بدون اعمال تغییر (Dry Run Simulation)
            </h3>
            <p className="text-slate-300">
              شبیه‌سازی فرآیند اعتبارسنجی ۱۰۰ رکورد اول بدون دستکاری دیتابیس عملیاتی جهت اطمینان از سلامت تطبیق:
            </p>
            <button
              onClick={handleRunDryRun}
              disabled={dryRunRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow"
            >
              <Play className={`h-4 w-4 ${dryRunRunning ? 'animate-spin' : ''}`} />
              <span>{dryRunRunning ? 'در حال اجرای شبیه‌سازی...' : 'اجرای شبیه‌سازی آزمایشی (Dry Run)'}</span>
            </button>

            {dryRunResult && (
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">تعداد رکوردهای جدید</div>
                  <div className="text-emerald-400 font-bold text-lg mt-0.5">+{dryRunResult.inserts}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">به‌روزرسانی‌های معتبر</div>
                  <div className="text-cyan-400 font-bold text-lg mt-0.5">{dryRunResult.updates}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">تداخل و خطا (Conflicts)</div>
                  <div className="text-slate-300 font-bold text-lg mt-0.5">{dryRunResult.conflicts} خطا</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 12, 13, 14: ACTIVATION & SUCCESS */}
        {currentStep >= 12 && (
          <div className="space-y-4 text-xs text-center py-6">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-100">
              اتصال سامانه با موفقیت تایید، فعال و در صف همگام‌سازی قرار گرفت!
            </h3>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              کانکتور {selectedProvider.name} با راهبرد {syncStrategy} فعال شد. رکوردهای جدید پس از گذر از موتور نرمال‌سازی مستقیماً به ماژول‌های پیش‌بینی فروش و خوشه‌بندی مشتریان تزریق خواهند شد.
            </p>
            <div className="pt-3">
              <button
                onClick={onFinish}
                className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow"
              >
                بازگشت به مرکز اتصالات سازمانی
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>گام قبلی</span>
          </button>

          <span className="text-slate-400 font-mono">
            گام {currentStep} از ۱۴
          </span>

          <button
            onClick={() => {
              if (currentStep === 14) {
                onFinish();
              } else {
                setCurrentStep((prev) => Math.min(14, prev + 1));
              }
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow"
          >
            <span>{currentStep === 14 ? 'پایان ویزارد' : 'گام بعدی'}</span>
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
