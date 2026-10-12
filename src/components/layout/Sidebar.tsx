import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  LineChart,
  Users,
  PieChart,
  Repeat,
  Sparkles,
  Sliders,
  Scale,
  GitBranch,
  Database,
  FileText,
  Shield,
  GraduationCap,
  Terminal,
  ChevronLeft,
  Compass,
  Plug,
  Bot,
  GitPullRequest,
  Zap,
  Activity,
  Building2,
  Search,
  Code,
  Layers,
  CreditCard,
  Bug,
  Brain,
  ShieldAlert,
  Crown,
  Workflow,
  Share2,
  Network,
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavTabId =
  | 'overview'
  | 'decision-center'
  | 'store-discovery'
  | 'store-ai-architect'
  | 'unified-ecosystem'
  | 'saas-commercial'
  | 'super-admin'
  | 'deepseek-debug'
  | 'deep-learning'
  | 'data-quality-center'
  | 'automated-testing'
  | 'sales-analytics'
  | 'customer-analytics'
  | 'sales-forecast'
  | 'customer-segmentation'
  | 'repeat-purchase'
  | 'explainable-ai'
  | 'ai-copilot'
  | 'model-training'
  | 'model-comparison'
  | 'experiment-tracking'
  | 'autonomous-mlops'
  | 'universal-integration'
  | 'smart-wizard'
  | 'visual-mapping'
  | 'database-explorer'
  | 'connector-generator'
  | 'enterprise-connectors'
  | 'event-automation'
  | 'dataset-management'
  | 'observability'
  | 'multi-tenancy'
  | 'user-management'
  | 'report-center'
  | 'system-discovery'
  | 'thesis-defense'
  | 'linux-monorepo';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  currentRole: UserRole;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  collapsed,
  onToggleCollapsed,
}) => {
  const navGroups: NavGroup[] = [
    {
      groupName: 'تجاری‌سازی SaaS 2.0 و مدیریت کلان',
      items: [
        { id: 'saas-commercial', label: 'اشتراک و سهمیه‌های مصرفی', icon: CreditCard, badge: 'SaaS 2.0' },
        { id: 'super-admin', label: 'کنترل پنل مدیر ارشد پلتفرم', icon: Crown, badge: 'SuperAdmin', adminOnly: true },
        { id: 'automated-testing', label: 'تست خودکار و گیت انتشار', icon: Activity, badge: 'CI/CD' },
      ],
    },
    {
      groupName: 'هوش مصنوعی عمیق و دیباگ هوشمند',
      items: [
        { id: 'deepseek-debug', label: 'عیب‌یابی هوشمند DeepSeek', icon: Bug, badge: 'DeepSeek' },
        { id: 'deep-learning', label: 'استودیو یادگیری عمیق (PyTorch)', icon: Brain, badge: 'N-BEATS' },
        { id: 'data-quality-center', label: 'مرکز بهداشت و مهندسی داده', icon: ShieldAlert, badge: 'Quality' },
      ],
    },
    {
      groupName: 'نظارت و تصمیم‌یاری',
      items: [
        { id: 'overview', label: 'داشبورد مدیریت کلان', icon: LayoutDashboard },
        { id: 'decision-center', label: 'اتاق تصمیم‌گیری خودکار', icon: Compass, badge: 'Intelligence' },
        { id: 'sales-analytics', label: 'تحلیل داده‌های فروش', icon: TrendingUp },
        { id: 'customer-analytics', label: 'تحلیل رفتار مشتریان (RFM)', icon: Users },
      ],
    },
    {
      groupName: 'کشف و یادگیری فروشگاه من',
      items: [
        { id: 'unified-ecosystem', label: 'اکوسیستم یکپارچه ۳ پروژه (قلب دوم + سرای حمید + ورکر)', icon: Network, badge: 'Ecosystem' },
        { id: 'store-discovery', label: 'کشف ساختار فروشگاه (Next+Mongo)', icon: Workflow, badge: 'Discovery' },
        { id: 'store-ai-architect', label: 'دستیار معمار هوشمند فروشگاه', icon: Bot, badge: 'DeepSeek' },
      ],
    },
    {
      groupName: 'یکپارچه‌سازی و اتصال جهانی',
      items: [
        { id: 'universal-integration', label: 'هاب اتصال جامع سامانه‌ها', icon: Plug, badge: 'Hub' },
        { id: 'smart-wizard', label: 'ویزارد اتصال هوشمند', icon: Sparkles, badge: '۵ مرحله' },
        { id: 'visual-mapping', label: 'موتور تطبیق بصری فیلدها', icon: Layers, badge: 'AI Mapping' },
        { id: 'database-explorer', label: 'کاوشگر امن پایگاه داده', icon: Database, badge: 'Read-Only' },
        { id: 'connector-generator', label: 'ژنراتور خودکار کانکتور پایتون', icon: Code, badge: 'SDK Gen' },
      ],
    },
    {
      groupName: 'مدل‌های هوش مصنوعی',
      items: [
        { id: 'sales-forecast', label: 'پیش‌بینی هوشمند فروش', icon: LineChart, badge: 'XGBoost' },
        { id: 'customer-segmentation', label: 'خوشه‌بندی مشتریان', icon: PieChart, badge: 'K-Means' },
        { id: 'repeat-purchase', label: 'پیش‌بینی خرید مجدد', icon: Repeat },
        { id: 'explainable-ai', label: 'توضیح‌پذیری هوش مصنوعی', icon: Sparkles, badge: 'SHAP' },
        { id: 'ai-copilot', label: 'دستیار هوشمند سازمانی', icon: Bot, badge: 'Copilot' },
      ],
    },
    {
      groupName: 'آزمایشگاه و MLOps خودکار',
      items: [
        { id: 'model-training', label: 'استودیو آموزش و Optuna', icon: Sliders },
        { id: 'model-comparison', label: 'مقایسه علمی مدل‌ها', icon: Scale },
        { id: 'experiment-tracking', label: 'ردیابی آزمایش‌ها (MLflow)', icon: GitBranch },
        { id: 'autonomous-mlops', label: 'پایش رانش و قناری', icon: GitPullRequest, badge: 'Canary' },
      ],
    },
    {
      groupName: 'اتصال، رویدادها و داده‌ها',
      items: [
        { id: 'enterprise-connectors', label: 'اتصالات و وضعیت Sync', icon: Plug, badge: 'Shopify/Woo' },
        { id: 'event-automation', label: 'رویدادها و اتوماسیون (Outbox)', icon: Zap },
        { id: 'dataset-management', label: 'بارگذاری و پاکسازی داده', icon: Database },
      ],
    },
    {
      groupName: 'سازمان، پایش و امنیت',
      items: [
        { id: 'observability', label: 'رصدپذیری و اهداف SLO', icon: Activity, badge: 'OpenTelemetry' },
        { id: 'multi-tenancy', label: 'چندسازمانی و مستاجران', icon: Building2, badge: 'RLS' },
        { id: 'user-management', label: 'کاربران و لاگ‌های حسابرسی', icon: Shield, adminOnly: true },
        { id: 'report-center', label: 'مرکز گزارش‌های علمی', icon: FileText },
      ],
    },
    {
      groupName: 'معماری و پایان‌نامه',
      items: [
        { id: 'system-discovery', label: 'ممیزی معماری فاز صفر', icon: Search, badge: 'Baseline' },
        { id: 'thesis-defense', label: 'جلسه دفاع و اسلایدها', icon: GraduationCap, badge: '۱۸ اسلاید' },
        { id: 'linux-monorepo', label: 'کدها و اسکریپت‌های لینوکس', icon: Terminal, badge: 'مراحل ۱-۱۵' },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-l border-slate-800 bg-slate-900 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      } shrink-0`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-sm shadow">
              AI
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-100 tracking-tight">
                سامانه هوشمند فروش
              </div>
              <div className="text-[11px] text-cyan-400 font-mono">
                Enterprise AI Platform
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-sm">
            AI
          </div>
        )}

        <button
          onClick={onToggleCollapsed}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          title={collapsed ? 'باز کردن منو' : 'جمع کردن منو'}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || currentRole === 'admin'
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {group.groupName}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-right truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="border-t border-slate-800 p-3 bg-slate-950/40 text-[11px] text-slate-400 flex flex-col gap-1">
          <div className="flex justify-between items-center text-slate-300">
            <span>سیستم عامل:</span>
            <span className="font-mono text-cyan-400">Ubuntu 24.04 LTS</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>پایتون / فست‌ای‌پی‌آی:</span>
            <span className="font-mono text-cyan-400">v3.12 / v0.111</span>
          </div>
        </div>
      )}
    </aside>
  );
};
