export type UserRole = 'admin' | 'analyst' | 'platform_engineer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  lastLogin: string;
  tenantId?: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface DailySaleRecord {
  date: string;
  actualSales: number;
  predictedSales: number;
  upperBound: number;
  lowerBound: number;
  ordersCount: number;
  averageOrderValue: number;
  isForecast?: boolean;
}

export type ForecastHorizon = 7 | 14 | 30;
export type ForecastModelType = 'seasonal_naive' | 'linear_regression' | 'random_forest' | 'xgboost';

export interface ModelMetricComparison {
  id: string;
  name: string;
  type: string;
  mae: number;
  rmse: number;
  wape: number;
  r2: number;
  trainingTimeSec: number;
  inferenceLatencyMs: number;
  status: 'production' | 'candidate' | 'archived';
  version: string;
  featuresUsed: number;
}

export interface CustomerRfm {
  customerId: string;
  customerName: string;
  recencyDays: number;
  frequencyOrders: number;
  monetaryValue: number;
  rfmScore: string;
  segment: string;
  repeatProbability: number;
  churnRisk: 'low' | 'medium' | 'high';
  lastOrderDate: string;
}

export interface ClusterSummary {
  clusterId: number;
  clusterName: string;
  customerCount: number;
  percentage: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  color: string;
  description: string;
  marketingAction: string;
}

export interface RepeatPurchaseMetric {
  modelName: string;
  rocAuc: number;
  prAuc: number;
  precision: number;
  recall: number;
  f1Score: number;
  brierScore: number;
  accuracy: number;
}

export interface ShapFeatureImportance {
  feature: string;
  faLabel: string;
  importance: number;
  meanAbsShap: number;
  correlation: 'positive' | 'negative';
  description: string;
}

export interface MLflowRun {
  runId: string;
  experimentName: string;
  modelType: string;
  timestamp: string;
  duration: string;
  hyperparameters: Record<string, string | number>;
  metrics: {
    wape: number;
    rmse: number;
    mae: number;
    r2?: number;
    rocAuc?: number;
  };
  artifacts: string[];
  status: 'FINISHED' | 'RUNNING' | 'FAILED';
  version: string;
  isProduction: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
  tenantId?: string;
}

export interface DataQualityReport {
  totalRows: number;
  totalColumns: number;
  validRows: number;
  canceledOrdersCount: number;
  missingCustomerIds: number;
  negativePricesFixed: number;
  dateRange: { start: string; end: string };
  uniqueCustomers: number;
  uniqueProducts: number;
  missingValuesPct: number;
  schemaValid: boolean;
}

/* =========================================================================
   ENTERPRISE EXTENSIONS (PHASE 0 TO 14)
   ========================================================================= */

// Decision Intelligence Engine & Decision Center
export interface RecommendationItem {
  id: string;
  title: string;
  category: 'inventory' | 'demand' | 'churn' | 'promotion' | 'pricing';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  confidencePct: number; // 0 - 100
  evidenceSource: string;
  modelReference: string;
  expectedImpact: string;
  suggestedAction: string;
  riskAssessment: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  createdAt: string;
  approvedBy?: string;
}

// Enterprise Integration Connectors (WooCommerce, Shopify, Digikala, ERP, etc.)
export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'ecommerce' | 'erp' | 'crm' | 'marketplace' | 'webhook';
  provider: 'woocommerce' | 'shopify' | 'digikala' | 'sepidar_erp' | 'custom_webhook';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSyncAt: string;
  recordsSynced: number;
  endpointUrl: string;
  authMethod: 'OAuth 2.0' | 'API Key / Secret' | 'HMAC Signature';
  healthScore: number; // 0 - 100
  syncIntervalMin: number;
  rateLimitUsage: string;
}

export interface SyncLog {
  id: string;
  connectorId: string;
  connectorName: string;
  timestamp: string;
  operation: 'PULL_ORDERS' | 'SYNC_INVENTORY' | 'PUSH_FORECAST' | 'WEBHOOK_EVENT';
  recordsProcessed: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  durationMs: number;
  message: string;
}

