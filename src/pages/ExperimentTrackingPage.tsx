import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArrowUpRight,
  ShieldCheck,
  FileCode,
  Tag,
  Clock,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { MLFLOW_RUNS } from '../data/mockData';
import { MLflowRun } from '../types';

export const ExperimentTrackingPage: React.FC = () => {
  const [runs, setRuns] = useState<MLflowRun[]>(MLFLOW_RUNS);
  const [selectedRun, setSelectedRun] = useState<MLflowRun>(MLFLOW_RUNS[0]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handlePromoteToProduction = (runId: string) => {
    setRuns((prev) =>
      prev.map((r) => ({
        ...r,
        isProduction: r.runId === runId,
      }))
    );
    setFeedbackMsg(`مدل با شناسه ${runId} با موفقیت به عنوان مدل پیش‌فرض خط تولید ارتقا یافت.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-cyan-400" />
            <span>ردیابی آزمایش‌ها و مدیریت چرخه حیات مدل (MLflow Registry)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ثبت متغیرها، هایپرپارامترها، آرتیفکت‌های مدل و امکان ارتقا یا بازگشت به عقب (Rollback)
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>سرور MLflow: پورت ۵۰۰۰ محلی (Online)</span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Grid: Runs List & Selected Run Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Runs List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
            <span>تاریخچه اجراهای آزمایشی ({runs.length})</span>
            <span className="text-slate-400 font-mono">Backend: SQLite / Postgres</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[500px]">
            {runs.map((r) => {
              const isSelected = selectedRun.runId === r.runId;
              return (
                <div
                  key={r.runId}
                  onClick={() => setSelectedRun(r)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border text-xs ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-slate-100 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{r.modelType}</span>
                    {r.isProduction && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                        تولید (Active)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 truncate">
                    {r.runId} · {r.version}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                    <span>{r.timestamp}</span>
                    <span className="font-mono text-slate-300">
                      {r.metrics.wape > 0 ? `WAPE: ${r.metrics.wape}٪` : `AUC: ${r.metrics.rocAuc}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Run Deep Inspector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">{selectedRun.experimentName}</h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  {selectedRun.runId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ثبت شده در: {selectedRun.timestamp} · مدت زمان اجرا: {selectedRun.duration}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!selectedRun.isProduction ? (
                <button
                  onClick={() => handlePromoteToProduction(selectedRun.runId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>ارتقا به خط تولید (Promote)</span>
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>در حال حاضر مدل فعال تولید است</span>
                </span>
              )}
            </div>
          </div>

          {/* Hyperparameters Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-cyan-400" />
              <span>هایپرپارامترهای بهینه‌شده ذخیره‌شده (Hyperparameters):</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              {Object.entries(selectedRun.hyperparameters).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{k}</div>
                  <div className="text-slate-200 font-bold mt-0.5">{String(v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Metrics Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>معیارهای ارزیابی نهایی (Metrics Logged):</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              {selectedRun.metrics.wape > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">WAPE Error</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{selectedRun.metrics.wape}٪</div>
                </div>
              )}
              {selectedRun.metrics.r2 && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">R-Squared</div>
                  <div className="text-cyan-400 font-bold mt-0.5">{selectedRun.metrics.r2}</div>
                </div>
              )}
              {selectedRun.metrics.rmse > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">RMSE</div>
                  <div className="text-slate-200 font-bold mt-0.5">
                    {(selectedRun.metrics.rmse / 1000000).toFixed(2)} م
                  </div>
                </div>
              )}
              {selectedRun.metrics.rocAuc && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ROC-AUC</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{selectedRun.metrics.rocAuc}</div>
                </div>
              )}
            </div>
          </div>

          {/* Stored Artifacts List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileCode className="h-3.5 w-3.5 text-indigo-400" />
              <span>فایل‌های خروجی و وزن‌های ثبت‌شده در انبار (Artifacts):</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {selectedRun.artifacts.map((art, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                >
                  <FileCode className="h-3 w-3 text-cyan-400" />
                  <span>{art}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
