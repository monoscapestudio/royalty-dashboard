import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import styles from '../onboarding.module.css';

const CHECKLIST = [
  { label: 'Sovereign Silo', value: 'Music & Royalty' },
  { label: 'Contract Sources', value: '2 connected (SoundExchange, Google Drive)' },
  { label: 'Billing Sources', value: '1 connected (QuickBooks)' },
  { label: 'Recovery Pipeline', value: 'Gmail connected' },
  { label: 'Active Rules', value: '141 rules (134 industry + 7 AI-approved)' },
  { label: 'Data Coverage', value: '26,644 records across 3 sources' },
];

export default function Step6RunAudit() {
  const navigate = useNavigate();
  const { setOnboardingStep, updateOnboardingData, setAuditState } = useAppStore();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleRunAudit() {
    setRunning(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 5) + 4; // 4-8%
        const next = Math.min(prev + increment, 100);
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          return 100;
        }
        return next;
      });
    }, 2000);
  }

  // When progress hits 100, complete onboarding
  useEffect(() => {
    if (progress === 100 && running) {
      const timeout = setTimeout(() => {
        updateOnboardingData({ firstAuditRun: true });
        setAuditState('music-royalty', 'COMPLETE');
        setOnboardingStep(7);
        navigate('/onboard/step-7');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, running, navigate, updateOnboardingData, setAuditState, setOnboardingStep]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className={styles.cardWrap}>
      <div className={styles.card700}>
        <span className={styles.siloBadge}>MUSIC &amp; ROYALTY</span>

        <h1 className={styles.heading}>Run Your First Audit</h1>
        <p className={styles.body}>
          Everything is configured. Review your setup summary below
          <br />and run your first audit when ready.
        </p>

        {/* Setup summary */}
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0054C4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Setup Summary
        </span>
        <div style={{ marginTop: 8, marginBottom: 20 }}>
          {CHECKLIST.map(({ label, value }) => (
            <div key={label} className={styles.checklistRow}>
              <span className={styles.checkmark}>✓</span>
              <span className={styles.checkLabel}>{label}</span>
              <span className={styles.checkValue}>{value}</span>
            </div>
          ))}
        </div>

        <div className={styles.estimationCard}>
          Estimated audit duration: ~4 minutes for 26,644 records against 141 rules
        </div>

        <button
          className={styles.runAuditBtn}
          onClick={handleRunAudit}
          disabled={running}
        >
          {running && progress < 100 ? 'Running...' : 'Run First Audit'}
        </button>

        {running && (
          <div className={styles.auditProgressWrap}>
            <div className={styles.auditProgressTrack}>
              <div className={styles.auditProgressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.auditProgressText}>
              {progress}% complete{progress < 100 ? ` · Running audit...` : ' · Finalizing...'}
            </span>
          </div>
        )}

        {!running && (
          <div className={styles.navRow} style={{ marginTop: 16 }}>
            <button className={styles.backBtn} onClick={() => navigate('/onboard/step-5')}>← Back to rules</button>
          </div>
        )}

        {import.meta.env.DEV && (
          <div className={styles.devSkip}>
            Skip to:{' '}
            {[1,2,3,4,5,7].map(n => (
              <button key={n} className={styles.devSkipLink} onClick={() => { setOnboardingStep(n); navigate(`/onboard/step-${n}`); }}>
                Step {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