// Intelligent AI Copilot / Assistant
export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  toolCalls?: Array<{
    toolName: string;
    args: Record<string, any>;
    resultSummary: string;
  }>;
  dataReferences?: Array<{
    title: string;
    value: string;
    linkToTab?: string;
  }>;
}

// Autonomous MLOps & Drift Monitoring
export interface DriftMetric {
  featureName: string;
  faLabel: string;
  driftType: 'data_drift' | 'concept_drift';
  psiScore: number; // Population Stability Index
  ksPValue: number; // Kolmogorov-Smirnov p-value
  status: 'stable' | 'warning' | 'drift_detected';
  baselineMean: number;
  currentMean: number;
  threshold: number;
}

export interface CanaryDeployment {
  modelId: string;
  version: string;
  trafficPercentage: number;
  challengerWape: number;
  championWape: number;
  errorBudgetRemaining: number;
  canaryHealth: 'HEALTHY' | 'DEGRADED' | 'ROLLING_BACK';
}

// Event-Driven Automation & Outbox
export interface PlatformEvent {
  id: string;
  eventType: 'order.created' | 'anomaly.detected' | 'model.promoted' | 'drift.detected' | 'inventory.low' | 'integration.sync_failed';
  sourceModule: string;
  payloadSummary: string;
  timestamp: string;
  status: 'PROCESSED' | 'PENDING' | 'RETRYING' | 'DEAD_LETTER';
  retryCount: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  condition: string;
  action: string;
  isEnabled: boolean;
  executionsCount: number;
  lastFired: string;
}

// Observability, SLOs & Telemetry
export interface ServiceSLO {
  serviceName: string;
  sloName: string;
  targetObjective: number; // e.g. 99.9%
  currentValue: number;
  errorBudgetRemainingPct: number;
  status: 'MET' | 'AT_RISK' | 'BREACHED';
  p95LatencyMs: number;
  p99LatencyMs: number;
}

// Multi-Tenancy & Organizations
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'enterprise' | 'growth' | 'business';
  region: string;
  activeUsers: number;
  ordersVolume: number;
  status: 'active' | 'suspended';
  dbSchema: string;
}

// Phase 0 System Discovery & Technical Debt
export interface AuditFinding {
  id: string;
  domain: 'architecture' | 'performance' | 'security' | 'ml_ops' | 'testing';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  resolutionPath: string;
  status: 'AUDITED' | 'MITIGATED' | 'VERIFIED';
}

/* =========================================================================
   UNIVERSAL AI INTEGRATION & DATA INTELLIGENCE PLATFORM TYPES
   ========================================================================= */

export type DataSourceCategory =
  | 'database'
  | 'ecommerce'
  | 'rest_api'
  | 'graphql'
  | 'erp_crm'
  | 'file'
  | 'event_stream';

export type IntegrationLevel = 'level_1' | 'level_2' | 'level_3';

export interface IntegrationProviderInfo {
  id: string;
  name: string;
  category: DataSourceCategory;
  level: IntegrationLevel;
  description: string;
  authTypes: string[];
  supportedEntities: string[];
  isAvailable: boolean;
  version: string;
}

export interface CanonicalFieldDefinition {
  name: string;
  entity: 'order' | 'customer' | 'product' | 'inventory' | 'payment';
  type: 'string' | 'number' | 'datetime' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  faTitle: string;
}

export interface FieldMappingRule {
  id: string;
  sourceField: string;
  canonicalField: string;
  transformation: 'direct' | 'date_utc' | 'to_number' | 'uppercase' | 'toman_to_rial' | 'json_path' | 'lookup';
  confidencePct: number;
  isConfirmed: boolean;
  sampleSourceValue: string;
  sampleOutputValue: string;
  evidence: string;
}

export interface DatabaseTableSchema {
  tableName: string;
  columnsCount: number;
  estimatedRows: number;
  primaryKey: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    isPk?: boolean;
    isFk?: boolean;
  }>;
}

export interface OpenApiAnalysisResult {
  specTitle: string;
  apiVersion: string;
  detectedEndpoints: Array<{
    method: string;
    path: string;
    entityDetected: string;
    paginationType: string;
    confidence: number;
  }>;
  generatedManifestYaml: string;
}

