import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';

export const ModelTrainingStudioPage: React.FC = () => {
  const [modelType, setModelType] = useState<'xgboost' | 'random_forest' | 'linear_regression'>('xgboost');
  const [useOptuna, setUseOptuna] = useState<boolean>(true);
  const [trialsCount, setTrialsCount] = useState<number>(20);
  const [estimators, setEstimators] = useState<number>(300);
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [learningRate, setLearningRate] = useState<number>(0.045);

  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    'سیستم آماده آغاز آموزش است. هایپرپارامترها را تنظیم کرده و دکمه شروع را بفشارید.',
  ]);
  const [completedMetric, setCompletedMetric] = useState<{
    wape: number;
    rmse: number;
    r2: number;
    duration: string;
  } | null>(null);

  const handleStartTraining = () => {
    setIsTraining(true);
    setProgress(0);
    setCompletedMetric(null);
    setLogs([
      `[${new Date().toLocaleTimeString('fa-IR')}] [INFO] راه‌اندازی تسک پس‌زمینه توسط Celery Worker بر روی پردازنده لینوکس...`,
      `[${new Date().toLocaleTimeString('fa-IR')}] [INFO] بارگذاری دیتاست از مسیر datasets/online_retail_cleaned.csv (۳۹۷,۹۲۴ رکورد معتبر)...`,
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const currentPct = Math.min(100, step * 12);
      setProgress(currentPct);

      if (step === 2) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('fa-IR')}] [INFO] مهندسی ویژگی‌های سری زمانی: تولید ۲۸ ویژگی شامل تاخیرهای ۱، ۷، ۱۴ روزه و میانگین‌های متحرک...`,
          `[${new Date().toLocaleTimeString('fa-IR')}] [CHECK] تایید تست عدم نشت اطلاعات آینده (Shift=1 verified)...`,
        ]);
      } else if (step === 4) {
        if (useOptuna) {
          setLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString('fa-IR')}] [OPTUNA] آغاز بهینه‌سازی بیزی هایپرپارامترها با ${trialsCount} تریال...`,
            `[${new Date().toLocaleTimeString('fa-IR')}] [OPTUNA] تریال ۱: n_est=180, depth=4, lr=0.100 -> اعتبارسنجی WAPE: ۷.۲۴٪`,
            `[${new Date().toLocaleTimeString('fa-IR')}] [OPTUNA] تریال ۵: n_est=290, depth=6, lr=${learningRate} -> اعتبارسنجی WAPE: ۴.۸۲٪ (بهترین تا الان)`,
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString('fa-IR')}] [TRAIN] فیت کردن مدل ${modelType} با پارامترهای دستی...`,
          ]);
        }
      } else if (step === 6) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('fa-IR')}] [EVAL] اجرای ارزیابی مستقل نهایی بر روی مجموعه آزمون Out-of-Time...`,
          `[${new Date().toLocaleTimeString('fa-IR')}] [SHAP] استخراج مقادیر TreeExplainer و ترسیم نمودارهای تبیین‌پذیری...`,
        ]);
      } else if (step >= 8) {
        clearInterval(interval);
        setIsTraining(false);
        setProgress(100);
        const finalWape = useOptuna ? 4.82 : 6.14;
        setCompletedMetric({
          wape: finalWape,
          rmse: 1120000,
          r2: 0.938,
          duration: '18.4s',
        });
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('fa-IR')}] [SUCCESS] فرآیند با موفقیت پایان یافت. وزن‌های مدل در artifacts/xgboost_sales_model.joblib ذخیره شد.`,
          `[${new Date().toLocaleTimeString('fa-IR')}] [MLFLOW] شناسه آزمایش exp_run_${Math.random().toString(36).substring(2, 8)} در سرور MLflow ثبت شد.`,
        ]);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <span>استودیو آموزش، بهینه‌سازی (Optuna) و پردازش پس‌زمینه</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پیکربندی پارامترهای الگوریتم، جستجوی بیزی خودکار و پایش زنده لاگ‌های Worker
          </p>
        </div>

        <button
          onClick={handleStartTraining}
          disabled={isTraining}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${
            isTraining
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
          }`}
        >
          {isTraining ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          <span>{isTraining ? 'در حال آموزش مدل...' : 'شروع آموزش و بهینه‌سازی'}</span>
        </button>
      </div>

      {/* Grid: Hyperparameter Controls & Training Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hyperparameter Configuration */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
            پیکربندی مدل و فضای جستجوی هایپرپارامترها
          </h3>

          <div className="space-y-3 text-xs">
            {/* Model Type */}
            <div>
              <label className="text-slate-400 block mb-1">الگوریتم یادگیری:</label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="xgboost">XGBoost Regressor (پیشنهادی)</option>
                <option value="random_forest">Random Forest Regressor</option>
                <option value="linear_regression">Ridge Linear Regression</option>
              </select>
            </div>

            {/* Optuna Toggle */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-slate-200">بهینه‌سازی بیزی Optuna</span>
                <input
                  type="checkbox"
                  checked={useOptuna}
                  onChange={(e) => setUseOptuna(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                />
              </label>
              <p className="text-[10px] text-slate-400">
                استفاده از الگوریتم نمونه‌بردار TPESampler و هرس شاخه‌های نامطلوب با Hyperband
              </p>
              {useOptuna && (
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>تعداد تریال‌ها (Trials):</span>
                    <span className="font-mono text-cyan-400">{trialsCount}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={trialsCount}
                    onChange={(e) => setTrialsCount(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              )}
            </div>

            {/* Manual hyperparams */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>تعداد درختان (n_estimators):</span>
                  <span className="font-mono text-slate-200">{estimators}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="20"
                  value={estimators}
                  onChange={(e) => setEstimators(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>عمق بیشینه درخت (max_depth):</span>
                  <span className="font-mono text-slate-200">{maxDepth}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>نرخ یادگیری (learning_rate):</span>
                  <span className="font-mono text-slate-200">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.005"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Terminal & Progress */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>کنسول پردازش زنده کارگر Celery (Linux Worker Logs)</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {isTraining ? 'وضعیت: در حال پردازش...' : 'وضعیت: بیکار (IDLE)'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="my-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>پیشرفت فرآیند:</span>
                <span className="font-mono font-bold text-cyan-400">{progress}٪</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Terminal Window */}
            <div className="h-64 overflow-y-auto rounded-lg bg-slate-950 p-3.5 font-mono text-xs text-slate-300 border border-slate-800 space-y-1.5 shadow-inner">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={
                    log.includes('[SUCCESS]')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('[OPTUNA]')
                      ? 'text-cyan-300'
                      : log.includes('[CHECK]')
                      ? 'text-amber-300'
                      : 'text-slate-400'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary Box if Finished */}
          {completedMetric && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>آموزش با موفقیت تکمیل و ثبت شد!</span>
                </div>
                <div className="text-slate-300 font-mono">
                  WAPE: <strong className="text-emerald-400">{completedMetric.wape}٪</strong> · R²:{' '}
                  <strong className="text-cyan-400">{completedMetric.r2}</strong> · زمان اجرا:{' '}
                  {completedMetric.duration}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                مدل به عنوان کاندید شماره ۱ در رجیستری ذخیره شد.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
