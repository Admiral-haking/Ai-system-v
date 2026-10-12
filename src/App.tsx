import React, { useState, useEffect } from 'react';
import { Sidebar, NavTabId } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { UserRole } from './types';

// Foundational Pages (Phases 1-15)
import { OverviewDashboard } from './pages/OverviewDashboard';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { SalesForecastingPage } from './pages/SalesForecastingPage';
import { CustomerAnalyticsPage } from './pages/CustomerAnalyticsPage';
import { CustomerSegmentationPage } from './pages/CustomerSegmentationPage';
import { RepeatPurchasePage } from './pages/RepeatPurchasePage';
import { ExplainableAiPage } from './pages/ExplainableAiPage';
import { ModelTrainingStudioPage } from './pages/ModelTrainingStudioPage';
import { ModelComparisonPage } from './pages/ModelComparisonPage';
import { ExperimentTrackingPage } from './pages/ExperimentTrackingPage';
import { DatasetManagementPage } from './pages/DatasetManagementPage';
import { ReportCenterPage } from './pages/ReportCenterPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { ThesisDefenseCompanion } from './pages/ThesisDefenseCompanion';
import { LinuxMonorepoHub } from './pages/LinuxMonorepoHub';

// Enterprise Extension Pages (Phase 0 & Next-Generation Upgrades)
import { SystemDiscoveryAuditPage } from './pages/SystemDiscoveryAuditPage';
import { DecisionCenterPage } from './pages/DecisionCenterPage';
import { EnterpriseConnectorsPage } from './pages/EnterpriseConnectorsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AutonomousMlopsPage } from './pages/AutonomousMlopsPage';
import { EventAutomationPage } from './pages/EventAutomationPage';
import { ObservabilityPage } from './pages/ObservabilityPage';
import { MultiTenancyPage } from './pages/MultiTenancyPage';

// Universal Integration & Data Intelligence Pages
import { UniversalIntegrationHubPage } from './pages/UniversalIntegrationHubPage';
import { SmartConnectionWizardPage } from './pages/SmartConnectionWizardPage';
import { VisualFieldMappingPage } from './pages/VisualFieldMappingPage';
import { DatabaseExplorerPage } from './pages/DatabaseExplorerPage';
import { ConnectorSdkGeneratorPage } from './pages/ConnectorSdkGeneratorPage';

