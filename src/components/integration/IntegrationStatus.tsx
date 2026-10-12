import React from 'react';
import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';

type State = 'loading' | 'connected' | 'offline';

export const IntegrationStatus: React.FC = () => {
  const [state, setState] = React.useState<State>('loading');
  const [detail, setDetail] = React.useState('در حال بررسی اتصال به فروشگاه…');

  const check = React.useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/ai/health', { signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload?.ok) throw new Error('پاسخ سلامت معتبر نیست');
      setState('connected');
      setDetail(`اتصال زنده · ${payload.componentId ?? 'ghlbedovom-site'} · پروتکل ${payload.protocolVersion ?? '1.0.0'}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setState('offline');
      setDetail('اتصال واقعی برقرار نیست؛ داشبورد با دادهٔ نمونه نمایش داده می‌شود.');
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    void check(controller.signal);
    const timer = window.setInterval(() => void check(), 30_000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [check]);

  const connected = state === 'connected';
  return (
    <div className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
      state === 'loading'
        ? 'border-slate-700 bg-slate-900/60 text-slate-300'
        : connected
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    }`} role="status" aria-live="polite">
      {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : connected ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
      <span>{detail}</span>
    </div>
  );
};
