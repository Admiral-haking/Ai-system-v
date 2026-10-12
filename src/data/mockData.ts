import {
  DailySaleRecord,
  ModelMetricComparison,
  CustomerRfm,
  ClusterSummary,
  RepeatPurchaseMetric,
  ShapFeatureImportance,
  MLflowRun,
  AuditLog,
  DataQualityReport,
  RecommendationItem,
  IntegrationConnector,
  SyncLog,
  DriftMetric,
  CanaryDeployment,
  PlatformEvent,
  AutomationRule,
  ServiceSLO,
  Tenant,
  AuditFinding,
  IntegrationProviderInfo,
  CanonicalFieldDefinition,
  FieldMappingRule,
  DatabaseTableSchema,
  OpenApiAnalysisResult,
  UniversalDataQualityMetric,
} from '../types';

// Realistic 60-day historical + 30-day forecast series based on UCI Online Retail daily aggregations
export const generateDailySales = (modelType: string = 'xgboost', horizon: number = 30): DailySaleRecord[] => {
  const records: DailySaleRecord[] = [];
  const baseValue = 18500000; // Tomans (or base currency units)
  
  // Historical 45 days
  for (let i = 45; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Day of week effect: weekend / weekday
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 5; // Friday
    const seasonalMultiplier = isWeekend ? 0.72 : (dayOfWeek === 4 ? 1.25 : 1.0);
    const trend = 1 + (45 - i) * 0.003;
    const noise = (Math.sin(i * 0.8) * 0.12) + (Math.cos(i * 0.3) * 0.07);
    
    const actual = Math.round(baseValue * seasonalMultiplier * trend * (1 + noise));
    const predDiff = (Math.sin(i * 1.5) * 0.04) + 0.01;
    const predicted = Math.round(actual * (1 + predDiff));
    
    records.push({
      date: dateStr,
      actualSales: actual,
      predictedSales: predicted,
      upperBound: Math.round(predicted * 1.08),
      lowerBound: Math.round(predicted * 0.92),
      ordersCount: Math.round(actual / 245000),
      averageOrderValue: Math.round(245000 + (Math.sin(i) * 15000)),
      isForecast: false,
    });
  }

  // Model-specific accuracy offsets
  let modelVariance = 0.06;
  if (modelType === 'seasonal_naive') modelVariance = 0.18;
  if (modelType === 'linear_regression') modelVariance = 0.14;
  if (modelType === 'random_forest') modelVariance = 0.08;
  if (modelType === 'xgboost') modelVariance = 0.048;

  // Future forecast days (up to requested horizon)
  for (let i = 1; i <= horizon; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 5;
    const seasonalMultiplier = isWeekend ? 0.70 : (dayOfWeek === 4 ? 1.28 : 1.02);
    const trend = 1 + (45 + i) * 0.0035;
    const futureNoise = Math.sin(i * 0.7) * 0.08;
    
    const expected = Math.round(baseValue * seasonalMultiplier * trend * (1 + futureNoise));
    // Simulated forecast error expansion over time horizon (heteroscedasticity)
    const horizonErrorGrowth = 1 + (i / horizon) * 0.07;
    const boundWidth = modelVariance * 1.96 * horizonErrorGrowth;

    records.push({
      date: dateStr,
      actualSales: 0, // Unobserved future ground truth
      predictedSales: expected,
      upperBound: Math.round(expected * (1 + boundWidth)),
      lowerBound: Math.round(expected * (1 - boundWidth)),
      ordersCount: Math.round(expected / 252000),
      averageOrderValue: Math.round(252000),
      isForecast: true,
    });
  }

  return records;
};

// Model comparison metrics evaluated on out-of-time test split (Nov-Dec 2024 test window)
export const FORECAST_MODELS: ModelMetricComparison[] = [
  {
    id: 'xgboost-reg-v3',
    name: 'XGBoost Regressor (بهینه‌سازی شده با Optuna)',
    type: 'گرادیان بوستینگ غیرخطی با ویژگی‌های تاخیری (Lags 1-14)',
    mae: 842000,
    rmse: 1120000,
    wape: 4.82,
    r2: 0.938,
    trainingTimeSec: 18.4,
    inferenceLatencyMs: 14.2,
    status: 'production',
    version: 'v3.2.0',
    featuresUsed: 28,
  },
  {
    id: 'rf-reg-v2',
    name: 'Random Forest Regressor',
    type: 'جنگل تصادفی (۲۰۰ درخت با عمق بیشینه ۱۲)',
    mae: 1180000,
    rmse: 1540000,
    wape: 6.75,
    r2: 0.884,
    trainingTimeSec: 34.6,
    inferenceLatencyMs: 28.5,
    status: 'candidate',
    version: 'v2.1.0',
    featuresUsed: 28,
  },
  {
    id: 'linear-reg-v1',
    name: 'Ridge Linear Regression (پایه‌ای)',
    type: 'رگرسیون خطی قانونمند با ویژگی‌های خطی تقویمی',
    mae: 2410000,
    rmse: 3120000,
    wape: 13.8,
    r2: 0.712,
    trainingTimeSec: 2.1,
    inferenceLatencyMs: 3.4,
    status: 'candidate',
    version: 'v1.4.0',
    featuresUsed: 12,
  },
  {
    id: 'seasonal-naive-baseline',
    name: 'Seasonal Naive Baseline (پایه مقایسه)',
    type: 'الگوریتم هیوریستیک انتقال مقدار ۷ روز قبل بدون یادگیری',
    mae: 3290000,
    rmse: 4410000,
    wape: 18.9,
    r2: 0.584,
    trainingTimeSec: 0.05,
    inferenceLatencyMs: 0.8,
    status: 'archived',
    version: 'v1.0.0',
    featuresUsed: 1,
  },
];

// Customer RFM profile sample (representing customers extracted from UCI dataset)
export const SAMPLE_CUSTOMERS: CustomerRfm[] = [
  {
    customerId: 'CUST-17850',
    customerName: 'فروشگاه پخش آریا (تهران)',
    recencyDays: 3,
    frequencyOrders: 34,
    monetaryValue: 128400000,
    rfmScore: '5-5-5',
    segment: 'مشتریان طلایی (Champions)',
    repeatProbability: 0.96,
    churnRisk: 'low',
    lastOrderDate: '۱۴۰۳/۰۸/۲۴',
  },
  {
    customerId: 'CUST-13047',
    customerName: 'بازرگانی پارسیان پویا',
    recencyDays: 14,
    frequencyOrders: 18,
    monetaryValue: 64500000,
    rfmScore: '4-4-5',
    segment: 'مشتریان وفادار (Loyal)',
    repeatProbability: 0.88,
    churnRisk: 'low',
    lastOrderDate: '۱۴۰۳/۰۸/۱۳',
  },
  {
    customerId: 'CUST-12583',
    customerName: 'فروشگاه زنجیره‌ای سپهر',
    recencyDays: 6,
    frequencyOrders: 22,
    monetaryValue: 89300000,
    rfmScore: '5-4-5',
    segment: 'مشتریان طلایی (Champions)',
    repeatProbability: 0.93,
    churnRisk: 'low',
    lastOrderDate: '۱۴۰۳/۰۸/۲۱',
  },
  {
    customerId: 'CUST-13748',
    customerName: 'فروشگاه الکترونیک رسا',
    recencyDays: 45,
    frequencyOrders: 8,
    monetaryValue: 24700000,
    rfmScore: '3-3-3',
    segment: 'مشتریان در معرض خطر (At Risk)',
    repeatProbability: 0.42,
    churnRisk: 'medium',
    lastOrderDate: '۱۴۰۳/۰۷/۱۱',
  },
  {
    customerId: 'CUST-15100',
    customerName: 'تجهیزات صنعتی رادمهر',
    recencyDays: 122,
    frequencyOrders: 3,
    monetaryValue: 11200000,
    rfmScore: '1-2-2',
    segment: 'مشتریان خاموش (Hibernating)',
    repeatProbability: 0.12,
    churnRisk: 'high',
    lastOrderDate: '۱۴۰۳/۰۴/۲۹',
  },
  {
    customerId: 'CUST-15291',
    customerName: 'توزیع کالا نیما',
    recencyDays: 8,
    frequencyOrders: 2,
    monetaryValue: 7800000,
    rfmScore: '5-1-2',
    segment: 'مشتریان جدید مستعد (Promising)',
    repeatProbability: 0.64,
    churnRisk: 'low',
    lastOrderDate: '۱۴۰۳/۰۸/۱۹',
  },
  {
    customerId: 'CUST-14688',
    customerName: 'شرکت خدمات رایانه افق',
    recencyDays: 88,
    frequencyOrders: 12,
    monetaryValue: 48900000,
    rfmScore: '2-4-4',
    segment: 'نیازمند توجه فوری (Need Attention)',
    repeatProbability: 0.38,
    churnRisk: 'high',
    lastOrderDate: '۱۴۰۳/۰۵/۳۰',
  },
  {
    customerId: 'CUST-16029',
    customerName: 'هایپرمارکت باران',
    recencyDays: 2,
    frequencyOrders: 41,
    monetaryValue: 194000000,
    rfmScore: '5-5-5',
    segment: 'مشتریان طلایی (Champions)',
    repeatProbability: 0.98,
    churnRisk: 'low',
    lastOrderDate: '۱۴۰۳/۰۸/۲۵',
  },
];

// Customer Segmentation Clusters (Results from K-Means k=4 vs DBSCAN)
export const CLUSTERS_DATA: ClusterSummary[] = [
  {
    clusterId: 0,
    clusterName: 'مشتریان طلایی و استراتژیک (Champions)',
    customerCount: 684,
    percentage: 15.6,
    avgRecency: 8.4,
    avgFrequency: 29.8,
    avgMonetary: 115200000,
    color: '#10b981', // emerald
    description: 'خرید بسیار مکرر، تازگی بالا و سهم بیش از ۶۲ درصد از کل درآمد سازمان.',
    marketingAction: 'برنامه پاداش VIP، پشتیبانی اختصاصی و عدم ارسال تخفیف‌های سنگین غیرضروری.',
  },
  {
    clusterId: 1,
    clusterName: 'مشتریان وفادار پرپتانسیل (Loyal & Growing)',
    customerCount: 1420,
    percentage: 32.4,
    avgRecency: 22.1,
    avgFrequency: 11.4,
    avgMonetary: 38400000,
    color: '#06b6d4', // cyan
    description: 'خرید منظم با بسامد متوسط؛ وفاداری بالا و پتانسیل عالی برای فروش مکمل (Cross-sell).',
    marketingAction: 'پیشنهاد بسته‌های ویژه کالا و اطلاع‌رسانی محصولات تازه وارد.',
  },
  {
    clusterId: 2,
    clusterName: 'مشتریان جدید و امیدوارکننده (Promising & Recent)',
    customerCount: 962,
    percentage: 22.0,
    avgRecency: 14.5,
    avgFrequency: 2.3,
    avgMonetary: 9200000,
    color: '#8b5cf6', // purple
    description: 'مشتریانی که اخیراً اولین یا دومین خرید خود را ثبت کرده‌اند.',
    marketingAction: 'کمپین آنبوردینگ، کد تخفیف برای سفارش دوم در فاصله زمانی ۱۰ روزه.',
  },
  {
    clusterId: 3,
    clusterName: 'مشتریان در معرض ریزش و غیرفعال (At Risk & Inactive)',
    customerCount: 1314,
    percentage: 30.0,
    avgRecency: 168.2,
    avgFrequency: 3.1,
    avgMonetary: 11400000,
    color: '#f43f5e', // rose
    description: 'عدم ثبت سفارش در ۱۶۰ روز گذشته پس از چندین خرید اولیه در گذشته.',
    marketingAction: 'کمپین بازگشت (Win-back)، نظرسنجی علت عدم رضایت و کوپن بازگشت ویژه.',
  },
];

// Supervised Repeat Purchase Classification Metrics (Window: 90 days obs -> 30 days future prediction)
export const REPEAT_PURCHASE_MODELS: RepeatPurchaseMetric[] = [
  {
    modelName: 'XGBoost Classifier (بهینه‌سازی شده)',
    rocAuc: 0.892,
    prAuc: 0.841,
    precision: 0.824,
    recall: 0.856,
    f1Score: 0.840,
    brierScore: 0.118,
    accuracy: 0.848,
  },
  {
    modelName: 'Random Forest Classifier',
    rocAuc: 0.865,
    prAuc: 0.804,
    precision: 0.795,
    recall: 0.812,
    f1Score: 0.803,
    brierScore: 0.134,
    accuracy: 0.816,
  },
  {
    modelName: 'Logistic Regression (پایه‌ای)',
    rocAuc: 0.784,
    prAuc: 0.692,
    precision: 0.718,
    recall: 0.730,
    f1Score: 0.724,
    brierScore: 0.182,
    accuracy: 0.732,
  },
];

// SHAP Feature Importance derived from the tree explainer
export const SHAP_FEATURES: ShapFeatureImportance[] = [
  {
    feature: 'lag_sales_7d',
    faLabel: 'فروش هفت روز گذشته (Lag 7)',
    importance: 0.384,
    meanAbsShap: 0.42,
    correlation: 'positive',
    description: 'الگوی هفتگی قوی‌ترین شاخص تکرار رفتار خرید و برآورد روند کوتاه‌مدت است.',
  },
  {
    feature: 'customer_recency_days',
    faLabel: 'فاصله تا آخرین خرید (Recency)',
    importance: 0.291,
    meanAbsShap: 0.36,
    correlation: 'negative',
    description: 'با افزایش تعداد روزهای دوری از سیستم، احتمال خرید مجدد به صورت نمایی افت می‌کند.',
  },
  {
    feature: 'rolling_mean_sales_14d',
    faLabel: 'میانگین متحرک فروش ۱۴ روزه',
    importance: 0.198,
    meanAbsShap: 0.28,
    correlation: 'positive',
    description: 'شاخص پایدار میانگین‌گیری متحرک بدون نشت اطلاعات آینده (No Leakage).',
  },
  {
    feature: 'order_frequency_total',
    faLabel: 'تعداد کل سفارشات قبلی (Frequency)',
    importance: 0.145,
    meanAbsShap: 0.22,
    correlation: 'positive',
    description: 'تکرار سفارشات نشان‌دهنده عادت‌پذیری و وابستگی به زنجیره تامین است.',
  },
  {
    feature: 'day_of_week_friday',
    faLabel: 'شاخص روز جمعه (تعطیلات آخر هفته)',
    importance: 0.112,
    meanAbsShap: 0.18,
    correlation: 'negative',
    description: 'کاهش حدود ۲۸ درصدی حجم فروش در روزهای تعطیل پایانی هفته.',
  },
  {
    feature: 'customer_monetary_ltv',
    faLabel: 'ارزش تجمعی خریدهای مشتری (Monetary)',
    importance: 0.098,
    meanAbsShap: 0.15,
    correlation: 'positive',
    description: 'مشتریان با گردش مالی بالاتر تمایل بیشتری به تکرار سفارش دارند.',
  },
  {
    feature: 'unit_price_average',
    faLabel: 'میانگین قیمت اقلام خریداری شده',
    importance: 0.065,
    meanAbsShap: 0.09,
    correlation: 'negative',
    description: 'اقلام بسیار گران‌قیمت با بسامد کمتری مجدداً خریداری می‌شوند.',
  },
];

// MLflow Experiment Tracking Runs
export const MLFLOW_RUNS: MLflowRun[] = [
  {
    runId: 'exp_run_a94f1c',
    experimentName: 'sales_forecast_xgboost_optuna',
    modelType: 'XGBoost Regressor',
    timestamp: '۱۴۰۳/۰۸/۲۲ - ۱۶:۴۰',
    duration: '18.4s',
    hyperparameters: {
      n_estimators: 320,
      max_depth: 6,
      learning_rate: 0.042,
      subsample: 0.85,
      colsample_bytree: 0.8,
      reg_alpha: 0.15,
      reg_lambda: 1.2,
    },
    metrics: {
      wape: 4.82,
      rmse: 1120000,
      mae: 842000,
      r2: 0.938,
    },
    artifacts: ['model.pkl', 'preprocessor.joblib', 'shap_summary.png', 'feature_importance.json'],
    status: 'FINISHED',
    version: 'v3.2.0',
    isProduction: true,
  },
  {
    runId: 'exp_run_7b38e0',
    experimentName: 'repeat_purchase_xgboost_clf',
    modelType: 'XGBoost Classifier',
    timestamp: '۱۴۰۳/۰۸/۲۲ - ۱۵:۱۰',
    duration: '14.1s',
    hyperparameters: {
      n_estimators: 250,
      max_depth: 5,
      learning_rate: 0.05,
      scale_pos_weight: 1.84, // Handles class imbalance
    },
    metrics: {
      wape: 0,
      rmse: 0,
      mae: 0,
      rocAuc: 0.892,
    },
    artifacts: ['clf_model.xgb', 'scaler.pkl', 'roc_curve.svg', 'confusion_matrix.json'],
    status: 'FINISHED',
    version: 'v2.4.0',
    isProduction: true,
  },
  {
    runId: 'exp_run_31c92a',
    experimentName: 'customer_clustering_kmeans',
    modelType: 'K-Means (k=4)',
    timestamp: '۱۴۰۳/۰۸/۲۱ - ۱۱:۳۵',
    duration: '4.8s',
    hyperparameters: {
      n_clusters: 4,
      init: 'k-means++',
      n_init: 20,
      max_iter: 300,
    },
    metrics: {
      wape: 0,
      rmse: 0,
      mae: 0,
      r2: 0.642, // Silhouette Score
    },
    artifacts: ['kmeans_k4.joblib', 'elbow_plot.png', 'cluster_profiles.csv'],
    status: 'FINISHED',
    version: 'v1.8.0',
    isProduction: true,
  },
  {
    runId: 'exp_run_10f44d',
    experimentName: 'sales_forecast_rf_baseline',
    modelType: 'Random Forest Regressor',
    timestamp: '۱۴۰۳/۰۸/۲۰ - ۰۹:۱۵',
    duration: '34.6s',
    hyperparameters: {
      n_estimators: 200,
      max_depth: 12,
      min_samples_split: 5,
    },
    metrics: {
      wape: 6.75,
      rmse: 1540000,
      mae: 1180000,
      r2: 0.884,
    },
    artifacts: ['rf_model.pkl'],
    status: 'FINISHED',
    version: 'v2.1.0',
    isProduction: false,
  },
];

