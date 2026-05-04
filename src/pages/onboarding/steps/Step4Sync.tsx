import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import styles from '../onboarding.module.css';

interface SyncSource {
  name: string;
  category: string;
  progress: number;
  recordCount: number;
  maxRecords: number;
  status: 'synced' | 'syncing' | 'queued';
}

const INITIAL_SOURCES: SyncSource[] = [
  { name: 'SoundExchange', category: 'Contracts', progress: 100, recordCount: 14203, maxRecords: 14203, status: 'synced' },
  { name: 'QuickBooks', category: 'Billing', progress: 30, recordCount: 3641, maxRecords: 12000, status: 'syncing' },
  { name: 'Google Drive', category: 'Contracts', progress: 0, recordCount: 0, maxRecords: 342, status: 'queued' },
];

const TICK_PLAN: Partial<SyncSource>[][] = [
  /* tick 1 */ [
    {},
    { progress: 55, recordCount: 6732 },
    {},
  ],
  /* tick 2 */ [
    {},
    { progress: 80, recordCount: 9812 },
    { progress: 10, recordCount: 34, status: 'syncing' },
  ],
  /* tick 3 */ [
    {},
    { progress: 100, recordCount: 12000, status: 'synced' },
    { progress: 45, recordCount: 154 },
  ],
  /* tick 4 */ [
    {},
    {},
    { progress: 78, recordCount: 268 },
  ],
  /* tick 5 */ [
    {},
    {},
    { progress: 100, recordCount: 342, status: 'synced' },
  ],
];

const TIME_REMAINING = ['~3 minutes', '~3 minutes', '~2 minutes', '~2 minutes', '~1 minute', 'Complete'];

export default function Step4Sync() {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData, setOnboardingStep } = useAppStore();

  const [sources, setSources] = useState<SyncSource[]>(INITIAL_SOURCES);
  const [tick, setTick] = useState(0);
  const [notified, setNotified] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const allSynced = sources.every((s) => s.status === 'synced');
  const isReEntry = onboardingData.syncComplete;

  useEffect(() => {
    if (allSynced || isReEntry) return;
    const id = setInterval(() => {
      setTick((t) => {
        const nextTick = t + 1;
        if (nextTick > TICK_PLAN.length) {
          clearInterval(id);
          return t;
        }
        setSources((prev) =>
          prev.map((src, i) => ({
            ...src,
            ...TICK_PLAN[nextTick - 1][i],
          }))
        );
        return nextTick;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [allSynced, isReEntry]);

  // Mark sync complete in store once all done
  useEffect(() => {
    if (allSynced && !onboardingData.syncComplete) {
      updateOnboardingData({ syncComplete: true });
    }
  }, [allSynced, onboardingData.syncComplete, updateOnboardingData]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleContinue() {
    setOnboardingStep(5);
    navigate('/onboard/step-5');
  }

  /* ── RE-ENTRY STATE ── */
  if (isReEntry) {
    return (
      <div className={styles.cardWrap}>
        <div className={styles.card700}>
          <span className={styles.logotype}>AUDITGRAPH</span>

          <h1 className={styles.heading}>Your Data is Ready</h1>
          <p className={styles.body}>
            All data sources have finished syncing since your last visit.
            <br />You can continue setup where you left off.
          </p>

          {INITIAL_SOURCES.map((src) => (
            <div key={src.name} className={styles.reEntrySyncRow}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className={styles.reEntrySyncCheck}>✓</span>
                <div>
                  <span className={styles.reEntrySyncName}>{src.name}</span>
                  <span className={styles.reEntrySyncMeta}>{src.category} · {src.recordCount.toLocaleString()} records</span>
                </div>
              </div>
              <span className={styles.reEntrySynced}>Synced</span>
            </div>
          ))}

          <span className={styles.reEntryLeftOff}>
            You left off at: Review Rules (Step 5 of 7)
          </span>

          <button className={`${styles.continueBtn} ${styles.continueBtnFull}`} onClick={handleContinue}>
            Continue Setup
          </button>

          <button
            className={styles.skipLink}
            onClick={() => navigate('/app/connects?skip-guard=1')}
          >
            Skip to dashboard →
          </button>
        </div>

        <div className={styles.devSkip}>
          Skip to:{' '}
          {[1, 2, 3, 5, 6, 7].map((n) => (
            <button key={n} className={styles.devSkipLink} onClick={() => {
              setOnboardingStep(n);
              navigate(`/onboard/step-${n}`);
            }}>
              Step {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── NORMAL SYNC STATE ── */
  return (
    <div className={styles.cardWrap}>
      <div className={styles.card700}>
        <span className={styles.logotype}>AUDITGRAPH</span>

        <h1 className={styles.heading}>Syncing Your Data</h1>
        <p className={styles.body}>
          We're pulling data from your connected sources. This may take a few minutes
          <br />depending on the volume of contracts and invoices.
        </p>

        {sources.map((src) => (
          <div key={src.name} className={styles.syncRow}>
            <div className={styles.syncRowLeft}>
              <span className={styles.syncRowName}>{src.name}</span>
              <span className={styles.syncRowMeta}>
                {src.category}
                {src.status === 'synced'
                  ? ` · ${src.recordCount.toLocaleString()} records`
                  : src.status === 'syncing'
                  ? ` · Syncing... ${src.recordCount.toLocaleString()} of ~${src.maxRecords.toLocaleString()} records`
                  : ' · Waiting...'}
              </span>
            </div>
            <span className={
              src.status === 'synced' ? styles.syncStatusSynced
              : src.status === 'syncing' ? styles.syncStatusProgress
              : styles.syncStatusQueued
            }>
              {src.status === 'synced' ? '✓ Synced'
               : src.status === 'syncing' ? `${src.progress}%`
               : 'Queued'}
            </span>
            {/* Progress track */}
            <div className={styles.syncProgressTrack} />
            <div
              className={`${styles.syncProgressFill} ${src.status === 'synced' ? styles.syncProgressFillGreen : styles.syncProgressFillBlue}`}
              style={{ width: `${src.progress}%` }}
            />
          </div>
        ))}

        <p className={styles.estimation}>
          Estimated time remaining: {TIME_REMAINING[Math.min(tick, TIME_REMAINING.length - 1)]}
        </p>

        <div className={styles.infoCardGray}>
          <div className={styles.infoCardLeft}>
            <span className={styles.infoCardTitle}>Taking longer than expected?</span>
            <span className={styles.infoCardText}>We'll email you when your data is ready. You can safely close this page.</span>
          </div>
          <button
            className={`${styles.notifyLink} ${notified ? styles.notifyLinkDimmed : ''}`}
            onClick={() => {
              if (!notified) {
                setNotified(true);
                showToast("You\u2019ll receive an email when sync is complete.");
              }
            }}
          >
            Notify me →
          </button>
        </div>

        <div className={styles.navRow}>
          <button className={styles.backBtn} onClick={() => navigate('/onboard/step-3')}>← Back</button>
          <button
            className={styles.continueBtn}
            onClick={handleContinue}
            disabled={!allSynced}
          >
            {allSynced ? 'Continue' : 'Waiting for sync'}
          </button>
        </div>

        <div className={styles.devSkip}>
          Skip to:{' '}
          {[1, 2, 3, 5, 6, 7].map((n) => (
            <button key={n} className={styles.devSkipLink} onClick={() => {
              setOnboardingStep(n);
              navigate(`/onboard/step-${n}`);
            }}>
              Step {n}
            </button>
          ))}
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