export interface UniversalDataQualityMetric {
  sourceSystem: string;
  category: string;
  totalRecords: number;
  cleanRecords: number;
  quarantinedCount: number;
  duplicatesResolved: number;
  currencyNormalized: number;
  healthScore: number;
  lastEvaluated: string;
}

/* =========================================================================
   ENTERPRISE AI SAAS 2.0 — COMMERCIALIZATION, DEEP LEARNING & DEEPSEEK TYPES
   ========================================================================= */

export type SubscriptionTier = 'starter' | 'professional' | 'business' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  nameFa: string;
  pricePerMonthToman: number;
  pricePerYearToman: number;
  description: string;
  maxConnectors: number;
  maxSyncedRecordsPerMonth: number;
  maxApiRequestsPerMonth: number;
  maxTrainingJobsPerMonth: number;
  maxAiTokensPerMonth: number;
  storageGb: number;
  supportSla: string;
  features: string[];
  isPopular?: boolean;
}

export interface TenantSubscriptionState {
  tenantId: string;
  planId: SubscriptionTier;
  status: 'active' | 'trialing' | 'grace_period' | 'past_due' | 'canceled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: string;
  billingEmail: string;
  autoRenew: boolean;
}

export interface UsageQuotaMeter {
  metricName: string;
  metricLabelFa: string;
  currentUsage: number;
  quotaLimit: number;
  unit: string;
  percentageUsed: number;
  isOverQuota: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  amountToman: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  periodStart: string;
  periodEnd: string;
  issuedAt: string;
  paidAt?: string;
  paymentGateway: 'mock_gateway' | 'zarinpal' | 'saman_bank' | 'stripe';
  receiptUrl?: string;
}

// DeepSeek AI Debugging & Self-Diagnostics
export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentSource = 'frontend' | 'fastapi_backend' | 'postgres' | 'redis_celery' | 'connector' | 'ml_training';

export interface SanitizedIncident {
  id: string;
  traceId: string;
  title: string;
  errorType: string;
  source: IncidentSource;
  severity: IncidentSeverity;
  timestamp: string;
  sanitizedStackTrace: string;
  redactedSensitiveFields: string[];
  correlationCount: number;
  affectedTenant: string;
  environment: 'production' | 'staging';
  status: 'OPEN' | 'ANALYZING' | 'PATCH_PROPOSED' | 'APPROVED' | 'VERIFIED' | 'RESOLVED';
}

export interface DeepSeekDiagnosticReport {
  incidentId: string;
  modelUsed: string;
  analyzedAt: string;
  rootCauseSummary: string;
  probableCauses: Array<{
    cause: string;
    probabilityPct: number;
    technicalDetail: string;
  }>;
  impactAnalysis: string;
  suggestedPatch: {
    fileTarget: string;
    unifiedDiff: string;
    explanation: string;
    riskScore: number; // 1 to 10
  };
  regressionTestCase: {
    language: 'python' | 'typescript';
    framework: 'pytest' | 'vitest';
    testName: string;
    testCode: string;
  };
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    costEstimateToman: number;
  };
}

export interface SandboxVerificationResult {
  runId: string;
  patchApplied: boolean;
  testPassed: boolean;
  executionDurationMs: number;
  stdoutLog: string[];
  humanApprover?: string;
  verifiedAt: string;
}

// Advanced Deep Learning Models & Time Series Forecasters
export type DeepLearningArchitecture = 'LSTM' | 'GRU' | 'TCN' | 'N_BEATS' | 'N_HITS' | 'TFT';

export interface DeepLearningConfig {
  modelType: DeepLearningArchitecture;
  inputWindowSize: number; // e.g. 30 days
  forecastHorizon: number; // e.g. 7 or 14 days
  hiddenUnits: number;
  numLayers: number;
  dropout: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
  device: 'cpu' | 'cuda';
  earlyStoppingPatience: number;
}