// Audit trail for security & defense inspection
export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-8841',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۰:۴۲:۱۵',
    user: 'دکتر خبیری (مدیر سیستم)',
    role: 'admin',
    action: 'PROMOTE_MODEL_PRODUCTION',
    resource: 'models/xgboost-reg-v3',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'LOG-8840',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۰۹:۳۰:۰۲',
    user: 'علی خیری (تحلیل‌گر داده)',
    role: 'analyst',
    action: 'RUN_OPTUNA_HYPERPARAMETER_SEARCH',
    resource: 'jobs/training_optuna_trials_50',
    status: 'SUCCESS',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'LOG-8839',
    timestamp: '۱۴۰۳/۰۸/۲۴ ۱۸:۱۴:۲۹',
    user: 'علی خیری (تحلیل‌گر داده)',
    role: 'analyst',
    action: 'UPLOAD_DATASET_VALIDATE',
    resource: 'datasets/online_retail_cleaned.csv',
    status: 'SUCCESS',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'LOG-8838',
    timestamp: '۱۴۰۳/۰۸/۲۴ ۱۱:۰۲:۱۸',
    user: 'سیستم پس‌زمینه (Celery)',
    role: 'system',
    action: 'SCHEDULED_BACKTESTING_EVAL',
    resource: 'eval/rolling_origin_14d',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
  },
];

// Data quality summary for UCI Online Retail dataset ingestion
export const INITIAL_DATA_QUALITY_REPORT: DataQualityReport = {
  totalRows: 541909,
  totalColumns: 8,
  validRows: 397924,
  canceledOrdersCount: 9288,
  missingCustomerIds: 135080,
  negativePricesFixed: 2,
  dateRange: { start: '2010-12-01', end: '2011-12-09' },
  uniqueCustomers: 4372,
  uniqueProducts: 3684,
  missingValuesPct: 24.9,
  schemaValid: true,
};

// =========================================================================
// ENTERPRISE SEED DATA (DECISION CENTER, CONNECTORS, MLOPS, MULTI-TENANCY)
// =========================================================================

// Phase 0: System Discovery and Technical Debt Audit Register
export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: 'FINDING-001',
    domain: 'architecture',
    severity: 'HIGH',
    title: 'تداخل وابستگی ماژول پیش‌بینی و دسترسی مستقیم به ORM',
    description: 'خط لوله‌های استنتاج یادگیری ماشین مستقیماً با مدل‌های SQLAlchemy گره خورده بودند که استقرار مستقل را با مشکل مواجه می‌کرد.',
    resolutionPath: 'اعمال معماری بنادر و آداپتورها (Hexagonal Ports & Adapters) و ایجاد قرارداد مشترک IForecastingService.',
    status: 'MITIGATED',
  },
  {
    id: 'FINDING-002',
    domain: 'performance',
    severity: 'MEDIUM',
    title: 'کمبود کش برای پیش‌بینی‌های پربسامد ۷ روزه',
    description: 'درخواست‌های مکرر پیش‌بینی داشبورد محاسبات استنتاج را در هر درخواست تکرار می‌کردند.',
    resolutionPath: 'پیاده‌سازی لایه کش توزیع‌شده Redis با کلیدهای هش‌شده مبتنی بر پارامترهای افق و نسخه مدل.',
    status: 'MITIGATED',
  },
  {
    id: 'FINDING-003',
    domain: 'security',
    severity: 'CRITICAL',
    title: 'فقدان تفکیک داده‌ای سطح ردیف (Row-Level Security) در پایگاه داده چندسازمانی',
    description: 'پیش از این جداسازی مستاجران تنها در لایه کد بک‌اند اعمال می‌شد.',
    resolutionPath: 'فعال‌سازی پالیسی‌های RLS در PostgreSQL و مقید کردن تمام کوئری‌ها به tenant_id فعال در هدر نشست.',
    status: 'VERIFIED',
  },
  {
    id: 'FINDING-004',
    domain: 'ml_ops',
    severity: 'HIGH',
    title: 'عدم پایش خودکار رانش توزیع ورودی (Data Drift) در فرآیند استنتاج زنده',
    description: 'تغییر الگوهای تقاضا به صورت خودکار شناسایی نمی‌شد و نیاز به مداخله دستی کاربر داشت.',
    resolutionPath: 'افزودن پایشگر Kolmogorov-Smirnov و شاخص پایداری جمعیت (PSI) به صف دوره‌ای Celery.',
    status: 'VERIFIED',
  },
];

// Decision Intelligence Recommendations
export const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'REC-2024-01',
    title: 'پیش‌بینی کسری موجودی کالا (Stockout) در ۴ روز آینده: شمع تزیینی قلبی',
    category: 'inventory',
    urgency: 'critical',
    confidencePct: 94,
    evidenceSource: 'مدل پیش‌بینی تقاضای XGBoost v3.2 + داده موجودی انبار مرکزی',
    modelReference: 'xgboost-reg-v3',
    expectedImpact: 'جلوگیری از زیان احتمالی ۲۴ میلیون تومانی و رضایت ۹۸ درصدی خریداران سبد',
    suggestedAction: 'صدور خودکار پیش‌فاکتور خرید اضطراری ۴۰۰ عدد از تامین‌کننده آریا با تخفیف سفارش سریع',
    riskAssessment: 'ریسک انباشت پایین؛ نرخ چرخش کالا در ۹۰ روز اخیر ۲.۸ برابر میانگین رده بوده است.',
    status: 'pending',
    createdAt: '۱۴۰۳/۰۸/۲۵ ۱۱:۲۰',
  },
  {
    id: 'REC-2024-02',
    title: 'تشخیص ناهنجاری افت تقاضای فانتزی‌ها (کاهش غیرعادی ۳۲ درصدی در فروش)',
    category: 'demand',
    urgency: 'high',
    confidencePct: 88,
    evidenceSource: 'الگوریتم Isolation Forest + مقایسه با چرخه فصلی هفته قبل',
    modelReference: 'anomaly-detector-isoforest-v1',
    expectedImpact: 'بازیابی حجم فروش پیش‌بینی‌شده با پیشنهاد بسته مکمل (Bundle)',
    suggestedAction: 'فعال‌سازی کمپین تخفیف هدفمند ۱۰ درصدی برای خریداران وفادار رده اکسسوری',
    riskAssessment: 'کاهش مقطعی مارجین سود خالص به میزان ۱.۲ درصد در قبال حفظ سهم بازار',
    status: 'pending',
    createdAt: '۱۴۰۳/۰۸/۲۵ ۱۰:۰۵',
  },
  {
    id: 'REC-2024-03',
    title: 'مشتریان عمده در معرض خطر ریزش (At Risk) با احتمال بازگشت کمتر از ۴۰٪',
    category: 'churn',
    urgency: 'medium',
    confidencePct: 86,
    evidenceSource: 'مدل طبقه‌بندی خرید مجدد XGBoost Classifier + ماتریس RFM',
    modelReference: 'repeat-purchase-xgb-v2',
    expectedImpact: 'حفظ ۶ مشتری کلیدی با ارزش گردش مالی سالانه بیش از ۴۲۰ میلیون تومان',
    suggestedAction: 'تماس تیم فروش B2B همراه با بسته پیشنهاد اعتباری ۳۰ روزه اختصاصی',
    riskAssessment: 'هزینه نگهداری کمتر از یک‌چهارم هزینه جذب مشتریان شرکتی جدید برآورد شده است.',
    status: 'approved',
    createdAt: '۱۴۰۳/۰۸/۲۴ ۱۶:۳۰',
    approvedBy: 'دکتر خبیری',
  },
  {
    id: 'REC-2024-04',
    title: 'تعدیل قیمت پیشنهادی بر مبنای کشش قیمتی تقاضا (رده منسوجات)',
    category: 'pricing',
    urgency: 'low',
    confidencePct: 79,
    evidenceSource: 'رگرسیون کشش تقاضا (Price Elasticity Modeling)',
    modelReference: 'elasticity-estimator-v1',
    expectedImpact: 'افزایش ۶.۵ درصدی درآمد ناخالص با افزایش اندک ۳.۸ درصدی قیمت اقلام کم‌کشش',
    suggestedAction: 'به‌روزرسانی قیمت ۵ قلم کالای برند پریمیم در فروشگاه ووکامرس',
    riskAssessment: 'حساسیت متوسط خریداران خرد؛ پایش تاخیر سفارش‌ها در ۴۸ ساعت اول الزامی است.',
    status: 'pending',
    createdAt: '۱۴۰۳/۰۸/۲۴ ۰۹:۱۵',
  },
];

// Enterprise Integration Connectors
export const ENTERPRISE_CONNECTORS: IntegrationConnector[] = [
  {
    id: 'conn-woo-01',
    name: 'فروشگاه آنلاین اصلی (WooCommerce REST API)',
    category: 'ecommerce',
    provider: 'woocommerce',
    status: 'connected',
    lastSyncAt: '۲ دقیقه قبل',
    recordsSynced: 12480,
    endpointUrl: 'https://shop.example.ir/wp-json/wc/v3',
    authMethod: 'OAuth 2.0',
    healthScore: 99,
    syncIntervalMin: 15,
    rateLimitUsage: '42 / 100 req/min',
  },
  {
    id: 'conn-digi-02',
    name: 'پنل فروشندگان دیجی‌کالا (Open Marketplace API)',
    category: 'marketplace',
    provider: 'digikala',
    status: 'connected',
    lastSyncAt: '۱۰ دقیقه قبل',
    recordsSynced: 8420,
    endpointUrl: 'https://seller.digikala.com/api/v1',
    authMethod: 'API Key / Secret',
    healthScore: 96,
    syncIntervalMin: 30,
    rateLimitUsage: '65 / 120 req/min',
  },
  {
    id: 'conn-erp-03',
    name: 'نرم‌افزار مالی و انبار سپیدار (Sepidar ERP Connector)',
    category: 'erp',
    provider: 'sepidar_erp',
    status: 'connected',
    lastSyncAt: '۱ ساعت قبل',
    recordsSynced: 45200,
    endpointUrl: 'https://erp-gateway.internal.sys:8443/api',
    authMethod: 'HMAC Signature',
    healthScore: 100,
    syncIntervalMin: 60,
    rateLimitUsage: '12 / 50 req/min',
  },
  {
    id: 'conn-shopify-04',
    name: 'شعبه صادراتی بین‌المللی (Shopify Store Admin API)',
    category: 'ecommerce',
    provider: 'shopify',
    status: 'connected',
    lastSyncAt: '۱۵ دقیقه قبل',
    recordsSynced: 2140,
    endpointUrl: 'https://enterprise-export.myshopify.com/admin/api/2024-07',
    authMethod: 'OAuth 2.0',
    healthScore: 98,
    syncIntervalMin: 30,
    rateLimitUsage: '18 / 80 req/min',
  },
  {
    id: 'conn-webhook-05',
    name: 'درگاه دریافت وب‌هوک سفارشات آنی (Universal Webhook Hub)',
    category: 'webhook',
    provider: 'custom_webhook',
    status: 'connected',
    lastSyncAt: 'هم‌اکنون (Realtime)',
    recordsSynced: 68120,
    endpointUrl: 'https://api.enterprise-ai.internal/v1/webhooks/incoming',
    authMethod: 'HMAC Signature',
    healthScore: 100,
    syncIntervalMin: 0,
    rateLimitUsage: 'Real-time Event Stream',
  },
];

export const CONNECTOR_SYNC_LOGS: SyncLog[] = [
  {
    id: 'SYNC-9921',
    connectorId: 'conn-woo-01',
    connectorName: 'WooCommerce API',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۱:۲۸:۱۰',
    operation: 'PULL_ORDERS',
    recordsProcessed: 48,
    status: 'SUCCESS',
    durationMs: 420,
    message: '۴۸ سفارش جدید با شماره‌های سند #18420 تا #18468 دریافت و به پایگاه داده افزوده شد.',
  },
  {
    id: 'SYNC-9920',
    connectorId: 'conn-digi-02',
    connectorName: 'دیجی‌کالا Marketplace',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۱:۲۰:۰۲',
    operation: 'SYNC_INVENTORY',
    recordsProcessed: 142,
    status: 'SUCCESS',
    durationMs: 810,
    message: 'به‌روزرسانی موجودی انبار برای ۱۴۲ کد محصول در پنل فروشندگی با موفقیت اعمال گردید.',
  },
  {
    id: 'SYNC-9919',
    connectorId: 'conn-erp-03',
    connectorName: 'سپیدار ERP',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۰:۴۵:۰۰',
    operation: 'PUSH_FORECAST',
    recordsProcessed: 30,
    status: 'SUCCESS',
    durationMs: 1250,
    message: 'سند برآورد تقاضای ۳۰ روزه برای برنامه‌ریزی تامین مواد اولیه در ماژول انبار ثبت شد.',
  },
  {
    id: 'SYNC-9918',
    connectorId: 'conn-webhook-05',
    connectorName: 'Universal Webhook',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۰:۱۲:۴۵',
    operation: 'WEBHOOK_EVENT',
    recordsProcessed: 1,
    status: 'SUCCESS',
    durationMs: 38,
    message: 'رویداد پرداخت موفق فاکتور و اعتبارسنجی امضای HMAC با موفقیت تایید شد.',
  },
];

// Autonomous MLOps: Drift Detection & Canary State
export const DRIFT_METRICS: DriftMetric[] = [
  {
    featureName: 'lag_sales_7d',
    faLabel: 'فروش هفت روز گذشته (Lag 7)',
    driftType: 'data_drift',
    psiScore: 0.042, // < 0.1 means stable!
    ksPValue: 0.48, // > 0.05 means no distribution change
    status: 'stable',
    baselineMean: 18400000,
    currentMean: 18720000,
    threshold: 0.1,
  },
  {
    featureName: 'customer_recency_days',
    faLabel: 'فاصله تا آخرین خرید (Recency)',
    driftType: 'data_drift',
    psiScore: 0.078,
    ksPValue: 0.18,
    status: 'stable',
    baselineMean: 22.1,
    currentMean: 23.4,
    threshold: 0.1,
  },
  {
    featureName: 'rolling_mean_sales_14d',
    faLabel: 'میانگین متحرک فروش ۱۴ روزه',
    driftType: 'data_drift',
    psiScore: 0.142, // 0.1 to 0.2 is moderate warning
    ksPValue: 0.038, // < 0.05 indicates statistical shift
    status: 'warning',
    baselineMean: 18200000,
    currentMean: 21100000,
    threshold: 0.1,
  },
  {
    featureName: 'unit_price_average',
    faLabel: 'میانگین قیمت اقلام سبد',
    driftType: 'concept_drift',
    psiScore: 0.055,
    ksPValue: 0.32,
    status: 'stable',
    baselineMean: 245000,
    currentMean: 249000,
    threshold: 0.1,
  },
];

export const CURRENT_CANARY_STATE: CanaryDeployment = {
  modelId: 'xgboost-reg-v3-candidate',
  version: 'v3.3.0-rc1',
  trafficPercentage: 20, // 20% traffic routed to Canary
  challengerWape: 4.68, // slightly better than production
  championWape: 4.82,
  errorBudgetRemaining: 98.4,
  canaryHealth: 'HEALTHY',
};

// Event Automation & Outbox Stream
export const PLATFORM_EVENTS: PlatformEvent[] = [
  {
    id: 'EVT-1082',
    eventType: 'order.created',
    sourceModule: 'Data Integration / WooCommerce',
    payloadSummary: 'سفارش #18468 به مبلغ ۲,۴۵۰,۰۰۰ تومان ثبت شد',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۱:۲۸:۱۰',
    status: 'PROCESSED',
    retryCount: 0,
  },
  {
    id: 'EVT-1081',
    eventType: 'anomaly.detected',
    sourceModule: 'Decision Intelligence / Isolation Forest',
    payloadSummary: 'افت نابهنگام ۳۲ درصدی در فروش دسته کادویی ثبت شد',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۱۰:۰۵:۰۰',
    status: 'PROCESSED',
    retryCount: 0,
  },
  {
    id: 'EVT-1080',
    eventType: 'inventory.low',
    sourceModule: 'Inventory Forecasting / Stock Monitor',
    payloadSummary: 'موجودی کالای StockCode: 85123A کمتر از مصرف ۴ روز آتی است',
    timestamp: '۱۴۰۳/۰۸/۲۵ ۰۹:۴۰:۱۵',
    status: 'PROCESSED',
    retryCount: 0,
  },
  {
    id: 'EVT-1079',
    eventType: 'model.promoted',
    sourceModule: 'Autonomous MLOps / Canary Evaluation',
    payloadSummary: 'مدل XGBoost v3.2.0 در محیط تولید تایید و فعال شد',
    timestamp: '۱۴۰۳/۰۸/۲۴ ۱۸:۰۰:۰۰',
    status: 'PROCESSED',
    retryCount: 0,
  },
];

export const AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'RULE-01',
    name: 'تولید خودکار پیشنهاد شارژ انبار هنگام پیش‌بینی کسری موجودی',
    triggerEvent: 'inventory.low',
    condition: 'days_until_stockout <= 5 AND confidence_pct >= 85',
    action: 'Create Recommendation in Decision Center + Slack/SMS Alert',
    isEnabled: true,
    executionsCount: 42,
    lastFired: '۱۴۰۳/۰۸/۲۵ ۰۹:۴۰',
  },
  {
    id: 'RULE-02',
    name: 'ارسال هشدار به تیم فروش در صورت تشخیص ریسک ریزش مشتری طلایی',
    triggerEvent: 'customer.churn_risk_high',
    condition: 'segment == "Champions" AND repeat_prob < 0.40',
    action: 'Dispatch Task to CRM / Notify Account Manager',
    isEnabled: true,
    executionsCount: 18,
    lastFired: '۱۴۰۳/۰۸/۲۴ ۱۶:۳۰',
  },
  {
    id: 'RULE-03',
    name: 'راه‌اندازی آموزش خودکار مدل در صورت عبور شاخص رانش از آستانه',
    triggerEvent: 'drift.detected',
    condition: 'psi_score >= 0.20 OR ks_p_value < 0.01',
    action: 'Trigger Celery Background Retraining Pipeline + Optuna',
    isEnabled: true,
    executionsCount: 4,
    lastFired: '۱۴۰۳/۰۸/۲۰ ۱۲:۱۵',
  },
];

// Observability & System SLOs
export const SERVICE_SLOS: ServiceSLO[] = [
  {
    serviceName: 'FastAPI Backend Core',
    sloName: 'API P95 Latency < 50ms',
    targetObjective: 99.9,
    currentValue: 99.94,
    errorBudgetRemainingPct: 94.2,
    status: 'MET',
    p95LatencyMs: 24.2,
    p99LatencyMs: 41.5,
  },
  {
    serviceName: 'ML Inference Engine',
    sloName: 'Prediction Latency < 100ms',
    targetObjective: 99.5,
    currentValue: 99.82,
    errorBudgetRemainingPct: 88.0,
    status: 'MET',
    p95LatencyMs: 38.6,
    p99LatencyMs: 72.1,
  },
  {
    serviceName: 'PostgreSQL Database Pool',
    sloName: 'Query Latency < 20ms',
    targetObjective: 99.9,
    currentValue: 99.98,
    errorBudgetRemainingPct: 97.4,
    status: 'MET',
    p95LatencyMs: 6.4,
    p99LatencyMs: 14.8,
  },
  {
    serviceName: 'Celery Background Workers',
    sloName: 'Task Queue Delay < 2s',
    targetObjective: 99.0,
    currentValue: 99.45,
    errorBudgetRemainingPct: 76.5,
    status: 'MET',
    p95LatencyMs: 340.0,
    p99LatencyMs: 820.0,
  },
];

