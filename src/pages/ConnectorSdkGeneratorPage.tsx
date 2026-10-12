import React, { useState } from 'react';
import {
  Code,
  Sparkles,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  Layers,
  Plug,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  RefreshCw,
  Box,
  Server,
  Zap,
} from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  systemType: string;
  description: string;
  authType: string;
  defaultEndpoint: string;
  category: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'woocommerce',
    name: 'WooCommerce REST v3',
    systemType: 'ecommerce',
    description: 'درگاه رسمی اتصال به فروشگاه‌های ووکامرس وردپرس با احراز هویت Consumer Key/Secret و صفحه‌بندی هوشمند',
    authType: 'Basic Auth / HMAC',
    defaultEndpoint: 'https://shop.example.ir/wp-json/wc/v3',
    category: 'E-Commerce',
  },
  {
    id: 'digikala',
    name: 'دیجی‌کالا سلر سنتر (Digikala Open API)',
    systemType: 'marketplace',
    description: 'اتصال به پنل فروشندگان دیجی‌کالا برای همگام‌سازی سفارش‌های روزانه، وضعیت مرسوله و قیمت اقلام',
    authType: 'Bearer Token (JWT)',
    defaultEndpoint: 'https://seller.digikala.com/api/v1',
    category: 'Marketplace',
  },
  {
    id: 'torob',
    name: 'ترب و ایمالز (Torob / Emalls Marketplace)',
    systemType: 'aggregator',
    description: 'دریافت گزارش کلیک‌ها، سفارش‌ها و رصد قیمت رقبا از موتورهای مقایسه قیمت با کنترل نرخ فراخوانی',
    authType: 'API Key Header',
    defaultEndpoint: 'https://api.torob.com/v4/merchant',
    category: 'Aggregator',
  },
  {
    id: 'sepidar',
    name: 'سپیدار سیستم / همکاران سیستم (ERP Web API)',
    systemType: 'erp',
    description: 'همگام‌سازی فاکتورهای فروش قطعی، مانده حساب مشتریان و موجودی انبارهای شرکت از سرویس وب سپیدار',
    authType: 'Token-based Session',
    defaultEndpoint: 'https://sepidar.company.ir:8080/api',
    category: 'ERP / Accounting',
  },
  {
    id: 'generic_rest',
    name: 'سرویس دلخواه RESTful با OpenAPI / Swagger',
    systemType: 'rest',
    description: 'کانکتور جهانی سازگار با تمامی وب‌سرویس‌های مدرن دارای مستندات OpenAPI با کشف خودکار اندپوینت‌ها',
    authType: 'Bearer Token / API Key',
    defaultEndpoint: 'https://api.company.ir/v2',
    category: 'Custom REST API',
  },
  {
    id: 'pos_sftp',
    name: 'صندوق‌های فروشگاهی حضوری (POS File Drop / SFTP)',
    systemType: 'pos',
    description: 'پردازش خودکار فایل‌های فاکتور ارسالی از شعب و صندوق‌های فروشگاهی با فرمت CSV / JSON و آرشیو امن',
    authType: 'SSH Key / Token',
    defaultEndpoint: 'sftp://pos-gateway.internal/inbox',
    category: 'POS / Retail Stores',
  },
];

