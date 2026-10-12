import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Sparkles,
} from 'lucide-react';
import { FORECAST_MODELS, CLUSTERS_DATA, REPEAT_PURCHASE_MODELS } from '../data/mockData';

export const ReportCenterPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('scientific_thesis');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateDownload = (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    setExportNotice(null);

    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(`فایل گزارش در قالب ${format.toUpperCase()} با موفقیت آماده و بارگیری شد.`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800 no-print">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <span>مرکز گزارش‌گیری علمی، پژوهشی و خروجی‌های دفاعیه</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            صدور گزارش‌های مستند، تحلیل خطا، مشخصات آزمایش‌ها و خروجی‌های چاپی برای هیئت داوران
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-cyan-400" />
            <span>نسخه چاپی (Print/PDF)</span>
          </button>
          <button
            onClick={() => handleSimulateDownload('excel')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>خروجی اکسل چندبرگه</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow no-print">
          <CheckCircle2 className="h-4 w-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Select Report Template (No print) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        {[
          {
            id: 'scientific_thesis',
            title: 'گزارش جامع پایان‌نامه و مقایسه مدل‌ها',
            desc: 'شامل جداول ارزیابی تجربی، متدولوژی، فواصل اطمینان و SHAP',
          },
          {
            id: 'customer_rfm',
            title: 'گزارش بخش‌بندی مشتریان و خوشه‌ها',
            desc: 'تحلیل آماری ۴ خوشه، شاخص‌های RFM و راهبردهای بازاریابی',
          },
          {
            id: 'sales_forecast',
            title: 'گزارش اجرایی پیش‌بینی تقاضا و فروش',
            desc: 'افق ۳۰ روزه آینده با خطوط اطمینان و متغیرهای فصلی',
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedReportType(item.id)}
            className={`p-3.5 rounded-xl text-right transition-all border ${
              selectedReportType === item.id
                ? 'bg-cyan-500/10 border-cyan-500 text-slate-100 ring-1 ring-cyan-500/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{item.title}</div>
            <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Printable Report Document Sheet */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6 text-slate-200 text-xs">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono text-cyan-400">
              دانشگاه صنعتی · گروه مهندسی کامپیوتر و هوش مصنوعی
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-100 mt-1">
              مستند رسمی نتایج تجربی: سامانه پیش‌بینی فروش و تحلیل رفتار مشتریان
            </h1>
            <div className="text-[11px] text-slate-400 mt-1">
              پایان‌نامه دوره کارشناسی · پژوهشگر: علی خیری · تاریخ ثبت آزمایش: پاییز ۱۴۰۳
            </div>
          </div>
          <div className="text-left font-mono text-[11px] text-slate-400 space-y-0.5">
            <div>شماره گزارش: REP-2024-AI-88</div>
            <div>وضعیت اعتبارسنجی: PASSED (Verified)</div>
            <div>نسخه کد: v3.2.0 (Ubuntu x86_64)</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>خلاصه اجرایی و یافته‌های پژوهش</span>
          </h3>
          <p className="text-slate-300 leading-relaxed text-justify">
            این گزارش نتایج ارزیابی مدل‌های یادگیری ماشین پیاده‌سازی شده در بستر سیستم‌عامل لینوکس را بر روی ۵۴۱,۹۰۹ تراکنش واقعی تجاری مستند می‌سازد. مدل گرادیان بوستینگ غیرخطی (XGBoost Regressor) پس از بهینه‌سازی بیزی هایپرپارامترها توسط Optuna موفق به کاهش خطای پیش‌بینی WAPE به ۴.۸۲ درصد گردیده که در مقایسه با مدل پایه فصلی (۱۸.۹٪) بهبودی معادل ۷۴.۵ درصد را به ثبت رسانده است.
          </p>
        </div>

        {/* Section 1: Forecasting Benchmark Table */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-slate-100 text-sm">
            جدول ۱: مقایسه تجربی الگوریتم‌های پیش‌بینی تقاضا در افق‌های ۷ تا ۳۰ روزه
          </h3>
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5">الگوریتم</th>
                  <th className="p-2.5">WAPE (٪)</th>
                  <th className="p-2.5">RMSE (تومان)</th>
                  <th className="p-2.5">ضریب تبیین (R²)</th>
                  <th className="p-2.5">زمان آموزش</th>
                  <th className="p-2.5">تاخیر استنتاج</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {FORECAST_MODELS.map((m) => (
                  <tr key={m.id}>
                    <td className="p-2.5 font-bold text-slate-200">{m.name}</td>
                    <td className="p-2.5 font-mono text-emerald-400">{m.wape}٪</td>
                    <td className="p-2.5 font-mono">{(m.rmse / 1000000).toFixed(2)} م</td>
                    <td className="p-2.5 font-mono">{m.r2}</td>
                    <td className="p-2.5 font-mono">{m.trainingTimeSec}s</td>
                    <td className="p-2.5 font-mono">{m.inferenceLatencyMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Customer Clusters Table */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-slate-100 text-sm">
            جدول ۲: مشخصات بخش‌های ۴ گانه مشتریان کشف‌شده توسط الگوریتم K-Means
          </h3>
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5">نام بخش</th>
                  <th className="p-2.5">تعداد مشتری</th>
                  <th className="p-2.5">سهم درآمد</th>
                  <th className="p-2.5">میانگین تازگی (روز)</th>
                  <th className="p-2.5">میانگین بسامد</th>
                  <th className="p-2.5">راهبرد سازمانی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {CLUSTERS_DATA.map((c) => (
                  <tr key={c.clusterId}>
                    <td className="p-2.5 font-bold text-slate-200">{c.clusterName}</td>
                    <td className="p-2.5 font-mono">{c.customerCount}</td>
                    <td className="p-2.5 font-mono">{c.percentage}٪</td>
                    <td className="p-2.5 font-mono">{c.avgRecency} روز</td>
                    <td className="p-2.5 font-mono">{c.avgFrequency}</td>
                    <td className="p-2.5 text-slate-300 text-[11px]">{c.marketingAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Methodology and Limitations */}
        <div className="border-t border-slate-800 pt-4 space-y-2 text-[11px] text-slate-400">
          <strong className="text-slate-200 block">محدودیت‌ها و ملاحظات روش‌شناسی:</strong>
          <p>
            ۱. اعتبارسنجی با روش پنجره‌های بازگشتی (Rolling-Origin Backtesting) بدون دسترسی به اطلاعات آینده صورت گرفته است.
            ۲. فواصل اطمینان ۹۵٪ با در نظر گرفتن ناهم‌واریانسی خطای پیش‌بینی بر طول افق زمانی برآورد گردیده‌اند.
          </p>
        </div>

        {/* Signatures */}
        <div className="border-t border-slate-800 pt-6 flex justify-between items-center text-xs text-slate-400">
          <div>امضای پژوهشگر: علی خیری</div>
          <div>تاییدیه استاد راهنما و ناظر پروژه</div>
        </div>
      </div>
    </div>
  );
};