// Multi-Tenancy Organizations
export const TENANTS: Tenant[] = [
  {
    id: 'tenant-hq-01',
    name: 'سازمان مرکزی و انبار کل (تهران)',
    subdomain: 'hq.enterprise-ai.internal',
    plan: 'enterprise',
    region: 'ir-tehran-zone1',
    activeUsers: 34,
    ordersVolume: 284500,
    status: 'active',
    dbSchema: 'tenant_hq',
  },
  {
    id: 'tenant-msh-02',
    name: 'شعبه و انبار منطقه‌ای شمال‌شرق (مشهد)',
    subdomain: 'mashhad.enterprise-ai.internal',
    plan: 'growth',
    region: 'ir-mashhad-zone1',
    activeUsers: 14,
    ordersVolume: 74200,
    status: 'active',
    dbSchema: 'tenant_msh',
  },
  {
    id: 'tenant-isf-03',
    name: 'مرکز توزیع و لجستیک اصفهان',
    subdomain: 'isfahan.enterprise-ai.internal',
    plan: 'growth',
    region: 'ir-isfahan-zone1',
    activeUsers: 12,
    ordersVolume: 61800,
    status: 'active',
    dbSchema: 'tenant_isf',
  },
  {
    id: 'tenant-online-04',
    name: 'پلتفرم تجارت الکترونیک فروشگاه آنلاین',
    subdomain: 'online.enterprise-ai.internal',
    plan: 'enterprise',
    region: 'ir-tehran-cloud',
    activeUsers: 28,
    ordersVolume: 184900,
    status: 'active',
    dbSchema: 'tenant_online',
  },
];

// =========================================================================
// UNIVERSAL INTEGRATION & DATA INTELLIGENCE SEED DATA
// =========================================================================

export const INTEGRATION_CATALOG_PROVIDERS: IntegrationProviderInfo[] = [
  // Level 1: Standard generic connectors
  {
    id: 'prov-postgres',
    name: 'پایگاه داده PostgreSQL',
    category: 'database',
    level: 'level_1',
    description: 'اتصال فقط‌خواندنی به تمام نسخه‌های PostgreSQL با کشف خودکار جداول، ستون‌ها و استخراج جریانی.',
    authTypes: ['Password', 'SSL/TLS Client Cert', 'Kerberos'],
    supportedEntities: ['Orders', 'Customers', 'Inventory', 'Custom SQL View'],
    isAvailable: true,
    version: 'v2.4.0',
  },
  {
    id: 'prov-mysql',
    name: 'پایگاه داده MySQL / MariaDB',
    category: 'database',
    level: 'level_1',
    description: 'اتصال به دیتابیس‌های رابطه‌ای مای‌اس‌کیوال با صفحه‌بندی مبتنی بر نشانگر (Cursor) و کشف طرحواره.',
    authTypes: ['User & Password', 'SSL CA Cert'],
    supportedEntities: ['Tables', 'Views', 'Replication Log'],
    isAvailable: true,
    version: 'v2.1.0',
  },
  {
    id: 'prov-rest-openapi',
    name: 'سرویس وب RESTful / OpenAPI',
    category: 'rest_api',
    level: 'level_1',
    description: 'تحلیل خودکار مشخصات Swagger / OpenAPI v3، کشف متدهای GET/POST و استخراج داده با محافظت SSRF.',
    authTypes: ['Bearer Token', 'API Key / Header', 'OAuth 2.0 Client Credentials'],
    supportedEntities: ['Dynamic JSON Resources', 'Paginated Endpoints'],
    isAvailable: true,
    version: 'v3.0.0',
  },
  {
    id: 'prov-csv-excel',
    name: 'فایل‌های اکسل و CSV محلی / SFTP',
    category: 'file',
    level: 'level_1',
    description: 'ورود دسته‌ای فایل‌های فاکتور و گردش حساب با تشخیص خودکار نوع داده‌ها و انکودینگ UTF-8/Windows-1256.',
    authTypes: ['Local Upload', 'SFTP Key / Secret'],
    supportedEntities: ['Tabular Sales Data', 'Inventory Balances'],
    isAvailable: true,
    version: 'v2.0.0',
  },

  // Level 2: Dedicated commerce, ERP and NoSQL adapters
  {
    id: 'prov-woocommerce',
    name: 'فروشگاه‌ساز WooCommerce',
    category: 'ecommerce',
    level: 'level_2',
    description: 'آداپتور رسمی بر بستر WooCommerce REST API v3 با تطبیق خودکار فاکتورها، مشتریان و تغییرات موجودی.',
    authTypes: ['Consumer Key & Secret', 'OAuth 2.0'],
    supportedEntities: ['Orders', 'Products', 'Customers', 'Coupons', 'Refunds'],
    isAvailable: true,
    version: 'v3.2.0',
  },
  {
    id: 'prov-shopify',
    name: 'پلتفرم تجارت الکترونیک Shopify',
    category: 'ecommerce',
    level: 'level_2',
    description: 'همگام‌سازی سفارشات از طریق Shopify Admin GraphQL API همراه با کنترل سهمیه درخواست و وب‌هوک.',
    authTypes: ['Admin Access Token', 'Custom App API Key'],
    supportedEntities: ['Orders', 'Line Items', 'Draft Orders', 'Inventory Levels'],
    isAvailable: true,
    version: 'v2.8.0',
  },
  {
    id: 'prov-digikala',
    name: 'پنل فروشندگان دیجی‌کالا (Seller Open API)',
    category: 'ecommerce',
    level: 'level_2',
    description: 'اتصال به درگاه باز دیجی‌کالا جهت ثبت سفارش‌های محقق‌شده، کدهای تنوع کالا (DKP) و مانده انبار متمرکز.',
    authTypes: ['Seller API Key', 'OAuth 2.0 Token'],
    supportedEntities: ['DKP Variant Orders', 'Inventory Consignments', 'Pricing Rules'],
    isAvailable: true,
    version: 'v2.2.0',
  },
  {
    id: 'prov-sepidar-erp',
    name: 'نرم‌افزار مالی و انبار سپیدار سیستم',
    category: 'erp_crm',
    level: 'level_2',
    description: 'درگاه واسط اتصال به پایگاه داده و وب‌سرویس سپیدار برای همگام‌سازی فاکتورهای فروش و پیش‌بینی تامین انبار.',
    authTypes: ['HMAC Signature', 'Database Dedicated User'],
    supportedEntities: ['سند فروش و فاکتور', 'موجودی کاردکس کالا', 'اشخاص و مشتریان'],
    isAvailable: true,
    version: 'v1.9.0',
  },
  {
    id: 'prov-mongodb',
    name: 'پایگاه داده سندگرا MongoDB',
    category: 'database',
    level: 'level_2',
    description: 'استخراج داده‌های ساختارنیافته و اسناد پیچیده JSON با پشتیبانی از خطوط تجمیعی (Aggregation Pipelines).',
    authTypes: ['SCRAM-SHA-256', 'MongoDB Atlas TLS'],
    supportedEntities: ['Collections', 'Timeseries Buckets'],
    isAvailable: true,
    version: 'v2.0.0',
  },
  {
    id: 'prov-clickhouse',
    name: 'دیتابیس تحلیلی ClickHouse',
    category: 'database',
    level: 'level_2',
    description: 'اتصال به پایگاه داده ستونی کلیک‌هاوس برای واکشی کوئری‌های تحلیلی کلان با سرعت بالا.',
    authTypes: ['Native HTTP API', 'JWT'],
    supportedEntities: ['Columnar Aggregations', 'Event Logs'],
    isAvailable: true,
    version: 'v1.5.0',
  },

  // Level 3: Legacy / Custom / Enterprise
  {
    id: 'prov-custom-pos',
    name: 'صندوق‌های فروشگاهی اختصاصی (Custom POS / Legacy)',
    category: 'erp_crm',
    level: 'level_3',
    description: 'اتصال به سیستم‌های فروشگاهی حضوری، سامانه‌های کارتخوان متصل و پایگاه‌های فاقد وب‌سرویس عمومی.',
    authTypes: ['Staging File Watcher', 'Encrypted Agent Socket'],
    supportedEntities: ['تراکنش‌های حضوری صندوق', 'اسناد بستن شیفت'],
    isAvailable: true,
    version: 'v1.0.0',
  },
  {
    id: 'prov-snappshop',
    name: 'اسنپ‌شاپ (Snapp Shop Seller API)',
    category: 'ecommerce',
    level: 'level_3',
    description: 'همگام‌سازی سفارش‌های آنلاین سوپرمارکت و فروشندگان اسنپ‌شاپ بر اساس توافق‌نامه فنی و دسترسی رسمی.',
    authTypes: ['Merchant API Key', 'Bearer Auth'],
    supportedEntities: ['سفارشات فوری', 'موجودی در لحظه'],
    isAvailable: true,
    version: 'v1.1.0',
  },
];

// Canonical Entity Fields for Visual Mapping & Normalization
export const CANONICAL_FIELDS: CanonicalFieldDefinition[] = [
  { name: 'external_id', entity: 'order', type: 'string', description: 'شناسه منحصر‌به‌فرد سفارش در سیستم مبدا', required: true, faTitle: 'شناسه سند مبدا' },
  { name: 'placed_at', entity: 'order', type: 'datetime', description: 'زمان ثبت سفارش استاندارد شده در منطقه زمانی UTC', required: true, faTitle: 'تاریخ و زمان ثبت' },
  { name: 'total_amount', entity: 'order', type: 'number', description: 'مبلغ ناخالص کل فاکتور به واحد پول پایه', required: true, faTitle: 'مبلغ کل سفارش' },
  { name: 'discount_amount', entity: 'order', type: 'number', description: 'مجموع مبالغ تخفیف داده شده بر روی فاکتور', required: false, faTitle: 'مبلغ تخفیف' },
  { name: 'customer_id', entity: 'order', type: 'string', description: 'شناسه یکتای مشتری ثبت‌کننده فاکتور', required: true, faTitle: 'شناسه مشتری' },
  { name: 'currency', entity: 'order', type: 'string', description: 'واحد پول فاکتور (IRR, IRT, USD, EUR)', required: true, faTitle: 'واحد پولی' },
  { name: 'status', entity: 'order', type: 'string', description: 'وضعیت سفارش (completed, cancelled, processing)', required: true, faTitle: 'وضعیت سند' },
  { name: 'sku', entity: 'product', type: 'string', description: 'کد شناسایی انبار کالا (Stock Keeping Unit)', required: true, faTitle: 'کد کالا (SKU)' },
  { name: 'product_name', entity: 'product', type: 'string', description: 'نام رسمی و عنوان کالای درج‌شده در کاتالوگ', required: true, faTitle: 'عنوان محصول' },
  { name: 'unit_price', entity: 'product', type: 'number', description: 'قیمت پایه واحد محصول در لحظه ثبت سفارش', required: true, faTitle: 'قیمت واحد' },
  { name: 'quantity', entity: 'inventory', type: 'number', description: 'تعداد یا حجم فیزیکی اقلام خریداری شده', required: true, faTitle: 'تعداد اقلام' },
  { name: 'customer_email', entity: 'customer', type: 'string', description: 'پست الکترونیکی مشتری جهت تحلیل رفتار', required: false, faTitle: 'ایمیل مشتری' },
  { name: 'customer_phone', entity: 'customer', type: 'string', description: 'شماره تماس جهت خوشه‌بندی و پیشگیری از ریزش', required: false, faTitle: 'شماره تلفن' },
];

// Pre-computed AI Smart Mappings for a connected source (e.g. WooCommerce/PostgreSQL)
export const INITIAL_AI_MAPPING_RULES: FieldMappingRule[] = [
  {
    id: 'map-01',
    sourceField: 'order_number',
    canonicalField: 'order.external_id',
    transformation: 'direct',
    confidencePct: 98,
    isConfirmed: true,
    sampleSourceValue: 'WC-18468',
    sampleOutputValue: 'WC-18468',
    evidence: 'انطباق رشته‌ای با الگوی شماره سند تجاری و یکتایی ۱۰۰٪ در سوابق.',
  },
  {
    id: 'map-02',
    sourceField: 'date_created_gmt',
    canonicalField: 'order.placed_at',
    transformation: 'date_utc',
    confidencePct: 95,
    isConfirmed: true,
    sampleSourceValue: '2024-11-15T08:24:10',
    sampleOutputValue: '2024-11-15T08:24:10Z',
    evidence: 'فرمت ISO8601 با تشخیص پسوند زمانی گرینویچ (GMT/UTC).',
  },
  {
    id: 'map-03',
    sourceField: 'total_price_toman',
    canonicalField: 'order.total_amount',
    transformation: 'to_number',
    confidencePct: 94,
    isConfirmed: true,
    sampleSourceValue: '2450000',
    sampleOutputValue: '2450000',
    evidence: 'مقدار عددی مثبت متناظر با جمع کل مبالغ اقلام سبد خرید.',
  },
  {
    id: 'map-04',
    sourceField: 'billing.email',
    canonicalField: 'customer.customer_email',
    transformation: 'direct',
    confidencePct: 99,
    isConfirmed: true,
    sampleSourceValue: 'aria.buyer@gmail.com',
    sampleOutputValue: 'aria.buyer@gmail.com',
    evidence: 'فرمت استاندارد آدرس ایمیل با تطبیق نحوی RFC 5322.',
  },
  {
    id: 'map-05',
    sourceField: 'line_items[0].sku',
    canonicalField: 'product.sku',
    transformation: 'json_path',
    confidencePct: 91,
    isConfirmed: true,
    sampleSourceValue: '85123A',
    sampleOutputValue: '85123A',
    evidence: 'استخراج فیلد کاتالوگ از آرایه تودرتوی خطوط فاکتور.',
  },
  {
    id: 'map-06',
    sourceField: 'line_items[0].quantity',
    canonicalField: 'inventory.quantity',
    transformation: 'to_number',
    confidencePct: 96,
    isConfirmed: true,
    sampleSourceValue: '6',
    sampleOutputValue: '6',
    evidence: 'مقدار صحیح مثبت نشان‌دهنده تیراژ کالای تحویلی.',
  },
];

// Sample Database Tables for Database Explorer
export const SAMPLE_DATABASE_TABLES: DatabaseTableSchema[] = [
  {
    tableName: 'public.ecommerce_orders',
    columnsCount: 14,
    estimatedRows: 541909,
    primaryKey: 'order_id',
    columns: [
      { name: 'order_id', type: 'uuid', nullable: false, isPk: true },
      { name: 'invoice_no', type: 'varchar(64)', nullable: false },
      { name: 'customer_id', type: 'varchar(32)', nullable: true, isFk: true },
      { name: 'total_amount', type: 'numeric(14,2)', nullable: false },
      { name: 'currency', type: 'varchar(10)', nullable: false },
      { name: 'order_status', type: 'varchar(32)', nullable: false },
      { name: 'created_at', type: 'timestamp with time zone', nullable: false },
    ],
  },
  {
    tableName: 'public.customers_master',
    columnsCount: 8,
    estimatedRows: 4372,
    primaryKey: 'customer_id',
    columns: [
      { name: 'customer_id', type: 'varchar(32)', nullable: false, isPk: true },
      { name: 'company_name', type: 'varchar(150)', nullable: false },
      { name: 'email', type: 'varchar(255)', nullable: true },
      { name: 'phone', type: 'varchar(50)', nullable: true },
      { name: 'country', type: 'varchar(50)', nullable: false },
      { name: 'last_order_date', type: 'timestamp', nullable: true },
    ],
  },
  {
    tableName: 'public.warehouse_inventory_stock',
    columnsCount: 7,
    estimatedRows: 3684,
    primaryKey: 'sku',
    columns: [
      { name: 'sku', type: 'varchar(50)', nullable: false, isPk: true },
      { name: 'product_title', type: 'text', nullable: false },
      { name: 'quantity_on_hand', type: 'integer', nullable: false },
      { name: 'reorder_point', type: 'integer', nullable: false },
      { name: 'unit_cost', type: 'numeric(12,2)', nullable: false },
    ],
  },
];

// AI OpenAPI Analysis Sample Result
export const SAMPLE_OPENAPI_ANALYSIS: OpenApiAnalysisResult = {
  specTitle: 'E-Commerce Universal Seller API (OpenAPI v3.0.3)',
  apiVersion: 'v3.2.0-rc',
  detectedEndpoints: [
    { method: 'GET', path: '/api/v1/orders', entityDetected: 'Order Entity', paginationType: 'Page & Per_Page Cursor', confidence: 98 },
    { method: 'GET', path: '/api/v1/customers', entityDetected: 'Customer Entity', paginationType: 'Offset Limit', confidence: 95 },
    { method: 'GET', path: '/api/v1/products', entityDetected: 'Product Catalog', paginationType: 'Seek ID Cursor', confidence: 97 },
    { method: 'GET', path: '/api/v1/inventory/stock', entityDetected: 'Inventory Balance', paginationType: 'Full Snapshot', confidence: 92 },
    { method: 'POST', path: '/api/v1/webhooks', entityDetected: 'Webhook Subscription', paginationType: 'Event Push', confidence: 99 },
  ],
  generatedManifestYaml: `name: generic_ecommerce_rest_connector
version: 1.0.0
schema_version: 2026-enterprise
base_url: "https://api.merchant.com/v1"
auth:
  type: oauth2_client_credentials
  token_url: "https://api.merchant.com/oauth/token"
endpoints:
  orders:
    path: "/orders"
    method: GET
    cursor_param: "since_id"
    primary_key: "id"
    date_field: "created_at"
  inventory:
    path: "/inventory/stock"
    method: GET
    sku_field: "sku"
    balance_field: "available_quantity"
resilience:
  rate_limit_per_minute: 120
  timeout_seconds: 15
  retry_count: 3
  exponential_backoff: true
`,
};

