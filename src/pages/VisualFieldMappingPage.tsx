import React, { useState } from 'react';
import {
  Layers,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Plus,
  Trash2,
  Check,
  Eye,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { CANONICAL_FIELDS, INITIAL_AI_MAPPING_RULES } from '../data/mockData';
import { FieldMappingRule } from '../types';

export const VisualFieldMappingPage: React.FC = () => {
  const [rules, setRules] = useState<FieldMappingRule[]>(INITIAL_AI_MAPPING_RULES);
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleToggleConfirm = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isConfirmed: !r.isConfirmed } : r))
    );
  };

  const handleSaveMapping = () => {
    setSaveNotice('طرحواره تطبیق فیلدها با موفقیت به عنوان نسخه v2.1 در دیتابیس ثبت و فعال گردید.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rules, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            PHASE 6 · موتور تطبیق بصری داده‌ها (Visual Field Mapping & Transformation)
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <span>طراح تطبیق بصری فیلدهای مبدا با مدل داده یکپارچه کسب‌وکار</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            انطباق هوشمند فیلدهای ناهمگون سیستم‌های خارجی با فیلدهای استاندارد سفارش، مشتری، کالا و انبار
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
            <span>{copied ? 'کپی شد!' : 'خروجی JSON'}</span>
          </button>
          <button
            onClick={handleSaveMapping}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors shadow"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>ذخیره و فعال‌سازی نگاشت</span>
          </button>
        </div>
      </div>

      {saveNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Visual 3-Column Mapping Board */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="font-bold text-slate-200">
            فیلدهای نگاشت‌شده فعال ({rules.length} قانون فعال)
          </div>
          <div className="text-slate-400 font-mono">
            منبع: WooCommerce REST API ➔ مدل استاندارد Enterprise
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-3 px-3 py-2 rounded-lg bg-slate-950/80 text-[11px] font-bold text-slate-400 border border-slate-800">
          <div className="col-span-4">فیلد در سیستم مبدا (Source Field)</div>
          <div className="col-span-3 text-center">نوع تبدیل و ضریب اطمینان AI</div>
          <div className="col-span-4">فیلد در مدل یکپارچه (Canonical Entity)</div>
          <div className="col-span-1 text-center">وضعیت</div>
        </div>

        {/* Rows List */}
        <div className="space-y-2.5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs font-mono"
            >
              {/* Source Field */}
              <div className="col-span-4 space-y-0.5 truncate">
                <div className="font-bold text-cyan-300 truncate" dir="ltr">
                  {rule.sourceField}
                </div>
                <div className="text-[10px] text-slate-400 font-sans truncate">
                  نمونه مبدا: <span className="text-slate-300 font-mono">{rule.sampleSourceValue}</span>
                </div>
              </div>

              {/* Transformation & AI Confidence */}
              <div className="col-span-3 text-center space-y-1">
                <span className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-mono">
                  {rule.transformation}
                </span>
                <div className="text-[10px] text-emerald-400 font-sans flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>{rule.confidencePct}٪ انطباق هوش مصنوعی</span>
                </div>
              </div>

              {/* Canonical Field */}
              <div className="col-span-4 space-y-0.5 truncate text-left" dir="ltr">
                <div className="font-bold text-emerald-300 truncate">
                  {rule.canonicalField}
                </div>
                <div className="text-[10px] text-slate-400 font-sans text-right">
                  خروجی نرمال: <span className="text-slate-300 font-mono">{rule.sampleOutputValue}</span>
                </div>
              </div>

              {/* Status Action */}
              <div className="col-span-1 text-center">
                <button
                  onClick={() => handleToggleConfirm(rule.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    rule.isConfirmed
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title={rule.isConfirmed ? 'تایید شده (کلیک برای لغو)' : 'تایید نشده'}
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side JSON Record Comparator */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
          <Eye className="h-4 w-4 text-cyan-400" />
          <span>مقایسه سطر به سطر رکورد ورودی با رکورد خروجی نرمال‌شده</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left" dir="ltr">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 font-sans">
              سند ورودی ناهمگون (WooCommerce Webhook Payload):
            </div>
            <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">{`{
  "order_number": "WC-18468",
  "status": "processing",
  "currency": "IRT",
  "date_created_gmt": "2024-11-15T08:24:10",
  "total_price_toman": "2450000",
  "billing": {
    "first_name": "آریا",
    "email": "aria.buyer@gmail.com"
  },
  "line_items": [
    { "sku": "85123A", "quantity": 6, "price": 245000 }
  ]
}`}</pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
            <div className="text-xs font-bold text-cyan-400 font-sans">
              سند نرمال‌شده مدل یکپارچه کسب‌وکار (Canonical Business Entity):
            </div>
            <pre className="text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">{`{
  "order": {
    "external_id": "WC-18468",
    "placed_at": "2024-11-15T08:24:10Z",
    "total_amount": 2450000,
    "currency": "IRT",
    "status": "processing"
  },
  "customer": {
    "customer_email": "aria.buyer@gmail.com"
  },
  "items": [
    { "sku": "85123A", "quantity": 6, "unit_price": 245000 }
  ]
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
