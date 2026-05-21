import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { FindingStatus } from '../../../types';
import { ALL_FINDINGS, MOCK_AUDIT_RESULT } from '../../../data/mockAudit';
import styles from './FindingDetailOverlay.module.css';

function statusClass(s: FindingStatus): string {
  switch (s) {
    case 'New': return styles.statusNew;
    case 'Recovery': return styles.statusRecovery;
    case 'Recovered': return styles.statusRecovered;
    case 'Dismissed': return styles.statusDismissed;
    case 'Disputed': return styles.statusDisputed;
  }
}

export default function FindingDetailOverlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const allIds = ALL_FINDINGS.map((f) => f.id);
  const currentIndex = allIds.indexOf(id ?? '');
  const finding = currentIndex >= 0 ? ALL_FINDINGS[currentIndex] : null;

  const close = () => navigate('/app/audit', { replace: true });
  const goTo = (newId: string) => navigate(`/app/audit/finding/${newId}`, { replace: true });

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allIds.length - 1;

  if (!finding) {
    return (
      <div className={styles.scrim} onClick={close}>
        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
          <div className={styles.panelHeader}>
            <span className={styles.findingTitle}>Finding not found</span>
            <button className={styles.closeBtn} onClick={close}>✕</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrim} onClick={close}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <span className={styles.findingTitle}>
              {finding.contract} / {finding.billingRecord} / {finding.discrepancy}
            </span>
            <div className={styles.nav}>
              <span className={styles.navCounter}>
                Finding {currentIndex + 1} of {ALL_FINDINGS.length}
              </span>
              <button className={styles.navBtn} disabled={!hasPrev} onClick={() => goTo(allIds[currentIndex - 1])}>← Prev</button>
              <button className={styles.navBtn} disabled={!hasNext} onClick={() => goTo(allIds[currentIndex + 1])}>Next →</button>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* ── LEFT: Audit Trail — identical to Report PDF canvas ── */}
          <div className={styles.colLeft}>
            <div className={styles.reportPage}>
              <div className={styles.reportContent}>
                {/* Document header — mirrors Report PDF */}
                <div className={styles.docHeader}>
                  <div className={styles.docLogoRow}>
                    <img src="/header/brand-mark.png" alt="Revorion" className={styles.docLogoImg} />
                  </div>
                  <span className={styles.docReportLabel}>Finding Audit Trail</span>
                  <span className={styles.docTitle}>{finding.contract}</span>
                  <span className={styles.docMeta}>
                    Finding: {finding.id.toUpperCase()} | Invoice: {finding.billingRecord} | Confidence: {finding.confidence}%
                  </span>
                  <hr className={styles.docDivider} />

                  {/* Summary hero — matches Report PDF */}
                  <div className={styles.docSummary}>
                    <div className={styles.docSummaryHero}>
                      <span className={styles.docSummaryLabel}>Discrepancy Amount</span>
                      <span className={styles.docSummaryHeroValue}>{finding.discrepancy}</span>
                      <span className={styles.docSummarySub}>Shortfall identified against contractual terms</span>
                    </div>
                    <div className={styles.docSummaryRow}>
                      <div className={styles.docSummaryItem}>
                        <span className={styles.docSummaryLabel}>Status</span>
                        <span className={`${styles.statusBadge} ${statusClass(finding.status)}`}>{finding.status}</span>
                      </div>
                      <div className={styles.docSummaryItem}>
                        <span className={styles.docSummaryLabel}>Confidence</span>
                        <span className={styles.docSummaryValue}>{finding.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <hr className={styles.docDivider} />
                </div>

                {/* Discrepancy Description — block section */}
                <div className={styles.blockSection}>
                  <span className={styles.blockLabel}>Discrepancy Description</span>
                  <p className={styles.blockText}>
                    The contract specifies a minimum rate of $0.005 per stream for mechanical royalties.
                    Billing record {finding.billingRecord} reports a rate of $0.0031 — a shortfall of {finding.discrepancy}.
                    This affects all streams processed between March 1 and March 31, 2026.
                  </p>
                </div>

                <hr className={styles.docDivider} />

                {/* Contract Evidence — table block */}
                <div className={styles.blockSection}>
                  <span className={styles.blockLabel}>Contract Evidence</span>
                  <table className={styles.miniTable}>
                    <thead>
                      <tr>
                        <th>Clause</th>
                        <th>Contractual Rate</th>
                        <th>Applied Rate</th>
                        <th>Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>§7.2 Mechanical Royalty</td>
                        <td>$0.0050 / stream</td>
                        <td>$0.0031 / stream</td>
                        <td>−$0.0019</td>
                      </tr>
                    </tbody>
                  </table>
                  <span className={styles.blockCaption}>
                    Source: {finding.contract} — Page 4 of 12, Section 7.2
                  </span>
                </div>

                <hr className={styles.docDivider} />

                {/* Billing Record — table block */}
                <div className={styles.blockSection}>
                  <span className={styles.blockLabel}>Billing Record</span>
                  <table className={styles.miniTable}>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Invoice</td><td>{finding.billingRecord}</td></tr>
                      <tr><td>Period</td><td>Mar 1 – Mar 31, 2026</td></tr>
                      <tr><td>Rate Applied</td><td>$0.0031 / stream</td></tr>
                      <tr><td>Stream Count</td><td>1,354,839</td></tr>
                      <tr><td>Shortfall</td><td>{finding.discrepancy}</td></tr>
                    </tbody>
                  </table>
                </div>

                <hr className={styles.docDivider} />

                {/* Audit Context */}
                <div className={styles.blockSection}>
                  <span className={styles.blockLabel}>Audit Context</span>
                  <table className={styles.miniTable}>
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Audit Completed</td><td>{MOCK_AUDIT_RESULT.completedAt}</td></tr>
                      <tr><td>Duration</td><td>{MOCK_AUDIT_RESULT.duration}</td></tr>
                      <tr><td>Records Processed</td><td>{MOCK_AUDIT_RESULT.recordsProcessed.toLocaleString()}</td></tr>
                      <tr><td>Overall Coverage</td><td>{MOCK_AUDIT_RESULT.coverage}%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Recovery ── */}
          <div className={styles.colRight}>
            {finding.status === 'New' && (
              <div className={styles.recoveryBlock}>
                <div className={styles.emailCard}>
                  <div className={styles.docHead}>
                    <span className={styles.docHeadLabel}>Recovery</span>
                    <span className={styles.docHeadId}>Email Draft</span>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <span className={styles.emailMeta}>To: matthew@soundexchange.com</span>
                    <span className={styles.emailSubject}>Subject: Following up on Invoice {finding.billingRecord}</span>
                    <hr className={styles.emailHr} />
                    <span className={styles.emailBody}>
                      Hi Matthew,{'\n\n'}
                      I wanted to follow up on invoice {finding.billingRecord} for {finding.discrepancy}. Our records indicate a discrepancy against contract {finding.contract}. Could you review and confirm?{'\n\n'}
                      Best regards,{'\n'}AuditGraph
                    </span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.primaryBtn} onClick={() => showToast('Email queued for your approval — not sent in this wireframe.')}>Send email</button>
                  <button className={styles.linkBtn} onClick={() => showToast('Opening composer is out of scope for this wireframe.')}>Edit before sending</button>
                  <button className={styles.linkBtn} onClick={() => showToast('Recovery bot armed for this invoice (wireframe).')}>Activate bot only</button>
                  <button className={styles.linkBtn} onClick={close}>Cancel</button>
                </div>
              </div>
            )}

            {finding.status === 'Recovery' && (
              <div className={styles.statusCard}>
                <div className={styles.docHead}>
                  <span className={styles.docHeadLabel}>Recovery</span>
                  <span className={styles.docHeadId}>In Progress</span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <span className={styles.statusCardTitle}>Recovery in progress</span>
                  <span className={styles.statusCardBody} style={{ display: 'block', marginTop: 8 }}>A recovery email has been sent. Bot sequence is active and monitoring for a response.</span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button className={styles.linkBtn} onClick={() => { showToast('Recovery cancelled (wireframe).'); setTimeout(close, 900); }}>Cancel recovery</button>
                </div>
              </div>
            )}

            {finding.status === 'Recovered' && (
              <div className={styles.statusCard}>
                <div className={styles.docHead}>
                  <span className={styles.docHeadLabel}>Recovery</span>
                  <span className={styles.docHeadId}>Resolved</span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <span className={styles.statusCardTitle}>Recovered successfully</span>
                  <span className={`${styles.statusCardBody} ${styles.positive}`} style={{ display: 'block', marginTop: 8 }}>Payment received. Finding resolved.</span>
                </div>
              </div>
            )}

            {finding.status === 'Dismissed' && (
              <div className={styles.statusCard}>
                <div className={styles.docHead}>
                  <span className={styles.docHeadLabel}>Recovery</span>
                  <span className={styles.docHeadId}>Archived</span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <span className={styles.statusCardTitle}>Finding dismissed</span>
                  <span className={styles.statusCardBody} style={{ display: 'block', marginTop: 8 }}>You chose not to pursue this finding. Archived but accessible.</span>
                </div>
              </div>
            )}

            {finding.status === 'Disputed' && (
              <div className={styles.statusCard}>
                <div className={styles.docHead}>
                  <span className={styles.docHeadLabel}>Recovery</span>
                  <span className={styles.docHeadId}>Action Required</span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <span className={styles.statusCardTitle}>Counterparty dispute</span>
                  <span className={`${styles.statusCardBody} ${styles.negative}`} style={{ display: 'block', marginTop: 8 }}>Counterparty has contested the discrepancy. Requires manual review.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