export interface DeepLearningTrainingRun {
  id: string;
  modelType: DeepLearningArchitecture;
  currentEpoch: number;
  totalEpochs: number;
  trainLossHistory: number[];
  valLossHistory: number[];
  bestValLoss: number;
  wape: number;
  rmse: number;
  mase: number;
  inferenceLatencyMs: number;
  memoryUsageMb: number;
  trainingDurationSec: number;
  status: 'IDLE' | 'TRAINING' | 'COMPLETED' | 'EARLY_STOPPED';
}

export interface ModelRecommendationVerdict {
  recommendedModel: string;
  reason: string;
  compositeScore: number; // 0-100
  accuracyVsCostRatio: string;
  tradeoffs: {
    accuracy: string;
    latency: string;
    computeCost: string;
    explainability: string;
  };
}

// Data Quality & Feature Engineering
export interface FeatureScalingConfig {
  method: 'StandardScaler' | 'MinMaxScaler' | 'RobustScaler' | 'QuantileTransformer';
  targetColumns: string[];
  fittedMean?: Record<string, number>;
  fittedScale?: Record<string, number>;
  handlingOutliers: 'clip' | 'robust_iqr' | 'drop';
}

export interface QuarantinedDataRecord {
  id: string;
  sourceSystem: string;
  entityType: 'order' | 'customer' | 'transaction';
  rawRecord: Record<string, any>;
  failureReason: string;
  violationSeverity: 'CRITICAL' | 'WARNING';
  aiSuggestedFix: Record<string, any>;
  receivedAt: string;
  status: 'QUARANTINED' | 'CORRECTED' | 'DISCARDED';
}

// Automated Testing Center
export interface TestSuiteRegistryItem {
  id: string;
  name: string;
  category: 'unit' | 'integration' | 'e2e' | 'load' | 'ml_pipeline' | 'tenant_isolation' | 'billing_lifecycle';
  framework: 'pytest' | 'vitest' | 'playwright' | 'k6';
  totalTests: number;
  passCount: number;
  failCount: number;
  durationMs: number;
  lastRun: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
}

export interface QualityGateMetrics {
  totalCoveragePct: number;
  criticalDefectsOpen: number;
  tenantIsolationValidated: boolean;
  billingReconciliationValidated: boolean;
  p95PerformanceBudgetMet: boolean;
  releaseGateVerdict: 'APPROVED' | 'BLOCKED';
}

// Commercial Super Admin & Business Intelligence
export interface CommercialSaaSKpis {
  mrrToman: number;
  arrToman: number;
  activeTenantsCount: number;
  payingTenantsCount: number;
  trialTenantsCount: number;
  churnRatePct: number;
  customerLifetimeValueToman: number;
  aiInfraCostPerTenantToman: number;
  grossMarginPct: number;
  conversionRatePct: number;
}

/* =========================================================================
   STORE DISCOVERY, MONGODB INTELLIGENCE & STORE KNOWLEDGE GRAPH TYPES
   ========================================================================= */

export type StoreSourceType =
  | 'nextjs_node_mongodb'
  | 'postgresql_enterprise'
  | 'mysql_ecommerce'
  | 'woocommerce_wordpress'
  | 'custom_api_store';

export type StoreDbEngine = 'mongodb' | 'postgresql' | 'mysql' | 'mariadb' | 'sqlite';

export interface StoreConnectionProfile {
  id: string;
  name: string;
  storeUrl: string;
  sourceType: StoreSourceType;
  databaseEngine: StoreDbEngine;
  authMethod: 'read_only_uri' | 'api_key' | 'ssh_tunnel' | 'repo_inspection';
  status: 'CONNECTED' | 'DISCOVERING' | 'LEARNED' | 'SYNCING' | 'ERROR';
  isReadOnlyConfirmed: boolean;
  discoveredAt: string;
  lastSyncAt: string;
  readOnlyConnectionString?: string;
  collectionsCount: number;
  totalRecordsCount: number;
}

export interface TechnologyDetectionResult {
  storeId: string;
  frontendFramework: string;
  backendFramework: string;
  databaseDriver: string;
  authMechanism: string;
  cachingSystem: string;
  queueSystem: string;
  confidenceScore: number;
  detectedModules: Array<{
    name: string;
    path: string;
    purpose: string;
    evidence: string;
  }>;
}

