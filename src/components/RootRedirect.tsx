import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/app';

/**
 * Sends users to onboarding until first audit completes, otherwise to dashboard.
 */
export default function RootRedirect() {
  const { onboardingStep, onboardingData } = useAppStore();
  const done = onboardingData.firstAuditRun;
  if (done) {
    return <Navigate to="/app/connects" replace />;
  }
  return <Navigate to={`/onboard/step-${onboardingStep}`} replace />;
}
