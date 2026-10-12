import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  TrendingDown,
  Clock,
  Sparkles,
  Zap,
  Info,
  Scale,
  Award,
  HelpCircle,
  Activity,
  HardDrive,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  DEEP_LEARNING_MODELS_BENCHMARK,
  SAMPLE_DL_TRAINING_RUN,
  MODEL_SELECTION_RECOMMENDATION,
} from '../data/mockData';
import { DeepLearningArchitecture, DeepLearningConfig, DeepLearningTrainingRun } from '../types';

export const DeepLearningStudioPage: React.FC = () => {
  const [selectedArch, setSelectedArch] = useState<DeepLearningArchitecture>('N_BEATS');
  const [windowSize, setWindowSize] = useState<number>(30);
  const [forecastHorizon, setForecastHorizon] = useState<number>(14);
  const [hiddenUnits, setHiddenUnits] = useState<number>(128);
  const [numLayers, setNumLayers] = useState<number>(3);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [epochs, setEpochs] = useState<number>(40);
  const [device, setDevice] = useState<'cpu' | 'cuda'>('cpu');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingRun, setTrainingRun] = useState<DeepLearningTrainingRun>(SAMPLE_DL_TRAINING_RUN);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingLogs([
      `[INIT] مقداردهی مدل عصبی عمیق ${selectedArch} در بستر PyTorch...`,
      `[DATA] ساخت پنجره‌های غلتان کشویی (Sliding Windows): ورودی=${windowSize} روز، افق=${forecastHorizon} روز.`,
      `[DEVICE] تخصیص منابع سخت‌افزاری: Device=${device.toUpperCase()} (کاهش ریسک سرریز رم با Dataloader Pinned Memory)...`,
      `[CRITERION] تابع زیان: Symmetric Mean Absolute Percentage Error (sMAPE) + L2 Regularization.`,
    ]);

    const initialLoss = 0.52;
    let currentTrainLoss = initialLoss;
    let currentValLoss = initialLoss * 1.08;
    const trainHistory: number[] = [];
    const valHistory: number[] = [];

    let epochCounter = 1;
    const interval = setInterval(() => {
      if (epochCounter <= epochs) {
        currentTrainLoss = Math.max(0.09, currentTrainLoss * 0.94 + (Math.random() * 0.008 - 0.004));
        currentValLoss = Math.max(0.14, currentValLoss * 0.95 + (Math.random() * 0.01 - 0.005));
        trainHistory.push(Number(currentTrainLoss.toFixed(4)));
        valHistory.push(Number(currentValLoss.toFixed(4)));

        if (epochCounter % 5 === 0 || epochCounter === epochs) {
          setTrainingLogs((prev) => [
            ...prev,
            `Epoch [${epochCounter}/${epochs}] | Train Loss: ${currentTrainLoss.toFixed(4)} | Val Loss: ${currentValLoss.toFixed(4)} | LR: ${learningRate}`,
          ]);
        }

        setTrainingRun({
          id: `DL-RUN-${Date.now()}`,
          modelType: selectedArch,
          currentEpoch: epochCounter,
          totalEpochs: epochs,
          trainLossHistory: [...trainHistory],
          valLossHistory: [...valHistory],
          bestValLoss: Math.min(...valHistory),
          wape: selectedArch === 'N_BEATS' ? 7.42 : selectedArch === 'TCN' ? 8.15 : 8.84,
          rmse: selectedArch === 'N_BEATS' ? 68.4 : selectedArch === 'TCN' ? 73.1 : 79.5,
          mase: 0.72,
          inferenceLatencyMs: selectedArch === 'TCN' ? 8.4 : 18.2,
          memoryUsageMb: selectedArch === 'N_BEATS' ? 340 : 210,
          trainingDurationSec: Math.round(epochCounter * 2.8),
          status: epochCounter === epochs ? 'COMPLETED' : 'TRAINING',
        });

        epochCounter += 2;
      } else {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingLogs((prev) => [
          ...prev,
          `[CHECKPOINT] بهترین وزن‌های مدل در 'weights/${selectedArch.toLowerCase()}_best.pt' ذخیره شد.`,
          `[EVAL] ارزیابی نهایی در افق ${forecastHorizon} روزه: WAPE=${(7.42).toFixed(2)}% | استنتاج: ${(18.2).toFixed(1)}ms.`,
        ]);
      }
    }, 200);
  };

  const chartData = trainingRun.trainLossHistory.map((tLoss, idx) => ({
    epoch: idx + 1,
    trainLoss: tLoss,
    valLoss: trainingRun.valLossHistory[idx] || tLoss * 1.05,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
              ADVANCED DEEP LEARNING & PYTORCH FORECASTING ENGINE
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              استودیو مدل‌های عمیق سری زمانی (N-BEATS, TCN, LSTM, GRU, TFT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              آموزش و آزمون شبکه‌های عصبی عمیق با پنجره‌های زمانی کشویی (Sliding-Window)، پایش واگرایی و برازش بیش از حد (Overfitting)، 
              به همراه موتور هوشمند مقایسه و انتخاب خودکار مدل (Model Recommendation Engine).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {isTraining ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span>در حال آموزش شبکه عصبی...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>آموزش زنده در PyTorch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Model Selection Recommendation Notice (Part D) */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Award className="h-4 w-4 text-amber-400" />
            <span>توصیه موتور انتخاب هوشمند مدل (Automated Model Selection Recommendation):</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            امتیاز ترکیبی: ۹۴/۱۰۰
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {MODEL_SELECTION_RECOMMENDATION.reason}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-800">
          <div className="text-slate-400">دقت پیش‌بینی: <span className="text-slate-200 font-mono">برتری N-BEATS</span></div>
          <div className="text-slate-400">تاخیر استنتاج: <span className="text-slate-200 font-mono">برتری XGBoost (3.2ms)</span></div>
          <div className="text-slate-400">مصرف منابع و هزینه: <span className="text-slate-200 font-mono">برتری XGBoost</span></div>
          <div className="text-slate-400">توضیح‌پذیری: <span className="text-slate-200 font-mono">SHAP Values در دسترس</span></div>
        </div>
      </div>

      {/* Hyperparameter Configurator (Part B) */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <span>پیکربندی معماری و هایپرپارامترهای شبکه عصبی عمیق (PyTorch Config):</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Early Stopping: ۵ Epoch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">معماری شبکه عصبی (Architecture):</label>
            <select
              value={selectedArch}
              onChange={(e) => setSelectedArch(e.target.value as DeepLearningArchitecture)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
            >
              <option value="N_BEATS">N-BEATS (Neural Basis Expansion)</option>
              <option value="TCN">TCN (Temporal Convolutional Net)</option>
              <option value="LSTM">LSTM (Bi-directional Recurrent)</option>
              <option value="GRU">GRU (Gated Recurrent Unit)</option>
              <option value="TFT">TFT (Temporal Fusion Transformer)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">طول پنجره ورودی (Lookback Window):</label>
            <select
              value={windowSize}
              onChange={(e) => setWindowSize(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
            >
              <option value={14}>۱۴ روز (کوتاه‌مدت)</option>
              <option value={30}>۳۰ روز (پیش‌فرض ماهانه)</option>
              <option value={60}>۶۰ روز (فصلی)</option>
              <option value={90}>۹۰ روز (بلندمدت)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">افق پیش‌بینی (Forecast Horizon):</label>
            <select
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
            >
              <option value={7}>۷ روز آینده</option>
              <option value={14}>۱۴ روز آینده</option>
              <option value={30}>۳۰ روز آینده</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">پردازنده اجرا (Compute Device):</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDevice('cpu')}
                className={`flex-1 py-1.5 rounded-lg font-mono text-xs border transition-colors ${
                  device === 'cpu'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                CPU (Multi-Thread)
              </button>
              <button
                type="button"
                onClick={() => setDevice('cuda')}
                className={`flex-1 py-1.5 rounded-lg font-mono text-xs border transition-colors ${
                  device === 'cuda'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                CUDA (NVIDIA GPU)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Training Convergence Charts & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loss Convergence Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <span>نمودار همگرایی زیان آموزش و اعتبارسنجی (Loss Convergence):</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                پایش Train Loss در برابر Validation Loss برای پیشگیری از بیش‌برازش
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-indigo-400">WAPE: {trainingRun.wape}%</span>
              <span className="text-emerald-400">Best Val: {trainingRun.bestValLoss}</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="trainLoss"
                  name="خطای آموزش (Train Loss)"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="valLoss"
                  name="خطای اعتبارسنجی (Val Loss)"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Terminal Stream (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 shadow-inner flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                <Cpu className="h-4 w-4" />
                <span>خروجی استاندارد کارگر آموزش (PyTorch Stream)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Epoch: {trainingRun.currentEpoch}/{trainingRun.totalEpochs}
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto" dir="ltr">
              {trainingLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-slate-500 select-none">&gt;</span>
                  <span className={log.includes('CHECKPOINT') || log.includes('Epoch [40') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
              {isTraining && (
                <div className="text-indigo-400 animate-pulse">&gt; Backpropagating gradients...</div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>حافظه اختصاص‌یافته: {trainingRun.memoryUsageMb} MB</span>
            <span>تاخیر استنتاج: {trainingRun.inferenceLatencyMs} ms</span>
          </div>
        </div>
      </div>

      {/* Model Benchmark & Comparison Table (Part C) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Scale className="h-4 w-4 text-cyan-400" />
              <span>ماتریس جامع مقایسه مدل‌های عمیق، درخت‌های تصمیم و خط پایه آماری (Model Benchmark):</span>
            </h3>
            <p className="text-xs text-slate-400">
              ارزیابی تجربی بر روی داده‌های آزمون خارج از نمونه (Out-Of-Time Holdout) با افق ۱۴ روزه
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">معماری و نام مدل</th>
                <th className="py-2.5 px-3">دسته‌بندی</th>
                <th className="py-2.5 px-3">WAPE (%)</th>
                <th className="py-2.5 px-3">RMSE</th>
                <th className="py-2.5 px-3">MASE</th>
                <th className="py-2.5 px-3">زمان آموزش</th>
                <th className="py-2.5 px-3">تاخیر استنتاج</th>
                <th className="py-2.5 px-3">مصرف رم</th>
                <th className="py-2.5 px-3">توضیح‌پذیری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {DEEP_LEARNING_MODELS_BENCHMARK.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-100 font-sans">
                    {m.architecture}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-sans">
                    {m.category}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {m.wape}%
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {m.rmse}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {m.mase}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {m.trainingTimeSec}s
                  </td>
                  <td className="py-3 px-3 text-cyan-300">
                    {m.inferenceLatencyMs}ms
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {m.memoryMb} MB
                  </td>
                  <td className="py-3 px-3 font-sans text-[11px] text-slate-300">
                    {m.interpretability}
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