export interface DiscoveredCollectionField {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isReference?: boolean;
  refCollection?: string;
  isNullable: boolean;
  sampleValue: string;
  isNestedDocument?: boolean;
}

export interface DiscoveredCollectionSchema {
  name: string;
  documentCountEstimate: number;
  avgDocumentSizeBytes: number;
  primaryKeyField: string;
  fields: DiscoveredCollectionField[];
  indexes: Array<{ name: string; keys: string; unique: boolean }>;
  nestedDocumentsDetected: boolean;
  inconsistenciesDetected: string[];
  canonicalEntityMatch?: string;
  confidencePct: number;
}

export interface BusinessEntityDefinition {
  entityType: 'Product' | 'Customer' | 'Order' | 'OrderItem' | 'Inventory' | 'Payment' | 'Discount' | 'Shipment';
  nameFa: string;
  matchedCollection: string;
  confidencePct: number;
  isConfirmed: boolean;
  keyFields: Record<string, string>;
  relationships: Array<{
    targetEntity: string;
    relationType: '1:1' | '1:N' | 'N:M';
    foreignKey: string;
    confidence: number;
    isVerified: boolean;
  }>;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: 'route' | 'service' | 'collection' | 'entity' | 'workflow';
  details: string;
  confidence: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  confidence: number;
  verified: boolean;
}

export interface StoreKnowledgeGraphData {
  version: string;
  generatedAt: string;
  storeName: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  stateMachines: Array<{
    workflowName: string;
    states: string[];
    transitions: Array<{ from: string; to: string; trigger: string }>;
  }>;
}

export interface StoreAiArchitectMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Array<{ title: string; source: string; snippet?: string }>;
  architectureDiagram?: string;
}

/* =========================================================================
   UNIFIED COMMERCE ECOSYSTEM COMPATIBILITY ENGINE TYPES
   (ghlbedovom-site + saraye-hamid-site + sync-worker + Shared MongoDB)
   ========================================================================= */

export type EcosystemComponentId = 'ghlbedovom-site' | 'saraye-hamid-site' | 'sync-worker';
export type BrandStorefrontId = 'ghlbedovom' | 'saraye-hamid';

export interface EcosystemComponentInfo {
  id: EcosystemComponentId;
  name: string;
  nameFa: string;
  repoPath: string;
  type: 'storefront' | 'worker';
  brandId?: BrandStorefrontId;
  framework: string;
  status: 'HEALTHY' | 'SYNCING' | 'DEGRADED' | 'DISCONNECTED';
  lastPingMs: number;
  activeVersion: string;
  gitCommit: string;
  gitBranch: string;
  activePort: number;
  openEndPointsCount: number;
}

export interface UnifiedEcosystemProfile {
  ecosystemId: string;
  displayName: string;
  sharedDatabaseUri: string;
  components: EcosystemComponentInfo[];
  totalOrdersUnified: number;
  ghlbedovomOrders: number;
  sarayeHamidOrders: number;
  syncWorkerActiveJobs: number;
  lastSynchronizedAt: string;
  healthScore: number;
}

export type OwnershipScope =
  | 'SHARED'
  | 'GHLBEDOVOM_EXCLUSIVE'
  | 'SARAYE_HAMID_EXCLUSIVE'
  | 'WORKER_EXCLUSIVE'
  | 'MARKETPLACE';

export interface DataOwnershipItem {
  resourceName: string;
  resourceCategory: string;
  ownershipScope: OwnershipScope;
  owningComponent: string;
  collectionName: string;
  discriminatorField: string;
  isolationPolicy: string;
  sharedRationale: string;
}

export interface InventoryLedgerRecord {
  id: string;
  sku: string;
  productTitle: string;
  variantDetail: string;
  brandScope: string;
  physicalStock: number;
  allocatedGhlbedovom: number;
  allocatedSarayeHamid: number;
  digikalaSyncedStock: number;
  discrepancyStatus: 'IN_SYNC' | 'DISCREPANCY_DETECTED' | 'RESERVED_PENDING';
  lastLedgerEvent: string;
  invariantVerified: boolean;
  discrepancyReason?: string;
}

