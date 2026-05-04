import { Outlet, Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom';
import TopNav from './TopNav';
import SubHeader from './SubHeader';
import SiloTransitionBanner from './SiloTransitionBanner';
import { useAppStore } from '../../store/app';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const navigate = useNavigate();
  const resetOnboardingDemo = useAppStore((s) => s.resetOnboardingDemo);
  const { onboardingStep, onboardingData, siloSwitching } = useAppStore();
  const [searchParams] = useSearchParams();

  /* Navigation guard: redirect to onboarding if first audit not yet run.
     Bypassed by ?skip-guard=1 (for dev/testing). */
  const skipGuard = searchParams.has('skip-guard');
  if (!onboardingData.firstAuditRun && !skipGuard) {
    return <Navigate to={`/onboard/step-${onboardingStep}`} replace />;
  }

  return (
    <div className={styles.shell}>
      <TopNav />
      <SubHeader />
      <main className={`${styles.main} ${siloSwitching ? styles.mainSwitching : ''}`}>
        {siloSwitching && <SiloTransitionBanner />}
        <Outlet />
      </main>
      <div className={styles.demoSkipBanner}>
        <span className={styles.demoSkipLabel}>Dev</span>
        <Link className={styles.demoSkipLink} to="/app/connects?skip-guard=1" replace={false}>
          Skip onboarding →
        </Link>
        <Link className={styles.demoSkipLink} to="/onboard/step-1">
          Open wizard
        </Link>
        <button
          type="button"
          className={styles.demoSkipButton}
          onClick={() => {
            resetOnboardingDemo();
            navigate('/onboard/step-1');
          }}
        >
          Reset &amp; enter onboarding
        </button>
      </div>
    </div>
  );
}
