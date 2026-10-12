import React, { useState } from 'react';
import {
  Plug,
  Search,
  Filter,
  Layers,
  Database,
  ShoppingBag,
  Globe,
  FileSpreadsheet,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { INTEGRATION_CATALOG_PROVIDERS, ENTERPRISE_CONNECTORS } from '../data/mockData';
import { DataSourceCategory, IntegrationLevel, IntegrationProviderInfo } from '../types';
import { NavTabId } from '../components/layout/Sidebar';

interface UniversalIntegrationHubPageProps {
  onNavigateToWizard: (providerId?: string) => void;
  onNavigateToMapping: () => void;
  onNavigateToGenerator: () => void;
  onNavigateToDbExplorer: () => void;
}

export const UniversalIntegrationHubPage: React.FC<UniversalIntegrationHubPageProps> = ({
  onNavigateToWizard,
  onNavigateToMapping,
  onNavigateToGenerator,
  onNavigateToDbExplorer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProviders = React.useMemo(() => {
    return INTEGRATION_CATALOG_PROVIDERS.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchLvl = selectedLevel === 'all' || p.level === selectedLevel;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchLvl && matchSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              UNIVERSAL AI INTEGRATION ENGINE · هاب جامع یکپارچه‌سازی سامانه‌ها
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              مرکز اتصال و تطبیق هوشمند انواع فروشگاه‌ها، دیتابیس‌ها و نرم‌افزارها
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              اتصال چندمنبعی بدون کدنویسی به انواع سیستم‌های تجاری (WooCommerce، دیجی‌کالا، سپیدار، دیتابیس‌های PostgreSQL/MySQL و وب‌سرویس‌های REST)، 
              کشف خودکار ساختار داده، تطبیق هوشمند فیلدها با هوش مصنوعی و ورود مستقیم به پایپ‌لاین‌های یادگیری ماشین.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateToWizard()}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Plug className="h-4 w-4" />
              <span>اتصال سامانه جدید با ویزارد هوشمند</span>
            </button>
            <button
              onClick={onNavigateToGenerator}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>تولید خودکار کانکتور با AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Level Explanations Table Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-cyan-400 font-bold">
            <span>سطح ۱: اتصال عمومی با پیکربندی</span>
            <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded font-mono">Level 1</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            شامل پایگاه‌های PostgreSQL، MySQL، فایل‌های CSV/Excel و APIهای استاندارد RESTful با کشف آنی ساختار.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>سطح ۲: آداپتورهای اختصاصی رسمی</span>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono">Level 2</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            سامانه‌های WooCommerce، Shopify، دیجی‌کالا، سپیدار سیستم و MongoDB با مدل داده پیش‌ساخته.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-amber-400 font-bold">
            <span>سطح ۳: سامانه‌های سفارشی و Legacy</span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">Level 3</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            صندوق‌های فروشگاهی حضوری (POS)، نرم‌افزارهای قدیمی فاقد وب‌سرویس و درگاه‌های نیازمند ایجنت امن.
          </p>
        </div>
      </div>

      {/* Filtering Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی درگاه، دیتابیس یا فروشگاه..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 pr-9 pl-3 py-1.5 text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Category & Level pills */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">همه دسته‌ها</option>
            <option value="database">پایگاه‌های داده (Databases)</option>
            <option value="ecommerce">فروشگاه‌های آنلاین (E-Commerce)</option>
            <option value="rest_api">وب‌سرویس و API (REST / GraphQL)</option>
            <option value="erp_crm">نرم‌افزارهای مالی و ERP / CRM</option>
            <option value="file">فایل و اسناد (CSV / Excel)</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">همه سطوح اتصال</option>
            <option value="level_1">سطح ۱ (عمومی با پیکربندی)</option>
            <option value="level_2">سطح ۲ (آداپتور رسمی)</option>
            <option value="level_3">سطح ۳ (سفارشی و Legacy)</option>
          </select>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
                    {provider.category === 'database' ? (
                      <Database className="h-5 w-5" />
                    ) : provider.category === 'ecommerce' ? (
                      <ShoppingBag className="h-5 w-5" />
                    ) : provider.category === 'file' ? (
                      <FileSpreadsheet className="h-5 w-5" />
                    ) : (
                      <Globe className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{provider.name}</h3>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {provider.version} · {provider.category}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    provider.level === 'level_1'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : provider.level === 'level_2'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {provider.level === 'level_1' ? 'سطح ۱' : provider.level === 'level_2' ? 'سطح ۲' : 'سطح ۳'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[38px]">
                {provider.description}
              </p>

              {/* Supported Entities */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-slate-400 font-medium">موجودیت‌های قابل دریافت:</div>
                <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                  {provider.supportedEntities.map((ent, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Auth Types */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>احراز هویت:</span>
                <span className="font-mono text-slate-300 truncate max-w-[160px]">
                  {provider.authTypes.join(' · ')}
                </span>
              </div>
            </div>

            {/* Connect Action Button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onNavigateToWizard(provider.id)}
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Plug className="h-3.5 w-3.5" />
                <span>راه‌اندازی اتصال در ویزارد هوشمند</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