// Universal Cross-System Data Quality Metrics
export const UNIVERSAL_QUALITY_METRICS: UniversalDataQualityMetric[] = [
  {
    sourceSystem: 'WooCommerce Store (فروشگاه آنلاین اصلی)',
    category: 'E-Commerce',
    totalRecords: 12480,
    cleanRecords: 12410,
    quarantinedCount: 70,
    duplicatesResolved: 24,
    currencyNormalized: 12480,
    healthScore: 99.4,
    lastEvaluated: '۱۰ دقیقه قبل',
  },
  {
    sourceSystem: 'PostgreSQL Orders DB (دیتابیس تراکنش‌ها)',
    category: 'Relational DB',
    totalRecords: 541909,
    cleanRecords: 397924,
    quarantinedCount: 9288,
    duplicatesResolved: 1420,
    currencyNormalized: 541909,
    healthScore: 97.2,
    lastEvaluated: '۱ ساعت قبل',
  },
  {
    sourceSystem: 'دیجی‌کالا Marketplace Seller API',
    category: 'Marketplace',
    totalRecords: 8420,
    cleanRecords: 8350,
    quarantinedCount: 70,
    duplicatesResolved: 12,
    currencyNormalized: 8420,
    healthScore: 99.1,
    lastEvaluated: '۱۵ دقیقه قبل',
  },
  {
    sourceSystem: 'سپیدار سیستم (ERP / انبار مرکزی)',
    category: 'ERP',
    totalRecords: 45200,
    cleanRecords: 44980,
    quarantinedCount: 220,
    duplicatesResolved: 0,
    currencyNormalized: 45200,
    healthScore: 99.5,
    lastEvaluated: '۲ ساعت قبل',
  },
];

// =========================================================================
// ENTERPRISE AI SAAS 2.0 SEED DATA
// =========================================================================

import {
  SubscriptionPlan,
  TenantSubscriptionState,
  UsageQuotaMeter,
  InvoiceRecord,
  SanitizedIncident,
  DeepSeekDiagnosticReport,
  DeepLearningTrainingRun,
  ModelRecommendationVerdict,
  QuarantinedDataRecord,
  TestSuiteRegistryItem,
  QualityGateMetrics,
  CommercialSaaSKpis,
} from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    nameFa: 'پلن استارتر (فروشگاه نوپا)',
    pricePerMonthToman: 950000,
    pricePerYearToman: 9500000,
    description: 'مناسب فروشگاه‌های نوپا و خرده‌فروشی‌های محلی با یک درگاه فروش و نیاز به پیش‌بینی پایه تقاضا',
    maxConnectors: 1,
    maxSyncedRecordsPerMonth: 50000,
    maxApiRequestsPerMonth: 25000,
    maxTrainingJobsPerMonth: 10,
    maxAiTokensPerMonth: 100000,
    storageGb: 10,
    supportSla: 'پشتیبانی تیکتی (پاسخ حداکثر ۴۸ ساعت)',
    features: [
      'یک کانکتور فعال (ووکامرس یا فایل CSV)',
      'پیش‌بینی فروش با الگوریتم‌های کلاسیک (Linear / Naive)',
      'تحلیل اولیه خوشه‌بندی مشتریان',
      'خروجی گزارش‌های PDF و اکسل پایه',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Tier',
    nameFa: 'پلن حرفه‌ای (کسب‌وکار در حال رشد)',
    pricePerMonthToman: 2450000,
    pricePerYearToman: 24500000,
    description: 'برای برندها و خرده‌فروشان اینترنتی که نیازمند پیش‌بینی روزانه با XGBoost، ردیابی MLflow و اتصال چندگانه هستند',
    maxConnectors: 3,
    maxSyncedRecordsPerMonth: 250000,
    maxApiRequestsPerMonth: 100000,
    maxTrainingJobsPerMonth: 30,
    maxAiTokensPerMonth: 500000,
    storageGb: 50,
    supportSla: 'پشتیبانی اولویت‌دار (پاسخ حداکثر ۱۲ ساعت)',
    isPopular: true,
    features: [
      '۳ کانکتور فعال (WooCommerce, Digikala, PostgreSQL)',
      'پیش‌بینی پیشرفته با XGBoost و تیونینگ خودکار Optuna',
      'تحلیل احتمال خرید مجدد مشتریان (Repeat Purchase)',
      'توضیح‌پذیری مدل‌ها با مقادیر SHAP',
      'دستیار هوشمند سازمانی AI Copilot',
    ],
  },
  {
    id: 'business',
    name: 'Business Tier',
    nameFa: 'پلن تجاری (Omnichannel Enterprise)',
    pricePerMonthToman: 5900000,
    pricePerYearToman: 59000000,
    description: 'برای شرکت‌های زنجیره‌ای با شعب حضوری و آنلاین، شبکه‌های توزیع، صفوف اتوماسیون رویدادمحور و مدل‌های Deep Learning',
    maxConnectors: 10,
    maxSyncedRecordsPerMonth: 1500000,
    maxApiRequestsPerMonth: 500000,
    maxTrainingJobsPerMonth: 100,
    maxAiTokensPerMonth: 2000000,
    storageGb: 200,
    supportSla: 'پشتیبانی اختصاصی (پاسخ حداکثر ۴ ساعت) + مدیر حساب',
    features: [
      '۱۰ کانکتور فعال همزمان + اتصال سیستم‌های مالی و ERP',
      'مدل‌های یادگیری عمیق سری زمانی (LSTM, GRU, N-BEATS)',
      'اتوماسیون رویدادمحور Outbox و وب‌هوک‌های بلادرنگ',
      'مرکز عیب‌یابی هوشمند DeepSeek با پیشنهاد خودکار پچ',
      'پایش خودکار رانش داده‌ها (Data Drift Monitoring)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Tier',
    nameFa: 'پلن سازمانی و ابری اختصاصی',
    pricePerMonthToman: 14500000,
    pricePerYearToman: 145000000,
    description: 'برای سازمان‌های بزرگ، نیازمند توافق‌نامه سطح خدمت ۹۹.۹٪ (SLA)، تفکیک سخت‌افزاری، استقرار Hybrid/On-Premise و SSO سازمانی',
    maxConnectors: 50,
    maxSyncedRecordsPerMonth: 10000000,
    maxApiRequestsPerMonth: 3000000,
    maxTrainingJobsPerMonth: 500,
    maxAiTokensPerMonth: 10000000,
    storageGb: 1000,
    supportSla: 'SLA سازمانی ۹۹.۹٪ + پشتیبانی ۲۴/۷ تلفنی و مهندس مقیم',
    features: [
      'کانکتورهای نامحدود و سفارشی با SDK Generator',
      'استقرار روی سرورهای اختصاصی یا کلاستر Kubernetes مشتری',
      'ورود یکپارچه سازمانی (SAML / OIDC / LDAP SSO)',
      'قرارداد محرمانگی داده‌ها و مدل‌های ایزوله سازمانی',
      'دسترسی کامل به کدها و خط لوله‌های آموزش روی GPU',
    ],
  },
];

export const CURRENT_TENANT_SUBSCRIPTION: TenantSubscriptionState = {
  tenantId: 'tenant-hq-01',
  planId: 'professional',
  status: 'active',
  currentPeriodStart: '۱۴۰۳/۰۸/۰۱',
  currentPeriodEnd: '۱۴۰۳/۰۹/۰۱',
  cancelAtPeriodEnd: false,
  paymentMethod: 'کیف‌پول اعتباری زرین‌پال (شارژ خودکار)',
  billingEmail: 'billing@company.ir',
  autoRenew: true,
};

export const CURRENT_USAGE_QUOTAS: UsageQuotaMeter[] = [
  {
    metricName: 'active_connectors',
    metricLabelFa: 'کانکتورهای فعال همزمان',
    currentUsage: 2,
    quotaLimit: 3,
    unit: 'درگاه',
    percentageUsed: 66.7,
    isOverQuota: false,
  },
  {
    metricName: 'synced_records_monthly',
    metricLabelFa: 'رکوردهای همگام‌شده در این دوره',
    currentUsage: 184200,
    quotaLimit: 250000,
    unit: 'رکورد',
    percentageUsed: 73.68,
    isOverQuota: false,
  },
  {
    metricName: 'api_requests',
    metricLabelFa: 'درخواست‌های وب‌سرویس و استنتاج API',
    currentUsage: 48900,
    quotaLimit: 100000,
    unit: 'فراخوانی',
    percentageUsed: 48.9,
    isOverQuota: false,
  },
  {
    metricName: 'training_jobs',
    metricLabelFa: 'وظایف آموزش و بهینه‌سازی مدل (Celery)',
    currentUsage: 14,
    quotaLimit: 30,
    unit: 'اجرا',
    percentageUsed: 46.6,
    isOverQuota: false,
  },
  {
    metricName: 'ai_tokens',
    metricLabelFa: 'توکن‌های مصرفی هوش مصنوعی (DeepSeek / Copilot)',
    currentUsage: 284500,
    quotaLimit: 500000,
    unit: 'توکن',
    percentageUsed: 56.9,
    isOverQuota: false,
  },
  {
    metricName: 'storage_usage',
    metricLabelFa: 'فضای ذخیره‌سازی ابری دیتاست‌ها و مدل‌ها',
    currentUsage: 18.4,
    quotaLimit: 50,
    unit: 'گیگابایت',
    percentageUsed: 36.8,
    isOverQuota: false,
  },
];

export const SAMPLE_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2024-11-001',
    invoiceNumber: 'صورتحساب دوره آبان ۱۴۰۳',
    tenantId: 'tenant-hq-01',
    tenantName: 'فروشگاه اینترنتی افق داده‌گستر',
    amountToman: 2450000,
    status: 'paid',
    periodStart: '۱۴۰۳/۰۸/۰۱',
    periodEnd: '۱۴۰۳/۰۹/۰۱',
    issuedAt: '۱۴۰۳/۰۸/۰۱ ۰۰:۰۰',
    paidAt: '۱۴۰۳/۰۸/۰۱ ۰۹:۱۵',
    paymentGateway: 'zarinpal',
    receiptUrl: '/receipts/inv-2024-11.pdf',
  },
  {
    id: 'INV-2024-10-001',
    invoiceNumber: 'صورتحساب دوره مهر ۱۴۰۳',
    tenantId: 'tenant-hq-01',
    tenantName: 'فروشگاه اینترنتی افق داده‌گستر',
    amountToman: 2450000,
    status: 'paid',
    periodStart: '۱۴۰۳/۰۷/۰۱',
    periodEnd: '۱۴۰۳/۰۸/۰۱',
    issuedAt: '۱۴۰۳/۰۷/۰۱ ۰۰:۰۰',
    paidAt: '۱۴۰۳/۰۷/۰۱ ۱۰:۳۰',
    paymentGateway: 'zarinpal',
    receiptUrl: '/receipts/inv-2024-10.pdf',
  },
  {
    id: 'INV-2024-09-001',
    invoiceNumber: 'صورتحساب دوره شهریور ۱۴۰۳ (استارتر)',
    tenantId: 'tenant-hq-01',
    tenantName: 'فروشگاه اینترنتی افق داده‌گستر',
    amountToman: 950000,
    status: 'paid',
    periodStart: '۱۴۰۳/۰۶/۰۱',
    periodEnd: '۱۴۰۳/۰۷/۰۱',
    issuedAt: '۱۴۰۳/۰۶/۰۱ ۰۰:۰۰',
    paidAt: '۱۴۰۳/۰۶/۰۱ ۱۴:۲۰',
    paymentGateway: 'mock_gateway',
    receiptUrl: '/receipts/inv-2024-09.pdf',
  },
];

// DeepSeek Diagnostics Seed Incidents
export const SANITIZED_INCIDENTS: SanitizedIncident[] = [
  {
    id: 'INC-8492',
    traceId: 'trc-99a4c10e-8f2a',
    title: 'خطای سرریز زمان (HTTP 504 Gateway Timeout) در خط‌لوله پیش‌بینی افق ۶۰ روزه',
    errorType: 'TimeoutError / WorkerExecutionTimeout',
    source: 'fastapi_backend',
    severity: 'HIGH',
    timestamp: '۱۰ دقیقه قبل',
    sanitizedStackTrace: `File "/app/api/v1/forecast.py", line 84, in predict_sales_horizon
    res = await run_in_threadpool(model.predict_future_window, horizon_days=60)
  File "/app/services/forecast_engine.py", line 142, in predict_future_window
    lagged_features = compute_rolling_lags(historical_df, [7, 14, 28, 60])
  File "/app/utils/feature_engineering.py", line 56, in compute_rolling_lags
    df['rolling_mean_60'] = df['quantity'].rolling(window=60).mean()
TimeoutError: Task async worker timed out after 30.00 seconds while calculating multi-step recursive lags.`,
    redactedSensitiveFields: ['authorization_bearer', 'customer_secret_token', 'db_password'],
    correlationCount: 4,
    affectedTenant: 'tenant-hq-01',
    environment: 'production',
    status: 'PATCH_PROPOSED',
  },
  {
    id: 'INC-8488',
    traceId: 'trc-77b319aa-44e1',
    title: 'تداخل قفل ردیف و نقض کلید یکتا (UniqueViolation) در همگام‌ساز سفارش‌های دیجی‌کالا',
    errorType: 'IntegrityError / UniqueViolationKey',
    source: 'postgres',
    severity: 'MEDIUM',
    timestamp: '۴۵ دقیقه قبل',
    sanitizedStackTrace: `sqlalchemy.exc.IntegrityError: (psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "uq_orders_tenant_invoiceno"
DETAIL: Key (tenant_id, invoice_no)=(tenant-hq-01, DK-984210) already exists.
[SQL: INSERT INTO canonical_orders (invoice_no, tenant_id, total_amount, created_at) VALUES (%s, %s, %s, %s)]
[parameters: ('DK-984210', 'tenant-hq-01', 1420000.0, '2024-11-15T09:20:00Z')]`,
    redactedSensitiveFields: ['api_key', 'db_conn_string'],
    correlationCount: 12,
    affectedTenant: 'tenant-hq-01',
    environment: 'production',
    status: 'OPEN',
  },
  {
    id: 'INC-8475',
    traceId: 'trc-12f800bc-9912',
    title: 'افت کارایی و خطای همگام‌سازی سوکت Redis در کارگر پس‌زمینه Celery',
    errorType: 'ConnectionResetError / RedisBrokerDrop',
    source: 'redis_celery',
    severity: 'LOW',
    timestamp: '۲ ساعت قبل',
    sanitizedStackTrace: `celery.exceptions.OperationalError: Cannot connect to redis://redis-sentinel:6379/0: Connection reset by peer.
  File "/usr/local/lib/python3.11/site-packages/kombu/transport/redis.py", line 1120, in get
    return self._pop()`,
    redactedSensitiveFields: ['redis_password'],
    correlationCount: 2,
    affectedTenant: 'system-wide',
    environment: 'production',
    status: 'RESOLVED',
  },
];

export const SAMPLE_DEEPSEEK_DIAGNOSTICS: Record<string, DeepSeekDiagnosticReport> = {
  'INC-8492': {
    incidentId: 'INC-8492',
    modelUsed: 'DeepSeek-Coder-V2-Enterprise (0128-Context)',
    analyzedAt: '۱۴۰۳/۰۸/۲۴ ۱۲:۳۰:۴۵',
    rootCauseSummary: 'محاسبه همزمان لاگ‌های غلتان ۶۰ روزه به صورت تک‌رشته‌ای در ترد ورکر و عدم کش نتایج میانی برای تاریخ‌های ثابت باعث انباشت حافظه و فراتر رفتن از حد زمان ۳۰ ثانیه شده است.',
    probableCauses: [
      {
        cause: 'فقدان کش محاسبات لاگ سری زمانی برای پنجره‌های مشترک تاریخ',
        probabilityPct: 82,
        technicalDetail: 'تابع compute_rolling_lags در هر فراخوانی تمام تاریخچه را از ابتدا محاسبه می‌کند، در حالی که داده‌های گذشته ثابت هستند.',
      },
      {
        cause: 'سرریز حافظه در عملیات بازگشتی چندگامی (Recursive Lag Calculation)',
        probabilityPct: 15,
        technicalDetail: 'افق ۶۰ روزه نیازمند ۶۰ گام استنتاج بازگشتی است که به علت ایجاد کپی‌های مکرر از DataFrame بار پردازشی بالایی دارد.',
      },
      {
        cause: 'تنظیم کمبود سقف زمان timeout_seconds در Uvicorn/FastAPI',
        probabilityPct: 3,
        technicalDetail: 'سقف ۳۰ ثانیه برای افق‌های بالای ۳۰ روز نیاز به افزایش یا واگذاری به صف نامتقارن دارد.',
      },
    ],
    impactAnalysis: 'کاربران در زمان درخواست پیش‌بینی بیش از ۳۰ روز با خطای لودینگ بی‌پایان یا ۵۰۴ مواجه می‌شوند. دیتابیس دچار قفل نشده و داده‌ای مخدوش نشده است.',
    suggestedPatch: {
      fileTarget: 'backend/app/services/forecast_engine.py',
      explanation: 'جایگزینی محاسبات تکراری با بردارسازی NumPy و اعمال کش Redis روی پیش‌بینی‌های ۶۰ روزه، به همراه واگذاری افق‌های بیش از ۳۰ روز به صف Celery با الگوی Polling.',
      riskScore: 2,
      unifiedDiff: `--- a/backend/app/services/forecast_engine.py
+++ b/backend/app/services/forecast_engine.py
@@ -139,7 +139,12 @@ class ForecastEngine:
     def predict_future_window(self, historical_df: pd.DataFrame, horizon_days: int) -> np.ndarray:
-        lagged_features = compute_rolling_lags(historical_df, [7, 14, 28, 60])
-        preds = self.model.predict(lagged_features)
+        cache_key = f"fc_feat:{hash(historical_df.tail(60).values.tobytes())}:{horizon_days}"
+        cached_feats = redis_client.get(cache_key)
+        if cached_feats is not None:
+            return pickle.loads(cached_feats)
+        # Vectorized lag extraction without DataFrame duplication
+        lagged_array = extract_vectorized_lags(historical_df['quantity'].values, horizon_days)
+        preds = self.model.predict(lagged_array)
+        redis_client.setex(cache_key, 3600, pickle.dumps(preds))
         return preds`,
    },
    regressionTestCase: {
      language: 'python',
      framework: 'pytest',
      testName: 'test_predict_future_window_latency_and_caching',
      testCode: `import pytest
import time
import pandas as pd
import numpy as np
from app.services.forecast_engine import ForecastEngine

@pytest.mark.asyncio
async def test_predict_future_window_latency_and_caching():
    engine = ForecastEngine()
    df = pd.DataFrame({"quantity": np.random.randint(50, 500, size=180)})
    start_t = time.perf_counter()
    res1 = engine.predict_future_window(df, horizon_days=60)
    dur1 = time.perf_counter() - start_t
    assert len(res1) == 60
    assert dur1 < 5.0, f"Expected < 5s, got {dur1}s"
    
    # Second call must hit cache in < 100ms
    start_t2 = time.perf_counter()
    res2 = engine.predict_future_window(df, horizon_days=60)
    dur2 = time.perf_counter() - start_t2
    assert dur2 < 0.1, f"Cache missed or too slow: {dur2}s"
    np.testing.assert_array_almost_equal(res1, res2)`,
    },
    tokenUsage: {
      promptTokens: 1420,
      completionTokens: 890,
      costEstimateToman: 4200,
    },
  },
};

