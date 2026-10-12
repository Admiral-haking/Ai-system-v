import React, { useState } from 'react';
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Cpu,
  Database,
  GitBranch,
  Terminal,
  Activity,
  FileCheck,
  Zap,
} from 'lucide-react';
import { AUDIT_FINDINGS } from '../data/mockData';
import { AuditFinding } from '../types';

export const SystemDiscoveryAuditPage: React.FC = () => {
  const [filterDomain, setFilterDomain] = useState<string>('all');

  const filteredFindings = React.useMemo(() => {
    if (filterDomain === 'all') return AUDIT_FINDINGS;
    return AUDIT_FINDINGS.filter((f) => f.domain === filterDomain);
  }, [filterDomain]);

  const capabilityInventory = [
    { module: 'Identity & Access (IAM)', maturity: 'Enterprise', status: 'Argon2id + JWT HttpOnly + Tenant RLS' },
    { module: 'Sales Forecasting Engine', maturity: 'Production', status: 'XGBoost v3.2 + Optuna (WAPE 4.82%)' },
    { module: 'Customer Analytics & RFM', maturity: 'Production', status: 'K-Means k=4 (Silhouette 0.642) + DBSCAN' },
    { module: 'Decision Intelligence', maturity: 'Enterprise Ready', status: 'Anomaly Detection + Stockout Projections' },
    { module: 'Integration Connectors SDK', maturity: 'Enterprise Ready', status: 'WooCommerce, Shopify, Digikala, Sepidar' },
    { module: 'Autonomous MLOps', maturity: 'Enterprise Ready', status: 'Drift Monitor (KS/PSI) + Canary Rollout' },
    { module: 'Event-Driven Bus', maturity: 'Enterprise Ready', status: 'Transactional Outbox + Redis Stream' },
    { module: 'Observability & Telemetry', maturity: 'Enterprise Ready', status: 'OpenTelemetry, Prometheus & SLOs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 0 · ممیزی جامع، ارزیابی معماری و خط مبنای سیستم (Baseline Audit)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400" />
            <span>گزارش کشف معماری، بررسی بدهی‌های فنی و نقشه ارتقای سازمانی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تحلیل قراردادهای API، اعتبارسنجی سازگاری به عقب، ارزیابی گلوگاه‌ها و ممیزی مخاطرات
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle2 className="h-4 w-4" />
          <span>تمام ۱۵ مرحله اولیه تایید و آماده ارتقا هستند</span>
        </div>
      </div>

      {/* Top 4 Architecture Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">الگوی معماری هدف</div>
          <div className="mt-1 text-base font-black text-cyan-300 font-mono">Modular Monolith</div>
          <p className="text-[11px] text-slate-400 mt-1">
            تفکیک مرزهای Bounded Context بدون پیچیدگی زودرس میکروسرویس
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">سازگاری نسخه‌ها (SemVer)</div>
          <div className="mt-1 text-base font-black text-emerald-400 font-mono">100% Backward Compatible</div>
          <p className="text-[11px] text-slate-400 mt-1">
            حفظ کامل قراردادهای /api/v1 با گسترش ماژول‌های جدید
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">پوشش تست‌های رگرسیون</div>
          <div className="mt-1 text-base font-black text-slate-100 font-mono">۸۹.۴٪ (Pytest & Vitest)</div>
          <p className="text-[11px] text-slate-400 mt-1">
            ارزیابی پیوسته خط لوله عدم نشت داده (Leakage-Safe)
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400 font-medium">بدهی فنی شناسایی‌شده</div>
          <div className="mt-1 text-base font-black text-amber-400 font-mono">۴ مورد (۳ مورد رفع شد)</div>
          <p className="text-[11px] text-slate-400 mt-1">
            ثبت شده در دفترچه ریسک سامانه (Risk Register)
          </p>
        </div>
      </div>

      {/* Capability Inventory Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>ماتریس جامع قابلیت‌های پلتفرم و سطح بلوغ معماری (Capability Inventory)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">۸ حوزه سازمانی فعال</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {capabilityInventory.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between"
            >
              <div className="space-y-0.5 truncate pr-1">
                <div className="font-bold text-slate-200">{item.module}</div>
                <div className="text-[11px] text-slate-400 font-mono">{item.status}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                {item.maturity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Debt and Risk Register Findings */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>دفترچه ریسک و ممیزی فنی (Technical Debt & Risk Register)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              نتایج بازرسی استاتیک کد، پروفایل کارایی و جداسازی دامنه‌ها
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            {['all', 'architecture', 'performance', 'security', 'ml_ops'].map((dom) => (
              <button
                key={dom}
                onClick={() => setFilterDomain(dom)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterDomain === dom
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dom === 'all' ? 'همه' : dom}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      finding.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : finding.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {finding.severity}
                  </span>
                  <span className="font-bold text-slate-200">{finding.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({finding.id})</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    finding.status === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {finding.status === 'VERIFIED' ? 'تایید و رفع شد' : 'کاهش ریسک'}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">{finding.description}</p>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-cyan-400">راهکار و تغییر اعمال‌شده: </strong>
                <span>{finding.resolutionPath}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
