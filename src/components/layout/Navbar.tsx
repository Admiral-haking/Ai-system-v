import React from 'react';
import { 
  Bell, 
  Terminal, 
  Database, 
  Cpu, 
  ShieldCheck, 
  UserCheck, 
  Moon, 
  Sun,
  FileSpreadsheet,
  Building2,
  Globe,
  Calendar,
  Compass,
} from 'lucide-react';
import { UserRole } from '../../types';
import { TENANTS } from '../../data/mockData';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activePageTitle: string;
  onNavigateToReports: () => void;
  onNavigateToDecisionCenter: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentTenantId: string;
  onTenantChange: (tenantId: string) => void;
  isEnglish: boolean;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activePageTitle,
  onNavigateToReports,
  onNavigateToDecisionCenter,
  darkMode,
  onToggleDarkMode,
  currentTenantId,
  onTenantChange,
  isEnglish,
  onToggleLanguage,
}) => {
  const currentTenant = TENANTS.find((t) => t.id === currentTenantId) || TENANTS[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 backdrop-blur transition-colors">
      {/* Title & Path */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{activePageTitle}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise AI Platform · پلتفرم هوشمند تصمیم‌یاری و پیش‌بینی تقاضا
          </p>
        </div>
      </div>

      {/* Center: Tenant Switcher & System Telemetry */}
      <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-slate-300">
        {/* Tenant Selector Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-xs">
          <Building2 className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-slate-400 font-sans">سازمان:</span>
          <select
            value={currentTenantId}
            onChange={(e) => onTenantChange(e.target.value)}
            className="bg-transparent text-slate-200 font-sans font-bold focus:outline-none cursor-pointer"
          >
            {TENANTS.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100 font-sans">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SLO 99.9% (MET)</span>
        </div>
      </div>

      {/* Right Controls: Decision Center Quick Action, Role Switcher, Language & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Decision Center Quick Jump */}
        <button
          onClick={onNavigateToDecisionCenter}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition-colors"
          title="اتاق تصمیم‌گیری خودکار"
        >
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          <span>اتاق تصمیم (۴)</span>
        </button>

        {/* Language / Direction Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
          title="تغییر زبان (فارسی / English)"
        >
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span>{isEnglish ? 'EN' : 'فا'}</span>
        </button>

        {/* Role Selector Pill */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700/80 text-xs">
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium flex items-center gap-1 ${
              currentRole === 'admin'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>مدیر ارشد</span>
          </button>
          <button
            onClick={() => onRoleChange('analyst')}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium flex items-center gap-1 ${
              currentRole === 'analyst'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>تحلیل‌گر</span>
          </button>
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="تغییر تم"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 border-r border-slate-800 pr-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
            ع.خ
          </div>
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-slate-200 leading-none">علی خیری</div>
            <div className="text-[10px] text-cyan-400 mt-1 leading-none truncate max-w-[110px]">
              {currentTenant.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
