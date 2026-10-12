import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { SAMPLE_CUSTOMERS } from '../data/mockData';
import { CustomerRfm } from '../types';

export const CustomerAnalyticsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof CustomerRfm>('monetaryValue');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter & sort
  const filteredCustomers = React.useMemo(() => {
    return SAMPLE_CUSTOMERS.filter((c) => {
      const matchSearch =
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSegment = segmentFilter === 'all' || c.segment.includes(segmentFilter);
      return matchSearch && matchSegment;
    }).sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [searchTerm, segmentFilter, sortBy, sortAsc]);

  const handleSort = (field: keyof CustomerRfm) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-400" />
            <span>تحلیل رفتار مشتریان و ماتریس شاخص‌های RFM</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ارزیابی تازگی سفارش (Recency)، بسامد خرید (Frequency) و ارزش پولی تجمعی (Monetary)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی مشتری یا شناسه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 rounded-lg border border-slate-700 bg-slate-800 pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">همه بخش‌ها</option>
            <option value="طلایی">مشتریان طلایی (Champions)</option>
            <option value="وفادار">مشتریان وفادار (Loyal)</option>
            <option value="جدید">مشتریان جدید مستعد</option>
            <option value="خطر">مشتریان در معرض خطر</option>
            <option value="خاموش">مشتریان خاموش</option>
          </select>
        </div>
      </div>

      {/* RFM 3-Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">تازگی سفارش (Recency)</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۲۲.۴ روز</div>
          <p className="text-[11px] text-slate-400 mt-1">
            میانگین فاصله زمانی تا آخرین خرید موفق مشتریان فعال
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">بسامد خرید (Frequency)</span>
            <ArrowUpDown className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۱۱.۲ سفارش</div>
          <p className="text-[11px] text-slate-400 mt-1">
            میانگین تعداد فاکتورهای ثبت شده در هر دوره مالی
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">ارزش پولی (Monetary / LTV)</span>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">۴۳.۸ م تومان</div>
          <p className="text-[11px] text-slate-400 mt-1">
            میانگین ارزش طول عمر مشتری با تبدیل لگاریتمی جهت مهار چولگی
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-200">
            لیست پروفایل‌های مشتریان استخراج شده از دیتاست ({filteredCustomers.length} مشتری)
          </div>
          <div className="text-[11px] text-slate-400">
            کلیک روی سرستون‌ها برای مرتب‌سازی
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">شناسه و نام مشتری</th>
                <th
                  onClick={() => handleSort('recencyDays')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  تازگی (روز) {sortBy === 'recencyDays' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('frequencyOrders')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  بسامد (سفارش) {sortBy === 'frequencyOrders' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('monetaryValue')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  گردش مالی {sortBy === 'monetaryValue' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4">امتیاز RFM</th>
                <th className="py-3 px-4">بخش مشتری</th>
                <th
                  onClick={() => handleSort('repeatProbability')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  احتمال خرید مجدد {sortBy === 'repeatProbability' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4">ریسک ریزش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCustomers.map((c) => (
                <tr key={c.customerId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{c.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.customerId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">{c.recencyDays} روز پیش</td>
                  <td className="py-3 px-4 font-mono">{c.frequencyOrders} بار</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-100">
                    {(c.monetaryValue / 1000000).toLocaleString()} م تومان
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{c.rfmScore}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{c.segment}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className={c.repeatProbability > 0.7 ? 'text-emerald-400 font-bold' : c.repeatProbability < 0.3 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                      {(c.repeatProbability * 100).toFixed(0)}٪
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.churnRisk === 'low'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : c.churnRisk === 'high'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {c.churnRisk === 'low' ? 'کم' : c.churnRisk === 'high' ? 'بالا' : 'متوسط'}
                    </span>
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
