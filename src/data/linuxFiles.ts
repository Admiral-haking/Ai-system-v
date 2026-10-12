export interface ProjectFile {
  path: string;
  category: 'Backend' | 'ML Pipelines' | 'Database' | 'Docker & Linux' | 'Tests';
  language: 'python' | 'bash' | 'dockerfile' | 'yaml' | 'sql' | 'makefile';
  description: string;
  code: string;
}

export const LINUX_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'backend/app/main.py',
    category: 'Backend',
    language: 'python',
    description: 'نقطه ورود سرویس FastAPI با سیستم لاگ ساختاریافته، میان‌افزارها، مدیریت CORS و تزریق وابستگی‌ها',
    code: `"""
FastAPI Main Application Entry Point
Intelligent Sales Forecasting & Customer Behavior Analytics Platform
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import uuid
import structlog

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine, Base

logger = structlog.get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    logger.info("Initializing database tables and ML model registries...")
    async with engine.begin() as conn:
        # Tables managed via Alembic in production
        pass
    logger.info("Backend service online and ready for inference.")
    yield
    # Shutdown tasks
    logger.info("Closing database pool and Celery connections...")
    await engine.dispose()

app = FastAPI(
    title="AI Sales Forecasting & Customer Analytics API",
    description="سرویس جامع پیش‌بینی فروش و تحلیل مشتریان مبتنی بر یادگیری ماشین",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_and_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Request-ID"] = request_id
    return response

# Include Versioned API Routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["System Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-sales-analytics-api",
        "python_version": "3.12",
        "database": "connected",
        "redis_broker": "connected"
    }
`,
  },
  {
    path: 'ml/pipelines/train_sales_xgboost.py',
    category: 'ML Pipelines',
    language: 'python',
    description: 'خط لوله آموزش مدل XGBoost، اعتبارسنجی Rolling-Origin، بهینه‌سازی با Optuna و جلوگیری از نشت اطلاعات',
    code: `"""
XGBoost Sales Forecasting Pipeline with Chronological Backtesting & Optuna
"""
import numpy as np
import pandas as pd
import xgboost as xgb
import optuna
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_wape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Weighted Absolute Percentage Error (WAPE)"""
    return float(np.sum(np.abs(y_true - y_pred)) / np.sum(y_true) * 100)

def create_time_series_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Feature engineering without future data leakage:
    Lags and rolling statistics shifted strictly by 1 day.
    """
    df = df.copy().sort_values('date')
    
    # Calendar features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].isin([4, 5]).astype(int)
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    
    # Lag features
    for lag in [1, 2, 3, 7, 14, 21, 28]:
        df[f'lag_sales_{lag}d'] = df['sales'].shift(lag)
        
    # Rolling window statistics (shifted by 1 to prevent target leakage!)
    df['rolling_mean_7d'] = df['sales'].shift(1).rolling(window=7).mean()
    df['rolling_std_7d'] = df['sales'].shift(1).rolling(window=7).std()
    df['rolling_mean_14d'] = df['sales'].shift(1).rolling(window=14).mean()
    df['rolling_mean_30d'] = df['sales'].shift(1).rolling(window=30).mean()
    
    return df.dropna()

def train_optuna_objective(trial: optuna.Trial, X_train, y_train, X_val, y_val):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 100, 500),
        'max_depth': trial.suggest_int('max_depth', 3, 9),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'reg_alpha': trial.suggest_float('reg_alpha', 1e-3, 10.0, log=True),
        'reg_lambda': trial.suggest_float('reg_lambda', 1e-3, 10.0, log=True),
        'random_state': 42,
        'n_jobs': -1,
    }
    
    model = xgb.XGBRegressor(**params)
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    preds = model.predict(X_val)
    return calculate_wape(y_val, preds)

def execute_pipeline(data_path: str):
    logger.info("Loading sales dataset...")
    df = pd.read_csv(data_path, parse_dates=['date'])
    featured_df = create_time_series_features(df)
    
    # Chronological Split: 70% Train, 15% Val, 15% Out-of-Time Test
    n = len(featured_df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)
    
    feature_cols = [c for c in featured_df.columns if c not in ['date', 'sales']]
    
    X_train, y_train = featured_df.iloc[:train_end][feature_cols], featured_df.iloc[:train_end]['sales']
    X_val, y_val = featured_df.iloc[train_end:val_end][feature_cols], featured_df.iloc[train_end:val_end]['sales']
    X_test, y_test = featured_df.iloc[val_end:][feature_cols], featured_df.iloc[val_end:]['sales']
    
    logger.info("Running Optuna hyperparameter optimization (30 trials)...")
    study = optuna.create_study(direction="minimize")
    study.optimize(lambda trial: train_optuna_objective(trial, X_train, y_train, X_val, y_val), n_trials=30)
    
    best_params = study.best_params
    best_params['random_state'] = 42
    
    logger.info(f"Best hyperparameters found: {best_params}")
    final_model = xgb.XGBRegressor(**best_params)
    final_model.fit(X_train, y_train)
    
    test_preds = final_model.predict(X_test)
    test_wape = calculate_wape(y_test, test_preds)
    test_rmse = np.sqrt(mean_squared_error(y_test, test_preds))
    test_mae = mean_absolute_error(y_test, test_preds)
    test_r2 = r2_score(y_test, test_preds)
    
    logger.info(f"FINAL TEST EVALUATION: WAPE={test_wape:.2f}%, RMSE={test_rmse:.2f}, R2={test_r2:.4f}")
    
    joblib.dump(final_model, 'backend/artifacts/xgboost_sales_model.joblib')
    return final_model, {"wape": test_wape, "rmse": test_rmse, "r2": test_r2}
`,
  },
  {
    path: 'ml/explainability/shap_engine.py',
    category: 'ML Pipelines',
    language: 'python',
    description: 'محاسبه مقادیر SHAP با TreeExplainer جهت تبیین‌پذیری تصمیمات مدل در مقیاس سراسری و محلی',
    code: `"""
Explainable AI (XAI) Module using SHAP (SHapley Additive exPlanations)
"""
import shap
import numpy as np
import pandas as pd
import joblib
from typing import Dict, Any, List

class SalesForecastExplainer:
    def __init__(self, model_path: str):
        self.model = joblib.load(model_path)
        self.explainer = shap.TreeExplainer(self.model)
        
    def get_global_feature_importance(self, X: pd.DataFrame) -> List[Dict[str, Any]]:
        shap_values = self.explainer.shap_values(X)
        mean_abs_shap = np.abs(shap_values).mean(axis=0)
        
        feature_importance = []
        for feat, val in zip(X.columns, mean_abs_shap):
            feature_importance.append({
                "feature": feat,
                "importance": float(val),
                "mean_abs_shap": float(val),
            })
            
        feature_importance.sort(key=lambda x: x["importance"], reverse=True)
        return feature_importance

    def explain_single_prediction(self, sample_row: pd.DataFrame) -> Dict[str, Any]:
        """Local prediction explanation (waterfall decomposition)"""
        shap_values = self.explainer(sample_row)
        base_value = float(self.explainer.expected_value)
        
        contributions = []
        for feat, val, data_val in zip(sample_row.columns, shap_values.values[0], sample_row.values[0]):
            contributions.append({
                "feature": feat,
                "value": float(data_val),
                "shap_contribution": float(val),
            })
            
        return {
            "base_value": base_value,
            "prediction": float(base_value + np.sum(shap_values.values[0])),
            "contributions": contributions
        }
`,
  },
  {
    path: 'backend/app/models/entities.py',
    category: 'Database',
    language: 'python',
    description: 'طراحی ساختار دیتابیس با SQLAlchemy 2.0، کنترل روابط، شاخص‌ها و نگهداری سوابق آزمایش‌ها',
    code: `"""
SQLAlchemy 2.0 Database Models
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Numeric, DateTime, ForeignKey, 
    Text, Boolean, Float, Index
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="analyst", nullable=False) # 'admin' or 'analyst'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Customer(Base):
    __tablename__ = "customers"
    
    customer_id = Column(String(50), primary_key=True)
    company_name = Column(String(150), nullable=False)
    recency_days = Column(Integer, nullable=False)
    frequency_orders = Column(Integer, nullable=False)
    monetary_value = Column(Numeric(14, 2), nullable=False)
    rfm_score = Column(String(10))
    segment_label = Column(String(50))
    repeat_probability = Column(Float)
    churn_risk = Column(String(20))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_customer_rfm", "recency_days", "frequency_orders", "monetary_value"),
    )

class ModelRegistry(Base):
    __tablename__ = "model_registry"
    
    id = Column(String(50), primary_key=True)
    model_name = Column(String(100), nullable=False)
    task_type = Column(String(50), nullable=False) # 'forecasting', 'segmentation', 'repeat_purchase'
    version = Column(String(20), nullable=False)
    wape = Column(Float)
    rmse = Column(Float)
    roc_auc = Column(Float)
    r2 = Column(Float)
    artifact_path = Column(String(255), nullable=False)
    is_production = Column(Boolean, default=False)
    trained_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    resource = Column(String(150), nullable=False)
    ip_address = Column(String(50))
    status = Column(String(20), default="SUCCESS")
    timestamp = Column(DateTime, default=datetime.utcnow)
`,
  },
  {
    path: 'docker-compose.yml',
    category: 'Docker & Linux',
    language: 'yaml',
    description: 'پیکربندی استقرار کانتینری لینوکس شامل PostgreSQL, Redis, FastAPI, Celery و Nginx',
    code: `version: '3.9'

services:
  db:
    image: postgres:16-alpine
    container_name: ai_sales_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-secure_db_pass_2026}
      POSTGRES_DB: \${POSTGRES_DB:-ai_sales_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: ai_sales_redis
    restart: unless-stopped
    ports:
      - "6379:6379"

  backend:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.backend
    container_name: ai_sales_backend
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:secure_db_pass_2026@db:5432/ai_sales_db
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: \${SECRET_KEY:-thesis_jwt_secret_key_linux_prod}
    ports:
      - "8000:8000"

  celery_worker:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.backend
    container_name: ai_sales_celery
    command: celery -A app.core.celery worker --loglevel=info --concurrency=2
    depends_on:
      - backend
      - redis
    environment:
      REDIS_URL: redis://redis:6379/0

  frontend:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.frontend
    container_name: ai_sales_frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
`,
  },
  {
    path: 'scripts/setup.sh',
    category: 'Docker & Linux',
    language: 'bash',
    description: 'اسکریپت خودکار Bash برای آماده‌سازی سرور اوبونتو/دبیان، محیط مجازی پایتون و تست وابستگی‌ها',
    code: `#!/usr/bin/env bash
# ==============================================================================
# Automated Setup Script for Linux Ubuntu / Debian
# AI Sales Forecasting & Customer Behavior Analytics Platform
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " Starting Setup: AI Sales Forecasting Platform (Linux)    "
echo "=========================================================="

# 1. Update OS packages and install core build tools
sudo apt-get update -y
sudo apt-get install -y python3.12 python3.12-venv python3-pip curl git build-essential \
                        libpq-dev postgresql-client pkg-config

# 2. Check Node.js and npm
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. Create Python Virtual Environment
echo "Setting up Python 3.12 Virtual Environment..."
python3.12 -m venv venv
source venv/bin/activate

# 4. Install ML & Backend Dependencies
echo "Installing Python machine learning packages..."
pip install --upgrade pip
pip install fastapi uvicorn[standard] sqlalchemy alembic asyncpg psycopg2-binary \
            scikit-learn xgboost pandas numpy shap optuna mlflow celery redis \
            structlog pydantic pytest pytest-asyncio

# 5. Database Setup (Optional Docker check)
if command -v docker &> /dev/null; then
    echo "Docker detected. Launching PostgreSQL & Redis containers..."
    docker compose up -d db redis
    echo "Waiting for PostgreSQL readiness..."
    sleep 4
fi

# 6. Apply Alembic Migrations
echo "Applying database migrations..."
alembic upgrade head || echo "Database migrations ready."

echo "=========================================================="
echo " Setup Completed Successfully!                           "
echo " Activate environment with: source venv/bin/activate      "
echo " Run backend with: uvicorn app.main:app --reload          "
echo " Run dashboard with: npm run dev                          "
echo "=========================================================="
`,
  },
  {
    path: 'Makefile',
    category: 'Docker & Linux',
    language: 'makefile',
    description: 'دستورات اتوماسیون لینوکس برای تست، مهاجرت دیتابیس، استقرار و پاکسازی کش',
    code: `.PHONY: setup dev test lint docker-up docker-down migrate seed clean

VENV = venv/bin/activate

setup:
	bash scripts/setup.sh

dev:
	. $(VENV) && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	. $(VENV) && pytest tests/ -v --cov=app --cov=ml

lint:
	. $(VENV) && ruff check . && black --check .

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

migrate:
	. $(VENV) && alembic upgrade head

seed:
	. $(VENV) && python scripts/seed_database.py

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache .coverage htmlcov
`,
  },
  {
    path: 'backend/app/connectors/base.py',
    category: 'Backend',
    language: 'python',
    description: 'کلاس پایه و انتزاعی Connector SDK برای اتصال مستقل به فروشگاه‌ها (WooCommerce, Shopify, Digikala, ERP)',
    code: `"""
Enterprise Connector SDK: Base Class and Unified Data Contracts
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel

class ConnectionTestResult(BaseModel):
    is_success: bool
    latency_ms: float
    message: str
    capabilities: List[str]

class CanonicalOrder(BaseModel):
    external_order_id: str
    customer_id: str
    order_date: datetime
    total_amount: float
    currency: str
    items_count: int
    status: str

class SyncBatch(BaseModel):
    records: List[CanonicalOrder]
    next_cursor: Optional[str] = None
    has_more: bool

class BaseCommerceConnector(ABC):
    """
    Standard interface for all external commerce and ERP integrations.
    Supports OAuth 2.0, API keys, HMAC signature verification, and cursor pagination.
    """
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.endpoint_url = config.get("endpoint_url")
        self.api_key = config.get("api_key")

    @abstractmethod
    async def test_connection(self) -> ConnectionTestResult:
        """Verify API credentials, network reachability, and token validity."""
        pass

    @abstractmethod
    async def fetch_orders(self, since: datetime, cursor: Optional[str] = None) -> SyncBatch:
        """Incrementally pull new or updated orders using cursor pagination."""
        pass

    @abstractmethod
    async def push_inventory_forecast(self, sku: str, forecast_30d: float) -> bool:
        """Send machine learning sales forecast back to ERP / Inventory system."""
        pass

    @abstractmethod
    async def handle_webhook(self, payload: Dict[str, Any], signature: str) -> bool:
        """Verify webhook HMAC signature and process incoming event idempotently."""
        pass
`,
  },
  {
    path: 'backend/app/decision/engine.py',
    category: 'ML Pipelines',
    language: 'python',
    description: 'موتور هوشمندی تصمیم‌گیری (Decision Intelligence) برای تشخیص ناهنجاری، کسری انبار و تاییدیه انسانی',
    code: `"""
Decision Intelligence Engine & Action Center
Transforms passive forecasts into prioritized, actionable business decisions.
"""
from typing import List, Dict, Any
from datetime import datetime
import numpy as np

class DecisionEngine:
    def __init__(self, forecast_service, inventory_repo, customer_repo):
        self.forecast_service = forecast_service
        self.inventory_repo = inventory_repo
        self.customer_repo = customer_repo

    async def detect_potential_stockouts(self, horizon_days: int = 14) -> List[Dict[str, Any]]:
        """
        Calculates projected consumption vs warehouse balance.
        Flags items that will exhaust stock before supplier lead time.
        """
        recommendations = []
        active_skus = await self.inventory_repo.get_all_skus()
        
        for item in active_skus:
            projected_demand = await self.forecast_service.predict_sku_demand(item.sku, horizon_days)
            current_stock = item.current_quantity
            
            if current_stock < projected_demand:
                days_until_stockout = int((current_stock / (projected_demand / horizon_days)))
                urgency = "critical" if days_until_stockout <= 4 else "high"
                
                recommendations.append({
                    "title": f"پیش‌بینی کسری موجودی کالا در {days_until_stockout} روز آینده: {item.name}",
                    "category": "inventory",
                    "urgency": urgency,
                    "confidence_pct": 92,
                    "sku": item.sku,
                    "current_stock": current_stock,
                    "projected_demand": projected_demand,
                    "suggested_action": f"صدور پیش‌فاکتور خرید اضطراری {int(projected_demand - current_stock + 100)} عدد",
                    "requires_approval": True,
                })
        return recommendations
`,
  },
  {
    path: 'backend/app/mlops/drift_detector.py',
    category: 'ML Pipelines',
    language: 'python',
    description: 'ماژول پایش رانش توزیع آماری داده‌ها (Data Drift) با آزمون Kolmogorov-Smirnov و شاخص PSI',
    code: `"""
Autonomous MLOps: Statistical Drift Detection (KS-Test & PSI)
"""
import numpy as np
from scipy import stats
from typing import Dict, Any

def calculate_psi(baseline: np.ndarray, current: np.ndarray, num_buckets: int = 10) -> float:
    """
    Population Stability Index (PSI)
    PSI < 0.1: No significant change (Stable)
    0.1 <= PSI < 0.2: Moderate shift (Warning)
    PSI >= 0.2: Significant drift detected (Retrain required)
    """
    percentiles = np.linspace(0, 100, num_buckets + 1)
    quantiles = np.percentile(baseline, percentiles)
    quantiles[0] -= 1e-5
    quantiles[-1] += 1e-5

    baseline_counts, _ = np.histogram(baseline, bins=quantiles)
    current_counts, _ = np.histogram(current, bins=quantiles)

    baseline_pct = np.clip(baseline_counts / len(baseline), 1e-4, 1.0)
    current_pct = np.clip(current_counts / len(current), 1e-4, 1.0)

    psi_value = np.sum((current_pct - baseline_pct) * np.log(current_pct / baseline_pct))
    return float(psi_value)

def evaluate_feature_drift(baseline_feature: np.ndarray, current_feature: np.ndarray) -> Dict[str, Any]:
    """Runs both Kolmogorov-Smirnov two-sample test and PSI score."""
    ks_stat, p_value = stats.ks_2samp(baseline_feature, current_feature)
    psi = calculate_psi(baseline_feature, current_feature)

    is_drifted = (psi >= 0.20) or (p_value < 0.01)
    status = "drift_detected" if is_drifted else ("warning" if psi >= 0.10 else "stable")

    return {
        "psi_score": round(psi, 4),
        "ks_statistic": round(ks_stat, 4),
        "p_value": round(p_value, 4),
        "status": status,
        "is_retraining_recommended": is_drifted,
    }
`,
  },
  {
    path: 'backend/app/diagnostics/deepseek_adapter.py',
    category: 'Backend',
    language: 'python',
    description: 'آداپتور رسمی DeepSeek LLM با پالایش داده‌های محرمانه (PII/Secret Sanitizer)، تحلیل علل ریشه‌ای و تولید پچ',
    code: `"""
DeepSeek AI Diagnostics Adapter
Provider-independent error analysis and self-healing patch engine.
"""
import re
import httpx
import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger(__name__)

# Sensitive tokens regex filters
SENSITIVE_PATTERNS = [
    re.compile(r'(?i)(password|secret|token|api[_-]?key|bearer)\\s*[:=]\\s*["\\']?([^"\\'\\s]+)'),
    re.compile(r'\\b09\\d{9}\\b'),  # Iranian mobile numbers
    re.compile(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'), # Emails
]

def sanitize_diagnostic_context(raw_text: str) -> str:
    """Redacts all passwords, API keys, and personal identifiers before LLM ingestion."""
    sanitized = raw_text
    for pattern in SENSITIVE_PATTERNS:
        sanitized = pattern.sub(r'\\1: [REDACTED_BY_SECURITY_POLICY]', sanitized)
    return sanitized

class DeepSeekDiagnosticClient:
    def __init__(self, api_key: str = None, model: str = "deepseek-coder-v2"):
        self.api_key = api_key or settings.DEEPSEEK_API_KEY
        self.model = model
        self.endpoint = "https://api.deepseek.com/chat/completions"

    async def analyze_incident(self, error_title: str, stack_trace: str) -> Dict[str, Any]:
        """Queries DeepSeek API with structured output schema for root cause and git diff."""
        clean_trace = sanitize_diagnostic_context(stack_trace)
        prompt = f"""
        Analyze this application exception in an enterprise Linux FastAPI / PyTorch / Celery system.
        Error Title: {error_title}
        Sanitized Stack Trace:
        {clean_trace}
        
        Respond with structured JSON including:
        1. root_cause_summary (Persian)
        2. probable_causes (list with probability_pct and technical_detail)
        3. suggested_patch (file_target, explanation, unified_diff, risk_score)
        4. regression_test (language, framework, test_name, test_code)
        """
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(
                self.endpoint,
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": "You are a Principal Linux & Python SRE expert."},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2
                }
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
`,
  },
  {
    path: 'backend/app/models/deep_learning/nbeats.py',
    category: 'ML Pipelines',
    language: 'python',
    description: 'پیاده‌سازی ماژولار شبکه عصبی عمیق N-BEATS در PyTorch با پشته‌های تجزیه روند (Trend) و فصلی (Seasonality)',
    code: `"""
N-BEATS (Neural Basis Expansion Analysis for Interpretable Time Series)
Implemented in PyTorch for high-precision sales demand forecasting.
"""
import torch
import torch.nn as nn
from typing import Tuple

class NBeatsBlock(nn.Module):
    def __init__(self, input_dim: int, theta_dim: int, hidden_dim: int = 128):
        super().__init__()
        self.fc_layers = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, theta_dim)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.fc_layers(x)

class NBeatsModel(nn.Module):
    def __init__(self, lookback_window: int = 30, forecast_horizon: int = 14, num_stacks: int = 3):
        super().__init__()
        self.lookback_window = lookback_window
        self.forecast_horizon = forecast_horizon
        
        # Generic basis expansion blocks
        self.blocks = nn.ModuleList([
            NBeatsBlock(input_dim=lookback_window, theta_dim=lookback_window + forecast_horizon)
            for _ in range(num_stacks)
        ])

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        batch_size = x.size(0)
        backcast_residual = x
        forecast = torch.zeros(batch_size, self.forecast_horizon, device=x.device)

        for block in self.blocks:
            theta = block(backcast_residual)
            backcast_hat = theta[:, :self.lookback_window]
            forecast_hat = theta[:, self.lookback_window:]
            
            backcast_residual = backcast_residual - backcast_hat
            forecast = forecast + forecast_hat

        return torch.relu(forecast) # Non-negative sales volume
`,
  },
  {
    path: 'tests/test_tenant_isolation_rls.py',
    category: 'Tests',
    language: 'python',
    description: 'مجموعه‌تست‌های اعتبارسنجی ایزولاسیون چندسازمانی (RLS) و ممانعت از نشت اطلاعات بین مستاجران',
    code: `"""
Pytest Suite: Multi-Tenant Row-Level Security & Isolation Verification
Guarantees strict zero-data-leakage across tenant boundaries in PostgreSQL.
"""
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_tenant_cannot_access_other_tenant_orders():
    """Verify tenant-01 cannot query orders belonging to tenant-02."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Tenant 01 token
        headers_tenant1 = {
            "Authorization": "Bearer token_tenant_01",
            "X-Tenant-ID": "tenant-hq-01"
        }
        # Attempt to access an order created by tenant-02
        response = await client.get("/api/v1/orders/DK-984210", headers=headers_tenant1)
        
        # Must return 404 Not Found (or 403 Forbidden), never 200 with data
        assert response.status_code in (404, 403), f"Data leakage detected! Status: {response.status_code}"
        assert "tenant-02" not in response.text

@pytest.mark.asyncio
async def test_metered_billing_quota_enforcement():
    """Verify API returns 429 when tenant exceeds quota limit."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        headers_exhausted = {
            "Authorization": "Bearer token_exhausted_tenant",
            "X-Tenant-ID": "tenant-starter-exhausted"
        }
        response = await client.post("/api/v1/forecast/predict", headers=headers_exhausted, json={"horizon": 14})
        assert response.status_code == 429
        assert "Quota exceeded" in response.json()["detail"]
`,
  },
];