// Deep Learning Benchmark Dataset Seed
export const DEEP_LEARNING_MODELS_BENCHMARK = [
  {
    architecture: 'N-BEATS (Neural Basis Expansion)',
    category: 'Deep Neural Forecaster',
    wape: 7.42,
    rmse: 68.4,
    mase: 0.72,
    trainingTimeSec: 142,
    inferenceLatencyMs: 18.2,
    memoryMb: 340,
    interpretability: 'متوسط (تجزیه Trend و Seasonality)',
    status: 'بهترین دقت تقاضا',
  },
  {
    architecture: 'TCN (Temporal Convolutional Network)',
    category: 'Dilated Causal CNN',
    wape: 8.15,
    rmse: 73.1,
    mase: 0.79,
    trainingTimeSec: 88,
    inferenceLatencyMs: 8.4,
    memoryMb: 210,
    interpretability: 'پایین (بلک‌باکس کانولوشنی)',
    status: 'سریع‌ترین استنتاج عمیق',
  },
  {
    architecture: 'LSTM (Bi-directional Long Short-Term)',
    category: 'Recurrent Neural Network',
    wape: 8.84,
    rmse: 79.5,
    mase: 0.85,
    trainingTimeSec: 195,
    inferenceLatencyMs: 24.6,
    memoryMb: 420,
    interpretability: 'پایین',
    status: 'پایدار در الگوهای فصلی',
  },
  {
    architecture: 'GRU (Gated Recurrent Unit)',
    category: 'Gated RNN',
    wape: 8.92,
    rmse: 80.2,
    mase: 0.86,
    trainingTimeSec: 124,
    inferenceLatencyMs: 16.1,
    memoryMb: 280,
    interpretability: 'پایین',
    status: 'کم‌مصرف‌تر از LSTM',
  },
  {
    architecture: 'XGBoost Regressor (موتور پیش‌فرض فعلی)',
    category: 'Gradient Boosted Trees',
    wape: 8.70,
    rmse: 78.2,
    mase: 0.84,
    trainingTimeSec: 12,
    inferenceLatencyMs: 3.2,
    memoryMb: 65,
    interpretability: 'بسیار بالا (SHAP Values)',
    status: 'تعادل بهینه دقت، هزینه و سرعت',
  },
  {
    architecture: 'Seasonal Naive Baseline',
    category: 'Statistical Baseline',
    wape: 16.40,
    rmse: 145.8,
    mase: 1.00,
    trainingTimeSec: 0.1,
    inferenceLatencyMs: 0.4,
    memoryMb: 10,
    interpretability: 'بسیار بالا',
    status: 'خط پایه آماری',
  },
];

export const SAMPLE_DL_TRAINING_RUN: DeepLearningTrainingRun = {
  id: 'DL-RUN-2024-NBEATS-01',
  modelType: 'N_BEATS',
  currentEpoch: 40,
  totalEpochs: 40,
  trainLossHistory: [
    0.48, 0.41, 0.35, 0.31, 0.28, 0.26, 0.24, 0.23, 0.21, 0.20,
    0.19, 0.18, 0.17, 0.165, 0.16, 0.155, 0.15, 0.148, 0.144, 0.141,
    0.138, 0.135, 0.132, 0.130, 0.128, 0.125, 0.123, 0.121, 0.119, 0.118,
    0.116, 0.115, 0.113, 0.112, 0.110, 0.109, 0.108, 0.107, 0.106, 0.105,
  ],
  valLossHistory: [
    0.51, 0.44, 0.38, 0.34, 0.31, 0.29, 0.27, 0.26, 0.24, 0.235,
    0.228, 0.221, 0.215, 0.210, 0.205, 0.201, 0.198, 0.195, 0.192, 0.189,
    0.187, 0.185, 0.183, 0.181, 0.180, 0.178, 0.177, 0.176, 0.175, 0.174,
    0.174, 0.173, 0.173, 0.172, 0.172, 0.172, 0.171, 0.171, 0.171, 0.171,
  ],
  bestValLoss: 0.171,
  wape: 7.42,
  rmse: 68.4,
  mase: 0.72,
  inferenceLatencyMs: 18.2,
  memoryUsageMb: 340,
  trainingDurationSec: 142,
  status: 'COMPLETED',
};

export const MODEL_SELECTION_RECOMMENDATION: ModelRecommendationVerdict = {
  recommendedModel: 'XGBoost برای عملیات پیش‌فرض / N-BEATS برای محصولات استراتژیک کلاس A',
  reason: 'اگرچه N-BEATS خطای WAPE را ۱.۲۸٪ کاهش می‌دهد، اما زمان استنتاج آن ۶ برابر و هزینه آموزش آن ۱۲ برابر بیشتر از XGBoost است. برای ۹۰٪ پیش‌بینی‌ها XGBoost به دلیل توجیه‌پذیری اقتصادی و پشتیبانی از SHAP اولویت دارد، اما برای اقلام با ارزش بسیار بالا (کلاس A پارتو) مدل N-BEATS توصیه می‌شود.',
  compositeScore: 94,
  accuracyVsCostRatio: 'عالی (تعادل اقتصادی ۹۴/۱۰۰)',
  tradeoffs: {
    accuracy: 'N-BEATS: ۷.۴۲٪ در مقابل XGBoost: ۸.۷۰٪ (برتری N-BEATS)',
    latency: 'XGBoost: ۳.۲ میلی‌ثانیه در مقابل N-BEATS: ۱۸.۲ میلی‌ثانیه (برتری XGBoost)',
    computeCost: 'XGBoost: ۳۵ مگابایت رم، CPU در مقابل N-BEATS: ۳۴۰ مگابایت رم (برتری XGBoost)',
    explainability: 'XGBoost دارای درخت‌های شفاف و مقادیر SHAP است؛ N-BEATS بلک‌باکس عصبی است.',
  },
};

// Quarantined Records for Intelligent Data Quality Center
export const QUARANTINED_DATA_RECORDS: QuarantinedDataRecord[] = [
  {
    id: 'QREC-901',
    sourceSystem: 'WooCommerce API',
    entityType: 'order',
    rawRecord: {
      id: 84920,
      total: '-45000',
      currency: 'IRT',
      customer_id: 'GUEST',
      items: [{ name: 'ماوس بی‌سیم گیمینگ', qty: 1 }],
    },
    failureReason: 'مبلغ کل سفارش منفی است (تضاد با قانون حسابداری total_amount >= 0)',
    violationSeverity: 'CRITICAL',
    aiSuggestedFix: {
      action: 'شناسایی به عنوان مرجوعی (Refund) و ثبت در فیلد تراکنش‌های برگشتی',
      correctedTotal: 45000,
      orderType: 'REFUND_INVOICE',
    },
    receivedAt: '۱۴۰۳/۰۸/۲۴ ۰۹:۱۵',
    status: 'QUARANTINED',
  },
  {
    id: 'QREC-902',
    sourceSystem: 'صندوق فروشگاهی حضوری (POS File Drop)',
    entityType: 'order',
    rawRecord: {
      terminal_id: 'POS-04',
      date: '1403/08/32 14:00',
      amount_rial: 12000000,
    },
    failureReason: 'روز ماه نامعتبر در تاریخ شمسی (روز ۳۲ در تقویم وجود ندارد)',
    violationSeverity: 'WARNING',
    aiSuggestedFix: {
      action: 'اصلاح روز ماه به ۱ آذر ۱۴۰۳ (روز بعد از ۳۰ آبان) با تکیه بر timestamp سیستمی سرور پایانه',
      correctedDate: '1403/09/01 14:00',
    },
    receivedAt: '۱۴۰۳/۰۸/۲۴ ۱۰:۰۰',
    status: 'QUARANTINED',
  },
  {
    id: 'QREC-903',
    sourceSystem: 'Digikala Seller Webhook',
    entityType: 'customer',
    rawRecord: {
      name: 'نامشخص',
      mobile: '09120000000',
      city: 'Tehran, Iran',
    },
    failureReason: 'شماره تماس ساختگی (Mock Mobile Pattern: 09120000000)',
    violationSeverity: 'WARNING',
    aiSuggestedFix: {
      action: 'تفکیک مشتری به برچسب Guest-Order و استناد به شناسه کاربر پلتفرم دیجی‌کالا',
      isGuest: true,
    },
    receivedAt: '۱۴۰۳/۰۸/۲۴ ۱۱:۲۰',
    status: 'CORRECTED',
  },
];

// Automated Testing Center Seed Data
export const TEST_SUITE_REGISTRY: TestSuiteRegistryItem[] = [
  {
    id: 'TEST-UNIT-PYTEST',
    name: 'تست‌های واحد بک‌اند (Pytest Backend Services)',
    category: 'unit',
    framework: 'pytest',
    totalTests: 184,
    passCount: 184,
    failCount: 0,
    durationMs: 4210,
    lastRun: '۲۰ دقیقه قبل',
    status: 'PASSED',
  },
  {
    id: 'TEST-ISOLATION-TENANT',
    name: 'تست ایزولاسیون و RLS چندسازمانی (Tenant Isolation)',
    category: 'tenant_isolation',
    framework: 'pytest',
    totalTests: 42,
    passCount: 42,
    failCount: 0,
    durationMs: 1890,
    lastRun: '۲۵ دقیقه قبل',
    status: 'PASSED',
  },
  {
    id: 'TEST-BILLING-RECONCIL',
    name: 'تست انطباق مالی و وب‌هوک ایدمپوتنت زرین‌پال (Billing Lifecycle)',
    category: 'billing_lifecycle',
    framework: 'pytest',
    totalTests: 28,
    passCount: 28,
    failCount: 0,
    durationMs: 1120,
    lastRun: '۳۰ دقیقه قبل',
    status: 'PASSED',
  },
  {
    id: 'TEST-FRONTEND-VITEST',
    name: 'تست کامپوننت‌های فرانت‌اند و رندرینگ RTL (Vitest React)',
    category: 'unit',
    framework: 'vitest',
    totalTests: 96,
    passCount: 96,
    failCount: 0,
    durationMs: 2340,
    lastRun: '۱۵ دقیقه قبل',
    status: 'PASSED',
  },
  {
    id: 'TEST-E2E-PLAYWRIGHT',
    name: 'تست سرتاسری فرآیند ورود تا پیش‌بینی فروش (Playwright E2E)',
    category: 'e2e',
    framework: 'playwright',
    totalTests: 18,
    passCount: 18,
    failCount: 0,
    durationMs: 14200,
    lastRun: '۱ ساعت قبل',
    status: 'PASSED',
  },
  {
    id: 'TEST-LOAD-K6',
    name: 'تست بار و تاب‌آوری API با ۵۰۰ کاربر همزمان (k6 Load Test)',
    category: 'load',
    framework: 'k6',
    totalTests: 8,
    passCount: 8,
    failCount: 0,
    durationMs: 60000,
    lastRun: '۳ ساعت قبل',
    status: 'PASSED',
  },
  {
    id: 'TEST-ML-REGRESSION',
    name: 'تست تکرارپذیری خط لوله‌های آموزش و دیتالیست (ML Pipeline Test)',
    category: 'ml_pipeline',
    framework: 'pytest',
    totalTests: 32,
    passCount: 32,
    failCount: 0,
    durationMs: 8400,
    lastRun: '۴۵ دقیقه قبل',
    status: 'PASSED',
  },
];

export const QUALITY_GATE_METRICS: QualityGateMetrics = {
  totalCoveragePct: 88.4,
  criticalDefectsOpen: 0,
  tenantIsolationValidated: true,
  billingReconciliationValidated: true,
  p95PerformanceBudgetMet: true,
  releaseGateVerdict: 'APPROVED',
};

// Commercial Super Admin & Business Intelligence KPIs
export const COMMERCIAL_SAAS_KPIS: CommercialSaaSKpis = {
  mrrToman: 48500000, // Monthly Recurring Revenue
  arrToman: 582000000, // Annual Recurring Revenue
  activeTenantsCount: 38,
  payingTenantsCount: 29,
  trialTenantsCount: 9,
  churnRatePct: 1.8,
  customerLifetimeValueToman: 28400000,
  aiInfraCostPerTenantToman: 145000,
  grossMarginPct: 84.6,
  conversionRatePct: 24.2,
};

// =========================================================================
// AI STORE DISCOVERY, NEXT.JS + NODE.JS + MONGODB INTELLIGENCE SEED DATA
// =========================================================================

import {
  StoreConnectionProfile,
  TechnologyDetectionResult,
  DiscoveredCollectionSchema,
  BusinessEntityDefinition,
  StoreKnowledgeGraphData,
  StoreAiArchitectMessage,
} from '../types';

export const CURRENT_CONNECTED_STORE: StoreConnectionProfile = {
  id: 'store-nextjs-mongo-01',
  name: 'فروشگاه آنلاین اصلی (Next.js + Node.js + MongoDB)',
  storeUrl: 'https://shop.company.ir',
  sourceType: 'nextjs_node_mongodb',
  databaseEngine: 'mongodb',
  authMethod: 'read_only_uri',
  status: 'LEARNED',
  isReadOnlyConfirmed: true,
  discoveredAt: '۱۴۰۳/۰۸/۲۴ ۰۸:۳۰:۰۰',
  lastSyncAt: '۵ دقیقه قبل',
  readOnlyConnectionString: 'mongodb://readonly_ai:****@mongo-cluster.internal:27017/shop_production?authSource=admin&readPreference=secondaryPreferred',
  collectionsCount: 8,
  totalRecordsCount: 142850,
};

export const NEXTJS_MONGODB_TECH_DETECTION: TechnologyDetectionResult = {
  storeId: 'store-nextjs-mongo-01',
  frontendFramework: 'Next.js 14.2.5 (App Router / React 18 / Tailwind CSS)',
  backendFramework: 'Node.js 20 LTS (Route Handlers & Server Actions در src/app/api)',
  databaseDriver: 'Mongoose ODM v8.4.1 (اتصال تایید شده به کلاستر MongoDB 7.0)',
  authMechanism: 'NextAuth.js v5 (احراز هویت نشست‌های JWT با کالکشن کاربران)',
  cachingSystem: 'Redis v7.2 (کلاینت ioredis جهت کش قیمت و کاتالوگ محصولات)',
  queueSystem: 'BullMQ بر بستر Redis (پردازش ناهمگام نوتیفیکیشن‌ها و صدور حواله انبار)',
  confidenceScore: 99.2,
  detectedModules: [
    {
      name: 'Order Lifecycle Module',
      path: 'src/lib/services/order.service.ts',
      purpose: 'ثبت سفارش، رزرو موجودی کالا و اتصال به درگاه پرداخت',
      evidence: 'فایل orderService.ts شامل متدهای createOrder و reserveInventory با تراکنش session.startTransaction',
    },
    {
      name: 'Product & Variant Catalog',
      path: 'src/models/Product.ts',
      purpose: 'مدل مانگوس محصولات و آرایه تو در توی واریانت‌ها (رنگ و سایز)',
      evidence: 'شمای Mongoose دارای فیلد variants: [VariantSchema] با فیلدهای sku, color, size, inventoryQty',
    },
    {
      name: 'Customer & Address Ledger',
      path: 'src/models/Customer.ts',
      purpose: 'پروفایل مشتریان، آرایه آدرس‌های پستی و مانده خرید',
      evidence: 'کالکشن customers با شاخص منحصربه‌فرد روی شماره موبایل و ارجاع به سفارش‌ها',
    },
    {
      name: 'Inventory Sync Agent',
      path: 'src/lib/inventory/stock-manager.ts',
      purpose: 'مدیریت و کسر خودکار موجودی انبار هنگام موفقیت درگاه پرداخت',
      evidence: 'فراخوانی decrementStock پس از تایید کال‌بک در src/app/api/payment/verify/route.ts',
    },
  ],
};

