import { useState, useEffect, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import type { AuditState, Finding } from '../../types';
import { ALL_FINDINGS, MOCK_AUDIT_RESULT } from '../../data/mockAudit';
import FindingsTable from './components/FindingsTable';
import InlineBanner from '../../components/ui/InlineBanner';
import styles from './AuditPage.module.css';

const TICK_MS = 2000;
const INCREMENT_MIN = 4;
const INCREMENT_MAX = 8;
const FINDINGS_PER_TICK = 3;
const FINDINGS_TICK_EVERY = 2;

export default function AuditPage() {
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const auditStateBySilo = useAppStore((s) => s.auditStateBySilo);
  const setAuditState = useAppStore((s) => s.setAuditState);

  const [searchParams, setSearchParams] = useSearchParams();
  const devParam = searchParams.get('audit-state') as AuditState | null;

  const storedState: AuditState = auditStateBySilo[activeSiloId] ?? 'NOT_YET_RUN';
  const effectiveState: AuditState = devParam ?? storedState;

  /* Running simulation state */
  const [progress, setProgress] = useState(0);
  const [visibleFindings, setVisibleFindings] = useState<Finding[]>([]);
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Inline banners — dismissed state is session-only */
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const dismissBanner = (id: string) => setDismissedBanners((prev) => [...prev, id]);

  /* Toast */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  /* Simulate audit progress when state = RUNNING */
  useEffect(() => {
    if (effectiveState !== 'RUNNING') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setProgress(0);
    setVisibleFindings([]);
    tickRef.current = 0;

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      setProgress((p) => {
        const inc = INCREMENT_MIN + Math.random() * (INCREMENT_MAX - INCREMENT_MIN);
        const newP = Math.min(100, p + inc);

        if (newP >= 100) {
          clearInterval(intervalRef.current!);
          setAuditState(activeSiloId, 'COMPLETE');
          showToast('Audit complete. 1,390 findings identified.');
        }
        return newP;
      });

      if (tick % FINDINGS_TICK_EVERY === 0) {
        setVisibleFindings((prev) => {
          const nextCount = prev.length + FINDINGS_PER_TICK;
          return ALL_FINDINGS.slice(0, nextCount);
        });
      }
    }, TICK_MS);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [effectiveState, activeSiloId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Reset on silo change */
  useEffect(() => {
    setProgress(0);
    setVisibleFindings([]);
    tickRef.current = 0;
  }, [activeSiloId]);

  const startAudit = () => {
    setAuditState(activeSiloId, 'RUNNING');
    if (devParam) setSearchParams({});
  };

  const stopAudit = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAuditState(activeSiloId, 'STOPPED');
  };

  const resumeAudit = () => {
    setAuditState(activeSiloId, 'RUNNING');
  };

  const findingsToShow =
    effectiveState === 'RUNNING'
      ? visibleFindings
      : MOCK_AUDIT_RESULT.findings;

  const estimatedMinutes = progress > 0
    ? Math.max(0, Math.round((100 - progress) / 6 * 0.6))
    : 4;

  /* Dev override handler */
  const setDevState = (val: string) => {
    if (val === 'reset') {
      setSearchParams({});
    } else {
      setSearchParams({ 'audit-state': val });
    }
  };

  /* Determine which audit page inline banner to show (most recent event wins) */
  const auditBanner = (() => {
    if (effectiveState === 'COMPLETE' && !dismissedBanners.includes('audit-complete')) {
      return (
        <InlineBanner
          id="audit-complete"
          variant="green"
          title="Audit complete."
          body="1,390 findings identified. $12,450,000 potential recovery. Report auto-generated."
          onDismiss={dismissBanner}
        />
      );
    }
    if ((effectiveState === 'FAILED' || effectiveState === 'STOPPED') &&
        !dismissedBanners.includes('audit-failed')) {
      return (
        <InlineBanner
          id="audit-failed"
          variant="red"
          title="Connection dropped during audit."
          body="SoundExchange connection failed at 43%. Audit stopped. Fix connection and re-run."
          onDismiss={dismissBanner}
        />
      );
    }
    if (!dismissedBanners.includes('audit-recovery-response')) {
      return (
        <InlineBanner
          id="audit-recovery-response"
          variant="blue"
          title="Response received."
          body="SoundExchange replied to recovery email for INV-2026-0667. Review in findings table."
          onDismiss={dismissBanner}
        />
      );
    }
    return null;
  })();

  return (
    <>
      {auditBanner}
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Audit</h1>
        <span className={styles.pageSubtitle}>Review readiness, run audit, inspect findings.</span>
        {effectiveState === 'NOT_YET_RUN' && null}
        {effectiveState === 'RUNNING' && (
          <button className={styles.runBtn} disabled style={{ opacity: 0.5 }}>Run Audit</button>
        )}
        {(effectiveState === 'COMPLETE' || effectiveState === 'STOPPED' || effectiveState === 'FAILED') && (
          <button className={styles.runBtn} onClick={startAudit}>Run Audit</button>
        )}
      </div>

      {/* PRE-AUDIT READINESS section label */}
      <span className={styles.sectionLabel} style={{ paddingTop: 16 }}>Pre-Audit Readiness</span>

      {/* Readiness cards */}
      <div className={styles.readinessRow}>
        <div className={styles.readinessCard}>
          <span className={`${styles.readinessBadge} ${styles.badgeReady}`}>Ready</span>
          <span className={styles.readinessDesc}>Data Sources: 6 connected, 5 live, 1 needs fix</span>
        </div>
        <div className={styles.readinessCard}>
          <span className={`${styles.readinessBadge} ${styles.badgeReady}`}>Ready</span>
          <span className={styles.readinessDesc}>Rules: 321 active across 3 sources</span>
        </div>
        <div className={styles.readinessCard}>
          <span className={`${styles.readinessBadge} ${styles.badgeReady}`}>96%</span>
          <span className={styles.readinessDesc}>Coverage: 1,412,308 eligible records</span>
        </div>
      </div>

      {/* ── State-specific content ── */}

      {/* NOT_YET_RUN: CTA + empty table placeholder */}
      {effectiveState === 'NOT_YET_RUN' && (
        <>
          <div className={styles.notYetRunCta}>
            <span className={styles.ctaTitle}>Ready to run your first audit</span>
            <span className={styles.ctaBody}>
              6 data sources, 321 rules, 96% estimated coverage. Click Run Audit to begin.
            </span>
            <button className={styles.ctaBtn} onClick={startAudit}>Run Audit</button>
          </div>
          <div className={styles.emptyFindings} style={{ marginTop: 16 }}>
            <span className={styles.emptyFindingsText}>No findings yet. Run an audit to begin.</span>
          </div>
        </>
      )}

      {/* RUNNING: progress bar + partial findings */}
      {effectiveState === 'RUNNING' && (
        <>
          <div className={styles.progressBanner}>
            <span className={styles.progressLabel}>Live Audit Running</span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressText}>
              {Math.round(progress)}% complete. Estimated {estimatedMinutes} minute{estimatedMinutes !== 1 ? 's' : ''} remaining.
            </span>
            <button className={styles.stopBtn} onClick={stopAudit}>Stop audit</button>
          </div>
          {/* Findings summary (updates as findings come in) */}
          {visibleFindings.length > 0 && (
            <FindingsSummary findings={visibleFindings} />
          )}
          {visibleFindings.length > 0 ? (
            <FindingsTable findings={visibleFindings} onToast={showToast} />
          ) : (
            <div className={styles.emptyFindings} style={{ marginTop: 16 }}>
              <span className={styles.emptyFindingsText}>Scanning records… findings will appear as they are identified.</span>
            </div>
          )}
        </>
      )}

      {/* COMPLETE: success banner + full findings */}
      {effectiveState === 'COMPLETE' && (
        <>
          <div className={styles.completeBanner}>
            <span className={`${styles.bannerTitle} ${styles.bannerTitleGreen}`}>Audit Complete</span>
            <span className={styles.bannerMeta}>
              Completed April 21, 2026 at 14:32 UTC. Duration: 8 minutes. 1,412,308 records processed.
            </span>
            <button
              className={`${styles.rerunBtn} ${styles.completeBannerBtn}`}
              onClick={startAudit}
            >
              Re-run Audit
            </button>
          </div>
          <FindingsSummary findings={findingsToShow} />
          <FindingsTable findings={findingsToShow} onToast={showToast} />
        </>
      )}

      {/* FAILED: error banner */}
      {effectiveState === 'FAILED' && (
        <>
          <div className={styles.failedBanner}>
            <span className={`${styles.bannerTitle} ${styles.bannerTitleRed}`}>Audit Failed</span>
            <span className={styles.bannerBody}>
              Error: Connection to SoundExchange dropped during audit at 43% completion.
            </span>
            <span className={styles.bannerMeta}>
              1,412,308 records attempted. 607,292 processed before failure. 0 findings can be saved from partial run.
            </span>
            <div className={styles.bannerActions}>
              <button className={styles.bannerBtnPrimary} onClick={startAudit}>Fix connection</button>
              <button className={styles.bannerBtnLink} onClick={startAudit}>Re-run Audit</button>
              <button className={styles.bannerBtnLink}>View error log</button>
            </div>
          </div>
          <div className={styles.emptyFindings} style={{ marginTop: 16 }}>
            <span className={styles.emptyFindingsText}>No findings saved from failed run.</span>
          </div>
        </>
      )}

      {/* STOPPED: partial results banner */}
      {effectiveState === 'STOPPED' && (
        <>
          <div className={styles.stoppedBanner}>
            <span className={`${styles.bannerTitle} ${styles.bannerTitleAmber}`}>Audit Stopped</span>
            <span className={styles.bannerBody}>
              Manually stopped at {Math.round(progress) || 67}% completion. {(Math.round(progress) || 67) * 14123 | 0} of 1,412,308 records processed.
            </span>
            <span className={styles.bannerMeta}>
              Partial results below. These findings are incomplete and may not reflect the full scope of discrepancies.
            </span>
            <div className={styles.bannerActions}>
              <button className={styles.bannerBtnSecondary} onClick={() => startAudit()}>Start new run</button>
              <button className={styles.bannerBtnPrimary} onClick={resumeAudit}>Resume Audit</button>
            </div>
          </div>
          {visibleFindings.length > 0 ? (
            <>
              <FindingsSummary findings={visibleFindings} />
              <FindingsTable findings={visibleFindings} onToast={showToast} />
            </>
          ) : (
            <div className={styles.emptyFindings} style={{ marginTop: 16 }}>
              <span className={styles.emptyFindingsText}>No findings captured before audit was stopped.</span>
            </div>
          )}
        </>
      )}

      {/* FindingDetailOverlay renders here as nested route */}
      <Outlet />

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Simulate state toggle */}
      <div className={styles.devToggle}>
        <span>SIMULATE STATE</span>
        <select
          value={devParam ?? 'reset'}
          onChange={(e) => setDevState(e.target.value)}
        >
          <option value="reset">store ({storedState})</option>
          <option value="NOT_YET_RUN">not-yet-run</option>
          <option value="RUNNING">running</option>
          <option value="COMPLETE">complete</option>
          <option value="FAILED">failed</option>
          <option value="STOPPED">stopped</option>
        </select>
      </div>
    </>
  );
}

/* ── Internal sub-component ── */
function FindingsSummary({ findings }: { findings: Finding[] }) {
  const totalValue = findings.reduce((sum, f) => sum + f.discrepancyValue, 0);
  const maxConf = findings.length > 0 ? Math.max(...findings.map((f) => f.confidence)) : 0;
  const fmtValue = '$' + (totalValue >= 1_000_000
    ? (totalValue / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + ',000,000'
    : totalValue.toLocaleString('en-US'));

  return (
    <div className={styles.findingsSummary}>
      <div className={styles.summaryMain}>
        <span className={styles.summaryLabel}>Findings</span>
        <span className={styles.summaryValue}>{fmtValue}</span>
        <span className={styles.summarySubtext}>Potential revenue recovery found</span>
      </div>
      <div className={styles.summaryStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Findings</span>
          <span className={styles.statValue}>{findings.length.toLocaleString()}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Coverage</span>
          <span className={styles.statValue}>96%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Max Confidence</span>
          <span className={styles.statValue}>{maxConf}%</span>
        </div>
      </div>
    </div>
  );
}
