import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  ShieldCheck,
  Clock,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { INITIAL_RECOMMENDATIONS } from '../data/mockData';
import { RecommendationItem } from '../types';

export const DecisionCenterPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(INITIAL_RECOMMENDATIONS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const filteredRecs = React.useMemo(() => {
    return recommendations.filter((r) => {
      const matchCat = filterCategory === 'all' || r.category === filterCategory;
      const matchUrg = filterUrgency === 'all' || r.urgency === filterUrgency;
      return matchCat && matchUrg;
    });
  }, [recommendations, filterCategory, filterUrgency]);

  const handleApprove = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'approved', approvedBy: 'علی خیری (تحلیل‌گر داده)' } : r
      )
    );
    setFeedbackNotice(`پیشنهاد ${id} با موفقیت تایید شد و دستور اقدام به صف کارها ارسال گردید.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleReject = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
    setFeedbackNotice(`پیشنهاد ${id} رد شد و دلیل آن در لاگ‌های سیستمی ثبت گردید.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            DECISION INTELLIGENCE · مرکز هوشمندی تصمیم‌گیری و راهبردهای عملیاتی
          </div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Compass className="h-5 w-5 text-cyan-400" />
            <span>اتاق تصمیم‌گیری خودکار و اولویت‌بندی پیشنهادهای تجاری</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تبدیل خروجی مدل‌های یادگیری ماشین به پیشنهادهای پیشگیرانه موجودی، قیمت‌گذاری و نگهداری مشتریان
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <ShieldCheck className="h-4 w-4" />
          <span>قانون حفاظت: اعمال هرگونه تغییر مستلزم تایید انسانی (Human-in-the-Loop) است</span>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">پیشنهادهای نیازمند بررسی</div>
          <div className="mt-1 text-2xl font-black text-amber-400 font-mono">
            {recommendations.filter((r) => r.status === 'pending').length} مورد
          </div>
          <div className="text-[11px] text-slate-400 mt-1">اولویت‌بندی شده بر مبنای شدت اثر</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">پیشنهادهای تایید و اجرا شده</div>
          <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">
            {recommendations.filter((r) => r.status === 'approved').length} مورد
          </div>
          <div className="text-[11px] text-slate-400 mt-1">نرخ پذیرش تیم عملیات: ۸۵٪</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">میانگین ضریب اطمینان مدل‌ها</div>
          <div className="mt-1 text-2xl font-black text-cyan-400 font-mono">۸۶.۸٪</div>
          <div className="text-[11px] text-slate-400 mt-1">برآورد عدم قطعیت با آزمون بیزی</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">ارزش کل ریسک مهارشده</div>
          <div className="mt-1 text-2xl font-black text-slate-100 font-mono">۴۴۴ م تومان</div>
          <div className="text-[11px] text-emerald-400 mt-1">پیشگیری از کسری کالا و ریزش B2B</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">دسته‌بندی موضوعی:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">همه حوزه‌ها</option>
            <option value="inventory">موجودی و تامین انبار (Inventory)</option>
            <option value="demand">ناهنجاری تقاضا (Demand Anomaly)</option>
            <option value="churn">نگهداری مشتریان (Churn Prevention)</option>
            <option value="pricing">کشش قیمت و تخفیف (Pricing)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">سطح فوریت:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg border border-slate-700">
            {['all', 'critical', 'high', 'medium', 'low'].map((u) => (
              <button
                key={u}
                onClick={() => setFilterUrgency(u)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterUrgency === u
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {u === 'all'
                  ? 'همه'
                  : u === 'critical'
                  ? 'بحرانی'
                  : u === 'high'
                  ? 'فوری'
                  : u === 'medium'
                  ? 'متوسط'
                  : 'عادی'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className={`rounded-2xl border p-5 shadow-sm transition-all space-y-3 ${
              rec.status === 'approved'
                ? 'bg-emerald-950/20 border-emerald-700/40'
                : rec.status === 'rejected'
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : rec.urgency === 'critical'
                ? 'bg-rose-950/20 border-rose-700/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            {/* Top Bar of Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    rec.urgency === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : rec.urgency === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  فوریت: {rec.urgency === 'critical' ? 'بحرانی' : rec.urgency === 'high' ? 'فوری' : 'متوسط'}
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  ضریب اطمینان مدل: {rec.confidencePct}٪
                </span>
                <span className="text-xs font-bold text-slate-100">{rec.title}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{rec.createdAt}</span>
              </div>
            </div>

            {/* Evidence & Impact 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>مستندات و مدل استخراج‌کننده:</span>
                </div>
                <div className="text-slate-200">{rec.evidenceSource}</div>
                <div className="text-[10px] text-slate-400 font-mono">الگوریتم: {rec.modelReference}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  <span>اثر مورد انتظار بر کسب‌وکار (Impact):</span>
                </div>
                <div className="text-emerald-300 font-medium">{rec.expectedImpact}</div>
                <div className="text-[10px] text-slate-400">{rec.riskAssessment}</div>
              </div>
            </div>

            {/* Suggested Action Box & Human Approval Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs bg-cyan-500/10 border border-cyan-500/20 p-2.5 rounded-xl text-cyan-200 flex-1">
                <strong className="text-cyan-400">اقدام پیشنهادی: </strong>
                <span>{rec.suggestedAction}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {rec.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(rec.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>تایید و صدور دستور اقدام</span>
                    </button>
                    <button
                      onClick={() => handleReject(rec.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-xs font-bold transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>رد پیشنهاد</span>
                    </button>
                  </>
                ) : rec.status === 'approved' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تایید شده توسط {rec.approvedBy}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold">
                    <XCircle className="h-4 w-4" />
                    <span>رد شده</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
