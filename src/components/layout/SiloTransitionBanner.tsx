import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/app';
import styles from './SiloTransitionBanner.module.css';

export default function SiloTransitionBanner() {
  const { siloSwitching, siloSwitchTargetName, setSiloSwitching } = useAppStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (siloSwitching) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSiloSwitching(false);
      }, 2000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [siloSwitching, setSiloSwitching]);

  if (!siloSwitching) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.accent} />
      <div className={styles.content}>
        <span className={styles.title}>Switching to {siloSwitchTargetName}...</span>
        <span className={styles.body}>
          Loading connections, rules, and findings for this industry. All screens will update.
        </span>
      </div>
      <div className={styles.progressWrap}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}
