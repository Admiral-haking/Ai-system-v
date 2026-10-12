import React, { useState } from 'react';
import {
  Database,
  Table,
  Columns,
  Key,
  ShieldCheck,
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  FileCode,
  Clock,
} from 'lucide-react';
import { SAMPLE_DATABASE_TABLES } from '../data/mockData';
import { DatabaseTableSchema } from '../types';

export const DatabaseExplorerPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<DatabaseTableSchema>(SAMPLE_DATABASE_TABLES[0]);
  const [activeQuery, setActiveQuery] = useState<string>(
    'SELECT invoice_no, customer_id, total_amount, order_status, created_at FROM public.ecommerce_orders LIMIT 5;'
  );
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const sampleRowsData = [
    { invoice_no: '536365', customer_id: 'CUST-17850', total_amount: '1,420,000', order_status: 'completed', created_at: '2024-11-15 08:26:00' },
    { invoice_no: '536366', customer_id: 'CUST-17850', total_amount: '890,000', order_status: 'completed', created_at: '2024-11-15 08:28:00' },
    { invoice_no: '536367', customer_id: 'CUST-13047', total_amount: '2,650,000', order_status: 'completed', created_at: '2024-11-15 08:34:00' },
    { invoice_no: '536368', customer_id: 'CUST-12583', total_amount: '4,100,000', order_status: 'completed', created_at: '2024-11-15 08:42:00' },
    { invoice_no: 'C536379', customer_id: 'CUST-14527', total_amount: '-275,000', order_status: 'refunded', created_at: '2024-11-15 09:41:00' },
  ];

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setQueryResult(sampleRowsData);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 2 · کاوشگر امن پایگاه داده و متادیتا (Read-Only Database Explorer)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <span>کاوشگر امن جداول، ستون‌ها و پیش‌نمایش داده‌های دیتابیس</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            اتصال فقط‌خواندنی به پایگاه‌های PostgreSQL / MySQL با استخراج طرحواره و تدابیر امنیتی ضد SQL Injection
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <Lock className="h-4 w-4" />
          <span>حالت فقط‌خواندنی اجباری (SET TRANSACTION READ ONLY)</span>
        </div>
      </div>

      {/* Grid: Tables Tree & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Tables Selector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Table className="h-4 w-4 text-cyan-400" />
              <span>جداول شناسایی‌شده دیتابیس</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">۳ جدول</span>
          </div>

          <div className="space-y-2">
            {SAMPLE_DATABASE_TABLES.map((tbl) => {
              const isSelected = selectedTable.tableName === tbl.tableName;
              return (
                <div
                  key={tbl.tableName}
                  onClick={() => setSelectedTable(tbl)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border text-xs ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-mono text-xs truncate" dir="ltr">
                    {tbl.tableName}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-sans">
                    <span>{tbl.columnsCount} ستون</span>
                    <span className="font-mono">{tbl.estimatedRows.toLocaleString()} سطر تخمینی</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns & Schema Inspector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono" dir="ltr">
                {selectedTable.tableName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                کلید اصلی: <strong className="text-cyan-400 font-mono">{selectedTable.primaryKey}</strong> · تعداد ستون‌ها: {selectedTable.columnsCount}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              {selectedTable.estimatedRows.toLocaleString()} سطر
            </span>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5">نام ستون (Column)</th>
                  <th className="p-2.5">نوع داده (Data Type)</th>
                  <th className="p-2.5">Nullable</th>
                  <th className="p-2.5">نقش کلیدی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {selectedTable.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-2.5 font-bold text-slate-200">{col.name}</td>
                    <td className="p-2.5 text-cyan-400">{col.type}</td>
                    <td className="p-2.5 text-slate-400">{col.nullable ? 'YES' : 'NO'}</td>
                    <td className="p-2.5">
                      {col.isPk ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">PRIMARY KEY</span>
                      ) : col.isFk ? (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">FOREIGN KEY</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Parameterized Query Runner with SSRF & SQL Injection Guards */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-cyan-400" />
            <span>اجرای پرس‌وجوی آزمایشی پارامتری فقط‌خواندنی (Safe Query Runner)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">حداکثر سقف واکشی: ۵۰۰ سطر</span>
        </div>

        <div className="space-y-2">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <textarea
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              rows={2}
              className="w-full bg-transparent font-mono text-xs text-slate-200 focus:outline-none resize-none text-left"
              dir="ltr"
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            <div className="text-[11px] text-slate-400">
              دستورات مجاز: فقط SELECT · مسدودسازی خودکار کلمات DROP، DELETE، UPDATE، INSERT، ALTER
            </div>
            <button
              onClick={handleRunQuery}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow"
            >
              <Play className={`h-3.5 w-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'در حال اجرا...' : 'اجرای پرس‌وجو'}</span>
            </button>
          </div>
        </div>

        {/* Live Query Results Table */}
        {queryResult && (
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5">invoice_no</th>
                  <th className="p-2.5">customer_id</th>
                  <th className="p-2.5">total_amount</th>
                  <th className="p-2.5">order_status</th>
                  <th className="p-2.5">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {queryResult.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-2.5 font-bold text-slate-200">{r.invoice_no}</td>
                    <td className="p-2.5 text-cyan-400">{r.customer_id}</td>
                    <td className="p-2.5 text-slate-100 font-bold">{r.total_amount}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {r.order_status}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400">{r.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
