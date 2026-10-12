import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Layers,
  ArrowRight,
  Send,
  Bell,
  Check,
} from 'lucide-react';
import { PLATFORM_EVENTS, AUTOMATION_RULES } from '../data/mockData';
import { PlatformEvent, AutomationRule } from '../types';

export const EventAutomationPage: React.FC = () => {
  const [events, setEvents] = useState<PlatformEvent[]>(PLATFORM_EVENTS);
  const [rules, setRules] = useState<AutomationRule[]>(AUTOMATION_RULES);
  const [replayNotice, setReplayNotice] = useState<string | null>(null);

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleSimulateEvent = () => {
    const newEvent: PlatformEvent = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      eventType: 'order.created',
      sourceModule: 'Data Integration / WooCommerce Webhook',
      payloadSummary: `سفارش جدید آنلاین به ارزش ${(Math.random() * 4 + 1).toFixed(1)} میلیون تومان دریافت شد`,
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      status: 'PROCESSED',
      retryCount: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setReplayNotice('رویداد جدید با الگوی Transactional Outbox در صف رویدادها پردازش و ارسال شد.');
    setTimeout(() => setReplayNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 10 · معماری رویدادمحور و موتور اتوماسیون سازمانی (Event-Driven Outbox)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            <span>مدیریت رویدادهای سامانه، پایگاه Outbox و گردش‌کارهای خودکار</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ارسال و دریافت رویدادها بر پایه الگوی Transactional Outbox، تحویل تضمینی (At-Least-Once) و صف بن‌بست (DLQ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateEvent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors shadow"
          >
            <Send className="h-3.5 w-3.5" />
            <span>شبیه‌سازی انتشار رویداد</span>
          </button>
        </div>
      </div>

      {replayNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>{replayNotice}</span>
        </div>
      )}

      {/* Automation Rules Configuration Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>قوانین اتوماسیون و واکنش به رویدادها (Configurable Event Rules)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تعریف رفتار خودکار سامانه در مواجهه با ناهنجاری، کسری انبار یا رانش مدل
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">{rules.filter((r) => r.isEnabled).length} قانون فعال</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
                rule.isEnabled
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-slate-950/20 border-slate-800/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-cyan-400 font-bold">{rule.id}</span>
                  <span className="font-bold text-slate-200">{rule.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">
                    تعداد دفعات اجرا: {rule.executionsCount} بار
                  </span>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.isEnabled}
                      onChange={() => toggleRule(rule.id)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-[11px] text-slate-300 mr-1.5 font-bold">
                      {rule.isEnabled ? 'فعال' : 'غیرفعال'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-400 font-sans">رویداد محرک: </span>
                  <strong className="text-cyan-300">{rule.triggerEvent}</strong>
                  <span className="text-slate-400 font-sans mr-2">شرط: </span>
                  <span className="text-amber-300">{rule.condition}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-400 font-sans">اقدام عملیاتی: </span>
                  <span className="text-emerald-300">{rule.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactional Outbox Event Stream Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>جریان رویدادهای پردازش‌شده (Transactional Outbox Event Stream)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              لاگ رویدادهای منتشرشده در کارگزار پیام با پشتیبانی از صف Dead-Letter
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Broker: Redis Streams</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">شناسه رویداد</th>
                <th className="py-2.5 px-3">نوع رخداد (Event Type)</th>
                <th className="py-2.5 px-3">ماژول مبدا</th>
                <th className="py-2.5 px-3">خلاصه داده‌های رویداد</th>
                <th className="py-2.5 px-3">زمان ثبت</th>
                <th className="py-2.5 px-3">تعداد تلاش</th>
                <th className="py-2.5 px-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-slate-400">{evt.id}</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{evt.eventType}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{evt.sourceModule}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200 max-w-xs truncate">
                    {evt.payloadSummary}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{evt.timestamp}</td>
                  <td className="py-2.5 px-3 text-slate-400">{evt.retryCount}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {evt.status}
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
