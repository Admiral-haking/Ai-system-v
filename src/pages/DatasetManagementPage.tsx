import React, { useState } from 'react';
import {
  Database,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { INITIAL_DATA_QUALITY_REPORT } from '../data/mockData';
import { DataQualityReport } from '../types';

export const DatasetManagementPage: React.FC = () => {
  const [report, setReport] = useState<DataQualityReport>(INITIAL_DATA_QUALITY_REPORT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFileName, setActiveFileName] = useState('UCI_Online_Retail_Dataset.csv');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Sample cleaned data preview
  const sampleRows = [
    { invoice: '536365', code: '85123A', desc: 'WHITE HANGING HEART T-LIGHT HOLDER', qty: 6, date: '2010-12-01 08:26', price: '2.55', cust: '17850', country: 'United Kingdom' },
    { invoice: '536365', code: '71053', desc: 'WHITE METAL LANTERN', qty: 6, date: '2010-12-01 08:26', price: '3.39', cust: '17850', country: 'United Kingdom' },
    { invoice: '536365', code: '84406B', desc: 'CREAM CUPID HEARTS COAT HANGER', qty: 8, date: '2010-12-01 08:26', price: '2.75', cust: '17850', country: 'United Kingdom' },
    { invoice: '536366', code: '22633', desc: 'HAND WARMER UNION JACK', qty: 6, date: '2010-12-01 08:28', price: '1.85', cust: '17850', country: 'United Kingdom' },
    { invoice: '536367', code: '84879', desc: 'ASSORTED COLOUR BIRD ORNAMENT', qty: 32, date: '2010-12-01 08:34', price: '1.69', cust: '13047', country: 'United Kingdom' },
    { invoice: 'C536379', code: 'D', desc: 'Discount (مرجوعی فاکتور - فیلتر شده)', qty: -1, date: '2010-12-01 09:41', price: '27.50', cust: '14527', country: 'United Kingdom' },
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setActiveFileName(file.name);
      setIsProcessing(true);
      setUploadSuccess(false);

      setTimeout(() => {
        setIsProcessing(false);
        setUploadSuccess(true);
        setReport({
          ...INITIAL_DATA_QUALITY_REPORT,
          totalRows: 541909,
          validRows: 397924,
        });
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <span>مدیریت ورود داده‌ها، پاکسازی و گزارش کیفیت (Data Pipeline)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ورود مجموعه داده مرجع UCI Online Retail یا فایل‌های CSV/XLSX سفارشی با خط لوله اعتبارسنجی
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition-colors shadow">
            <UploadCloud className="h-4 w-4" />
            <span>بارگذاری فایل جدید</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleSimulateUpload}
            />
          </label>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>فایل با موفقیت بررسی و پاکسازی شد. گزارش کیفیت داده به‌روزرسانی گردید.</span>
        </div>
      )}

      {/* Data Quality KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">کل رکوردهای خام ورودی</div>
          <div className="mt-1 text-xl font-black text-slate-100 font-mono">
            {report.totalRows.toLocaleString()} رکورد
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{activeFileName}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">سطرهای معتبر تاییدشده</div>
          <div className="mt-1 text-xl font-black text-emerald-400 font-mono">
            {report.validRows.toLocaleString()} رکورد
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">۷۳.۴٪ نرخ پالایش موفق</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">سفارش‌های لغو شده (Cancellations)</div>
          <div className="mt-1 text-xl font-black text-amber-400 font-mono">
            {report.canceledOrdersCount.toLocaleString()} فاکتور
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">شناسایی شده با پیشوند C</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">مشتریان یکتا و مجزا</div>
          <div className="mt-1 text-xl font-black text-cyan-400 font-mono">
            {report.uniqueCustomers.toLocaleString()} مشتری
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">در قالب ۳,۶۸۴ نوع محصول</div>
        </div>
      </div>

      {/* Cleaning Steps and Pipeline Rules */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center justify-between">
          <span>قوانین پاکسازی خط لوله پایتون (Pandas Pipeline Stages)</span>
          <span className="text-xs font-mono text-emerald-400">تست جامع: PASSED</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="font-bold text-slate-200">۱. کنترل فاکتورهای لغو شده</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              سفارش‌های دارای تعداد منفی یا پیشوند 'C' در ستون InvoiceNo تفکیک و به سفارش اصلی متصل یا از جمع خالص کسر شدند.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="font-bold text-slate-200">۲. مقادیر مفقوده (Missing Values)</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              تراکنش‌های بدون CustomerID (مهمان‌های ناشناس) برای تحلیل RFM کنار گذاشته شدند اما در پیش‌بینی تقاضای کل نگهداری شدند.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="font-bold text-slate-200">۳. نرمال‌سازی زمان و قیمت</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              تبدیل فیلد تاریخ به فرمت UTC و حذف قیمت‌های منفی یا صفر (خطاهای ورود داده اپراتور فروشگاه).
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-200">
            نمونه سطرهای پردازش‌شده در خط لوله (UCI Online Retail Transactions)
          </div>
          <span className="text-[11px] font-mono text-slate-400">نمایش نمونه ۶ سطر</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">InvoiceNo</th>
                <th className="py-2.5 px-3">StockCode</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">InvoiceDate</th>
                <th className="py-2.5 px-3">UnitPrice</th>
                <th className="py-2.5 px-3">CustomerID</th>
                <th className="py-2.5 px-3">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {sampleRows.map((r, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/30 ${
                    r.invoice.startsWith('C') ? 'bg-rose-500/5 text-rose-300' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold">{r.invoice}</td>
                  <td className="py-2.5 px-3 text-slate-400">{r.code}</td>
                  <td className="py-2.5 px-3 font-sans truncate max-w-xs">{r.desc}</td>
                  <td className="py-2.5 px-3">{r.qty}</td>
                  <td className="py-2.5 px-3 text-slate-400">{r.date}</td>
                  <td className="py-2.5 px-3 text-cyan-400">${r.price}</td>
                  <td className="py-2.5 px-3 text-slate-300">{r.cust}</td>
                  <td className="py-2.5 px-3 text-slate-400">{r.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
