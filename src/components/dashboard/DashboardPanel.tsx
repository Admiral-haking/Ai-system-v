import type { ReactNode } from 'react';
import { dashboardTokens } from './dashboard-tokens';

export type DashboardPanelState = 'ready' | 'loading' | 'error' | 'empty';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  state?: DashboardPanelState;
  errorMessage?: string;
  emptyMessage?: string;
  children?: ReactNode;
};

export function DashboardPanel({
  title,
  description,
  action,
  state = 'ready',
  errorMessage = 'این بخش در دسترس نیست.',
  emptyMessage = 'داده‌ای برای نمایش وجود ندارد.',
  children,
}: Props) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-xl border ${dashboardTokens.surface}`} aria-busy={state === 'loading'}>
      <header className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-100">{title}</h2>
          {description ? <p className="mt-1 text-xs leading-6 text-slate-400">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="p-5">
        {state === 'loading' ? <LoadingSkeleton /> : null}
        {state === 'error' ? <StatusMessage tone="error" message={errorMessage} /> : null}
        {state === 'empty' ? <StatusMessage tone="neutral" message={emptyMessage} /> : null}
        {state === 'ready' ? children : null}
      </div>
    </section>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="در حال بارگذاری">
      <span className="block h-4 w-2/5 animate-pulse rounded bg-slate-800" />
      <span className="block h-12 w-full animate-pulse rounded bg-slate-800" />
      <span className="block h-4 w-3/4 animate-pulse rounded bg-slate-800" />
    </div>
  );
}

export function StatusMessage({ tone, message }: { tone: 'error' | 'neutral'; message: string }) {
  const toneClass = tone === 'error' ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' : 'border-slate-700 bg-slate-950/40 text-slate-300';
  return <p className={`rounded-lg border px-4 py-3 text-sm ${toneClass}`} role={tone === 'error' ? 'alert' : 'status'}>{message}</p>;
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center gap-3 py-8 text-center"><p className="text-sm text-slate-400">{message}</p>{action}</div>;
}

export function Alert({ children, tone = 'warning' }: { children: ReactNode; tone?: 'warning' | 'error' | 'success' }) {
  const toneClass = { warning: 'border-amber-500/50 bg-amber-500/10 text-amber-100', error: 'border-rose-500/50 bg-rose-500/10 text-rose-100', success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100' }[tone];
  return <div className={`rounded-lg border px-4 py-3 text-sm ${toneClass}`} role="status">{children}</div>;
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-base font-bold text-slate-100">{title}</h2>{description ? <p className="mt-1 text-xs text-slate-400">{description}</p> : null}</div>{action}</div>;
}

export function QuickActionGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2" aria-label="اقدام‌های سریع">{children}</div>;
}

export function MetricCard({ title, value, detail, source, icon: Icon }: { title: string; value: string; detail: string; source?: string; icon: React.ComponentType<{ className?: string }> }) {
  return <article className={`min-w-0 rounded-xl border p-5 ${dashboardTokens.surface}`}><div className="flex items-start justify-between gap-3"><h3 className="text-xs font-medium text-slate-400">{title}</h3><span className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-cyan-300" aria-hidden="true"><Icon className="h-4 w-4" /></span></div><p className={`mt-4 break-words text-2xl font-black text-slate-100 ${dashboardTokens.numeric}`}>{value}</p><p className="mt-2 text-xs text-slate-300">{detail}</p>{source ? <p className="mt-2 text-[11px] text-slate-500">{source}</p> : null}</article>;
}
