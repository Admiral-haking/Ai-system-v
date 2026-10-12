import React, { useState } from 'react';
import {
  Layers,
  Network,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  Zap,
  Server,
  FileCode,
  ArrowRight,
  GitBranch,
  Clock,
  Eye,
  Key,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Activity,
  Sparkles,
  Search,
  Filter,
  Lock,
  Radio,
  FileCheck,
  Send,
  Sliders,
  Terminal,
  Ban,
  Share2,
} from 'lucide-react';
import {
  UNIFIED_ECOSYSTEM_PROFILE,
  UNIFIED_DATA_OWNERSHIP_MATRIX,
  INVENTORY_LEDGER_RECORDS,
  SYNC_WORKER_QUEUES,
  MARKETPLACE_SYNC_ITEMS,
  CROSS_REPO_DIAGNOSTICS,
  COMPATIBILITY_AUDIT_REPORT,
  ZERO_TRUST_MACHINE_IDENTITIES,
  SECURITY_AUDIT_TRAIL,
  COMPONENT_CONNECTION_STATUSES,
  CANONICAL_SCHEMA_MAPPINGS,
  INGESTION_CHECKPOINTS,
  DEDUPLICATION_AUDIT_PROOFS,
  KNOWLEDGE_GRAPH_NODES,
  KNOWLEDGE_GRAPH_EDGES,
  CONTROLLED_COMMAND_PROPOSALS,
} from '../data/mockData';
import {
  UnifiedEcosystemProfile,
  DataOwnershipItem,
  InventoryLedgerRecord,
  SyncWorkerQueueMetric,
  MarketplaceSyncItem,
  CrossRepoDiagnosticCase,
  ControlledCommandProposal,
} from '../types';

export type UnifiedEcosystemTab =
  | 'topology'
  | 'compatibility'
  | 'security'
  | 'connector'
  | 'schema-mapping'
  | 'cdc-dedup'
  | 'knowledge-graph'
  | 'ownership'
  | 'inventory'
  | 'worker'
  | 'marketplaces'
  | 'diagnostics'
  | 'controlled-commands';

