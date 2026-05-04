import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import styles from './onboarding.module.css';

const STEP_PATHS: Record<string, number> = {
  '/onboard/step-1': 1,
  '/onboard/step-2': 2,
  '/onboard/step-3': 3,
  '/onboard/step-4': 4,
  '/onboard/step-5': 5,
  '/onboard/step-6': 6,
  '/onboard/step-7': 7,
};

export default function OnboardingLayout() {
  const location = useLocation();
  const { onboardingData } = useAppStore();
  const step = STEP_PATHS[location.pathname] ?? 1;
  const isComplete = step === 7;
  const isReEntry = step === 4 && onboardingData.syncComplete;
  const fillPct = (step / 7) * 100;

  let indicatorClass = styles.stepIndicator;
  let indicatorText = `Step ${step} of 7`;
  if (isComplete) {
    indicatorClass = `${styles.stepIndicator} ${styles.stepIndicatorComplete}`;
    indicatorText = 'Setup Complete';
  } else if (isReEntry) {
    indicatorClass = `${styles.stepIndicator} ${styles.stepIndicatorReentry}`;
    indicatorText = 'Welcome back';
  }

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${isComplete ? styles.progressFillComplete : ''}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>

      {/* Step indicator */}
      <p className={indicatorClass}>{indicatorText}</p>

      {/* Step content */}
      <Outlet />
    </div>
  );
}