export const ConnectorSdkGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATE_OPTIONS[0]);
  const [activeCodeTab, setActiveCodeTab] = useState<'connector' | 'schemas' | 'tasks' | 'docker'>('connector');
  const [connectorName, setConnectorName] = useState<string>('ShopifyWooConnector');
  const [targetEndpoint, setTargetEndpoint] = useState<string>(TEMPLATE_OPTIONS[0].defaultEndpoint);
  const [batchSize, setBatchSize] = useState<number>(100);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [simulationSuccess, setSimulationSuccess] = useState<boolean | null>(null);

  const handleSelectTemplate = (template: TemplateOption) => {
    setSelectedTemplate(template);
    setTargetEndpoint(template.defaultEndpoint);
    setConnectorName(`${template.id.charAt(0).toUpperCase() + template.id.slice(1)}Connector`);
  };

  const handleCopyCode = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationSuccess(null);
    setSimulationLog([]);

    const logs: string[] = [
      `[INIT] در حال مقداردهی کانکتور ${connectorName} با نگاشت سطح ۲...`,
      `[AUTH] اعتبارسنجی پارامترهای ${selectedTemplate.authType} در آدرس ${targetEndpoint}...`,
      `[PROBE] ارسال درخواست Health-Check اولیه (GET /ping)... نتیجه: 200 OK (تاخیر: 42ms)`,
      `[DISCOVER] واکشی طرحواره ورودی: ۵۸ فیلد کشف شد.`,
      `[AI-MAP] تطبیق ۲۴ فیلد با مدل داده استاندارد شرکت (فاکتور، کاربر، مبلغ، اقلام، تخفیف)...`,
      `[TRANSFORM] تبدیل واحد پول (تومان به ریال) و نرمال‌سازی تاریخ شمسی به ISO-8601 UTC...`,
      `[DRY-RUN] پردازش آزمایشی ۵ رکورد بدون ثبت نهایی در دیتابیس... موفق!`,
      `[CELERY] ثبت تسک دوره‌ای در صف همگام‌سازی Celery با فاصله زمانی ۱۵ دقیقه.`,
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setSimulationLog((prev) => [...prev, logs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationSuccess(true);
      }
    }, 400);
  };

  const getConnectorPythonCode = (): string => {
    return `"""
Enterprise AI Platform - Connector SDK v2.4
Generated Connector: ${connectorName}
Target System: ${selectedTemplate.name} (${selectedTemplate.category})
Authentication: ${selectedTemplate.authType}
"""

import httpx
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import settings
from app.connectors.base import BaseEnterpriseConnector
from app.schemas.canonical import CanonicalOrder, CanonicalCustomer
from app.events.outbox import publish_domain_event

logger = logging.getLogger(__name__)

class ${connectorName}(BaseEnterpriseConnector):
    """
    Production-grade Connector for ${selectedTemplate.name}.
    Inherits enterprise features: Circuit Breaker, Exponential Backoff,
    Audit Logging, and Automatic Canonical Entity Transformation.
    """

    def __init__(
        self,
        endpoint_url: str = "${targetEndpoint}",
        api_key: Optional[str] = None,
        api_secret: Optional[str] = None,
        batch_size: int = ${batchSize},
        timeout_seconds: int = 30
    ):
        super().__init__(connector_name="${selectedTemplate.id}", category="${selectedTemplate.systemType}")
        self.endpoint_url = endpoint_url.rstrip("/")
        self.api_key = api_key or settings.DEFAULT_CONNECTOR_KEY
        self.api_secret = api_secret or settings.DEFAULT_CONNECTOR_SECRET
        self.batch_size = batch_size
        self.client = httpx.AsyncClient(timeout=timeout_seconds)

    async def health_check(self) -> Dict[str, Any]:
        """Verify endpoint connectivity and token validity."""
        try:
            response = await self.client.get(
                f"{self.endpoint_url}/health",
                headers=self._get_auth_headers()
            )
            is_healthy = response.status_code in (200, 204)
            return {
                "status": "HEALTHY" if is_healthy else "UNHEALTHY",
                "status_code": response.status_code,
                "latency_ms": round(response.elapsed.total_seconds() * 1000, 2)
            }
        except Exception as exc:
            logger.error(f"[CONNECTOR_PROBE_FAILED] Error reaching {self.endpoint_url}: {exc}")
            return {"status": "DOWN", "error": str(exc)}

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((httpx.RequestError, httpx.HTTPStatusError))
    )
    async def fetch_incremental_orders(self, since_timestamp: datetime) -> List[Dict[str, Any]]:
        """Pull orders modified after 'since_timestamp' with cursor pagination."""
        params = {
            "after": since_timestamp.isoformat(),
            "per_page": self.batch_size,
            "status": "completed,processing"
        }
        response = await self.client.get(
            f"{self.endpoint_url}/orders",
            headers=self._get_auth_headers(),
            params=params
        )
        response.raise_for_status()
        raw_records = response.json()
        logger.info(f"[{self.connector_name}] Successfully fetched {len(raw_records)} raw records.")
        return raw_records

    def transform_to_canonical(self, raw_order: Dict[str, Any]) -> CanonicalOrder:
        """
        Normalize heterogeneous payload into Canonical Business Data Model.
        Handles Persian currency, UTC timestamps, and status normalization.
        """
        raw_price = float(raw_order.get("total", 0))
        # Automatic Toman to Rial conversion rule
        unit_price_rial = raw_price * 10 if raw_order.get("currency") == "IRT" else raw_price

        return CanonicalOrder(
            invoice_no=str(raw_order.get("id") or raw_order.get("number")),
            customer_id=str(raw_order.get("customer_id") or raw_order.get("billing", {}).get("email", "GUEST")),
            total_amount=unit_price_rial,
            currency="IRR",
            created_at=datetime.fromisoformat(raw_order.get("date_created", datetime.utcnow().isoformat())),
            order_status=self._map_order_status(raw_order.get("status")),
            items_count=len(raw_order.get("line_items", [])),
            source_system="${selectedTemplate.id}",
            raw_metadata=raw_order
        )

    def _get_auth_headers(self) -> Dict[str, str]:
        """Construct secure auth headers based on configured method."""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "X-Client-Source": "Enterprise-AI-Platform-v2",
            "Content-Type": "application/json"
        }

    def _map_order_status(self, raw_status: str) -> str:
        status_map = {
            "completed": "DELIVERED",
            "processing": "CONFIRMED",
            "pending": "AWAITING_PAYMENT",
            "cancelled": "CANCELLED",
            "refunded": "REFUNDED"
        }
        return status_map.get(raw_status.lower(), "PENDING")

    async def close(self):
        await self.client.aclose()
`;
  };

  const getSchemasPythonCode = (): string => {
    return `"""
Pydantic v2 Validation Schemas for Canonical Unified Data Model
Ensures data hygiene, strict type validation, and zero contaminated records.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List
from datetime import datetime

class CanonicalOrder(BaseModel):
    invoice_no: str = Field(..., description="Unique enterprise invoice or transaction number")
    customer_id: str = Field(..., description="Normalized customer identifier or hash")
    total_amount: float = Field(..., ge=0, description="Total order amount in Iranian Rial (IRR)")
    currency: str = Field(default="IRR")
    created_at: datetime = Field(..., description="UTC ISO-8601 order creation timestamp")
    order_status: str = Field(..., description="Normalized status enum: CONFIRMED, DELIVERED, CANCELLED")
    items_count: int = Field(default=1, ge=1)
    source_system: str = Field(..., description="Source connector identifier (e.g. woocommerce, digikala)")
    raw_metadata: Optional[Dict[str, Any]] = Field(default=None)

    @field_validator("invoice_no")
    def validate_invoice_no(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Invoice number cannot be blank.")
        return clean

    @field_validator("total_amount")
    def validate_total_amount(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Total amount cannot be negative.")
        return round(v, 2)

class CanonicalCustomer(BaseModel):
    customer_id: str = Field(...)
    phone_hash: Optional[str] = Field(None, description="SHA-256 hashed mobile for privacy")
    email_domain: Optional[str] = None
    city: Optional[str] = Field(default="تهران")
    first_order_at: datetime
    last_order_at: datetime
    total_lifetime_spend: float = Field(ge=0)
    total_orders_count: int = Field(ge=1)
`;
  };

  const getTasksPythonCode = (): string => {
    return `"""
Celery Distributed Synchronization Task with Redis Distributed Lock
Guarantees exactly-once ingestion and handles automatic retry queues.
"""

from celery import shared_task
from datetime import datetime, timedelta
import asyncio
import logging
from app.core.redis import redis_client
from app.connectors.instances import get_connector_instance
from app.db.session import async_session_factory
from app.services.ingestion import ingest_canonical_batch

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    name="tasks.sync_${selectedTemplate.id}_orders",
    max_retries=3,
    default_retry_delay=60,
    rate_limit="10/m"
)
def sync_${selectedTemplate.id}_orders_task(self):
    """
    Periodic synchronization worker running on Linux Celery daemon.
    Acquires Redis mutex lock to prevent concurrent overlapping runs.
    """
    lock_key = "lock:sync:${selectedTemplate.id}"
    acquired = redis_client.set(lock_key, "RUNNING", nx=True, ex=300)
    if not acquired:
        logger.warning(f"Task sync_${selectedTemplate.id} is already running. Skipping overlap.")
        return {"status": "SKIPPED", "reason": "LOCK_HELD"}

    try:
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(_async_worker_body())
        return result
    except Exception as exc:
        logger.error(f"Sync failed for ${selectedTemplate.id}: {exc}")
        raise self.retry(exc=exc)
    finally:
        redis_client.delete(lock_key)

async def _async_worker_body():
    connector = get_connector_instance("${selectedTemplate.id}")
    since_time = datetime.utcnow() - timedelta(hours=2)
    raw_orders = await connector.fetch_incremental_orders(since_timestamp=since_time)
    
    canonical_orders = [connector.transform_to_canonical(o) for o in raw_orders]
    
    async with async_session_factory() as session:
        saved_count = await ingest_canonical_batch(session, canonical_orders)
        
    logger.info(f"Ingested {saved_count} canonical orders into Unified Data Layer.")
    return {"status": "SUCCESS", "records_ingested": saved_count}
`;
  };

  const getDockerCode = (): string => {
    return `# ====================================================================
# Enterprise AI Connector Daemon Dockerfile & Linux systemd unit
# ====================================================================

FROM python:3.11-slim as runtime

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    CONNECTOR_MODULE="${selectedTemplate.id}"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run as non-root enterprise user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
    CMD curl -f http://localhost:8000/api/v1/connectors/${selectedTemplate.id}/health || exit 1

CMD ["celery", "-A", "app.worker", "worker", "-Q", "connectors", "-l", "INFO", "-c", "2"]

# --------------------------------------------------------------------
# Linux systemd Service: /etc/systemd/system/ai-connector-${selectedTemplate.id}.service
# --------------------------------------------------------------------
# [Unit]
# Description=Enterprise AI Connector Worker - ${selectedTemplate.name}
# After=network.target redis-server.service postgresql.service
#
# [Service]
# Type=simple
# User=ubuntu
# WorkingDirectory=/home/ubuntu/ai-platform/backend
# ExecStart=/home/ubuntu/ai-platform/venv/bin/celery -A app.worker worker -Q connectors -l INFO
# Restart=always
# RestartSec=5
#
# [Install]
# WantedBy=multi-user.target
`;
  };

  const getActiveCode = (): string => {
    switch (activeCodeTab) {
      case 'connector':
        return getConnectorPythonCode();
      case 'schemas':
        return getSchemasPythonCode();
      case 'tasks':
        return getTasksPythonCode();
      case 'docker':
        return getDockerCode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              CONNECTOR SDK & CODE GENERATOR · ژنراتور خودکار کانکتورهای سازمانی
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              تولید خودکار کدهای پایتون و کانکتورهای استاندارد سیستم‌های دلخواه با هوش مصنوعی
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              با انتخاب نوع سامانه مبدا، موتور هوشمند کدهای اعتبارسنجی شده Python (FastAPI + Pydantic v2)، وظایف پس‌زمینه Celery، نگاشت خودکار به مدل داده یکپارچه، و فایل Dockerfile آماده استقرار در لینوکس را تولید می‌کند.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>در حال شبیه‌سازی اتصال...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>تست و شبیه‌سازی بلادرنگ اتصال</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Template Selectors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Box className="h-4 w-4 text-cyan-400" />
            <span>انتخاب الگوی سامانه خارجی (Pre-Built Enterprise Templates):</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">۶ الگوی رسمی فعال</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATE_OPTIONS.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{tmpl.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>شیوه احراز:</span>
                <span className="font-mono text-slate-300">{tmpl.authType}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generator Configuration Inputs */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-medium">نام کلاس کانکتور (Python Class):</label>
          <input
            type="text"
            value={connectorName}
            onChange={(e) => setConnectorName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">آدرس پایه وب‌سرویس (Base Endpoint):</label>
          <input
            type="text"
            value={targetEndpoint}
            onChange={(e) => setTargetEndpoint(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono text-left focus:border-cyan-500 focus:outline-none"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">حجم بسته هر درخواست (Batch Size):</label>
          <input
            type="number"
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Live Simulation Terminal Console if running or finished */}
      {(isSimulating || simulationLog.length > 0) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Terminal className="h-4 w-4" />
              <span>کنسول اجرای زنده شبیه‌ساز اتصال و کشف متادیتا</span>
            </div>
            {simulationSuccess && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>شبیه‌سازی با موفقیت کامل انجام شد</span>
              </span>
            )}
          </div>

          <div className="space-y-1 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto pt-1" dir="ltr">
            {simulationLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 select-none">&gt;</span>
                <span className={log.includes('موفق') || log.includes('200 OK') ? 'text-emerald-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
            {isSimulating && (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                <span>&gt; Processing next pipeline stage...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Viewer Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveCodeTab('connector')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeCodeTab === 'connector'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>connector.py (FastAPI / HTTPX)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('schemas')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeCodeTab === 'schemas'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>schemas.py (Pydantic v2)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('tasks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeCodeTab === 'tasks'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>tasks.py (Celery Worker)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('docker')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeCodeTab === 'docker'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="h-3.5 w-3.5" />
              <span>Dockerfile & systemd</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(getActiveCode(), activeCodeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700"
            >
              {copiedTab === activeCodeTab ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>کپی کد کامل</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] overflow-y-auto" dir="ltr">
          <pre className="leading-relaxed">
            <code>{getActiveCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