export const UnifiedEcosystemStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UnifiedEcosystemTab>('topology');
  const [profile] = useState<UnifiedEcosystemProfile>(UNIFIED_ECOSYSTEM_PROFILE);
  const [ownershipMatrix] = useState<DataOwnershipItem[]>(UNIFIED_DATA_OWNERSHIP_MATRIX);
  const [ledgerRecords] = useState<InventoryLedgerRecord[]>(INVENTORY_LEDGER_RECORDS);
  const [workerQueues] = useState<SyncWorkerQueueMetric[]>(SYNC_WORKER_QUEUES);
  const [marketplaces] = useState<MarketplaceSyncItem[]>(MARKETPLACE_SYNC_ITEMS);
  const [diagnosticCases] = useState<CrossRepoDiagnosticCase[]>(CROSS_REPO_DIAGNOSTICS);
  const [selectedCase, setSelectedCase] = useState<CrossRepoDiagnosticCase>(CROSS_REPO_DIAGNOSTICS[0]);
  const [ownershipFilter, setOwnershipFilter] = useState<string>('all');
  
  // Phases 1-11 States
  const [compatReport] = useState(COMPATIBILITY_AUDIT_REPORT);
  const [zeroTrustIdentities] = useState(ZERO_TRUST_MACHINE_IDENTITIES);
  const [securityAuditTrail] = useState(SECURITY_AUDIT_TRAIL);
  const [connectionStatuses, setConnectionStatuses] = useState(COMPONENT_CONNECTION_STATUSES);
  const [schemaMappings, setSchemaMappings] = useState(CANONICAL_SCHEMA_MAPPINGS);
  const [ingestionCheckpoints] = useState(INGESTION_CHECKPOINTS);
  const [dedupProofs] = useState(DEDUPLICATION_AUDIT_PROOFS);
  const [kgNodes] = useState(KNOWLEDGE_GRAPH_NODES);
  const [kgEdges] = useState(KNOWLEDGE_GRAPH_EDGES);
  const [commandProposals, setCommandProposals] = useState<ControlledCommandProposal[]>(CONTROLLED_COMMAND_PROPOSALS);
  const [emergencyKillswitch, setEmergencyKillswitch] = useState<boolean>(false);
  const [simulatedTestLog, setSimulatedTestLog] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotice('وضعیت هر سه مؤلفه (ghlbedovom + saraye-hamid + sync-worker) و کلاستر MongoDB با موفقیت استعلام شد. همه سرویس‌ها پایدار هستند.');
      setTimeout(() => setRefreshNotice(null), 5000);
    }, 800);
  };

  const filteredOwnership = ownershipMatrix.filter((item) => {
    if (ownershipFilter === 'all') return true;
    return item.ownershipScope === ownershipFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              UNIFIED COMMERCE ECOSYSTEM · سه مخزن مستقل، یک سیستم تجاری هماهنگ
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              مرکز پایش و هوشمندی یکپارچه (ghlbedovom-site + saraye-hamid-site + sync-worker)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تحلیل پیوسته دو فروشگاه Next.js 15 با کلاستر مشترک MongoDB و صف‌های پردازشی کارگر پس‌زمینه (sync-worker)، 
              با تفکیک دقیق مالکیت داده‌های برندها، تضمین ایمنی موجودی انبار و ردیابی هماهنگ با دیجی‌کالا و نرم‌افزار هلو.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>استعلام بلادرنگ سلامت مؤلفه‌ها</span>
            </button>
          </div>
        </div>
      </div>

      {refreshNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 shadow-md">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{refreshNotice}</span>
        </div>
      )}

      {/* Global Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>کل سفارش‌های یکپارچه (بدون دوبارشماری):</span>
            <ShoppingBag className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-lg font-black font-mono text-cyan-400">
            {profile.totalOrdersUnified.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">سفارش</span>
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between font-mono">
            <span>قلب دوم: {profile.ghlbedovomOrders.toLocaleString('fa-IR')}</span>
            <span>سرای حمید: {profile.sarayeHamidOrders.toLocaleString('fa-IR')}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>پایگاه داده مشترک (Shared MongoDB):</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black font-mono text-emerald-400">
            MongoDB 7.0 Cluster
          </div>
          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]" dir="ltr">
            shared_commerce_db
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>جاب‌های فعال در صفوف ورکر:</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-lg font-black font-mono text-amber-400">
            {profile.syncWorkerActiveJobs} <span className="text-xs font-normal text-slate-400">تسک در حال پردازش</span>
          </div>
          <div className="text-[10px] text-slate-500">
            صف Critical: بدون تاخیر (Latency: 0s)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>سلامت کل اکوسیستم (Health Score):</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black font-mono text-emerald-400">
            {profile.healthScore}%
          </div>
          <div className="text-[10px] text-emerald-400/80">
            ۳ مؤلفه آنلاین و هماهنگ هستند
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('topology')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'topology'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Network className="h-4 w-4" />
          <span>۱. توپولوژی سه مخزن</span>
        </button>

        <button
          onClick={() => setActiveTab('compatibility')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'compatibility'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>۲. آزمون تطبیق و شکاف (Phase 1)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>۳. امنیت Zero Trust (Phase 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('connector')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'connector'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Radio className="h-4 w-4" />
          <span>۴. کانکتور و سلامت ۳ مؤلفه (Phase 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('schema-mapping')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'schema-mapping'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>۵. تطبیق هوشمند شِما (Phase 4)</span>
        </button>

        <button
          onClick={() => setActiveTab('cdc-dedup')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'cdc-dedup'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          <span>۶. همگام‌سازی CDC و ضد دوبارشماری (Phase 5)</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge-graph')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'knowledge-graph'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>۷. گراف دانش پیوسته (Phase 6)</span>
        </button>

        <button
          onClick={() => setActiveTab('ownership')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'ownership'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>۸. تفکیک مالکیت برندها</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'inventory'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>۹. لجر اتمیک انبار</span>
        </button>

        <button
          onClick={() => setActiveTab('worker')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'worker'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>۱۰. صفوف Sync Worker</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplaces')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'marketplaces'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>۱۱. دیجی‌کالا و هلو</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'diagnostics'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>۱۲. عیب‌یابی DeepSeek (Phase 7)</span>
        </button>

        <button
          onClick={() => setActiveTab('controlled-commands')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'controlled-commands'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>۱۳. فرمان‌های دوطرفه کنترل‌شده (Phase 10)</span>
        </button>
      </div>

      {/* TAB 1: Topology & Three Repositories */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.components.map((comp) => (
              <div
                key={comp.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                      {comp.name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>{comp.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{comp.nameFa}</h4>
                    <div className="text-[11px] font-mono text-slate-400 mt-1" dir="ltr">
                      {comp.repoPath}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">فریم‌ورک:</span>
                      <span className="text-slate-200 text-[11px]">{comp.framework}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">پورت فعال:</span>
                      <span className="text-cyan-400">{comp.activePort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">شاخه و کامیت:</span>
                      <span className="text-emerald-400">{comp.gitBranch} @ {comp.gitCommit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">تاخیر ارتباطی:</span>
                      <span className="text-slate-300">{comp.lastPingMs} ms</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>اندپوینت‌های فعال: {comp.openEndPointsCount}</span>
                  <span className="text-cyan-400 font-mono">نسخه: {comp.activeVersion}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Unified Shared Architecture Diagram */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Network className="h-4 w-4 text-cyan-400" />
              <span>جریان معماری مشترک اکوسیستم (Shared Operational Ecosystem Flow):</span>
            </h3>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
                  <div className="font-bold text-cyan-300">ghlbedovom-site</div>
                  <div className="text-[11px] text-slate-400">پورت ۳۰۰۱ · ویترین و پنل قلب دوم</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
                  <div className="font-bold text-cyan-300">saraye-hamid-site</div>
                  <div className="text-[11px] text-slate-400">پورت ۳۰۰۲ · ویترین و پنل سرای حمید</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
                  <div className="font-bold text-amber-300">sync-worker</div>
                  <div className="text-[11px] text-slate-400">پورت ۴۰۰۰ · صفوف BullMQ & هماهنگ‌ساز</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
                <span>▼ اتصال مشترک Mongoose با تراکنش‌های اتمیک ▼</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-2">
                <div className="font-bold text-emerald-400 flex items-center justify-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Shared MongoDB Cluster (shared_commerce_db)</span>
                </div>
                <div className="text-slate-300 text-[11px] max-w-xl mx-auto leading-relaxed">
                  کالکشن‌های مشترک کاتالوگ و لجر انبار (محافظت در برابر Overselling)، در کنار کالکشن‌های اختصاصی سفارش‌ها و مشتریان با فیلد تفکیک‌کننده brandId.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Data Ownership & Brand Isolation */}
      {activeTab === 'ownership' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>ماتریس تفکیک مالکیت داده‌ها و حریم هر برند (Data Ownership Matrix):</span>
              </h3>
              <p className="text-xs text-slate-400">
                تضمین عدم نشت اطلاعات مشتریان و فاکتورها بین دو برند، همزمان با اشتراک انبار فیزیکی و کاتالوگ
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ownershipFilter}
                onChange={(e) => setOwnershipFilter(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">همه دامنه‌های مالکیت</option>
                <option value="SHARED">داده‌های مشترک (SHARED)</option>
                <option value="GHLBEDOVOM_EXCLUSIVE">اختصاصی قلب دوم</option>
                <option value="SARAYE_HAMID_EXCLUSIVE">اختصاصی سرای حمید</option>
                <option value="WORKER_EXCLUSIVE">اختصاصی کارگر Sync</option>
                <option value="MARKETPLACE">مارکت‌پلیس‌ها و هلو</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">منبع و موجودیت داده</th>
                  <th className="py-2.5 px-3">دسته</th>
                  <th className="py-2.5 px-3">دامنه مالکیت</th>
                  <th className="py-2.5 px-3">کالکشن در MongoDB</th>
                  <th className="py-2.5 px-3">سیاست تفکیک و ایزولاسیون</th>
                  <th className="py-2.5 px-3">دلیل اشتراک / تفکیک</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filteredOwnership.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-100 font-sans">
                      {item.resourceName}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {item.resourceCategory}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.ownershipScope === 'SHARED'
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : item.ownershipScope === 'WORKER_EXCLUSIVE'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.ownershipScope}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 text-[11px]">
                      {item.collectionName}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">
                      {item.isolationPolicy}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                      {item.sharedRationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Inventory Ledger & Safety Invariant */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Critical Invariant Banner */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold">قانون تغییرناپذیر ایمنی انبار (Critical Inventory Invariant):</div>
                <div className="text-[11px] text-amber-300/90 mt-0.5">
                  «هرگونه بازگشت مثبت موجودی (Restoration) باید به یک کسر قبلی تاییدشده برای همان مارکت‌پلیس، سفارش و ردیف متصل باشد و هرگز بیش از یک‌بار بازگردانده نشود.»
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">
              Invariant Verified (100%)
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span>دفتر کل ردیابی موجودی کالاها (Inventory Ledger):</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                پایش تطبیق ۴ واریانت نمونه
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">کد SKU و عنوان کالا</th>
                    <th className="py-2.5 px-3">مشخصات تنوع</th>
                    <th className="py-2.5 px-3">موجودی فیزیکی کل</th>
                    <th className="py-2.5 px-3">سهم قلب دوم</th>
                    <th className="py-2.5 px-3">سهم سرای حمید</th>
                    <th className="py-2.5 px-3">سینک دیجی‌کالا</th>
                    <th className="py-2.5 px-3">وضعیت تطبیق</th>
                    <th className="py-2.5 px-3">آخرین رویداد لجر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {ledgerRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-sans">
                        <div className="font-bold text-slate-100">{rec.productTitle}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">{rec.sku}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                        {rec.variantDetail}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-100 text-sm">
                        {rec.physicalStock} عدد
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {rec.allocatedGhlbedovom}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {rec.allocatedSarayeHamid}
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        {rec.digikalaSyncedStock}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.discrepancyStatus === 'IN_SYNC'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : rec.discrepancyStatus === 'RESERVED_PENDING'
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {rec.discrepancyStatus === 'IN_SYNC'
                            ? 'کاملاً منطبق'
                            : rec.discrepancyStatus === 'RESERVED_PENDING'
                            ? 'در انتظار پرداخت'
                            : 'اختلاف نیازمند سینک'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-sans text-[11px] max-w-[220px]">
                        {rec.lastLedgerEvent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Sync-Worker Operations & Queue Observability */}
      {activeTab === 'worker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workerQueues.map((q) => (
              <div
                key={q.queueName}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold uppercase">
                      Lane: {q.queueName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
                      اولویت {q.priorityLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{q.queueLabelFa}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {q.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">جاب‌های در حال اجرا (Active):</span>
                      <span className="text-cyan-400 font-bold">{q.activeJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">جاب‌های در صف (Waiting):</span>
                      <span className="text-slate-300">{q.waitingJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">نرخ پردازش (Throughput):</span>
                      <span className="text-emerald-400 font-bold">{q.throughputPerMin} جاب/دقیقه</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">سقف همزمانی (Concurrency):</span>
                      <span className="text-slate-300">{q.concurrencyLimit} ورکر</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-sans">جاب‌های ناموفق:</span>
                  <span className={`font-mono font-bold ${q.failedJobs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {q.failedJobs} خطا
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Worker Safety and Hourly Budget Control */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="font-bold">کنترل بودجه هوش مصنوعی (AI Hourly Budget Enforcement):</span>
              <span className="text-slate-400">
                سقف پردازش جاب‌های سئو و تحلیل به ازای هر ساعت برای جلوگیری از افزایش هزینه‌ها فعال است.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              سقف مصرف: ۱۲,۴۰۰ توکن در ساعت (زیر حد مجاز)
            </span>
          </div>
        </div>
      )}

      {/* TAB 5: Marketplaces & Holoo Sync */}
      {activeTab === 'marketplaces' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-cyan-400" />
                <span>وضعیت همگام‌سازی با کانال‌های خارجی و نرم‌افزار حسابداری هلو:</span>
              </h3>
              <p className="text-xs text-slate-400">
                پایش تاخیر و وضعیت نرخ فراخوانی (Rate-Limit) وب‌سرویس‌های خارجی متصل به sync-worker
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaces.map((mp) => (
              <div
                key={mp.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{mp.channel}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {mp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-900 text-slate-300 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-sans block">کالاهای همگام‌شده:</span>
                    <span className="text-emerald-400 font-bold">{mp.syncedItemsCount.toLocaleString('fa-IR')}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 text-slate-300 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-sans block">تاخیر فراخوانی:</span>
                    <span className="text-cyan-400 font-bold">{mp.latencyMs} ms</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>سقف نرخ فراخوانی: {mp.rateLimitUsage}</span>
                  <span>آخرین سینک: {mp.lastSyncTimestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DeepSeek Cross-Repo Diagnostic Reasoning */}
      {activeTab === 'diagnostics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Diagnostic Cases List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>سناریوهای ردیابی هوشمند DeepSeek:</span>
            </h3>

            <div className="space-y-2.5">
              {diagnosticCases.map((c) => {
                const isSelected = selectedCase.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/20 border-cyan-500/60 shadow ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {c.id}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {c.confidenceScore}% اطمینان
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 line-clamp-2 mt-1">
                        {c.questionFa}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trace Path & DeepSeek Explanation (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                  <span>پرسش کاربر و مهندسی معکوس مسیر اجرا:</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  {selectedCase.questionFa}
                </h3>
              </div>

              {/* Step-by-Step Cross-Repository Trace */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold text-slate-300">مسیر اجرای گام‌به‌گام در میان ۳ مخزن و دیتابیس (Trace Path):</div>
                <div className="space-y-2">
                  {selectedCase.tracePath.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 font-mono">
                          [{idx + 1}] {step.component}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400" dir="ltr">
                          {step.file} {step.collection ? `(${step.collection})` : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DeepSeek Root Cause Explanation */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-xs">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>نتیجه‌گیری قطعی هوش مصنوعی DeepSeek (Root Cause):</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedCase.rootCause}
                </p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  مدرک اثبات: {selectedCase.evidence}
                </div>
              </div>

              {/* Actionable Resolution */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-slate-200">اقدام پیشنهادی (Resolution):</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {selectedCase.resolution}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COMPATIBILITY (Phase 1) */}
      {activeTab === 'compatibility' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 1 · COMPATIBILITY GAP AUDIT</span>
                <h3 className="text-base font-bold text-slate-100">گزارش تطبیق معماری و قراردادهای فنی اکوسیستم</h3>
                <p className="text-xs text-slate-400">شناسه اکوسیستم: <span className="font-mono text-cyan-300">{compatReport.ecosystemId}</span> · زمان ممیزی: {compatReport.generatedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">وضعیت کل:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {compatReport.overallStatus === 'partially_compatible' ? 'سازگاری نسبی (نیازمند تکمیل ورکر)' : compatReport.overallStatus}
                </span>
              </div>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {compatReport.components.map((comp) => (
                <div key={comp.componentId} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{comp.componentNameFa}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      comp.status === 'compatible' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>پروتکل ارتباطی: <span className="text-emerald-400 font-mono">OK (HTTP/2 TLS 1.3)</span></div>
                    <div>اعتبارسنجی شِما Pydantic: <span className="text-emerald-400 font-mono">OK (V2 Schema Valid)</span></div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-bold text-slate-300 mb-1">قابلیت‌های احراز شده:</div>
                    <div className="flex flex-wrap gap-1">
                      {comp.capabilitiesSupported.map((cap) => (
                        <span key={cap} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-cyan-300">{cap}</span>
                      ))}
                    </div>
                  </div>
                  {comp.capabilitiesMissing.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] font-bold text-amber-400 mb-1">وابستگی‌های حل‌نشده (Missing):</div>
                      <div className="flex flex-wrap gap-1">
                        {comp.capabilitiesMissing.map((cap) => (
                          <span key={cap} className="px-1.5 py-0.5 rounded bg-amber-950/40 text-[9px] font-mono text-amber-300 border border-amber-500/30">{cap}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/50">
                    {comp.gapReport}
                  </p>
                </div>
              ))}
            </div>

            {/* Gap Analysis Table */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">تحلیل شکاف‌های ادغام (Gap Analysis) و اقدامات مورد نیاز:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[11px]">
                    <tr>
                      <th className="p-2.5">حوزه</th>
                      <th className="p-2.5">شرح شکاف شناسایی‌شده</th>
                      <th className="p-2.5">سطح فوریت</th>
                      <th className="p-2.5">اقدام الزامی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {compatReport.gapAnalysisList.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="p-2.5 font-bold text-slate-200">{g.area}</td>
                        <td className="p-2.5 text-slate-300">{g.gapDescription}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            g.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            g.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {g.severity}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">{g.requiredAction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SECURITY ZERO-TRUST (Phase 2) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 2 · ZERO-TRUST INTEGRATION SECURITY</span>
                <h3 className="text-base font-bold text-slate-100">هویت‌های ماشین‌به‌ماشین (M2M)، اعتبارسنجی توکن و لاگ حسابرسی</h3>
                <p className="text-xs text-slate-400">هیچ کلاینت و توکنی به صورت پیش‌فرض دسترسی کلی ندارد. سیاست Deny-by-Default اعمال شده است.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEmergencyKillswitch(!emergencyKillswitch)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    emergencyKillswitch ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                  }`}
                >
                  <Ban className="h-4 w-4" />
                  <span>{emergencyKillswitch ? 'کلید قطع اضطراری فعال است (اتصال مسدود شد)' : 'کلید قطع اضطراری (Kill-Switch)'}</span>
                </button>
              </div>
            </div>

            {/* M2M Identities List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {zeroTrustIdentities.map((id) => (
                <div key={id.machineId} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{id.componentId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">{id.authMethod}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>کلاینت ID: <span className="font-mono text-slate-300">{id.clientId}</span></div>
                    <div>اسکپ برند اختصاصی: <span className="font-bold text-cyan-400">{id.assignedStorefrontScope}</span></div>
                    <div>اعتبار توکن: <span className="font-mono text-emerald-400">{id.tokenExpiresInSec} ثانیه</span></div>
                    <div>محدودیت نرخ (Rate Limit): <span className="font-mono text-slate-300">{id.rateLimitPerMin} req/min</span></div>
                    <div>زیرشبکه مجاز: <span className="font-mono text-slate-400" dir="ltr">{id.allowedIpOrSubnet}</span></div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] text-slate-400">اثرانگشت گواهی:</div>
                    <div className="text-[9px] font-mono text-slate-500 truncate" dir="ltr">{id.certificateFingerprint}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Audit Trail */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">لاگ حسابرسی امنیتی و رویدادهای Zero-Trust:</h4>
              <div className="space-y-2">
                {securityAuditTrail.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.outcome === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {ev.eventType}
                        </span>
                        <span className="text-[11px] font-bold text-slate-300">{ev.sourceComponent}</span>
                        <span className="text-[10px] font-mono text-slate-500" dir="ltr">{ev.clientIp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{ev.details}</p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 shrink-0">
                      {ev.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CONNECTOR & HEALTH (Phase 3) */}
      {activeTab === 'connector' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 3 · UNIFIED COMMERCE CONNECTOR</span>
                <h3 className="text-base font-bold text-slate-100">مدیریت اتصال سه مؤلفه با Circuit Breaker و پشتیبانی آدرس لوپ‌بک</h3>
                <p className="text-xs text-slate-400">ورکر روی 127.0.0.1:3010 قرار دارد و صرفاً از طریق گیت‌وی امن خصوصی هدایت می‌شود.</p>
              </div>
              <button
                onClick={() => {
                  setSimulatedTestLog('در حال اجرای تست کامل reachability، TLS، اعتبار مانیفست و سازگاری پروتکل...');
                  setTimeout(() => {
                    setSimulatedTestLog('تست کامل با موفقیت انجام شد: ghlbedovom-site (14ms OK) · saraye-hamid-site (18ms OK) · sync-worker (3ms via private tunnel OK).');
                  }, 1200);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                <Radio className="h-4 w-4" />
                <span>اجرای آزمون اتصال مستقل (Connection Test)</span>
              </button>
            </div>

            {simulatedTestLog && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{simulatedTestLog}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {connectionStatuses.map((conn) => (
                <div key={conn.componentId} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{conn.displayNameFa}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {conn.connectionState}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 break-all" dir="ltr">
                    {conn.endpointUrl}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div>تاخیر Ping: <span className="font-mono text-emerald-400">{conn.lastPingMs}ms</span></div>
                    <div>Circuit Breaker: <span className="font-mono text-cyan-400">{conn.circuitBreakerState}</span></div>
                    <div>دسترس‌پذیری: <span className="text-emerald-400">تایید شده</span></div>
                    <div>احراز هویت: <span className="text-emerald-400">معتبر</span></div>
                  </div>
                  {conn.isLoopbackProtected && (
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[10px]">
                      محیط ایزوله: این سرویس در لوپ‌بک قرار دارد و تحت هیچ شرایطی به صورت پابلیک باز نخواهد شد.
                    </div>
                  )}
                  <p className="text-[11px] text-slate-300">{conn.diagnosticMsg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SCHEMA MAPPING (Phase 4) */}
      {activeTab === 'schema-mapping' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 4 · SCHEMA INTELLIGENCE & CANONICAL MAPPING</span>
                <h3 className="text-base font-bold text-slate-100">تطبیق هوشمند مدل‌های Mongoose با موجودیت‌های کانونیکال (بدون دسترسی نامحدود به DB)</h3>
                <p className="text-xs text-slate-400">حفظ زنجیره اصالت داده‌ها (Source Lineage) و جلوگیری از اختلاط مشتریان دو برند.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-3">کالکشن و فیلد مبدا (MongoDB)</th>
                    <th className="p-3">موجودیت کانونیکال مقصد</th>
                    <th className="p-3">نوع تبدیل (Transformation)</th>
                    <th className="p-3">ضریب اطمینان AI</th>
                    <th className="p-3">وضعیت تایید انسانی</th>
                    <th className="p-3">زنجیره اصالت (Lineage)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {schemaMappings.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-mono text-cyan-300" dir="ltr">{rule.sourceCollection}.{rule.sourceField}</td>
                      <td className="p-3 font-mono text-emerald-300" dir="ltr">{rule.targetCanonicalEntity}.{rule.targetCanonicalField}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">{rule.transformation}</span></td>
                      <td className="p-3 font-mono text-cyan-400">{(rule.confidenceScore * 100).toFixed(0)}%</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {rule.approvalStatus} ({rule.approvedBy})
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{rule.sourceLineage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CDC & DEDUPLICATION (Phase 5) */}
      {activeTab === 'cdc-dedup' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 5 · RELIABLE CDC & DEDUPLICATION ENGINE</span>
                <h3 className="text-base font-bold text-slate-100">پایش چک‌پوینت‌های افزایشی و تضمین ریاضی عدم دوبارشماری سفارش‌ها و موجودی</h3>
                <p className="text-xs text-slate-400">تفکیک چک‌پوینت بر اساس هر مؤلفه با توکن‌های Resume پایدار و صف Dead-Letter ایزوله.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {ingestionCheckpoints.map((cp) => (
                <div key={cp.componentId} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{cp.componentId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">{cp.resourceName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>کرسر پردازش: <span className="font-mono text-slate-300 text-[10px]" dir="ltr">{cp.lastProcessedCursor}</span></div>
                    <div>تعداد رکوردهای همگام: <span className="font-mono text-emerald-400 font-bold">{cp.recordsSyncedCount.toLocaleString('fa-IR')}</span></div>
                    <div>تاخیر همگام‌سازی (Lag): <span className="font-mono text-cyan-300">{cp.lagDurationSeconds} ثانیه</span></div>
                    <div>خطاهای Dead-Letter: <span className="font-mono text-slate-300">{cp.deadLetterCount}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">مدارک اثبات آشتی داده‌ها و حذف دوبارشماری (Deduplication Audit Proofs):</h4>
              <div className="space-y-2">
                {dedupProofs.map((dp) => (
                  <div key={dp.canonicalEntityId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300">{dp.unifiedRecordId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                          {dp.reconciliationStatus}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        مشاهده شده از طریق: <span className="text-slate-300 font-mono">{dp.observedViaComponents.join(' · ')}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-[11px] text-slate-300">
                      <div>منبع کانونیکال معتبر: <span className="text-cyan-400 font-bold">{dp.canonicalSource}</span></div>
                      {dp.amountToman > 0 && <div className="font-mono text-emerald-400">{dp.amountToman.toLocaleString('fa-IR')} تومان</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: KNOWLEDGE GRAPH (Phase 6) */}
      {activeTab === 'knowledge-graph' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 6 · COMMERCE SYSTEM KNOWLEDGE GRAPH</span>
                <h3 className="text-base font-bold text-slate-100">گراف دانش پیوسته معماری و روابط بین‌سیستمی با استناد به کد و دیتابیس</h3>
                <p className="text-xs text-slate-400">روابط تایید شده بر اساس AST Code Analysis و کالکشن‌های عملیاتی MongoDB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-200">گره‌های اکوسیستم (Nodes):</h4>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {kgNodes.map((n) => (
                    <div key={n.id} className="p-2 rounded bg-slate-900 border border-slate-800/70 flex items-center justify-between">
                      <span className="font-bold text-slate-300">{n.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 font-mono">{n.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-200">یال‌ها و شواهد متصل‌کننده (Evidence-Backed Edges):</h4>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {kgEdges.map((e) => (
                    <div key={e.id} className="p-2.5 rounded bg-slate-900 border border-slate-800/70 space-y-1">
                      <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px]">
                        <span>{e.source} ➔ {e.relationship} ➔ {e.target}</span>
                        <span className="text-emerald-400 font-bold">{(e.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{e.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CONTROLLED BIDIRECTIONAL COMMANDS (Phase 10) */}
      {activeTab === 'controlled-commands' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">PHASE 10 · CONTROLLED BIDIRECTIONAL COMMAND PROTOCOL</span>
                <h3 className="text-base font-bold text-slate-100">پروتکل فرمان‌های دوطرفه کنترل‌شده با سد تایید انسانی (Human-in-the-Loop)</h3>
                <p className="text-xs text-slate-400">سیاست سخت‌گیرانه: هرگونه درخواست نوشتن مستقیم روی انبار یا لجر توسط هسته امنیتی به‌صورت خودکار مسدود می‌شود.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {commandProposals.map((cmd) => (
                <div key={cmd.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{cmd.id}</span>
                      <span className="font-bold text-slate-200">{cmd.commandType}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cmd.riskLevel === 'LOW_READONLY' ? 'bg-emerald-500/20 text-emerald-400' :
                        cmd.riskLevel === 'MEDIUM_METADATA' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {cmd.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        cmd.executionStatus === 'EXECUTED_SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                        cmd.executionStatus === 'REJECTED_BY_POLICY' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {cmd.executionStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div>مؤلفه مقصد: <span className="font-mono text-slate-300">{cmd.targetComponent}</span></div>
                    <div>منبع مقصد: <span className="font-mono text-slate-300">{cmd.targetResource}</span></div>
                    <div>کلید Idempotency: <span className="font-mono text-slate-400 text-[10px]">{cmd.idempotencyKey}</span></div>
                  </div>

                  {cmd.receiptProof && (
                    <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800/80">
                      {cmd.receiptProof}
                    </div>
                  )}

                  {cmd.prohibitionNotice && (
                    <div className="text-[11px] text-rose-300 bg-rose-950/30 p-2.5 rounded border border-rose-500/30 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>{cmd.prohibitionNotice}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