export const DISCOVERED_MONGODB_COLLECTIONS: DiscoveredCollectionSchema[] = [
  {
    name: 'orders',
    documentCountEstimate: 54200,
    avgDocumentSizeBytes: 1840,
    primaryKeyField: '_id',
    canonicalEntityMatch: 'Order',
    confidencePct: 98.5,
    nestedDocumentsDetected: true,
    inconsistenciesDetected: [],
    indexes: [
      { name: '_id_', keys: '{ _id: 1 }', unique: true },
      { name: 'orderNumber_1', keys: '{ orderNumber: 1 }', unique: true },
      { name: 'customerId_1_createdAt_-1', keys: '{ customerId: 1, createdAt: -1 }', unique: false },
      { name: 'orderStatus_1', keys: '{ orderStatus: 1 }', unique: false },
    ],
    fields: [
      { name: '_id', type: 'ObjectId', isPrimaryKey: true, isNullable: false, sampleValue: '654a9f1b2c3d4e5f6a7b8c90' },
      { name: 'orderNumber', type: 'String', isNullable: false, sampleValue: 'ORD-1403-98420' },
      { name: 'customerId', type: 'ObjectId (Ref)', isReference: true, refCollection: 'customers', isNullable: false, sampleValue: '654a88001122334455667788' },
      { name: 'items', type: 'Array<Embedded OrderItem>', isNestedDocument: true, isNullable: false, sampleValue: '[{ productId, variantSku, qty: 2, unitPrice: 4200000 }]' },
      { name: 'totalAmount', type: 'Number (Rial)', isNullable: false, sampleValue: '8400000' },
      { name: 'orderStatus', type: 'String (Enum)', isNullable: false, sampleValue: 'COMPLETED' },
      { name: 'paymentStatus', type: 'String (Enum)', isNullable: false, sampleValue: 'PAID' },
      { name: 'shippingAddress', type: 'Object (Nested)', isNestedDocument: true, isNullable: false, sampleValue: '{ province: "تهران", city: "تهران", postalCode: "19839..." }' },
      { name: 'createdAt', type: 'Date (ISODate)', isNullable: false, sampleValue: '2024-11-14T10:30:00.000Z' },
      { name: 'updatedAt', type: 'Date (ISODate)', isNullable: false, sampleValue: '2024-11-14T11:15:00.000Z' },
    ],
  },
  {
    name: 'products',
    documentCountEstimate: 3680,
    avgDocumentSizeBytes: 2450,
    primaryKeyField: '_id',
    canonicalEntityMatch: 'Product',
    confidencePct: 99.0,
    nestedDocumentsDetected: true,
    inconsistenciesDetected: [],
    indexes: [
      { name: '_id_', keys: '{ _id: 1 }', unique: true },
      { name: 'slug_1', keys: '{ slug: 1 }', unique: true },
      { name: 'categoryId_1', keys: '{ categoryId: 1 }', unique: false },
    ],
    fields: [
      { name: '_id', type: 'ObjectId', isPrimaryKey: true, isNullable: false, sampleValue: '654b11112222333344445555' },
      { name: 'title', type: 'String', isNullable: false, sampleValue: 'کفش ورزشی رانینگ مدل اسپرینت' },
      { name: 'slug', type: 'String', isNullable: false, sampleValue: 'sprint-running-shoes' },
      { name: 'basePrice', type: 'Number (Rial)', isNullable: false, sampleValue: '18500000' },
      { name: 'variants', type: 'Array<Variant Object>', isNestedDocument: true, isNullable: false, sampleValue: '[{ sku: "SPRT-BLK-42", color: "مشکی", size: 42, stock: 15 }]' },
      { name: 'categoryId', type: 'ObjectId (Ref)', isReference: true, refCollection: 'categories', isNullable: false, sampleValue: '654a10001000100010001000' },
      { name: 'isActive', type: 'Boolean', isNullable: false, sampleValue: 'true' },
      { name: 'createdAt', type: 'Date (ISODate)', isNullable: false, sampleValue: '2024-06-01T08:00:00.000Z' },
    ],
  },
  {
    name: 'customers',
    documentCountEstimate: 18450,
    avgDocumentSizeBytes: 1120,
    primaryKeyField: '_id',
    canonicalEntityMatch: 'Customer',
    confidencePct: 97.8,
    nestedDocumentsDetected: true,
    inconsistenciesDetected: [],
    indexes: [
      { name: '_id_', keys: '{ _id: 1 }', unique: true },
      { name: 'mobile_1', keys: '{ mobile: 1 }', unique: true },
      { name: 'email_1', keys: '{ email: 1 }', unique: false },
    ],
    fields: [
      { name: '_id', type: 'ObjectId', isPrimaryKey: true, isNullable: false, sampleValue: '654a88001122334455667788' },
      { name: 'fullName', type: 'String', isNullable: false, sampleValue: 'علیرضا تهرانی' },
      { name: 'mobile', type: 'String', isNullable: false, sampleValue: '09123456789' },
      { name: 'email', type: 'String', isNullable: true, sampleValue: 'alireza@example.com' },
      { name: 'totalOrdersCount', type: 'Number', isNullable: false, sampleValue: '6' },
      { name: 'totalLifetimeSpend', type: 'Number (Rial)', isNullable: false, sampleValue: '48200000' },
      { name: 'firstOrderDate', type: 'Date', isNullable: false, sampleValue: '2023-12-10T09:00:00.000Z' },
      { name: 'lastOrderDate', type: 'Date', isNullable: false, sampleValue: '2024-11-12T14:20:00.000Z' },
    ],
  },
  {
    name: 'inventory',
    documentCountEstimate: 7200,
    avgDocumentSizeBytes: 650,
    primaryKeyField: '_id',
    canonicalEntityMatch: 'Inventory',
    confidencePct: 96.5,
    nestedDocumentsDetected: false,
    inconsistenciesDetected: [],
    indexes: [
      { name: '_id_', keys: '{ _id: 1 }', unique: true },
      { name: 'variantSku_1', keys: '{ variantSku: 1 }', unique: true },
      { name: 'productId_1', keys: '{ productId: 1 }', unique: false },
    ],
    fields: [
      { name: '_id', type: 'ObjectId', isPrimaryKey: true, isNullable: false, sampleValue: '654c99998888777766665555' },
      { name: 'productId', type: 'ObjectId (Ref)', isReference: true, refCollection: 'products', isNullable: false, sampleValue: '654b11112222333344445555' },
      { name: 'variantSku', type: 'String', isNullable: false, sampleValue: 'SPRT-BLK-42' },
      { name: 'warehouseName', type: 'String', isNullable: false, sampleValue: 'انبار مرکزی تهران' },
      { name: 'availableStock', type: 'Number', isNullable: false, sampleValue: '15' },
      { name: 'reservedStock', type: 'Number', isNullable: false, sampleValue: '2' },
      { name: 'safetyStockThreshold', type: 'Number', isNullable: false, sampleValue: '5' },
      { name: 'lastUpdated', type: 'Date', isNullable: false, sampleValue: '2024-11-14T11:15:30.000Z' },
    ],
  },
];

export const DISCOVERED_BUSINESS_ENTITIES: BusinessEntityDefinition[] = [
  {
    entityType: 'Order',
    nameFa: 'فاکتور و سفارش مشتری (Order Entity)',
    matchedCollection: 'orders',
    confidencePct: 98.5,
    isConfirmed: true,
    keyFields: {
      primaryId: '_id',
      referenceNumber: 'orderNumber',
      amount: 'totalAmount',
      status: 'orderStatus',
      timestamp: 'createdAt',
    },
    relationships: [
      { targetEntity: 'Customer', relationType: 'N:M', foreignKey: 'customerId -> customers._id', confidence: 99, isVerified: true },
      { targetEntity: 'OrderItem', relationType: '1:N', foreignKey: 'items[] (Embedded Array)', confidence: 98, isVerified: true },
    ],
  },
  {
    entityType: 'Product',
    nameFa: 'کالا و محصولات (Product Catalog)',
    matchedCollection: 'products',
    confidencePct: 99.0,
    isConfirmed: true,
    keyFields: {
      primaryId: '_id',
      name: 'title',
      price: 'basePrice',
      skuList: 'variants[].sku',
    },
    relationships: [
      { targetEntity: 'Inventory', relationType: '1:N', foreignKey: 'inventory.productId -> products._id', confidence: 97, isVerified: true },
    ],
  },
  {
    entityType: 'Customer',
    nameFa: 'مشتریان و خریداران (Customer Profile)',
    matchedCollection: 'customers',
    confidencePct: 97.8,
    isConfirmed: true,
    keyFields: {
      primaryId: '_id',
      identityPhone: 'mobile',
      fullName: 'fullName',
      lifetimeValue: 'totalLifetimeSpend',
    },
    relationships: [
      { targetEntity: 'Order', relationType: '1:N', foreignKey: 'orders.customerId -> customers._id', confidence: 99, isVerified: true },
    ],
  },
  {
    entityType: 'Inventory',
    nameFa: 'موجودی انبار و پایانه کالا (Stock & Warehousing)',
    matchedCollection: 'inventory',
    confidencePct: 96.5,
    isConfirmed: true,
    keyFields: {
      primaryId: '_id',
      sku: 'variantSku',
      stock: 'availableStock',
      safetyLimit: 'safetyStockThreshold',
    },
    relationships: [
      { targetEntity: 'Product', relationType: 'N:M', foreignKey: 'inventory.productId -> products._id', confidence: 97, isVerified: true },
    ],
  },
];

export const SAMPLE_STORE_KNOWLEDGE_GRAPH: StoreKnowledgeGraphData = {
  version: 'v2.4.0-learned',
  generatedAt: '۱۴۰۳/۰۸/۲۴ ۰۹:۱۵:۰۰',
  storeName: 'فروشگاه Next.js + MongoDB',
  nodes: [
    { id: 'node-route-checkout', label: 'Route: /api/checkout', category: 'route', details: 'اندپوینت Next.js App Router برای ثبت سبد خرید و ایجاد فاکتور اولیه', confidence: 99 },
    { id: 'node-route-verify', label: 'Route: /api/payment/verify', category: 'route', details: 'کال‌بک درگاه بانکی زرین‌پال و تایید تراکنش موفق', confidence: 99 },
    { id: 'node-service-order', label: 'Service: OrderService', category: 'service', details: 'منطق کسب‌وکار سفارش‌ها در src/lib/services/order.service.ts', confidence: 98 },
    { id: 'node-service-stock', label: 'Service: StockManager', category: 'service', details: 'کسر اتمیک موجودی با استفاده از $inc در MongoDB', confidence: 97 },
    { id: 'node-coll-orders', label: 'Collection: orders', category: 'collection', details: 'کالکشن ۵۴,۲۰۰ سند سفارش همراه با آیتم‌های تو در تو', confidence: 99 },
    { id: 'node-coll-products', label: 'Collection: products', category: 'collection', details: 'کالکشن ۳,۶۸۰ محصول با آرایه variants', confidence: 99 },
    { id: 'node-coll-customers', label: 'Collection: customers', category: 'collection', details: 'کالکشن ۱۸,۴۵۰ خریدار با ایندکس یونیک روی موبایل', confidence: 98 },
    { id: 'node-coll-inventory', label: 'Collection: inventory', category: 'collection', details: 'کالکشن ۷,۲۰۰ رکورد موجودی متناظر با SKUها', confidence: 97 },
    { id: 'node-wf-order-state', label: 'Workflow: Order Lifecycle', category: 'workflow', details: 'ماشین وضعیت سفارش از ایجاد تا تحویل یا ابطال', confidence: 96 },
  ],
  edges: [
    { id: 'e1', source: 'node-route-checkout', target: 'node-service-order', relationship: 'فراخوانی منطق ثبت', confidence: 99, verified: true },
    { id: 'e2', source: 'node-service-order', target: 'node-coll-orders', relationship: 'درج سند در کالکشن (INSERT)', confidence: 99, verified: true },
    { id: 'e3', source: 'node-route-verify', target: 'node-service-stock', relationship: 'دستور کسر موجودی انبار', confidence: 98, verified: true },
    { id: 'e4', source: 'node-service-stock', target: 'node-coll-inventory', relationship: 'به‌روزرسانی اتمیک {$inc: {stock: -qty}}', confidence: 97, verified: true },
    { id: 'e5', source: 'node-coll-orders', target: 'node-coll-customers', relationship: 'ارجاع customerId -> _id (ObjectId)', confidence: 99, verified: true },
    { id: 'e6', source: 'node-coll-orders', target: 'node-coll-products', relationship: 'ارجاع items[].productId -> products._id', confidence: 98, verified: true },
    { id: 'e7', source: 'node-coll-inventory', target: 'node-coll-products', relationship: 'وابستگی موجودی به SKU کالا', confidence: 97, verified: true },
    { id: 'e8', source: 'node-coll-orders', target: 'node-wf-order-state', relationship: 'پایبندی به وضعیت‌های ماشین حالت', confidence: 96, verified: true },
  ],
  stateMachines: [
    {
      workflowName: 'ماشین وضعیت چرخه سفارش (Order State Machine)',
      states: ['PENDING_PAYMENT', 'PAID_CONFIRMED', 'PROCESSING_INVENTORY', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
      transitions: [
        { from: 'PENDING_PAYMENT', to: 'PAID_CONFIRMED', trigger: 'تایید تراکنش درگاه بانکی (200 OK)' },
        { from: 'PAID_CONFIRMED', to: 'PROCESSING_INVENTORY', trigger: 'کسر قطعی موجودی انبار و تخصیص شناسه بارنامه' },
        { from: 'PROCESSING_INVENTORY', to: 'SHIPPED', trigger: 'تحویل مرسوله به شرکت پست/تیپاکس' },
        { from: 'SHIPPED', to: 'DELIVERED', trigger: 'ثبت امضای دیجیتال گیرنده کالا' },
        { from: 'PENDING_PAYMENT', to: 'CANCELLED', trigger: 'منقضی شدن مهلت پرداخت (۱۵ دقیقه)' },
        { from: 'PAID_CONFIRMED', to: 'REFUNDED', trigger: 'انصراف کاربر و بازگشت وجه با سند حسابداری' },
      ],
    },
  ],
};

export const INITIAL_STORE_AI_CHAT_MESSAGES: StoreAiArchitectMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'سلام! من دستیار هوشمند معماری و تحلیل پایگاه داده فروشگاه شما هستم (Store AI Architect). ساختار Next.js 14، سرویس‌های Node.js و کالکشن‌های دیتابیس MongoDB فروشگاه شما با موفقیت شناسایی و به گراف دانشی نسخه v2.4 تبدیل شده است. هر سوالی درباره جداول، ارتباط سفارش‌ها، کسر موجودی، یا نحوه پیش‌بینی فروش دارید بفرمایید.',
    timestamp: '۱۰:۰۰',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'محصولات فروشگاه من در کدام کالکشن MongoDB هستند و واریانت‌ها (رنگ و سایز) چطور ذخیره شده‌اند؟',
    timestamp: '۱۰:۰۱',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: `محصولات فروشگاه شما در کالکشن **products** قرار دارند. 
    
نکته معماری مهم کشف‌شده این است که فروشگاه شما برای واریانت‌ها یک کالکشن مجزا ایجاد نکرده؛ بلکه از الگوی **Embedded Sub-Documents** مانگودیزاین بهره برده است:
- در هر سند محصول، یک آرایه به نام \`variants\` وجود دارد:
\`\`\`json
{
  "_id": ObjectId("654b1111..."),
  "title": "کفش ورزشی رانینگ مدل اسپرینت",
  "basePrice": 18500000,
  "variants": [
    { "sku": "SPRT-BLK-42", "color": "مشکی", "size": 42, "stock": 15 },
    { "sku": "SPRT-WHT-43", "color": "سفید", "size": 43, "stock": 8 }
  ]
}
\`\`\`
موتور AI پلتفرم ما به طور خودکار این آرایه را می‌شکند (Unnest) تا پیش‌بینی تقاضا در سطح هر SKU به صورت جداگانه و با دقت بالا انجام شود.`,
    citations: [
      { title: 'کالکشن products', source: 'MongoDB Production DB', snippet: '3,680 documents · Mongoose Model: src/models/Product.ts' }
    ],
    timestamp: '۱۰:۰۱',
  },
  {
    id: 'msg-4',
    sender: 'user',
    text: 'وقتی سفارشی ثبت می‌شود، موجودی از کجا و چگونه کم می‌شود؟',
    timestamp: '۱۰:۰۲',
  },
  {
    id: 'msg-5',
    sender: 'assistant',
    text: `فرآیند کسر موجودی در فروشگاه شما طی یک جریان دوسطحی اجرا می‌شود:

1. **گام اول (رزرو موقت):** در زمان فراخوانی \`/api/checkout\`، متد \`reserveInventory\` در فایل \`src/lib/services/order.service.ts\` موجودی را در کالکشن **inventory** در وضعیت \`reservedStock\` قرار می‌دهد.
2. **گام دوم (کسر قطعی):** با بازگشت موفق از درگاه زرین‌پال به اندپوینت \`/api/payment/verify/route.ts\`، ماژول \`stock-manager.ts\` دستور زیر را مستقیماً روی MongoDB اجرا می‌کند:
\`\`\`javascript
await Inventory.updateOne(
  { variantSku: item.variantSku },
  { 
    $inc: { availableStock: -item.qty, reservedStock: -item.qty },
    $set: { lastUpdated: new Date() }
  }
);
\`\`\`
همچنین سند سفارش در کالکشن **orders** از وضعیت \`PENDING_PAYMENT\` به \`PAID_CONFIRMED\` تغییر وضعیت می‌دهد. اگر پرداخت در ۱۵ دقیقه انجام نشود، جاب BullMQ به صورت خودکار موجودی رزرو را آزاد می‌کند.`,
    citations: [
      { title: 'سرویس انبارداری', source: 'src/lib/inventory/stock-manager.ts' },
      { title: 'کالکشن inventory', source: 'MongoDB Collection: inventory' }
    ],
    timestamp: '۱۰:۰۲',
  },
];

// =========================================================================
// UNIFIED COMMERCE ECOSYSTEM SEED DATA
// (ghlbedovom-site + saraye-hamid-site + sync-worker + Shared MongoDB)
// =========================================================================

import {
  UnifiedEcosystemProfile,
  DataOwnershipItem,
  InventoryLedgerRecord,
  SyncWorkerQueueMetric,
  MarketplaceSyncItem,
  CrossRepoDiagnosticCase,
} from '../types';

export const UNIFIED_ECOSYSTEM_PROFILE: UnifiedEcosystemProfile = {
  ecosystemId: 'eco-unified-01',
  displayName: 'اکوسیستم یکپارچه تجارت الکترونیک (قلب دوم + سرای حمید + Sync Worker)',
  sharedDatabaseUri: 'mongodb://shared_cluster_app:****@mongo-cluster.internal:27017/shared_commerce_db?readPreference=secondaryPreferred',
  healthScore: 99.4,
  totalOrdersUnified: 72650,
  ghlbedovomOrders: 41200,
  sarayeHamidOrders: 31450,
  syncWorkerActiveJobs: 18,
  lastSynchronizedAt: 'هم‌اکنون (بلادرنگ)',
  components: [
    {
      id: 'ghlbedovom-site',
      name: 'ghlbedovom-site',
      nameFa: 'فروشگاه و پنل برند قلب دوم (کفش و تجهیزات ارتوپدی)',
      repoPath: '/home/alikheiri/eco/ghlbedovom-site',
      type: 'storefront',
      brandId: 'ghlbedovom',
      framework: 'Next.js 15 (React 19, TypeScript, Material UI, Emotion)',
      status: 'HEALTHY',
      lastPingMs: 12,
      activeVersion: 'v1.4.2',
      gitCommit: '8f4b21c',
      gitBranch: 'main',
      activePort: 3001,
      openEndPointsCount: 24,
    },
    {
      id: 'saraye-hamid-site',
      name: 'saraye-hamid-site',
      nameFa: 'فروشگاه و پنل برند سرای حمید (لوازم خانگی و فرش)',
      repoPath: '/home/alikheiri/eco/saraye-hamid-site',
      type: 'storefront',
      brandId: 'saraye-hamid',
      framework: 'Next.js 15 (React 19, TypeScript, Material UI, Emotion)',
      status: 'HEALTHY',
      lastPingMs: 14,
      activeVersion: 'v1.3.8',
      gitCommit: 'a19d80e',
      gitBranch: 'main',
      activePort: 3002,
      openEndPointsCount: 22,
    },
    {
      id: 'sync-worker',
      name: 'sync-worker',
      nameFa: 'کارگر پس‌زمینه و هماهنگ‌ساز مارکت‌پلیس‌ها و انبار (Sync Worker)',
      repoPath: '/home/alikheiri/eco/sync-worker',
      type: 'worker',
      framework: 'Node.js 20 LTS (TypeScript, BullMQ, Redis, Persistent Jobs)',
      status: 'HEALTHY',
      lastPingMs: 8,
      activeVersion: 'v2.1.0',
      gitCommit: '5c3e72a',
      gitBranch: 'main',
      activePort: 4000,
      openEndPointsCount: 16,
    },
  ],
};

