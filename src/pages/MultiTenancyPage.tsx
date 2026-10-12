import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Layers,
  Database,
  Users,
  CheckCircle2,
  Globe,
  Key,
  Server,
  ArrowRight,
} from 'lucide-react';
import { TENANTS } from '../data/mockData';
import { Tenant } from '../types';

interface MultiTenancyPageProps {
  currentTenantId: string;
  onSelectTenant: (tenantId: string) => void;
}

export const MultiTenancyPage: React.FC<MultiTenancyPageProps> = ({
  currentTenantId,
  onSelectTenant,
}) => {
  const [tenants] = useState<Tenant[]>(TENANTS);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const handleSwitch = (t: Tenant) => {
    onSelectTenant(t.id);
    setActiveNotice(`سازمان فعال به «${t.name}» تغییر یافت. متغیرهای نشست و RLS دیتابیس مقید شدند.`);
    setTimeout(() => setActiveNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 9 · چندسازمانی، تفکیک داده‌ها و امنیت پیشرفته (Multi-Tenancy & RLS)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-400" />
            <span>مدیریت سازمان‌ها، شعب، ایزولاسیون داده‌ها و امنیت سازمانی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تفکیک سخت‌گیرانه داده‌های شعب با Row-Level Security در PostgreSQL، مدیریت سهمیه‌ها و کلیدهای رمزنگاری
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="h-4 w-4" />
          <span>ایزولاسیون سطح ردیف (PostgreSQL RLS): فعال</span>
        </div>
      </div>

      {activeNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>{activeNotice}</span>
        </div>
      )}

      {/* Security Architecture Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-cyan-400" />
            <span>سیاست Row-Level Security (RLS)</span>
          </div>
          <div className="text-sm font-black text-slate-100 font-mono">PostgreSQL Native RLS</div>
          <p className="text-[11px] text-slate-400">
            تضمین عدم دسترسی یک مستاجر به داده‌های مستاجر دیگر حتی در صورت خطای نرم‌افزاری
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Key className="h-4 w-4 text-emerald-400" />
            <span>رمزنگاری داده‌ها در سکون (At-Rest)</span>
          </div>
          <div className="text-sm font-black text-slate-100 font-mono">AES-256 + KMS Per-Tenant</div>
          <p className="text-[11px] text-slate-400">
            کلیدهای رمزنگاری اختصاصی برای هر سازمان جهت رعایت استانداردهای حریم خصوصی
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Server className="h-4 w-4 text-purple-400" />
            <span>سهمیه‌بندی منابع (Resource Quota)</span>
          </div>
          <div className="text-sm font-black text-slate-100 font-mono">Tenant Rate-Limiting</div>
          <p className="text-[11px] text-slate-400">
            جلوگیری از انحصار منابع محاسباتی توسط یک شعبه بر بستر کش توزیع‌شده Redis
          </p>
        </div>
      </div>

      {/* Tenants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenants.map((t) => {
          const isActive = currentTenantId === t.id;
          return (
            <div
              key={t.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{t.name}</h3>
                    {isActive && (
                      <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                        سازمان انتخابی شما
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-cyan-400">{t.subdomain}</div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  طرح: {t.plan.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">کاربران فعال</div>
                  <div className="font-bold text-slate-200 mt-0.5">{t.activeUsers} نفر</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">حجم سفارشات</div>
                  <div className="font-bold text-slate-200 mt-0.5">{t.ordersVolume.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">طرحواره دیتابیس</div>
                  <div className="font-bold text-cyan-300 mt-0.5 truncate">{t.dbSchema}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">ناحیه ابری: {t.region}</span>
                {!isActive ? (
                  <button
                    onClick={() => handleSwitch(t)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
                  >
                    سوئیچ به این سازمان
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>نشست کاری در این شعبه است</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