// SaaS 2.0 & Commercialization Pages
import { SaaSCommercialCenterPage } from './pages/SaaSCommercialCenterPage';
import { DeepSeekDebugCenterPage } from './pages/DeepSeekDebugCenterPage';
import { DeepLearningStudioPage } from './pages/DeepLearningStudioPage';
import { DataQualityCenterPage } from './pages/DataQualityCenterPage';
import { AutomatedTestingHubPage } from './pages/AutomatedTestingHubPage';
import { SuperAdminControlPage } from './pages/SuperAdminControlPage';
// Store Discovery & Next.js + MongoDB Intelligence Pages
import { StoreDiscoveryCenterPage } from './pages/StoreDiscoveryCenterPage';
import { StoreAiArchitectPage } from './pages/StoreAiArchitectPage';
import { UnifiedEcosystemStudioPage } from './pages/UnifiedEcosystemStudioPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-hq-01');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [wizardProviderId, setWizardProviderId] = useState<string | undefined>();

  // Sync document direction when language toggles
  useEffect(() => {
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.documentElement.lang = isEnglish ? 'en' : 'fa';
  }, [isEnglish]);

  const getPageTitle = (tab: NavTabId): string => {
    switch (tab) {
      case 'overview':
        return 'داشبورد مدیریت کلان هوش مصنوعی';
      case 'decision-center':
        return 'اتاق هوشمندی تصمیم‌گیری و راهبردهای تجاری';
      case 'store-discovery':
        return 'کشف هوشمند ساختار فروشگاه و پایگاه داده (Next.js + MongoDB)';
      case 'store-ai-architect':
        return 'دستیار هوشمند معمار و تحلیلگر دیتابیس فروشگاه (Store AI Architect)';
      case 'unified-ecosystem':
        return 'مرکز مدیریت اکوسیستم یکپارچه ۳ پروژه (ghlbedovom + saraye-hamid + sync-worker)';
      case 'saas-commercial':
        return 'مدیریت اشتراک تجاری و سهمیه‌های مصرفی (SaaS 2.0)';
      case 'super-admin':
        return 'کنترل پنل مدیر ارشد و تحلیل داده‌های محصول (Super Admin)';
      case 'deepseek-debug':
        return 'مرکز عیب‌یابی خودکار و پچ با هوش مصنوعی DeepSeek';
      case 'deep-learning':
        return 'استودیو مدل‌های عمیق سری زمانی (PyTorch Deep Learning)';
      case 'data-quality-center':
        return 'مرکز کیفیت داده، مدیریت قرنطینه و نرمال‌سازی ویژگی‌ها';
      case 'automated-testing':
        return 'پلتفرم آزمون‌های خودکار و دروازه کنترل کیفیت (CI/CD Gates)';
      case 'sales-analytics':
        return 'تحلیل الگوهای فروش و رفتار تقاضا';
      case 'sales-forecast':
        return 'پیش‌بینی هوشمند فروش با الگوریتم‌های سری زمانی';
      case 'customer-analytics':
        return 'تحلیل رفتار مشتریان و ماتریس شاخص‌های RFM';
      case 'customer-segmentation':
        return 'خوشه‌بندی و بخش‌بندی مشتریان (K-Means & DBSCAN)';
      case 'repeat-purchase':
        return 'پیش‌بینی نظارت‌شده احتمال خرید مجدد (افق ۳۰ روزه)';
      case 'explainable-ai':
        return 'توضیح‌پذیری هوش مصنوعی با مقادیر SHAP';
      case 'ai-copilot':
        return 'دستیار هوشمند سازمانی تحلیل و تصمیم‌یاری';
      case 'model-training':
        return 'استودیو آموزش، بهینه‌سازی (Optuna) و صف Celery';
      case 'model-comparison':
        return 'مقایسه علمی و اعتبارسنجی مستقل مدل‌ها';
      case 'experiment-tracking':
        return 'ردیابی آزمایش‌ها و مدیریت نسخه‌ها (MLflow)';
      case 'autonomous-mlops':
        return 'عملیات خودکار یادگیری ماشین و پایش رانش (Canary)';
      case 'universal-integration':
        return 'هاب جامع یکپارچه‌سازی و اتصال انواع سامانه‌ها';
      case 'smart-wizard':
        return 'ویزارد ۵ مرحله‌ای اتصال هوشمند منبع داده';
      case 'visual-mapping':
        return 'موتور تطبیق بصری فیلدها و ترنسفورمیشن داده‌ها';
      case 'database-explorer':
        return 'کاوشگر امن پایگاه داده و استخراج طرحواره';
      case 'connector-generator':
        return 'ژنراتور خودکار کانکتورهای پایتون و Celery';
      case 'enterprise-connectors':
        return 'اکوسیستم اتصالات فروشگاهی و وضعیت همگام‌سازی';
      case 'event-automation':
        return 'اتوماسیون رویدادمحور و جریان Outbox';
      case 'dataset-management':
        return 'مدیریت ورود داده، پاکسازی و گزارش کیفیت (UCI Retail)';
      case 'observability':
        return 'رصدپذیری، معیارهای تله‌متری و اهداف سطح خدمت (SLOs)';
      case 'multi-tenancy':
        return 'چندسازمانی، تفکیک مستاجران و امنیت سطح ردیف (RLS)';
      case 'user-management':
        return 'مدیریت کاربران، دسترسی‌ها و لاگ‌های حسابرسی';
      case 'report-center':
        return 'مرکز گزارش‌گیری علمی، پژوهشی و خروجی‌های چاپی';
      case 'system-discovery':
        return 'ممیزی معماری فاز صفر و نقشه راه ارتقای سازمانی';
      case 'thesis-defense':
        return 'جلسه دفاع پایان‌نامه و اسلایدهای تعاملی';
      case 'linux-monorepo':
        return 'کدها، اسکریپت‌های لینوکس و ساختار Monorepo';
      default:
        return 'سامانه هوشمند پیش‌بینی فروش';
    }
  };

  return (
    <div
      className={`min-h-screen flex ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          activePageTitle={getPageTitle(activeTab)}
          onNavigateToReports={() => setActiveTab('report-center')}
          onNavigateToDecisionCenter={() => setActiveTab('decision-center')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          currentTenantId={currentTenantId}
          onTenantChange={setCurrentTenantId}
          isEnglish={isEnglish}
          onToggleLanguage={() => setIsEnglish(!isEnglish)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <OverviewDashboard onNavigate={setActiveTab} />}
            {activeTab === 'decision-center' && <DecisionCenterPage />}
            {activeTab === 'store-discovery' && <StoreDiscoveryCenterPage />}
            {activeTab === 'store-ai-architect' && <StoreAiArchitectPage />}
            {activeTab === 'unified-ecosystem' && <UnifiedEcosystemStudioPage />}
            {activeTab === 'saas-commercial' && <SaaSCommercialCenterPage />}
            {activeTab === 'super-admin' && <SuperAdminControlPage />}
            {activeTab === 'deepseek-debug' && <DeepSeekDebugCenterPage />}
            {activeTab === 'deep-learning' && <DeepLearningStudioPage />}
            {activeTab === 'data-quality-center' && <DataQualityCenterPage />}
            {activeTab === 'automated-testing' && <AutomatedTestingHubPage />}
            {activeTab === 'sales-analytics' && <SalesAnalyticsPage />}
            {activeTab === 'sales-forecast' && <SalesForecastingPage />}
            {activeTab === 'customer-analytics' && <CustomerAnalyticsPage />}
            {activeTab === 'customer-segmentation' && <CustomerSegmentationPage />}
            {activeTab === 'repeat-purchase' && <RepeatPurchasePage />}
            {activeTab === 'explainable-ai' && <ExplainableAiPage />}
            {activeTab === 'ai-copilot' && <AiAssistantPage />}
            {activeTab === 'model-training' && <ModelTrainingStudioPage />}
            {activeTab === 'model-comparison' && <ModelComparisonPage />}
            {activeTab === 'experiment-tracking' && <ExperimentTrackingPage />}
            {activeTab === 'autonomous-mlops' && <AutonomousMlopsPage />}
            {activeTab === 'universal-integration' && (
              <UniversalIntegrationHubPage
                onNavigateToWizard={(providerId) => {
                  setWizardProviderId(providerId);
                  setActiveTab('smart-wizard');
                }}
                onNavigateToMapping={() => setActiveTab('visual-mapping')}
                onNavigateToGenerator={() => setActiveTab('connector-generator')}
                onNavigateToDbExplorer={() => setActiveTab('database-explorer')}
              />
            )}
            {activeTab === 'smart-wizard' && (
              <SmartConnectionWizardPage
                initialProviderId={wizardProviderId}
                onFinish={() => setActiveTab('universal-integration')}
              />
            )}
            {activeTab === 'visual-mapping' && <VisualFieldMappingPage />}
            {activeTab === 'database-explorer' && <DatabaseExplorerPage />}
            {activeTab === 'connector-generator' && <ConnectorSdkGeneratorPage />}
            {activeTab === 'enterprise-connectors' && <EnterpriseConnectorsPage />}
            {activeTab === 'event-automation' && <EventAutomationPage />}
            {activeTab === 'dataset-management' && <DatasetManagementPage />}
            {activeTab === 'observability' && <ObservabilityPage />}
            {activeTab === 'multi-tenancy' && (
              <MultiTenancyPage
                currentTenantId={currentTenantId}
                onSelectTenant={setCurrentTenantId}
              />
            )}
            {activeTab === 'user-management' && <UserManagementPage />}
            {activeTab === 'report-center' && <ReportCenterPage />}
            {activeTab === 'system-discovery' && <SystemDiscoveryAuditPage />}
            {activeTab === 'thesis-defense' && <ThesisDefenseCompanion />}
            {activeTab === 'linux-monorepo' && <LinuxMonorepoHub />}
          </div>
        </main>
      </div>
    </div>
  );
}
