import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootRedirect from './components/RootRedirect';
import AppLayout from './components/layout/AppLayout';
import ConnectsPage from './pages/connects/ConnectsPage';
import RulesPage from './pages/rules/RulesPage';
import AuditPage from './pages/audit/AuditPage';
import FindingDetailOverlay from './pages/audit/overlay/FindingDetailOverlay';
import ReportingPage from './pages/reporting/ReportingPage';
import OnboardingLayout from './pages/onboarding/OnboardingLayout';
import Step1Welcome from './pages/onboarding/steps/Step1Welcome';
import Step2Silo from './pages/onboarding/steps/Step2Silo';
import Step3Sources from './pages/onboarding/steps/Step3Sources';
import Step4Sync from './pages/onboarding/steps/Step4Sync';
import Step5Rules from './pages/onboarding/steps/Step5Rules';
import Step6RunAudit from './pages/onboarding/steps/Step6RunAudit';
import Step7Results from './pages/onboarding/steps/Step7Results';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'}>
        <Routes>
          {/* Dashboard shell */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="connects" element={<ConnectsPage />} />
            <Route path="rules" element={<RulesPage />} />
            {/* Audit + nested finding overlay */}
            <Route path="audit" element={<AuditPage />}>
              <Route path="finding/:id" element={<FindingDetailOverlay />} />
            </Route>
            <Route path="reporting" element={<ReportingPage />} />
            {/* Default to Connects */}
            <Route index element={<Navigate to="connects" replace />} />
          </Route>

          {/* Onboarding wizard */}
          <Route path="/onboard" element={<OnboardingLayout />}>
            <Route path="step-1" element={<Step1Welcome />} />
            <Route path="step-2" element={<Step2Silo />} />
            <Route path="step-3" element={<Step3Sources />} />
            <Route path="step-4" element={<Step4Sync />} />
            <Route path="step-5" element={<Step5Rules />} />
            <Route path="step-6" element={<Step6RunAudit />} />
            <Route path="step-7" element={<Step7Results />} />
            <Route index element={<Navigate to="step-1" replace />} />
          </Route>

          {/* Root + unknown URLs: onboarding first, then dashboard */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