export const UNIFIED_DATA_OWNERSHIP_MATRIX: DataOwnershipItem[] = [
  {
    resourceName: 'کاتالوگ کالاها و مشخصات فنی',
    resourceCategory: 'Product Catalog',
    ownershipScope: 'SHARED',
    owningComponent: 'Shared MongoDB (Read/Write هر دو سایت)',
    collectionName: 'products',
    discriminatorField: 'siteOverrides: { ghlbedovom: { active, price }, saraye_hamid: { active, price } }',
    isolationPolicy: 'مشخصات پایه و بارکد مشترک؛ قیمت و ویترین مجزا برای هر برند',
    sharedRationale: 'کاهش زحمت ورود اطلاعات اقلام مشترک و هماهنگی زنجیره تامین',
  },
  {
    resourceName: 'دفتر کل موجودی و تراکنش‌های انبار',
    resourceCategory: 'Inventory Ledger',
    ownershipScope: 'SHARED',
    owningComponent: 'Shared MongoDB + sync-worker (Atomic Control)',
    collectionName: 'inventory_ledgers',
    discriminatorField: 'sku, warehouseId, allocatedChannels',
    isolationPolicy: 'موجودی فیزیکی کل متمرکز؛ جلوگیری قطعی از بیش‌فروشی (Overselling)',
    sharedRationale: 'هر دو سایت و دیجی‌کالا از یک انبار فیزیکی تغذیه می‌شوند',
  },
  {
    resourceName: 'سفارش‌ها و فاکتورهای فروشگاهی',
    resourceCategory: 'Orders & Invoices',
    ownershipScope: 'GHLBEDOVOM_EXCLUSIVE',
    owningComponent: 'ghlbedovom-site / saraye-hamid-site',
    collectionName: 'orders',
    discriminatorField: 'brandId: "ghlbedovom" | "saraye_hamid"',
    isolationPolicy: 'جداسازی ۱۰۰٪ سفارش‌ها، درگاه‌های پرداخت، و سربرگ‌های مالیاتی',
    sharedRationale: 'تفکیک حقوقی و حسابداری مستقل هر برند',
  },
  {
    resourceName: 'پروفایل خریداران و آدرس‌ها',
    resourceCategory: 'Customers & CRM',
    ownershipScope: 'SARAYE_HAMID_EXCLUSIVE',
    owningComponent: 'saraye-hamid-site',
    collectionName: 'customers',
    discriminatorField: 'tenantId / brandScope: "saraye_hamid"',
    isolationPolicy: 'عدم نشت داده‌های مشتریان و باشگاه وفاداری بین دو برند',
    sharedRationale: 'رعایت حریم خصوصی کاربران و کمپین‌های پیامکی مجزا',
  },
  {
    resourceName: 'صف‌ها، تسک‌های دوره‌ای و لاگ‌های وب‌هوک',
    resourceCategory: 'Background Jobs',
    ownershipScope: 'WORKER_EXCLUSIVE',
    owningComponent: 'sync-worker (BullMQ / Redis)',
    collectionName: 'worker_jobs & sync_checkpoints',
    discriminatorField: 'jobType, priorityQueue: "critical" | "bulk" | "ai"',
    isolationPolicy: 'فقط خواندنی برای سایت‌ها؛ اجرای انحصاری توسط sync-worker',
    sharedRationale: 'جلوگیری از قفل صفوف و اجرای تکراری پردازش‌های سنگین',
  },
  {
    resourceName: 'نگاشت‌های تنوع دیجی‌کالا و هلو ERP',
    resourceCategory: 'Marketplace Mappings',
    ownershipScope: 'MARKETPLACE',
    owningComponent: 'sync-worker (Integration Modules)',
    collectionName: 'marketplace_mappings & holoo_sync_records',
    discriminatorField: 'channel: "digikala" | "holoo" | "torob", externalVariantId',
    isolationPolicy: 'تطبیق کدینگ کالاها با شناسه تنوع دیجی‌کالا و کد انبار نرم‌افزار هلو',
    sharedRationale: 'همگام‌سازی دوسویه قیمت و موجودی با درگاه‌های بیرونی',
  },
];

export const INVENTORY_LEDGER_RECORDS: InventoryLedgerRecord[] = [
  {
    id: 'LEDGER-01',
    sku: 'SPRT-BLK-42',
    productTitle: 'کفش ورزشی ارتوپدی اسپرینت مشکی ۴۲',
    variantDetail: 'سایز ۴۲ · مشکی',
    brandScope: 'قلب دوم + دیجی‌کالا',
    physicalStock: 14,
    allocatedGhlbedovom: 6,
    allocatedSarayeHamid: 0,
    digikalaSyncedStock: 8,
    discrepancyStatus: 'IN_SYNC',
    lastLedgerEvent: 'کسر ۱ عدد با ثبت سفارش ORD-98421 در قلب دوم و ارسال به صف critical ورکر',
    invariantVerified: true,
  },
  {
    id: 'LEDGER-02',
    sku: 'HAMID-RUG-6M',
    productTitle: 'فرش دستباف‌گونه ۶ متری طرح افشان کاشان',
    variantDetail: '۶ متری · سرمه‌ای',
    brandScope: 'سرای حمید + فروش حضوری',
    physicalStock: 4,
    allocatedGhlbedovom: 0,
    allocatedSarayeHamid: 4,
    digikalaSyncedStock: 0,
    discrepancyStatus: 'IN_SYNC',
    lastLedgerEvent: 'استعلام هلو ERP: تطبیق کامل با سند حواله انبار شماره ۸۴۲۰',
    invariantVerified: true,
  },
  {
    id: 'LEDGER-03',
    sku: 'GHLB-ORTHO-L',
    productTitle: 'کفی طبی سیلیکونی خارپاشنه سایز بزرگ',
    variantDetail: 'سایز L · شفاف',
    brandScope: 'مشترک (قلب دوم + سرای حمید)',
    physicalStock: 22,
    allocatedGhlbedovom: 12,
    allocatedSarayeHamid: 5,
    digikalaSyncedStock: 5,
    discrepancyStatus: 'RESERVED_PENDING',
    lastLedgerEvent: 'رزرو موقت ۲ عدد برای پرداخت درگاه سداد سرای حمید (مهلت ۱۵ دقیقه)',
    invariantVerified: true,
  },
  {
    id: 'LEDGER-04',
    sku: 'DIJI-SND-BRN',
    productTitle: 'صندل چرم طبی مردانه قهوه‌ای',
    variantDetail: 'سایز ۴۱ · قهوه‌ای سوخته',
    brandScope: 'قلب دوم + دیجی‌کالا',
    physicalStock: 9,
    allocatedGhlbedovom: 5,
    allocatedSarayeHamid: 0,
    digikalaSyncedStock: 9,
    discrepancyStatus: 'DISCREPANCY_DETECTED',
    lastLedgerEvent: 'خطای ۴۲۹ دیجی‌کالا حین همگام‌سازی؛ تسک در صف بازآزمایی (Retry) قرار گرفت',
    invariantVerified: true,
    discrepancyReason: 'موجودی فیزیکی ۹ عدد است ولی سهمیه مجاز دیجی‌کالا باید ۴ عدد باشد (۵ عدد در قلب دوم فروش رفته است). تسک آپدیت در صف Retry با اولویت بالا قرار دارد.',
  },
];

export const SYNC_WORKER_QUEUES: SyncWorkerQueueMetric[] = [
  {
    queueName: 'critical',
    queueLabelFa: 'صف فوری (Critical Queue)',
    activeJobs: 3,
    waitingJobs: 2,
    failedJobs: 0,
    delayedJobs: 0,
    throughputPerMin: 124,
    concurrencyLimit: 10,
    priorityLevel: 1,
    description: 'رزرو لحظه‌ای موجودی در زمان Checkout، کسر انبار پس از پرداخت، و ارسال تغییرات فوری به دیجی‌کالا',
  },
  {
    queueName: 'bulk',
    queueLabelFa: 'صف دسته‌ای (Bulk Queue)',
    activeJobs: 11,
    waitingJobs: 42,
    failedJobs: 1,
    delayedJobs: 4,
    throughputPerMin: 48,
    concurrencyLimit: 4,
    priorityLevel: 2,
    description: 'همگام‌سازی دوره‌ای با نرم‌افزار هلو (Holoo ERP)، ایمپورت دسته‌ای کاتالوگ و فشرده‌سازی عکس‌ها با Sharp/GridFS',
  },
  {
    queueName: 'ai',
    queueLabelFa: 'صف هوش مصنوعی (AI Queue)',
    activeJobs: 4,
    waitingJobs: 8,
    failedJobs: 0,
    delayedJobs: 0,
    throughputPerMin: 14,
    concurrencyLimit: 2,
    priorityLevel: 3,
    description: 'تولید برچسب‌های سئو، تحلیل سبد خرید، محاسبه ویژگی‌های پیش‌بینی فروش و کنترل بودجه توکن ساعتی DeepSeek',
  },
];

export const MARKETPLACE_SYNC_ITEMS: MarketplaceSyncItem[] = [
  {
    id: 'mp-digikala',
    channel: 'دیجی‌کالا (Digikala)',
    status: 'HEALTHY',
    lastSyncTimestamp: '۲ دقیقه قبل',
    syncedItemsCount: 3420,
    divergentItemsCount: 1,
    latencyMs: 140,
    activeMappingCount: 3420,
    rateLimitUsage: '42 / 60 فراخوانی در دقیقه',
  },
  {
    id: 'mp-holoo',
    channel: 'هلو ERP (Holoo)',
    status: 'HEALTHY',
    lastSyncTimestamp: '۱۵ دقیقه قبل',
    syncedItemsCount: 4850,
    divergentItemsCount: 0,
    latencyMs: 85,
    activeMappingCount: 4850,
    rateLimitUsage: 'نامحدود (شبکه داخلی LAN)',
  },
  {
    id: 'mp-torob',
    channel: 'ترب (Torob)',
    status: 'SYNCED',
    lastSyncTimestamp: '۱۰ دقیقه قبل',
    syncedItemsCount: 2980,
    divergentItemsCount: 0,
    latencyMs: 110,
    activeMappingCount: 2980,
    rateLimitUsage: '18 / 30 فراخوانی در دقیقه',
  },
  {
    id: 'mp-emalls',
    channel: 'ایمالز (Emalls)',
    status: 'SYNCED',
    lastSyncTimestamp: '۲۰ دقیقه قبل',
    syncedItemsCount: 2450,
    divergentItemsCount: 0,
    latencyMs: 125,
    activeMappingCount: 2450,
    rateLimitUsage: '12 / 30 فراخوانی در دقیقه',
  },
];

export const CROSS_REPO_DIAGNOSTICS: CrossRepoDiagnosticCase[] = [
  {
    id: 'DIAG-CASE-01',
    title: 'ردیابی اختلاف موجودی واریانت بین دیجی‌کالا و فروشگاه',
    questionFa: 'چرا موجودی واریانت SPRT-BLK-42 در دیجی‌کالا با فروشگاه اختلاف دارد؟',
    targetSku: 'SPRT-BLK-42',
    confidenceScore: 99.4,
    tracePath: [
      {
        component: 'ghlbedovom-site',
        file: 'src/lib/services/order.service.ts',
        collection: 'orders',
        action: 'سفارش جدید ORD-98421 برای این کالا ثبت و تایید درگاه شد؛ موجودی مجاز ۱ عدد کاهش یافت.',
      },
      {
        component: 'Shared MongoDB',
        file: 'src/models/InventoryLedger.ts',
        collection: 'inventory_ledgers',
        action: 'دستور اتمیک {$inc: {physicalStock: -1}} با موفقیت در لجر ثبت شد (موجودی فیزیکی: ۱۴ عدد).',
      },
      {
        component: 'sync-worker',
        file: 'src/queues/critical.queue.ts',
        collection: 'worker_jobs',
        action: 'تسک sync_marketplace_stock با محتوای {sku: "SPRT-BLK-42", newStock: 8} بلافاصله در صف critical قرار گرفت.',
      },
      {
        component: 'Marketplace Integration',
        file: 'src/integrations/digikala/client.ts',
        action: 'پاسخ وب‌سرویس دیجی‌کالا: HTTP 429 Too Many Requests به دلیل مصرف سقف مجاز فراخوانی در این دقیقه.',
      },
      {
        component: 'sync-worker (Recovery)',
        file: 'src/workers/marketplace.worker.ts',
        action: 'کارگر ورکر به طور خودکار تسک را با تاخیر نمایی (Exponential Backoff) برای ۱۲۰ ثانیه بعد زمان‌بندی مجدد کرد.',
      },
    ],
    rootCause: 'اختلاف موقت به دلیل اعمال محدودیت نرخ فراخوانی (Rate-Limit) از سوی دیجی‌کالا رخ داده و ورکر بر اساس پروتکل استاندارد در حال اجرای مجدد است. موجودی دیتابیس و لجر داخلی صحیح و امن است.',
    evidence: 'لاگ خطای HTTP 429 در ساعت ۱۱:۲۴:۱۰ در جدول worker_jobs با شناسه تسک JOB-991204 ثبت شده و وضعیت تسک در صف critical برابر با RETRYING است.',
    resolution: 'نیازی به دخالت دستی نیست؛ تسک در صف بازآزمایی قرار دارد و ظرف ۱ دقیقه آینده با موفقیت در دیجی‌کالا اعمال می‌شود. در صورت تکرار، سقف نرخ فراخوانی در تنظیمات sync-worker به ۴۰ درخواست در دقیقه محدود شود.',
  },
  {
    id: 'DIAG-CASE-02',
    title: 'تضمین قانون عدم بازگشت تکراری موجودی (Inventory Invariant Safety)',
    questionFa: 'چطور مطمئن شویم در زمان لغو سفارش، موجودی دو بار به انبار بازگردانده نمی‌شود؟',
    confidenceScore: 99.8,
    tracePath: [
      {
        component: 'saraye-hamid-site',
        file: 'src/lib/services/order.service.ts',
        action: 'درخواست ابطال سفارش ORD-77140 ثبت شد.',
      },
      {
        component: 'Shared MongoDB',
        file: 'src/models/InventoryLedger.ts',
        collection: 'inventory_ledgers',
        action: 'بررسی شرط Safety Invariant: آیا رکورد کسر متناظر با همین orderId و orderLine وجود دارد و قبلاً بازگردانده نشده است؟',
      },
      {
        component: 'sync-worker',
        file: 'src/services/ledger.service.ts',
        action: 'اعمال فیلد isRestored: true با شناسه تراکنش اتمیک session.startTransaction() در دیتابیس.',
      },
    ],
    rootCause: 'قانون طلایی سیستم: هر بازگشت موجودی باید دقیقاً به یک کسر قبلی تاییدشده متصل باشد و فیلد isRestored مانع اجرای مجدد می‌شود.',
    evidence: 'تست‌های Pytest و Vitest فایل tests/test_inventory_ledger_invariant.py به طور ۱۰۰٪ پاس شده‌اند.',
    resolution: 'امنیت انبار در بالاترین سطح رعایت شده و خطر بیش‌فروشی صفر است.',
  },
];

// =========================================================================
// PHASES 1-11 SEED DATA & SUITE MOCK VALUES
// =========================================================================

import {
  CompatibilityAuditReport,
  ZeroTrustIdentity,
  SecurityAuditEvent,
  ComponentConnectionStatus,
  CanonicalEntityDefinition,
  SchemaMappingRule,
  IngestionCheckpoint,
  DeduplicationProof,
  EcosystemKnowledgeGraphNode,
  EcosystemKnowledgeGraphEdge,
  ControlledCommandProposal,
} from '../types';

export const COMPATIBILITY_AUDIT_REPORT: CompatibilityAuditReport = {
  ecosystemId: 'eco-unified-commerce-prod',
  overallStatus: 'partially_compatible',
  generatedAt: '1403/07/21 12:45:10 (Linux AI Engine)',
  components: [
    {
      componentId: 'ghlbedovom-site',
      componentNameFa: 'فروشگاه قلب دوم (Next.js 15 App Router)',
      status: 'compatible',
      protocolCompatible: true,
      schemaCompatible: true,
      capabilitiesSupported: ['manifest:v1', 'catalog:read', 'orders:read_scoped', 'webhook:signed_v2'],
      capabilitiesMissing: [],
      evidenceNotes: [
        'شناسه اکوسیستم eco-unified-commerce-prod تایید شد.',
        'قرارداد JSON Schema با Pydantic v2 کاملاً منطبق است.',
        'پروتکل ارتباطی HTTP/2 TLS 1.3 بدون مشکل پاسخ داد.',
      ],
      gapReport: 'سازگاری کامل برای دریافت کاتالوگ و رخدادهای امضا شده سفارش.',
    },
    {
      componentId: 'saraye-hamid-site',
      componentNameFa: 'فروشگاه سرای حمید (Next.js 15 Pages/App Router)',
      status: 'compatible',
      protocolCompatible: true,
      schemaCompatible: true,
      capabilitiesSupported: ['manifest:v1', 'catalog:read', 'orders:read_scoped', 'webhook:signed_v2'],
      capabilitiesMissing: [],
      evidenceNotes: [
        'شناسه اکوسیستم یکسان و اعتبار گواهی TLS احراز شد.',
        'تفکیک برند از طریق فیلد brandScope=saraye-hamid تضمین شده است.',
      ],
      gapReport: 'سازگاری کامل. بدون تداخل ساختاری با پایگاه مشترک.',
    },
    {
      componentId: 'sync-worker',
      componentNameFa: 'سرویس کارگر پس‌زمینه (Worker BullMQ + Redis)',
      status: 'partially_compatible',
      protocolCompatible: true,
      schemaCompatible: true,
      capabilitiesSupported: ['queue_metrics:read', 'health_check', 'inventory_ledger:read'],
      capabilitiesMissing: ['private_gateway_auth:v2', 'event_journal_cdc:stream'],
      evidenceNotes: [
        'ورکر روی آدرس لوپ‌بک 127.0.0.1:3010 مستقر است و نیازمند گیت‌وی امن داخلی (WireGuard/mTLS) می‌باشد.',
        'دسترسی مستقیم اینترنتی به ورکر مسدود است که با سیاست Zero Trust مطابقت دارد.',
        'قابلیت CDC زنده هنوز به صورت فید Outbox فعال نشده و به polling وابستگی دارد.',
      ],
      gapReport: 'وابستگی برطرف‌نشده سمت فروشگاه: استقرار Private Gateway امن به ورکر و اضافه کردن لاگ CDC به مانگو.',
    },
  ],
  gapAnalysisList: [
    {
      area: 'اتصال خصوصی ورکر',
      gapDescription: 'سرویس sync-worker روی 127.0.0.1:3010 قرار دارد و باید از طریق Private Gateway دسترسی داده شود.',
      severity: 'HIGH',
      requiredAction: 'پیکربندی تونل WireGuard یا پروکسی معکوس Nginx با تایید هویت mTLS.',
    },
    {
      area: 'مکانیزم CDC پایدار',
      gapDescription: 'عدم وجود ترافیک مداوم تریگر تغییرات پایگاه داده مانگوس (Outbox Pattern/Change Streams).',
      severity: 'MEDIUM',
      requiredAction: 'فعال‌سازی کالکشن Outbox درون MongoDB جهت ثبت تغییرات اتمیک با مدل تراکنش.',
    },
    {
      area: 'فرمان‌های مستقیم انبار',
      gapDescription: 'سامانه AI طبق سیاست امنیتی مجاز به نوشتن مستقیم روی لجر موجودی یا پایگاه داده نیست.',
      severity: 'CRITICAL',
      requiredAction: 'حفظ ممنوعیت مطلق نوشتن مستقیم؛ کلیه اصلاحات باید با تایید انسانی و از طریق APIهای امضاشده انجام گیرد.',
    },
  ],
};

