import React, { useState } from 'react';
import {
  Search,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  FileCode,
  Globe,
  Share2,
  Workflow,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  Eye,
  Server,
  Key,
} from 'lucide-react';
import {
  CURRENT_CONNECTED_STORE,
  NEXTJS_MONGODB_TECH_DETECTION,
  DISCOVERED_MONGODB_COLLECTIONS,
  DISCOVERED_BUSINESS_ENTITIES,
  SAMPLE_STORE_KNOWLEDGE_GRAPH,
} from '../data/mockData';
import {
  StoreConnectionProfile,
  DiscoveredCollectionSchema,
  BusinessEntityDefinition,
  StoreKnowledgeGraphData,
} from '../types';

export const StoreDiscoveryCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'tech' | 'database' | 'entities' | 'knowledgeGraph'>('tech');
  const [storeProfile, setStoreProfile] = useState<StoreConnectionProfile>(CURRENT_CONNECTED_STORE);
  const [techDetection] = useState(NEXTJS_MONGODB_TECH_DETECTION);
  const [collections] = useState<DiscoveredCollectionSchema[]>(DISCOVERED_MONGODB_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<DiscoveredCollectionSchema>(DISCOVERED_MONGODB_COLLECTIONS[0]);
  const [entities] = useState<BusinessEntityDefinition[]>(DISCOVERED_BUSINESS_ENTITIES);
  const [knowledgeGraph] = useState<StoreKnowledgeGraphData>(SAMPLE_STORE_KNOWLEDGE_GRAPH);

  // Connection Wizard Form State
  const [wizardDbEngine, setWizardDbEngine] = useState<'mongodb' | 'postgresql' | 'mysql'>('mongodb');
  const [wizardConnectionUri, setWizardConnectionUri] = useState<string>(
    'mongodb://readonly_ai:secure_pass_9842@mongo-cluster.internal:27017/shop_production?readPreference=secondaryPreferred'
  );
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; latency: number; msg: string } | null>(null);

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionTestResult({
        success: true,
        latency: 28,
        msg: 'اتصال فقط‌خواندنی به کلاستر MongoDB با موفقیت برقرار شد. ۸ کالکشن و ۱۴۲,۸۵۰ سند قابل دسترس کشف گردید.',
      });
      setStoreProfile((prev) => ({
        ...prev,
        status: 'LEARNED',
        discoveredAt: 'هم‌اکنون',
      }));
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              AI STORE DISCOVERY & KNOWLEDGE GRAPH ENGINE · موتور کشف و شناخت هوشمند فروشگاه
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              شناسایی هوشمند معماری Next.js + Node.js + MongoDB و استخراج گراف دانشی فروشگاه
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              اتصال کاملاً امن و فقط‌خواندنی (Read-Only) به فروشگاه، کشف ساختار کالکشن‌ها و اسناد تو در تو (Nested Documents)، 
              تحلیل ماشین وضعیت سفارش‌ها و ایجاد مدل دانشی پایدار و نسخه دار جهت پیش‌بینی دقیق فروش.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>دسترسی امن فقط خواندنی (Read-Only)</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
              نسخه گراف دانش: {knowledgeGraph.version}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('tech')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'tech'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>۱. شناسایی تکنولوژی (Next.js / Node / MongoDB)</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'database'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>۲. کاوشگر ساختار کالکشن‌ها و فیلدها</span>
        </button>

        <button
          onClick={() => setActiveTab('entities')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'entities'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Workflow className="h-4 w-4" />
          <span>۳. موجودیت‌ها و ماشین وضعیت سفارش</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledgeGraph')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'knowledgeGraph'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>۴. گراف دانشی یکپارچه فروشگاه (Knowledge Graph)</span>
        </button>

        <button
          onClick={() => setActiveTab('wizard')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'wizard'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Key className="h-4 w-4" />
          <span>پیکربندی ویزارد اتصال فروشگاه</span>
        </button>
      </div>

      {/* TAB 1: Technology & Architecture Detection */}
      {activeTab === 'tech' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold">فریم‌ورک فرانت‌اند (Frontend):</span>
                <Globe className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-sm font-black text-slate-100 font-mono">
                {techDetection.frontendFramework}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                معماری App Router با رندرینگ سرور کامپوننت (RSC) و پشتیبانی داخلی از بهینه‌سازی تصاویر.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold">موتور بک‌اند و API (Backend):</span>
                <Server className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-sm font-black text-slate-100 font-mono">
                {techDetection.backendFramework}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                مسیرهای استاندارد در src/app/api با استخراج مستقیم توکن‌های احراز هویت و پارامترها.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold">پایگاه داده و درایور (Database & ODM):</span>
                <Database className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-sm font-black text-slate-100 font-mono">
                {techDetection.databaseDriver}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                استفاده از مدل‌های Mongoose با شاخص‌های ترکیبی و تراکنش‌های چندسندی اتمیک.
              </p>
            </div>
          </div>

          {/* Detected Modules & Code Evidence */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-emerald-400" />
                  <span>ماژول‌های کلیدی کسب‌وکار کشف‌شده در سورس‌کد فروشگاه (Detected Modules):</span>
                </h3>
                <p className="text-xs text-slate-400">
                  تحلیل خودکار فایل‌های مخزن پروژه و استخراج مستندات فرآیندها با تطبیق الگو
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ضریب اطمینان: {techDetection.confidenceScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {techDetection.detectedModules.map((mod, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{mod.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300" dir="ltr">
                      {mod.path}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    هدف: {mod.purpose}
                  </p>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    مدرک اثبات: {mod.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Database Schema & Collections Explorer */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Collections List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>کالکشن‌های MongoDB کشف‌شده:</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {collections.length} کالکشن اصلی
              </span>
            </div>

            <div className="space-y-2.5">
              {collections.map((coll) => {
                const isSelected = selectedCollection.name === coll.name;
                return (
                  <button
                    key={coll.name}
                    onClick={() => setSelectedCollection(coll)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/20 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 font-mono flex items-center gap-1.5">
                          <span>{coll.name}</span>
                          {coll.nestedDocumentsDetected && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-sans">
                              اسناد تو در تو
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {coll.confidencePct}% تطبیق
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ~{coll.documentCountEstimate.toLocaleString('fa-IR')} سند · شناسه: {coll.primaryKeyField}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection Schema & Fields Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-emerald-400">
                    Collection: {selectedCollection.name}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                    طرحواره و فیلدهای استخراج‌شده ({selectedCollection.fields.length} فیلد شناسایی شد)
                  </h3>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  متوسط حجم سند: {selectedCollection.avgDocumentSizeBytes} بایت
                </div>
              </div>

              {/* Fields Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-2 px-3">نام فیلد</th>
                      <th className="py-2 px-3">نوع داده در MongoDB</th>
                      <th className="py-2 px-3">ارجاع به کالکشن</th>
                      <th className="py-2 px-3">مقدار نمونه (Sample)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {selectedCollection.fields.map((field, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{field.name}</span>
                          {field.isPrimaryKey && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-sans">
                              کلید اصلی
                            </span>
                          )}
                          {field.isNestedDocument && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-sans">
                              Sub-Doc
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-cyan-300 text-[11px]">
                          {field.type}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {field.refCollection ? (
                            <span className="text-emerald-400">Ref: {field.refCollection}</span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[200px]" dir="ltr">
                          {field.sampleValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes Summary */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300">ایندکس‌های فعال در این کالکشن:</div>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  {selectedCollection.indexes.map((idx, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      <span className="text-cyan-400 font-bold">{idx.name}: </span>
                      <span className="text-slate-400">{idx.keys}</span>
                      {idx.unique && <span className="text-amber-400 mr-1.5">(Unique)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Business Entities & State Machine */}
      {activeTab === 'entities' && (
        <div className="space-y-6">
          {/* Entities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entities.map((ent, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-100">{ent.nameFa}</h4>
                    <div className="text-xs font-mono text-slate-400">
                      متناظر با کالکشن: <span className="text-emerald-400">{ent.matchedCollection}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    اطمینان: {ent.confidencePct}%
                  </span>
                </div>

                {/* Key Field Mappings */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-sans font-bold">نگاشت فیلدهای کلیدی:</div>
                  {Object.entries(ent.keyFields).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px]">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-cyan-300">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Relationships */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] text-slate-400 font-bold">ارتباطات شناسایی شده:</div>
                  {ent.relationships.map((rel, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px] font-mono"
                    >
                      <span className="text-slate-200">
                        {ent.entityType} ({rel.relationType}) {rel.targetEntity}
                      </span>
                      <span className="text-emerald-400 text-[10px]">
                        {rel.foreignKey}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Lifecycle State Machine */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Workflow className="h-4 w-4 text-emerald-400" />
                <span>ماشین وضعیت چرخه سفارش و کسر موجودی انبار (Order State Machine):</span>
              </h3>
              <p className="text-xs text-slate-400">
                تحلیل خودکار توابع وضعیت سفارش در فایل src/lib/services/order.service.ts و کنترل تراکنش‌ها
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {knowledgeGraph.stateMachines[0].transitions.map((trans, tIdx) => (
                <div
                  key={tIdx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-amber-400 font-bold">{trans.from}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-emerald-400 font-bold">{trans.to}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    رویداد محرک: {trans.trigger}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Store Knowledge Graph Visualizer */}
      {activeTab === 'knowledgeGraph' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                <span>مدل دانشی نسخه دار ساختار فروشگاه (Store Knowledge Graph):</span>
              </h3>
              <p className="text-xs text-slate-400">
                شبکه ارتباطی میان اندپوینت‌های Next.js، سرویس‌های نود، کالکشن‌های مانگو، و موجودیت‌های تجاری
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {knowledgeGraph.nodes.length} گره · {knowledgeGraph.edges.length} یال ارتباطی
            </span>
          </div>

          {/* Visual Interactive Graph Simulator */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 min-h-[380px] flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category 1: Routes & Services */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-cyan-400 font-mono">
                  [1] Next.js Routes & Services:
                </div>
                {knowledgeGraph.nodes
                  .filter((n) => n.category === 'route' || n.category === 'service')
                  .map((node) => (
                    <div
                      key={node.id}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1"
                    >
                      <div className="text-xs font-bold text-slate-100 font-mono">
                        {node.label}
                      </div>
                      <div className="text-[11px] text-slate-400">{node.details}</div>
                    </div>
                  ))}
              </div>

              {/* Category 2: MongoDB Collections */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  [2] MongoDB Collections:
                </div>
                {knowledgeGraph.nodes
                  .filter((n) => n.category === 'collection')
                  .map((node) => (
                    <div
                      key={node.id}
                      className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 space-y-1"
                    >
                      <div className="text-xs font-bold text-emerald-300 font-mono">
                        {node.label}
                      </div>
                      <div className="text-[11px] text-slate-400">{node.details}</div>
                    </div>
                  ))}
              </div>

              {/* Category 3: Relationships & Workflows */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-purple-400 font-mono">
                  [3] Relationships & AI Flow:
                </div>
                {knowledgeGraph.edges.slice(0, 4).map((edge) => (
                  <div
                    key={edge.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="font-bold text-purple-300 font-mono text-[11px]">
                      {edge.relationship}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {edge.source} -&gt; {edge.target}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>آخرین به‌روزرسانی مدل دانشی: {knowledgeGraph.generatedAt}</span>
              <span className="text-emerald-400 font-bold">وضعیت: تایید شده و آماده تحلیل‌های پیشرفته AI</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Connection Wizard Settings */}
      {activeTab === 'wizard' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span>پیکربندی پارامترهای اتصال امن به پایگاه داده فروشگاه:</span>
            </h3>
            <p className="text-xs text-slate-400">
              پلتفرم به هیچ عنوان دسترسی نوشتن نخواهد داشت؛ تنها دسترسی خواندن (readPreference=secondary) مجاز است.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">نوع موتور پایگاه داده:</label>
              <select
                value={wizardDbEngine}
                onChange={(e) => setWizardDbEngine(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="mongodb">MongoDB (Atlas / Self-Hosted)</option>
                <option value="postgresql">PostgreSQL (Relational)</option>
                <option value="mysql">MySQL / MariaDB</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">رشته اتصال فقط‌خواندنی (Read-Only Connection URI):</label>
              <input
                type="text"
                value={wizardConnectionUri}
                onChange={(e) => setWizardConnectionUri(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 font-mono text-left focus:border-emerald-500 focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          {connectionTestResult && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{connectionTestResult.msg}</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-300">
                Latency: {connectionTestResult.latency}ms
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isTestingConnection ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span>در حال اعتبارسنجی اتصال و کشف کالکشن‌ها...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>تست اتصال و کشف ساختار دیتابیس</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