export interface SyncWorkerQueueMetric {
  queueName: 'critical' | 'bulk' | 'ai';
  queueLabelFa: string;
  activeJobs: number;
  waitingJobs: number;
  failedJobs: number;
  delayedJobs: number;
  throughputPerMin: number;
  concurrencyLimit: number;
  priorityLevel: number;
  description: string;
}

export interface MarketplaceSyncItem {
  id: string;
  channel: 'دیجی‌کالا (Digikala)' | 'ترب (Torob)' | 'ایمالز (Emalls)' | 'هلو ERP (Holoo)';
  status: 'HEALTHY' | 'RATE_LIMITED' | 'RETRYING' | 'SYNCED';
  lastSyncTimestamp: string;
  syncedItemsCount: number;
  divergentItemsCount: number;
  latencyMs: number;
  activeMappingCount: number;
  rateLimitUsage: string;
}

export interface CrossRepoDiagnosticCase {
  id: string;
  title: string;
  questionFa: string;
  targetSku?: string;
  tracePath: Array<{
    component: string;
    file: string;
    collection?: string;
    action: string;
  }>;
  rootCause: string;
  evidence: string;
  resolution: string;
  confidenceScore: number;
}

/* =========================================================================
   PHASES 1-11: ENTERPRISE AI PLATFORM UNIFIED COMMERCE INTEGRATION SUITE
   ========================================================================= */

// Phase 1: Compatibility Engine Types
export type CompatibilityStatus = 'compatible' | 'partially_compatible' | 'incompatible' | 'unknown';

export interface CapabilityManifest {
  componentId: string;
  componentType: 'storefront' | 'worker' | 'shared_service';
  protocolVersion: string;
  supportedCapabilities: string[];
  jsonSchemaVersion: string;
  healthEndpoint: string;
  manifestSignature: string;
  discoveredAt: string;
}

export interface ComponentCompatibilityRecord {
  componentId: string;
  componentNameFa: string;
  status: CompatibilityStatus;
  protocolCompatible: boolean;
  schemaCompatible: boolean;
  capabilitiesSupported: string[];
  capabilitiesMissing: string[];
  evidenceNotes: string[];
  gapReport: string;
}

export interface CompatibilityAuditReport {
  ecosystemId: string;
  overallStatus: CompatibilityStatus;
  generatedAt: string;
  components: ComponentCompatibilityRecord[];
  gapAnalysisList: Array<{
    area: string;
    gapDescription: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    requiredAction: string;
  }>;
}

// Phase 2: Zero-Trust Security Types
export interface ZeroTrustIdentity {
  machineId: string;
  componentId: string;
  clientId: string;
  authMethod: 'mTLS' | 'oauth2_client_credentials' | 'asymmetric_jwt_rs256';
  tlsVersion: string;
  certificateFingerprint?: string;
  tokenExpiresInSec: number;
  scopes: string[];
  assignedStorefrontScope: 'ghlbedovom' | 'saraye_hamid' | 'shared_worker' | 'ecosystem_admin';
  isRevoked: boolean;
  rateLimitPerMin: number;
  allowedIpOrSubnet: string;
}

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  eventType: 'TOKEN_VALIDATION' | 'WEBHOOK_SIGNATURE_VERIFIED' | 'REPLAY_PREVENTED' | 'SSRF_BLOCKED' | 'RBAC_DENIAL' | 'EMERGENCY_KILLSWITCH';
  sourceComponent: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
  clientIp: string;
  correlationId: string;
  outcome: 'ACCEPTED' | 'REJECTED' | 'QUARANTINED';
}

// Phase 3: Connector & Health Types
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'authenticated'
  | 'compatible'
  | 'partially_compatible'
  | 'syncing'
  | 'degraded'
  | 'error'
  | 'disabled';

export interface ComponentConnectionStatus {
  componentId: string;
  displayNameFa: string;
  endpointUrl: string;
  connectionState: ConnectionState;
  reachability: boolean;
  tlsValid: boolean;
  authValid: boolean;
  manifestValid: boolean;
  ecosystemIdMatches: boolean;
  protocolCompatible: boolean;
  circuitBreakerState: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
  lastPingMs: number;
  lastCheckedAt: string;
  diagnosticMsg: string;
  isLoopbackProtected: boolean; // e.g. sync-worker on 127.0.0.1 requires secure private gateway
}

