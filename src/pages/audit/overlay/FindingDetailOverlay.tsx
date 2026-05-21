import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { FindingStatus } from '../../../types';
import { ALL_FINDINGS, MOCK_AUDIT_RESULT } from '../../../data/mockAudit';
import styles from './FindingDetailOverlay.module.css';

type Tab = 'trail' | 'recovery';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = (searchParams.get('tab') as Tab) || 'trail';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
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

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t && (t === 'trail' || t === 'recovery')) setActiveTab(t);
  }, [searchParams]);

  const allIds = ALL_FINDINGS.map((f) => f.id);
  const currentIndex = allIds.indexOf(id ?? '');
  const finding = currentIndex >= 0 ? ALL_FINDINGS[currentIndex] : null;

  const close = () => navigate('/app/audit', { replace: true });
  const goTo = (newId: string) => navigate(`/app/audit/finding/${newId}?tab=${activeTab}`, { replace: true });

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
            <div className={styles.headerRow}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'trail' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('trail')}
                >
                  Audit Trail
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'recovery' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('recovery')}
                >
                  Send Recovery
                </button>
              </div>
              <div className={styles.nav}>
                <span className={styles.navCounter}>
                  Finding {currentIndex + 1} of {ALL_FINDINGS.length}
                </span>
                <button className={styles.navBtn} disabled={!hasPrev} onClick={() => goTo(allIds[currentIndex - 1])}>← Prev</button>
                <button className={styles.navBtn} disabled={!hasNext} onClick={() => goTo(allIds[currentIndex + 1])}>Next →</button>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
        </div>

        {/* Two-column body */}
        <div className={styles.body}>
          {/* LEFT: Document (changes by tab) */}
          <div className={styles.colLeft}>
            {activeTab === 'trail' && (
              <div className={styles.reportPage}>
                <div className={styles.reportContent}>
                  <div className={styles.docHeader}>
                    <div className={styles.docLogoRow}>
                      <img src="/header/brand-mark.png" alt="Revorion" className={styles.docLogoImg} />
                    </div>
                    <span className={styles.docReportLabel}>Audit Execution Report</span>
                    <span className={styles.docTitle}>{finding.contract}</span>
                    <span className={styles.docMeta}>
                      Finding: {finding.id.toUpperCase()} | Invoice: {finding.billingRecord} | Confidence: {finding.confidence}%
                    </span>
                    <hr className={styles.docDivider} />

                    <div className={styles.docSummary}>
                      <div className={styles.docSummaryHero}>
                        <span className={styles.docSummaryLabel}>Discrepancy Amount</span>
                        <span className={styles.docSummaryHeroValue}>{finding.discrepancy}</span>
                        <span className={styles.docSummarySub}>Shortfall identified against contractual terms</span>
                      </div>
                      <div className={styles.docSummaryRow}>
                        <div className={styles.docSummaryItem}>
                          <span className={styles.docSummaryLabel}>Coverage</span>
                          <span className={styles.docSummaryValue}>{MOCK_AUDIT_RESULT.coverage}%</span>
                        </div>
                        <div className={styles.docSummaryItem}>
                          <span className={styles.docSummaryLabel}>Findings Identified</span>
                          <span className={styles.docSummaryValue}>{MOCK_AUDIT_RESULT.findingsCount.toLocaleString()}</span>
                        </div>
                        <div className={styles.docSummaryItem}>
                          <span className={styles.docSummaryLabel}>Max Confidence</span>
                          <span className={styles.docSummaryValue}>{MOCK_AUDIT_RESULT.maxConfidence}%</span>
                        </div>
                      </div>
                    </div>
                    <hr className={styles.docDivider} />
                  </div>

                  <div className={styles.blockSection}>
                    <span className={styles.blockLabel}>Discrepancy Description</span>
                    <p className={styles.blockText}>
                      The contract specifies a minimum rate of $0.005 per stream for mechanical royalties.
                      Billing record {finding.billingRecord} reports a rate of $0.0031 — a shortfall of {finding.discrepancy}.
                      This affects all streams processed between March 1 and March 31, 2026.
                    </p>
                  </div>

                  <hr className={styles.docDivider} />

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

                  <hr className={styles.docDivider} />

                  <div className={styles.blockSection}>
                    <span className={styles.blockLabel}>Rule Set Applied</span>
                    <ul className={styles.ruleRefList}>
                      <li>Spotify recoupment rate ≥ $0.005/stream (v321)</li>
                      <li>SoundExchange minimum quarterly payout threshold (v318)</li>
                      <li>BMI license fee cap: $12,000/quarter (v305)</li>
                      <li>Mechanical royalty floor: 9.1¢/unit (v298)</li>
                    </ul>
                  </div>

                  <hr className={styles.docDivider} />

                  <div className={styles.blockSection}>
                    <span className={styles.blockCaption}>
                      Analysis prepared by the Revorion AuditGraph system. This report reflects the rule set v321 active on April 21, 2026. All findings are subject to counterparty verification.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recovery' && (
              <div className={styles.reportPage}>
                <div className={styles.reportContent}>
                  <div className={styles.docHeader}>
                    <div className={styles.docLogoRow}>
                      <img src="/header/brand-mark.png" alt="Revorion" className={styles.docLogoImg} />
                    </div>
                    <span className={styles.docReportLabel}>Recovery Notice</span>
                    <span className={styles.docTitle}>{finding.contract}</span>
                    <span className={styles.docMeta}>
                      Finding: {finding.id.toUpperCase()} | Invoice: {finding.billingRecord} | Amount: {finding.discrepancy}
                    </span>
                    <hr className={styles.docDivider} />

                    <div className={styles.docSummary}>
                      <div className={styles.docSummaryHero}>
                        <span className={styles.docSummaryLabel}>Recovery Amount</span>
                        <span className={styles.docSummaryHeroValue}>{finding.discrepancy}</span>
                        <span className={styles.docSummarySub}>Outstanding balance for counterparty resolution</span>
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

                  <div className={styles.blockSection}>
                    <span className={styles.blockLabel}>Recovery Summary</span>
                    <p className={styles.blockText}>
                      This finding identifies a shortfall of {finding.discrepancy} on invoice {finding.billingRecord} against
                      contract {finding.contract}. The contractual minimum rate of $0.005/stream was not met — an applied
                      rate of $0.0031/stream was detected, resulting in a per-stream delta of $0.0019.
                    </p>
                  </div>

                  <hr className={styles.docDivider} />

                  <div className={styles.blockSection}>
                    <span className={styles.blockLabel}>Counterparty Notice</span>
                    <table className={styles.miniTable}>
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Counterparty</td><td>{finding.contract.split(' ')[0]}</td></tr>
                        <tr><td>Invoice Reference</td><td>{finding.billingRecord}</td></tr>
                        <tr><td>Period</td><td>Mar 1 – Mar 31, 2026</td></tr>
                        <tr><td>Recovery Amount</td><td>{finding.discrepancy}</td></tr>
                        <tr><td>Deadline</td><td>30 days from notice date</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <hr className={styles.docDivider} />

                  <div className={styles.blockSection}>
                    <span className={styles.blockCaption}>
                      Recovery notice generated by Revorion AuditGraph. All amounts subject to counterparty verification. This document does not constitute legal notice.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Recovery actions */}
          <div className={styles.colRight}>
            {finding.status === 'New' && (
              <div className={styles.recoveryBlock}>
                <div className={styles.emailCard}>
                  <div className={styles.docHead}>
                    <span className={styles.docHeadLabel}>Recovery</span>
                    <span className={styles.docHeadId}>Email Draft</span>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <span className={styles.emailMeta}>To: accounting@{finding.contract.split(' ')[0].toLowerCase()}.com</span>
                    <span className={styles.emailSubject}>Subject: Following up on Invoice {finding.billingRecord}</span>
                    <hr className={styles.emailHr} />
                    <span className={styles.emailBody}>
                      Dear Accounting Team,{'\n\n'}
                      We are writing regarding invoice {finding.billingRecord} associated with contract {finding.contract}. Our audit has identified a variance of {finding.discrepancy} between the contractual rate and the rate applied.{'\n\n'}
                      We kindly request review and resolution within 30 days.{'\n\n'}
                      Best regards,{'\n'}Revorion AuditGraph
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
