import React, { useState } from 'react';
import {
  Layers,
  Plug,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Globe,
  ShoppingBag,
  Database,
  Key,
  ShieldCheck,
  Terminal,
  Activity,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { ENTERPRISE_CONNECTORS, CONNECTOR_SYNC_LOGS } from '../data/mockData';
import { IntegrationConnector, SyncLog } from '../types';

export const EnterpriseConnectorsPage: React.FC = () => {
  const [connectors, setConnectors] = useState<IntegrationConnector[]>(ENTERPRISE_CONNECTORS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(CONNECTOR_SYNC_LOGS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; msg: string; success: boolean } | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<IntegrationConnector | null>(null);

  const handleTestConnection = (conn: IntegrationConnector) => {
    setTestingId(conn.id);
    setTestResult(null);

    setTimeout(() => {
      setTestingId(null);
      setTestResult({
        id: conn.id,
        msg: `اتصال به درگاه ${conn.name} با موفقیت برقرار شد. تاخیر پاسخ: ۱۲۴ میلی‌ثانیه. توکن احراز هویت معتبر است.`,
        success: true,
      });
      setTimeout(() => setTestResult(null), 5000);
    }, 1200);
  };

  const handleManualSync = (conn: IntegrationConnector) => {
    setTestingId(conn.id);

    setTimeout(() => {
      setTestingId(null);
      const newLog: SyncLog = {
        id: `SYNC-${Math.floor(1000 + Math.random() * 9000)}`,
        connectorId: conn.id,
        connectorName: conn.name,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        operation: 'PULL_ORDERS',
        recordsProcessed: Math.floor(15 + Math.random() * 40),
        status: 'SUCCESS',
        durationMs: 380,
        message: `همگام‌سازی دستی با موفقیت انجام شد و رکوردهای جدید در پایگاه داده ذخیره شدند.`,
      };
      setSyncLogs((prev) => [newLog, ...prev]);
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === conn.id
            ? { ...c, lastSyncAt: 'هم‌اکنون', recordsSynced: c.recordsSynced + newLog.recordsProcessed }
            : c
        )
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            ENTERPRISE INTEGRATION ECOSYSTEM · اکوسیستم اتصالات سازمانی و Connector SDK
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Plug className="h-5 w-5 text-cyan-400" />
            <span>مدیریت اتصال به فروشگاه‌های آنلاین، ERP و درگاه‌های وب‌هوک</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ورود داده‌های بلادرنگ از WooCommerce، دیجی‌کالا، سپیدار و سایر سامانه‌ها با Connector SDK استاندارد
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle2 className="h-4 w-4" />
          <span>۵ درگاه فعال · نرخ سلامت کل ۹۸.۸٪</span>
        </div>
      </div>

      {testResult && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center gap-2 shadow border ${
            testResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{testResult.msg}</span>
        </div>
      )}

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((conn) => {
          const isBusy = testingId === conn.id;
          return (
            <div
              key={conn.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
                      {conn.category === 'ecommerce' ? (
                        <ShoppingBag className="h-5 w-5" />
                      ) : conn.category === 'erp' ? (
                        <Database className="h-5 w-5" />
                      ) : conn.category === 'marketplace' ? (
                        <Globe className="h-5 w-5" />
                      ) : (
                        <Zap className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">{conn.name}</h3>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[180px]">
                        {conn.endpointUrl}
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    متصل
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">تعداد رکوردهای همگام</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {conn.recordsSynced.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">آخرین همگام‌سازی</div>
                    <div className="font-bold text-cyan-300 mt-0.5">{conn.lastSyncAt}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>روش احراز هویت:</span>
                    <span className="font-mono text-slate-300">{conn.authMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>محدودیت نرخ (Rate Limit):</span>
                    <span className="font-mono text-slate-300">{conn.rateLimitUsage}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTestConnection(conn)}
                  disabled={isBusy}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isBusy ? 'در حال تست...' : 'تست اتصال'}</span>
                </button>
                <button
                  onClick={() => handleManualSync(conn)}
                  disabled={isBusy}
                  className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                  <span>همگام‌سازی فوری</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration SDK Blueprint & Interface Specs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span>قرارداد استاندارد Connector SDK (برای افزودن اتصال جدید بدون دستکاری کدهای اصلی)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          برای اتصال هر فروشگاه یا سرویس جدید، تنها کافی است کلاس <code>BaseCommerceConnector</code> را پیاده‌سازی و در ریجستری ثبت نمایید:
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto text-left" dir="ltr">
          <div className="text-cyan-400">class BaseCommerceConnector(ABC):</div>
          <div className="text-slate-400">    @abstractmethod</div>
          <div>    async def test_connection(self) -&gt; ConnectionTestResult: ...</div>
          <div className="text-slate-400">    @abstractmethod</div>
          <div>    async def fetch_orders(self, since: datetime, cursor: str = None) -&gt; SyncBatch: ...</div>
          <div className="text-slate-400">    @abstractmethod</div>
          <div>    async def push_forecast(self, product_sku: str, forecast_30d: float) -&gt; bool: ...</div>
          <div className="text-slate-400">    @abstractmethod</div>
          <div>    async def handle_webhook(self, payload: dict, signature: str) -&gt; None: ...</div>
        </div>
      </div>

      {/* Live Sync History Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>تاریخچه عملیات همگام‌سازی داده‌ها (Sync Audit Logs)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{syncLogs.length} تراکنش اخیر</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">شناسه لاگ</th>
                <th className="py-2.5 px-3">کانکتور</th>
                <th className="py-2.5 px-3">نوع عملیات</th>
                <th className="py-2.5 px-3">زمان ثبت</th>
                <th className="py-2.5 px-3">رکوردهای پردازش‌شده</th>
                <th className="py-2.5 px-3">تاخیر (ms)</th>
                <th className="py-2.5 px-3">پیام خروجی</th>
                <th className="py-2.5 px-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {syncLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-slate-400">{log.id}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-200">{log.connectorName}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{log.operation}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-slate-200 font-bold">{log.recordsProcessed}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.durationMs}ms</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 max-w-xs truncate">{log.message}</td>
                  <td className="py-2.5 px-3">
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
