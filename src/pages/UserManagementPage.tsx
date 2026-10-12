import React, { useState } from 'react';
import {
  Shield,
  Users,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Activity,
  Terminal,
  UserPlus,
} from 'lucide-react';
import { AUDIT_LOGS } from '../data/mockData';
import { AuditLog } from '../types';

export const UserManagementPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>(AUDIT_LOGS);

  const users = [
    {
      id: 'USR-01',
      name: 'دکتر خبیری',
      email: 'khabiri@university.ac.ir',
      role: 'مدیر ارشد سامانه (Admin)',
      department: 'گروه هوش مصنوعی',
      status: 'فعال',
      lastLogin: '۱۴۰۳/۰۸/۲۵ ۱۰:۴۲',
    },
    {
      id: 'USR-02',
      name: 'علی خیری',
      email: 'ali.kheiri@student.ac.ir',
      role: 'تحلیل‌گر داده و پژوهشگر (Analyst)',
      department: 'پژوهشگر پروژه کارشناسی',
      status: 'فعال',
      lastLogin: '۱۴۰۳/۰۸/۲۵ ۰۹:۳۰',
    },
    {
      id: 'USR-03',
      name: 'سرویس پس‌زمینه لینوکس (Celery/Worker)',
      email: 'worker-daemon@internal.sys',
      role: 'حساب سیستمی (Daemon)',
      department: 'زیرساخت سرور',
      status: 'فعال',
      lastLogin: 'بلادرنگ (Daemon)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>مدیریت کاربران، کنترل دسترسی (RBAC) و لاگ‌های حسابرسی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تفکیک اختیارات مدیر و تحلیل‌گر، احراز هویت با Argon2id و ثبت تمام فعالیت‌ها در پایگاه داده
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <Lock className="h-3.5 w-3.5" />
          <span>امنیت: Argon2id + JWT HttpOnly</span>
        </div>
      </div>

      {/* Security Architecture Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400">الگوریتم هش کلمه عبور</div>
          <div className="text-base font-black text-slate-100 font-mono">Argon2id (RFC 9106)</div>
          <p className="text-[11px] text-slate-400">
            مقاوم در برابر حملات سخت‌افزاری GPU و جدول‌های رنگین‌کمانی (Rainbow Tables)
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400">مدیریت نشست و توکن‌ها</div>
          <div className="text-base font-black text-cyan-400 font-mono">JWT + Rotation Cookie</div>
          <p className="text-[11px] text-slate-400">
            توکن دسترسی ۱۵ دقیقه‌ای + توکن بازنشانی با کوکی امن HttpOnly و محافظت CSRF
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400">نرخ درخواست (Rate Limiting)</div>
          <div className="text-base font-black text-emerald-400 font-mono">Redis Token Bucket</div>
          <p className="text-[11px] text-slate-400">
            محدودیت ۵ درخواست ناموفق در دقیقه برای جلوگیری از Brute-Force ورود
          </p>
        </div>
      </div>

      {/* Users List Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <span>حساب‌های کاربری فعال در سیستم</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">نام و شناسه</th>
                <th className="py-3 px-4">پست الکترونیکی</th>
                <th className="py-3 px-4">نقش دسترسی (Role)</th>
                <th className="py-3 px-4">واحد سازمانی</th>
                <th className="py-3 px-4">آخرین ورود</th>
                <th className="py-3 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3 px-4 font-bold text-cyan-300">{u.role}</td>
                  <td className="py-3 px-4 text-slate-400">{u.department}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{u.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>لاگ‌های حسابرسی امنیتی (Security Audit Trail)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ثبت رویدادهای ارتقای مدل، بارگذاری دیتاست و تغییرات حساس پایگاه داده
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">PostgreSQL table: audit_logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">زمان رخداد</th>
                <th className="py-3 px-4">کاربر مجری</th>
                <th className="py-3 px-4">اقدام انجام‌شده (Action)</th>
                <th className="py-3 px-4">منبع درگیر (Resource)</th>
                <th className="py-3 px-4">آدرس IP</th>
                <th className="py-3 px-4">نتیجه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-sans text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-200">{log.user}</td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-300">{log.resource}</td>
                  <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {log.status}
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