// Phase 4: Schema Catalog & Canonical Mapping Types
export interface CanonicalEntityField {
  name: string;
  type: string;
  descriptionFa: string;
  required: boolean;
}

export interface CanonicalEntityDefinition {
  entityType: 'Product' | 'ProductVariant' | 'Category' | 'Customer' | 'Order' | 'OrderItem' | 'Payment' | 'Refund' | 'Inventory' | 'InventoryMovement' | 'Warehouse' | 'MarketplaceMapping' | 'SyncJob';
  entityNameFa: string;
  fields: CanonicalEntityField[];
}

export interface SchemaMappingRule {
  id: string;
  sourceCollection: string;
  sourceField: string;
  targetCanonicalEntity: string;
  targetCanonicalField: string;
  transformation: 'DIRECT' | 'OBJECT_ID_TO_STRING' | 'RIAL_TO_TOMAN' | 'SPLIT_VARIANTS' | 'TIMESTAMP_ISO' | 'ENUM_MAP';
  confidenceScore: number;
  approvalStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
  approvedBy?: string;
  driftDetected: boolean;
  sourceLineage: string;
}

// Phase 5: Ingestion, CDC & Deduplication Types
export interface IngestionCheckpoint {
  componentId: string;
  resourceName: string;
  cursorType: 'timestamp' | 'mongodb_resume_token' | 'sequence_id';
  lastProcessedCursor: string;
  lastSyncTimestamp: string;
  recordsSyncedCount: number;
  lagDurationSeconds: number;
  deadLetterCount: number;
  isIdempotentVerified: boolean;
}

export interface DeduplicationProof {
  canonicalEntityId: string;
  entityType: 'Order' | 'Payment' | 'InventoryMovement';
  unifiedRecordId: string;
  observedViaComponents: string[];
  canonicalSource: string;
  amountToman: number;
  reconciliationStatus: 'RECONCILED_NO_DUPLICATE' | 'DUPLICATE_REJECTED' | 'DISCREPANCY_FLAGGED';
}

// Phase 6: Ecosystem Knowledge Graph Node & Edge
export interface EcosystemKnowledgeGraphNode {
  id: string;
  label: string;
  category: 'Ecosystem' | 'Component' | 'Storefront' | 'API' | 'BusinessEntity' | 'Collection' | 'Queue' | 'WorkerHandler' | 'Marketplace' | 'BusinessWorkflow';
  brandScope?: string;
  status?: string;
}

export interface EcosystemKnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'calls' | 'reads' | 'writes' | 'enqueues' | 'processes' | 'owns' | 'depends_on' | 'references' | 'synchronizes' | 'validates';
  evidence: string;
  confidence: number;
  discoverySource: string;
}

// Phase 10: Controlled Bidirectional Command Protocol
export type CommandRiskLevel = 'LOW_READONLY' | 'MEDIUM_METADATA' | 'HIGH_MODIFICATION_BLOCKED';

export interface ControlledCommandProposal {
  id: string;
  commandType: 'REQUEST_VALIDATION' | 'REFRESH_METADATA' | 'ANALYTICAL_EXPORT' | 'RECONCILIATION_PREVIEW' | 'EMERGENCY_SYNC_PAUSE' | 'DIRECT_INVENTORY_WRITE_PROHIBITED';
  targetComponent: 'ghlbedovom-site' | 'saraye-hamid-site' | 'sync-worker' | 'all';
  targetResource: string;
  riskLevel: CommandRiskLevel;
  humanApprovalRequired: boolean;
  approvalStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'AUTO_BLOCKED_POLICY';
  approvedBy?: string;
  idempotencyKey: string;
  correlationId: string;
  expiresAt: string;
  executionStatus: 'SUBMITTED' | 'DRY_RUN_PASSED' | 'EXECUTED_SUCCESS' | 'REJECTED_BY_POLICY';
  receiptProof?: string;
  prohibitionNotice?: string;
}