export const ZERO_TRUST_MACHINE_IDENTITIES: ZeroTrustIdentity[] = [
  {
    machineId: 'm2m-ghlbedovom-01',
    componentId: 'ghlbedovom-site',
    clientId: 'sec_client_ghlbedovom_8421',
    authMethod: 'asymmetric_jwt_rs256',
    tlsVersion: 'TLS 1.3',
    certificateFingerprint: 'SHA256:4a:89:1f:90:3d:e2:bc:88:12:34:56:78:90:ab:cd:ef',
    tokenExpiresInSec: 900,
    scopes: ['catalog.read', 'orders.read', 'events.consume'],
    assignedStorefrontScope: 'ghlbedovom',
    isRevoked: false,
    rateLimitPerMin: 600,
    allowedIpOrSubnet: '10.240.0.14/32',
  },
  {
    machineId: 'm2m-sarayehamid-01',
    componentId: 'saraye-hamid-site',
    clientId: 'sec_client_sarayehamid_9921',
    authMethod: 'asymmetric_jwt_rs256',
    tlsVersion: 'TLS 1.3',
    certificateFingerprint: 'SHA256:7b:11:c3:22:90:4a:d5:67:89:01:23:45:67:89:ab:cd',
    tokenExpiresInSec: 900,
    scopes: ['catalog.read', 'orders.read', 'events.consume'],
    assignedStorefrontScope: 'saraye_hamid',
    isRevoked: false,
    rateLimitPerMin: 600,
    allowedIpOrSubnet: '10.240.0.18/32',
  },
  {
    machineId: 'm2m-syncworker-01',
    componentId: 'sync-worker',
    clientId: 'sec_client_syncworker_3310',
    authMethod: 'mTLS',
    tlsVersion: 'TLS 1.3',
    certificateFingerprint: 'SHA256:ee:55:12:99:88:77:66:55:44:33:22:11:00:ff:ee:dd',
    tokenExpiresInSec: 300,
    scopes: ['metrics.read', 'ledger.read', 'jobs.status'],
    assignedStorefrontScope: 'shared_worker',
    isRevoked: false,
    rateLimitPerMin: 1200,
    allowedIpOrSubnet: '10.240.10.0/24',
  },
];

export const SECURITY_AUDIT_TRAIL: SecurityAuditEvent[] = [
  {
    id: 'sec-log-901',
    timestamp: '1403/07/21 12:44:02',
    eventType: 'TOKEN_VALIDATION',
    sourceComponent: 'ghlbedovom-site',
    severity: 'INFO',
    details: 'توکن نامتقارن RS256 با شناسه اعتباری m2m-ghlbedovom-01 و اسکپ orders.read با موفقیت تایید شد.',
    clientIp: '10.240.0.14',
    correlationId: 'req-corr-77192',
    outcome: 'ACCEPTED',
  },
  {
    id: 'sec-log-902',
    timestamp: '1403/07/21 12:43:18',
    eventType: 'REPLAY_PREVENTED',
    sourceComponent: 'external_untrusted',
    severity: 'WARNING',
    details: 'تلاش برای ارسال مجدد نانس (Nonce) قدیمی رخداد وب‌هوک سفارش شناسایی و فوراً مسدود شد.',
    clientIp: '198.51.100.44',
    correlationId: 'req-corr-99381',
    outcome: 'REJECTED',
  },
  {
    id: 'sec-log-903',
    timestamp: '1403/07/21 12:40:55',
    eventType: 'SSRF_BLOCKED',
    sourceComponent: 'inbound_request',
    severity: 'CRITICAL',
    details: 'تلاش برای فراخوانی آدرس غیرمجاز 169.254.169.254 (Cloud Metadata) با فایروال ضد SSRF خنثی گردید.',
    clientIp: '10.240.0.99',
    correlationId: 'req-corr-11029',
    outcome: 'REJECTED',
  },
  {
    id: 'sec-log-904',
    timestamp: '1403/07/21 12:35:10',
    eventType: 'WEBHOOK_SIGNATURE_VERIFIED',
    sourceComponent: 'saraye-hamid-site',
    severity: 'INFO',
    details: 'امضای HMAC-SHA256 بدنه خام وب‌هوک تغییر موجودی با کلید چرخشی جاری تایید شد.',
    clientIp: '10.240.0.18',
    correlationId: 'req-corr-44910',
    outcome: 'ACCEPTED',
  },
];

export const COMPONENT_CONNECTION_STATUSES: ComponentConnectionStatus[] = [
  {
    componentId: 'ghlbedovom-site',
    displayNameFa: 'فروشگاه قلب دوم',
    endpointUrl: 'https://api.ghlbedovom.internal/v1/integration',
    connectionState: 'syncing',
    reachability: true,
    tlsValid: true,
    authValid: true,
    manifestValid: true,
    ecosystemIdMatches: true,
    protocolCompatible: true,
    circuitBreakerState: 'CLOSED',
    lastPingMs: 14,
    lastCheckedAt: 'همین الان (پایدار)',
    diagnosticMsg: 'ارتباط فعال است. نرخ تاخیر ۱4 میلی‌ثانیه و فید سفارشات پایدار است.',
    isLoopbackProtected: false,
  },
  {
    componentId: 'saraye-hamid-site',
    displayNameFa: 'فروشگاه سرای حمید',
    endpointUrl: 'https://api.sarayehamid.internal/v1/integration',
    connectionState: 'syncing',
    reachability: true,
    tlsValid: true,
    authValid: true,
    manifestValid: true,
    ecosystemIdMatches: true,
    protocolCompatible: true,
    circuitBreakerState: 'CLOSED',
    lastPingMs: 18,
    lastCheckedAt: 'همین الان (پایدار)',
    diagnosticMsg: 'ارتباط فعال است. صف رخدادهای کاتالوگ و مشتریان متصل است.',
    isLoopbackProtected: false,
  },
  {
    componentId: 'sync-worker',
    displayNameFa: 'کارگر پس‌زمینه (Worker)',
    endpointUrl: 'http://127.0.0.1:3010/worker/metrics',
    connectionState: 'partially_compatible',
    reachability: true,
    tlsValid: false, // Protected via internal private tunnel
    authValid: true,
    manifestValid: true,
    ecosystemIdMatches: true,
    protocolCompatible: true,
    circuitBreakerState: 'HALF_OPEN',
    lastPingMs: 3,
    lastCheckedAt: '۱ دقیقه قبل',
    diagnosticMsg: 'آدرس لوپ‌بک 127.0.0.1 با موفقیت از طریق تونل خصوصی داخلی متصل است؛ توصیه می‌شود mTLS روی گیت‌وی فعال گردد.',
    isLoopbackProtected: true,
  },
];

export const CANONICAL_SCHEMA_MAPPINGS: SchemaMappingRule[] = [
  {
    id: 'map-rule-01',
    sourceCollection: 'products',
    sourceField: '_id',
    targetCanonicalEntity: 'Product',
    targetCanonicalField: 'id',
    transformation: 'OBJECT_ID_TO_STRING',
    confidenceScore: 0.99,
    approvalStatus: 'APPROVED',
    approvedBy: 'مدیر ارشد داده',
    driftDetected: false,
    sourceLineage: 'MongoDB -> shared_db.products._id',
  },
  {
    id: 'map-rule-02',
    sourceCollection: 'products',
    sourceField: 'variants[].price',
    targetCanonicalEntity: 'ProductVariant',
    targetCanonicalField: 'priceToman',
    transformation: 'RIAL_TO_TOMAN',
    confidenceScore: 0.98,
    approvalStatus: 'APPROVED',
    approvedBy: 'مدیر ارشد داده',
    driftDetected: false,
    sourceLineage: 'Mongoose schema: ProductSchema.variants -> unnested to Canonical ProductVariant',
  },
  {
    id: 'map-rule-03',
    sourceCollection: 'orders',
    sourceField: 'createdAt',
    targetCanonicalEntity: 'Order',
    targetCanonicalField: 'orderTimestamp',
    transformation: 'TIMESTAMP_ISO',
    confidenceScore: 1.0,
    approvalStatus: 'APPROVED',
    approvedBy: 'سیستم خودکار تطبیق',
    driftDetected: false,
    sourceLineage: 'MongoDB -> orders.createdAt',
  },
  {
    id: 'map-rule-04',
    sourceCollection: 'inventoryledgers',
    sourceField: 'deltaQty',
    targetCanonicalEntity: 'InventoryMovement',
    targetCanonicalField: 'quantityDelta',
    transformation: 'DIRECT',
    confidenceScore: 0.97,
    approvalStatus: 'APPROVED',
    approvedBy: 'مدیر ارشد داده',
    driftDetected: false,
    sourceLineage: 'MongoDB -> inventoryledgers.deltaQty (Atomic Ledger)',
  },
  {
    id: 'map-rule-05',
    sourceCollection: 'orders',
    sourceField: 'storefrontTag',
    targetCanonicalEntity: 'Order',
    targetCanonicalField: 'brandOwnership',
    transformation: 'ENUM_MAP',
    confidenceScore: 0.95,
    approvalStatus: 'APPROVED',
    approvedBy: 'قانون تفکیک داده',
    driftDetected: false,
    sourceLineage: 'MongoDB -> orders.storefrontTag (ghlbedovom / saraye_hamid)',
  },
];

export const INGESTION_CHECKPOINTS: IngestionCheckpoint[] = [
  {
    componentId: 'ghlbedovom-site',
    resourceName: 'orders',
    cursorType: 'mongodb_resume_token',
    lastProcessedCursor: 'token_6702a9b_orders_seq_98124',
    lastSyncTimestamp: '1403/07/21 12:44:30',
    recordsSyncedCount: 42380,
    lagDurationSeconds: 1.2,
    deadLetterCount: 0,
    isIdempotentVerified: true,
  },
  {
    componentId: 'saraye-hamid-site',
    resourceName: 'orders',
    cursorType: 'mongodb_resume_token',
    lastProcessedCursor: 'token_6702a9c_orders_seq_31902',
    lastSyncTimestamp: '1403/07/21 12:44:28',
    recordsSyncedCount: 31902,
    lagDurationSeconds: 1.5,
    deadLetterCount: 0,
    isIdempotentVerified: true,
  },
  {
    componentId: 'sync-worker',
    resourceName: 'inventory_ledger',
    cursorType: 'sequence_id',
    lastProcessedCursor: 'ledger_seq_884912',
    lastSyncTimestamp: '1403/07/21 12:44:45',
    recordsSyncedCount: 148200,
    lagDurationSeconds: 0.8,
    deadLetterCount: 0,
    isIdempotentVerified: true,
  },
];

export const DEDUPLICATION_AUDIT_PROOFS: DeduplicationProof[] = [
  {
    canonicalEntityId: 'canon-ord-90182',
    entityType: 'Order',
    unifiedRecordId: 'ORD-GH-2024-9912',
    observedViaComponents: ['ghlbedovom-site', 'sync-worker'],
    canonicalSource: 'ghlbedovom-site (منبع اصلی برند)',
    amountToman: 1850000,
    reconciliationStatus: 'RECONCILED_NO_DUPLICATE',
  },
  {
    canonicalEntityId: 'canon-pay-88123',
    entityType: 'Payment',
    unifiedRecordId: 'PAY-TRX-88123',
    observedViaComponents: ['saraye-hamid-site', 'sync-worker', 'zarinpal_gateway'],
    canonicalSource: 'saraye-hamid-site (تراکنش زرین‌پال)',
    amountToman: 3200000,
    reconciliationStatus: 'RECONCILED_NO_DUPLICATE',
  },
  {
    canonicalEntityId: 'canon-inv-77102',
    entityType: 'InventoryMovement',
    unifiedRecordId: 'LEDGER-MOV-77102',
    observedViaComponents: ['sync-worker', 'digikala_sync'],
    canonicalSource: 'sync-worker (کسر موجودی قطعی لجر)',
    amountToman: 0,
    reconciliationStatus: 'RECONCILED_NO_DUPLICATE',
  },
];

export const KNOWLEDGE_GRAPH_NODES: EcosystemKnowledgeGraphNode[] = [
  { id: 'node-eco', label: 'اکوسیستم یکپارچه فروشگاهی', category: 'Ecosystem', status: 'ACTIVE' },
  { id: 'node-ghlbedovom', label: 'ghlbedovom-site (برند اول)', category: 'Storefront', brandScope: 'ghlbedovom' },
  { id: 'node-sarayehamid', label: 'saraye-hamid-site (برند دوم)', category: 'Storefront', brandScope: 'saraye_hamid' },
  { id: 'node-syncworker', label: 'sync-worker (موتور هماهنگی)', category: 'WorkerHandler', brandScope: 'shared' },
  { id: 'node-mongo', label: 'پایگاه مشترک MongoDB Mongoose', category: 'Collection', brandScope: 'shared' },
  { id: 'node-ledger', label: 'لجر اتمیک موجودی (inventoryledgers)', category: 'Collection', brandScope: 'shared' },
  { id: 'node-queue-crit', label: 'صف بحرانی (critical queue)', category: 'Queue', brandScope: 'shared' },
  { id: 'node-digikala', label: 'مارکت‌پلیس دیجی‌کالا', category: 'Marketplace', brandScope: 'external' },
  { id: 'node-holoo', label: 'نرم‌افزار حسابداری هلو', category: 'Marketplace', brandScope: 'external' },
];

export const KNOWLEDGE_GRAPH_EDGES: EcosystemKnowledgeGraphEdge[] = [
  { id: 'edge-1', source: 'node-ghlbedovom', target: 'node-mongo', relationship: 'reads', evidence: 'فراخوانی کاتالوگ محصولات با Product.find()', confidence: 1.0, discoverySource: 'Mongoose AST Analysis' },
  { id: 'edge-2', source: 'node-sarayehamid', target: 'node-mongo', relationship: 'reads', evidence: 'فراخوانی محصولات سرای حمید با فیلتر برند', confidence: 1.0, discoverySource: 'Mongoose AST Analysis' },
  { id: 'edge-3', source: 'node-ghlbedovom', target: 'node-queue-crit', relationship: 'enqueues', evidence: 'ارسال جاب قفل موجودی هنگام تکمیل خرید', confidence: 0.99, discoverySource: 'BullMQ Producer Code' },
  { id: 'edge-4', source: 'node-sarayehamid', target: 'node-queue-crit', relationship: 'enqueues', evidence: 'ارسال جاب قفل موجودی هنگام تسویه‌حساب', confidence: 0.99, discoverySource: 'BullMQ Producer Code' },
  { id: 'edge-5', source: 'node-syncworker', target: 'node-queue-crit', relationship: 'processes', evidence: 'پردازش بلادرنگ جاب و اجرای تراکنش کسر از لجر', confidence: 1.0, discoverySource: 'Worker BullMQ Consumer' },
  { id: 'edge-6', source: 'node-syncworker', target: 'node-ledger', relationship: 'writes', evidence: 'ثبت رکورد افزایشی/کاهشی با deltaQty در لجر', confidence: 1.0, discoverySource: 'Ledger Repository Code' },
  { id: 'edge-7', source: 'node-syncworker', target: 'node-digikala', relationship: 'synchronizes', evidence: 'ارسال موجودی باقی‌مانده واقعی به وب‌سرویس دیجی‌کالا', confidence: 0.98, discoverySource: 'Digikala Connector API' },
  { id: 'edge-8', source: 'node-syncworker', target: 'node-holoo', relationship: 'synchronizes', evidence: 'همگام‌سازی فاکتور و اسناد مالی با API هلو', confidence: 0.95, discoverySource: 'Holoo Sync Service' },
];

export const CONTROLLED_COMMAND_PROPOSALS: ControlledCommandProposal[] = [
  {
    id: 'cmd-prop-101',
    commandType: 'REQUEST_VALIDATION',
    targetComponent: 'all',
    targetResource: 'integration_manifest',
    riskLevel: 'LOW_READONLY',
    humanApprovalRequired: false,
    approvalStatus: 'APPROVED',
    approvedBy: 'سیاست خودکار خواندنی',
    idempotencyKey: 'idemp_val_req_9921',
    correlationId: 'corr_cmd_101',
    expiresAt: '1403/07/21 14:00:00',
    executionStatus: 'EXECUTED_SUCCESS',
    receiptProof: 'رسید استعلام: مانیفست هر ۳ مؤلفه بدون تغییر و معتبر دریافت شد.',
  },
  {
    id: 'cmd-prop-102',
    commandType: 'RECONCILIATION_PREVIEW',
    targetComponent: 'sync-worker',
    targetResource: 'inventory_ledger_reconciliation',
    riskLevel: 'MEDIUM_METADATA',
    humanApprovalRequired: true,
    approvalStatus: 'PENDING_REVIEW',
    idempotencyKey: 'idemp_rec_prev_8812',
    correlationId: 'corr_cmd_102',
    expiresAt: '1403/07/21 16:00:00',
    executionStatus: 'SUBMITTED',
    receiptProof: 'پیش‌نمایش آماده است و منتظر تایید ناظر برای شبیه‌سازی مغایرت‌های SKU-401.',
  },
  {
    id: 'cmd-prop-103',
    commandType: 'DIRECT_INVENTORY_WRITE_PROHIBITED',
    targetComponent: 'sync-worker',
    targetResource: 'inventoryledgers',
    riskLevel: 'HIGH_MODIFICATION_BLOCKED',
    humanApprovalRequired: true,
    approvalStatus: 'AUTO_BLOCKED_POLICY',
    idempotencyKey: 'idemp_blocked_attempt_001',
    correlationId: 'corr_cmd_103',
    expiresAt: 'منقضی شده',
    executionStatus: 'REJECTED_BY_POLICY',
    prohibitionNotice: 'سیاست Zero Trust و ایمنی داده‌ها: سامانه هوش مصنوعی هرگز مجاز به نوشتن مستقیم روی لجر موجودی، اصلاح سفارشات یا پایگاه داده نیست.',
  },
];
