import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  ScatterChart as ScatterIcon,
  Award,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { CLUSTERS_DATA } from '../data/mockData';

export const CustomerSegmentationPage: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'kmeans' | 'dbscan'>('kmeans');

  // Simulated 2D PCA projected customer coordinates for K-Means and DBSCAN
  const scatterPoints = React.useMemo(() => {
    const points = [];
    // Cluster 0: Champions (Low Recency, High Monetary)
    for (let i = 0; i < 40; i++) {
      points.push({
        x: Number((2 + Math.random() * 15).toFixed(1)),
        y: Number((80 + Math.random() * 110).toFixed(1)),
        cluster: 0,
        clusterName: 'مشتریان طلایی',
        color: '#10b981',
      });
    }
    // Cluster 1: Loyal (Moderate Recency, Moderate Monetary)
    for (let i = 0; i < 60; i++) {
      points.push({
        x: Number((15 + Math.random() * 25).toFixed(1)),
        y: Number((25 + Math.random() * 45).toFixed(1)),
        cluster: 1,
        clusterName: 'مشتریان وفادار',
        color: '#06b6d4',
      });
    }
    // Cluster 2: Promising (Low Recency, Low Monetary)
    for (let i = 0; i < 45; i++) {
      points.push({
        x: Number((5 + Math.random() * 20).toFixed(1)),
        y: Number((5 + Math.random() * 18).toFixed(1)),
        cluster: 2,
        clusterName: 'مشتریان جدید مستعد',
        color: '#8b5cf6',
      });
    }
    // Cluster 3: At Risk (High Recency, Low-to-Mid Monetary)
    for (let i = 0; i < 55; i++) {
      points.push({
        x: Number((90 + Math.random() * 110).toFixed(1)),
        y: Number((6 + Math.random() * 24).toFixed(1)),
        cluster: 3,
        clusterName: 'مشتریان در معرض ریزش',
        color: '#f43f5e',
      });
    }
    // Noise points for DBSCAN (Cluster -1)
    if (activeAlgorithm === 'dbscan') {
      for (let i = 0; i < 12; i++) {
        points.push({
          x: Number((40 + Math.random() * 60).toFixed(1)),
          y: Number((60 + Math.random() * 50).toFixed(1)),
          cluster: -1,
          clusterName: 'نویز و داده‌های پرت (Outliers)',
          color: '#64748b',
        });
      }
    }
    return points;
  }, [activeAlgorithm]);

  // Elbow Curve Data for selecting optimal K
  const elbowData = [
    { k: 2, inertia: 1420, silhouette: 0.51 },
    { k: 3, inertia: 890, silhouette: 0.59 },
    { k: 4, inertia: 460, silhouette: 0.642 }, // Optimal elbow
    { k: 5, inertia: 380, silhouette: 0.57 },
    { k: 6, inertia: 320, silhouette: 0.52 },
    { k: 7, inertia: 280, silhouette: 0.48 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-cyan-400" />
            <span>خوشه‌بندی و بخش‌بندی مشتریان (یادگیری بدون نظارت)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پیاده‌سازی الگوریتم‌های K-Means و DBSCAN بر پایه ماتریس نرمال‌شده RFM و شاخص Silhouette
          </p>
        </div>

        {/* Algorithm switch buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveAlgorithm('kmeans')}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeAlgorithm === 'kmeans'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الگوریتم K-Means (k=4)
          </button>
          <button
            onClick={() => setActiveAlgorithm('dbscan')}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeAlgorithm === 'dbscan'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الگوریتم DBSCAN چگالی‌محور
          </button>
        </div>
      </div>

      {/* Evaluation Scores Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">ضریب شبح (Silhouette Score)</div>
          <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">۰.۶۴۲</div>
          <div className="text-[11px] text-slate-400 mt-1">
            تراکم درون‌خوشه‌ای بالا و تفکیک مناسب خوشه‌ها
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">شاخص دیویس-بولدین (Davies-Bouldin)</div>
          <div className="mt-1 text-2xl font-black text-cyan-400 font-mono">۰.۷۸۱</div>
          <div className="text-[11px] text-slate-400 mt-1">
            مقادیر کمتر نشان‌دهنده تفکیک برتر ساختار است
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs text-slate-400">تعداد نقاط نویز (DBSCAN Outliers)</div>
          <div className="mt-1 text-2xl font-black text-slate-300 font-mono">
            {activeAlgorithm === 'dbscan' ? '۴۸ مشتری' : '۰ (K-Means بدون نویز)'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeAlgorithm === 'dbscan' ? 'تراکنش‌های غیرعادی با حجم خرید نامتعارف' : 'همه نمونه‌ها به نزدیک‌ترین مرکز تعلق دارند'}
          </div>
        </div>
      </div>

      {/* Main Scatter Projection & Elbow Plot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2D Feature Space Scatter Plot */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ScatterIcon className="h-4 w-4 text-cyan-400" />
                <span>فضای دوبعدی ویژگی‌ها: تازگی (روز) در برابر ارزش پولی (میلیون تومان)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                توزیع نمونه‌های اعتبارسنجی خوشه‌بندی شده با رنگ تفکیک شده هر بخش
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              {activeAlgorithm === 'kmeans' ? 'k-means++ (n_init=20)' : 'eps=0.5, min_samples=5'}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="تازگی (روز)"
                  unit=" روز"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="ارزش مالی (م)"
                  unit=" م"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-lg text-right">
                          <div className="font-bold text-slate-200">{data.clusterName}</div>
                          <div className="text-slate-400 font-mono mt-1">تازگی: {data.x} روز</div>
                          <div className="text-slate-400 font-mono">ارزش پولی: {data.y} میلیون تومان</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="مشتریان" data={scatterPoints}>
                  {scatterPoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elbow Method Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
              نمودار آرنجی (Elbow Curve) جهت تعیین K بهینه
            </h3>
            <p className="text-xs text-slate-400 mt-2 mb-3">
              شکستگی شیب اینرسی در k=4 نشان‌دهنده نقطه تعادل ریاضی میان سادگی مدل و خطای بازسازی است.
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={elbowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="k" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                      direction: 'rtl',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inertia"
                    name="اینرسی (Inertia)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#06b6d4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            انتخاب نهایی: <strong>k=4 خوشه</strong> با بیشترین شاخص Silhouette (۰.۶۴۲).
          </div>
        </div>
      </div>

      {/* Cluster Profiles and Actionable Business Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">
          مشخصات آماری بخش‌های ۴ گانه کشف‌شده و راهبردهای بازاریابی اختصاصی
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CLUSTERS_DATA.map((c) => (
            <div
              key={c.clusterId}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs font-bold text-slate-100">{c.clusterName}</span>
                </div>
                <span className="font-mono text-xs text-slate-400">{c.percentage}٪ کل مشتریان</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">میانگین تازگی</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">{c.avgRecency} روز</div>
                </div>
                <div className="p-2 rounded bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">میانگین بسامد</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">{c.avgFrequency} سفارش</div>
                </div>
                <div className="p-2 rounded bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">میانگین ارزش</div>
                  <div className="font-mono font-bold text-cyan-400 mt-0.5">
                    {(c.avgMonetary / 1000000).toFixed(1)} م
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

              <div className="text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                <strong className="text-cyan-400">راهبرد بازاریابی:</strong> {c.marketingAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
