import { useState, useEffect, useRef } from 'react';
import { Outlet, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import type { AuditState, Finding } from '../../types';
import { ALL_FINDINGS, MOCK_AUDIT_RESULT } from '../../data/mockAudit';
import { mockRulesPopulated } from '../../data/mockRules';
import { mockSources } from '../../data/mock';
import FindingsTable from './components/FindingsTable';
import { Idea, ChevronLeft, ChevronRight, ChevronDown } from '@carbon/icons-react';
import styles from './AuditPage.module.css';

const TICK_MS = 2000;
const INCREMENT_MIN = 4;
const INCREMENT_MAX = 8;
const FINDINGS_PER_TICK = 3;
const FINDINGS_TICK_EVERY = 2;

const ACTIVE_RULES_COUNT = mockRulesPopulated.filter((r) => r.status === 'Active').length;
const SOURCES = mockSources['music-royalty'] ?? [];
const LIVE_COUNT = SOURCES.filter((s) => s.status === 'live').length;
const FIX_COUNT = SOURCES.filter((s) => s.status === 'fix').length;
const PENDING_COUNT = SOURCES.filter((s) => s.status === 'pending').length;

const TIPS = [
  'Use the table below to triage findings, or open the full report from the summary card.',
  'Bulk select findings to send multiple recovery drafts at once.',
  'Dismissed findings will not be included in the final recovery export.',
  'Click any finding row to view its complete audit trail and evidence.'
];

function auditTipMessage(state: AuditState, tipIdx: number): string {
  switch (state) {
    case 'NOT_YET_RUN':
      return 'Complete the two setup steps below, then run your first audit.';
    case 'RUNNING':
      return 'Audit in progress — findings appear below as they are identified.';
    case 'COMPLETE':
      return TIPS[tipIdx];
    case 'STOPPED':
      return 'Audit was stopped early — review partial results or start a new run from the banner above.';
    case 'FAILED':
      return 'The last run failed — fix your connection, then try again.';
    default:
      return 'Review readiness, run audit, inspect findings.';
  }
}

export default function AuditPage() {
  const navigate = useNavigate();
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const auditStateBySilo = useAppStore((s) => s.auditStateBySilo);
  const setAuditState = useAppStore((s) => s.setAuditState);
  const auditReadiness = useAppStore(
    (s) => s.auditReadinessBySilo[activeSiloId] ?? { contractSource: false, rulesApplied: false }
  );
  const resetAuditReadiness = useAppStore((s) => s.resetAuditReadiness);
  const contractStepDone = auditReadiness.contractSource;
  const rulesStepDone = auditReadiness.rulesApplied;
  const allStepsDone = contractStepDone && rulesStepDone;

  const [searchParams, setSearchParams] = useSearchParams();
  const devParam = searchParams.get('audit-state') as AuditState | null;

  const storedState: AuditState = auditStateBySilo[activeSiloId] ?? 'NOT_YET_RUN';
  const effectiveState: AuditState = devParam ?? storedState;

  /* Running simulation state */
  const [progress, setProgress] = useState(0);
  const [visibleFindings, setVisibleFindings] = useState<Finding[]>([]);
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Tip Carousel */
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (effectiveState !== 'COMPLETE') return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [effectiveState]);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % TIPS.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + TIPS.length) % TIPS.length);

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
          showToast(`Audit complete. ${MOCK_AUDIT_RESULT.findingsCount.toLocaleString()} findings identified.`);
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
      if (val === 'NOT_YET_RUN') {
        resetAuditReadiness(activeSiloId);
      }
      setSearchParams({ 'audit-state': val });
    }
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.topTipStrip}>
          <div className={styles.topTipInner}>
            <div className={styles.topTipContent}>
              <Idea size={20} className={styles.topTipIcon} />
              <span className={styles.topTipText}>{auditTipMessage(effectiveState, currentTip)}</span>
            </div>
          </div>
          <div className={styles.topTipControls}>
            {effectiveState === 'COMPLETE' && (
              <>
                <button onClick={prevTip} className={styles.topTipBtn} aria-label="Previous tip">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextTip} className={styles.topTipBtn} aria-label="Next tip">
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {effectiveState === 'RUNNING' && (
              <span className={styles.topTipStatus}>In progress</span>
            )}
            {(effectiveState === 'STOPPED' || effectiveState === 'FAILED') && (
              <button className={styles.runBtn} onClick={startAudit}>Run Audit</button>
            )}
          </div>
        </div>

        {effectiveState !== 'NOT_YET_RUN' && effectiveState !== 'COMPLETE' && (
          <>
        {/* PRE-AUDIT READINESS section label */}
        <span className={styles.sectionLabel} style={{ paddingTop: 16 }}>Pre-Audit Readiness</span>

        {/* Readiness cards */}
        <div className={styles.readinessRow}>
          <div className={styles.readinessCard}>
            <span className={`${styles.readinessBadge} ${styles.badgeReady}`}>Ready</span>
            <span className={styles.readinessDesc}>Data Sources: {SOURCES.length} connected, {LIVE_COUNT} live, {FIX_COUNT} fix, {PENDING_COUNT} pending</span>
          </div>
          <div className={styles.readinessCard}>
            <span className={`${styles.readinessBadge} ${styles.badgeReady}`}>Ready</span>
            <span className={styles.readinessDesc}>Rules: {ACTIVE_RULES_COUNT} active across 3 sources</span>
          </div>
          <div className={styles.readinessCard}>
            <span className={`${styles.readinessBadge} ${styles.badgeReady}`}>{MOCK_AUDIT_RESULT.coverage}%</span>
            <span className={styles.readinessDesc}>Coverage: {MOCK_AUDIT_RESULT.recordsProcessed.toLocaleString()} eligible records</span>
          </div>
        </div>
          </>
        )}

        {/* ── State-specific content ── */}

        {/* NOT_YET_RUN: to-do checklist */}
        {effectiveState === 'NOT_YET_RUN' && (
          <>
            <div className={styles.todoStage}>
              <div className={styles.todoIntro}>
                <span className={styles.todoEyebrow}>First audit</span>
                <span className={styles.todoHeroTitle}>Two steps to first findings.</span>
                <p className={styles.todoHeroBody}>
                  Connect contract data and apply rules. That is all you need before AuditGraph
                  can start reviewing your records.
                </p>
                <span className={styles.todoOrderNote}>You can do them in any order.</span>
              </div>

              <div className={styles.todoGrid}>
                <div
                  className={`${styles.todoCard} ${contractStepDone ? styles.todoCardDone : styles.todoCardPending}`}
                >
                  <div className={styles.todoCardTop}>
                    <span className={styles.todoStepIndex}>01</span>
                    <span
                      className={`${styles.todoCheck} ${contractStepDone ? styles.todoCheckDone : styles.todoCheckPending}`}
                      aria-hidden
                    >
                    {contractStepDone ? '✓' : null}
                    </span>
                  </div>
                  <span className={styles.todoCardTitle}>Connect a contract source</span>
                  <span className={styles.todoCardBody}>
                    Add the contract system you want the audit to read from.
                  </span>
                  <div className={styles.todoCardAction}>
                    {contractStepDone ? (
                      <span className={styles.todoCardDoneText}>Complete</span>
                    ) : (
                      <Link to="/app/connects?first-audit=1" className={styles.todoStepBtn}>
                        Go to Connects
                      </Link>
                    )}
                  </div>
                </div>

                <div
                  className={`${styles.todoCard} ${rulesStepDone ? styles.todoCardDone : styles.todoCardPending}`}
                >
                  <div className={styles.todoCardTop}>
                    <span className={styles.todoStepIndex}>02</span>
                    <span
                      className={`${styles.todoCheck} ${rulesStepDone ? styles.todoCheckDone : styles.todoCheckPending}`}
                      aria-hidden
                    >
                    {rulesStepDone ? '✓' : null}
                    </span>
                  </div>
                  <span className={styles.todoCardTitle}>Apply audit rules</span>
                  <span className={styles.todoCardBody}>
                    Review library, AI, or plain-language rules for this audit run.
                  </span>
                  <div className={styles.todoCardAction}>
                    {rulesStepDone ? (
                      <span className={styles.todoCardDoneText}>Complete</span>
                    ) : (
                      <Link to="/app/rules?first-audit=1" className={styles.todoStepBtn}>
                        Go to Rules
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.todoAction}>
                {allStepsDone ? (
                  <>
                    <span className={styles.todoReady}>You&apos;re all set.</span>
                    <button type="button" className={styles.runAuditBtn} onClick={startAudit}>
                      Run Audit
                    </button>
                  </>
                ) : (
                  <p className={styles.todoBlocked}>Complete both steps first.</p>
                )}
              </div>
            </div>
            <div className={styles.emptyFindings} style={{ marginTop: 24 }}>
              <span className={styles.emptyFindingsText}>No findings yet. Your first audit will populate this workspace.</span>
            </div>
          </>
        )}

        {/* RUNNING: hero progress + partial findings */}
        {effectiveState === 'RUNNING' && (
          <>
            <div className={styles.runningHero}>
              <div className={styles.runningTop}>
                <div className={styles.runningLeft}>
                  <span className={styles.runningLabel}>Audit in progress</span>
                  <span className={styles.runningHint}>Hold tight — we're going through your records.</span>
                </div>
                <div className={styles.runningRight}>
                  <span className={styles.runningPercent}>{Math.round(progress)}%</span>
                  <span className={styles.runningEta}>
                    {estimatedMinutes > 0
                      ? `~${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''} remaining`
                      : 'Almost done…'}
                  </span>
                </div>
              </div>
              <div className={styles.runningTrack}>
                <div className={styles.runningFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.runningBottom}>
                {visibleFindings.length > 0 && (
                  <span className={styles.runningFindings}>
                    {visibleFindings.length} finding{visibleFindings.length !== 1 ? 's' : ''} identified so far
                  </span>
                )}
                <button className={styles.stopBtn} onClick={stopAudit}>Stop audit</button>
              </div>
            </div>
            {visibleFindings.length > 0 ? (
              <>
                <FindingsSummary findings={visibleFindings} />
                <FindingsTable findings={visibleFindings} onToast={showToast} />
              </>
            ) : (
              <div className={styles.emptyFindings} style={{ marginTop: 16 }}>
                <span className={styles.emptyFindingsText}>Scanning records… findings will appear as they are identified.</span>
              </div>
            )}
          </>
        )}

              {/* COMPLETE: hero findings + table */}
        {effectiveState === 'COMPLETE' && (
          <>
            <FindingsSummary findings={findingsToShow} onRerun={startAudit} />
            <FindingsTable findings={findingsToShow} onToast={showToast} />
          </>
        )}

        {/* FAILED */}
        {effectiveState === 'FAILED' && (
          <>
            <div className={styles.stateCard} data-variant="failed">
              <span className={styles.stateCardTitle}>Something went wrong.</span>
              <span className={styles.stateCardBody}>
                The connection to SoundExchange dropped mid-audit. No findings were saved from this run.
              </span>
              <div className={styles.stateCardActions}>
                <button className={styles.stateCardBtnPrimary} onClick={() => navigate('/app/connects')}>Fix connection</button>
                <button className={styles.stateCardBtnSecondary} onClick={startAudit}>Re-run Audit</button>
              </div>
              <details className={styles.stateCardDetails}>
                <summary>Technical details</summary>
                <span>Connection to SoundExchange dropped at 43% completion. 607,292 of 1,412,308 records processed.</span>
              </details>
            </div>
          </>
        )}

        {/* STOPPED */}
        {effectiveState === 'STOPPED' && (
          <>
            <div className={styles.stateCard} data-variant="stopped">
              <span className={styles.stateCardTitle}>Audit was stopped.</span>
              <span className={styles.stateCardBody}>
                Stopped at {Math.round(progress) || 67}% — partial results are shown below. They may not reflect the full picture.
              </span>
              <div className={styles.stateCardActions}>
                <button className={styles.stateCardBtnPrimary} onClick={resumeAudit}>Resume Audit</button>
                <button className={styles.stateCardBtnSecondary} onClick={startAudit}>Start new run</button>
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
      </div>

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
function FindingsSummary({ findings, onRerun }: { findings: Finding[]; onRerun?: () => void }) {
  const totalValue = findings.reduce((sum, f) => sum + f.discrepancyValue, 0);
  const maxConf = findings.length > 0 ? Math.max(...findings.map((f) => f.confidence)) : 0;
  const fmtValue = '$' + (totalValue >= 1_000_000
    ? (totalValue / 1_000_000).toFixed(2) + 'M'
    : totalValue.toLocaleString('en-US'));

  return (
    <div className={styles.findingsSummary}>
      {/* 1. Neon Hero Block (Large) */}
      <div className={styles.summaryBentoCard} data-variant="neon">
        <span className={styles.summaryHeroLabel}>Potential recovery</span>
        <span className={`${styles.summaryHeroValue} ${styles.summaryHeroValueLarge}`}>{fmtValue}</span>
        <span className={styles.summaryHeroSub}>
          Audit complete · {MOCK_AUDIT_RESULT.completedAt.split(' at ')[0]}
        </span>
        {onRerun && (
          <div className={styles.summaryHeroActions}>
            <Link to="/app/reporting" className={styles.summaryPrimaryBtn}>
              View report
            </Link>
            <button type="button" className={styles.summarySecondaryBtn} onClick={onRerun}>
              Run new audit
            </button>
          </div>
        )}
      </div>

      {/* 2. Black Findings Block */}
      <div className={styles.summaryBentoCard} data-variant="black">
        <span className={styles.summaryHeroLabel}>Findings identified</span>
        <span className={styles.summaryHeroValue}>{findings.length.toLocaleString()}</span>
      </div>

      {/* 3. Small Info Block 1 */}
      <div className={styles.summaryBentoCard}>
        <span className={styles.summaryHeroLabel}>Coverage</span>
        <span className={styles.statValue}>{MOCK_AUDIT_RESULT.coverage}%</span>
      </div>

      {/* 4. Small Info Block 2 */}
      <div className={styles.summaryBentoCard}>
        <span className={styles.summaryHeroLabel}>Max Confidence</span>
        <span className={styles.statValue}>{maxConf}%</span>
      </div>

    </div>
  );
}
