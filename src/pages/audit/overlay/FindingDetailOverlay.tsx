import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { FindingStatus } from '../../../types';
import { ALL_FINDINGS } from '../../../data/mockAudit';
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

function ContractPdf({ contract, billingRecord, discrepancy }: { contract: string; billingRecord: string; discrepancy: string }) {
  return (
    <div className={styles.pdfEmbed}>
      <div className={styles.pdfBar}>
        <span className={styles.pdfBarTitle}>Contract: {contract}</span>
        <span className={styles.pdfBarPage}>Page 4 of 12</span>
      </div>
      <div className={styles.pdfBody}>
        <p className={styles.pdfParagraph}>
          <strong>Section 7.2 — Mechanical Royalty Rate</strong>
        </p>
        <p className={styles.pdfParagraph}>
          Licensee shall pay to Licensor a per-stream mechanical royalty rate of no less than
          <strong> $0.005 USD </strong> per stream for all territories covered under this agreement.
          Rates are subject to annual CPI adjustment per Section 12.1.
        </p>
        <div className={styles.pdfHighlightBlock}>
          <p className={styles.pdfHighlightText}>
            Billing record <strong>{billingRecord}</strong> reports a rate of $0.0031 — {discrepancy} below the contractual minimum.
          </p>
        </div>
        <p className={styles.pdfParagraph} style={{ opacity: 0.5 }}>
          Section 7.3 — Performance royalties shall be calculated separately per the terms of Exhibit B…
        </p>
      </div>
    </div>
  );
}

function BillingPdf({ billingRecord, discrepancy }: { billingRecord: string; discrepancy: string }) {
  return (
    <div className={styles.pdfEmbed}>
      <div className={styles.pdfBar}>
        <span className={styles.pdfBarTitle}>Billing: {billingRecord}</span>
        <span className={styles.pdfBarPage}>Invoice</span>
      </div>
      <div className={styles.pdfBody}>
        <div className={styles.pdfTable}>
          <div className={styles.pdfTableRow}>
            <span className={styles.pdfTableLabel}>Invoice</span>
            <span className={styles.pdfTableValue}>{billingRecord}</span>
          </div>
          <div className={styles.pdfTableRow}>
            <span className={styles.pdfTableLabel}>Period</span>
            <span className={styles.pdfTableValue}>Mar 1 – Mar 31, 2026</span>
          </div>
          <div className={styles.pdfTableRow}>
            <span className={styles.pdfTableLabel}>Rate Applied</span>
            <span className={styles.pdfTableValue}>$0.0031 / stream</span>
          </div>
          <div className={styles.pdfTableRow}>
            <span className={styles.pdfTableLabel}>Streams</span>
            <span className={styles.pdfTableValue}>1,354,839</span>
          </div>
        </div>
        <div className={styles.pdfHighlightBlock}>
          <p className={styles.pdfHighlightText}>
            Shortfall: <strong>{discrepancy}</strong> (rate delta × stream count)
          </p>
        </div>
      </div>
    </div>
  );
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
          {/* ── LEFT: Audit Trail as PDF document ── */}
          <div className={styles.colLeft}>
            <div className={styles.glassDoc}>
              {/* Document header */}
              <div className={styles.docHead}>
                <span className={styles.docHeadLabel}>Audit Trail</span>
                <span className={styles.docHeadId}>{finding.id.toUpperCase()}</span>
              </div>

              {/* Discrepancy description at top per Speaker A */}
              <div className={styles.descBlock}>
                <span className={styles.sectionLabel}>Discrepancy Description</span>
                <p className={styles.descBody}>
                  The contract specifies a minimum rate of $0.005 per stream for mechanical royalties.
                  Billing record {finding.billingRecord} reports a rate of $0.0031 — a shortfall of {finding.discrepancy}.
                  This affects all streams processed between March 1 and March 31, 2026.
                </p>
              </div>

              {/* Key metrics */}
              <div className={styles.metricsRow}>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Discrepancy</span>
                  <span className={styles.metricHero}>{finding.discrepancy}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${statusClass(finding.status)}`}>{finding.status}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Confidence</span>
                  <div className={styles.confRow}>
                    <div className={styles.confBar}><div className={styles.confFill} style={{ width: `${finding.confidence}%` }} /></div>
                    <span className={styles.confVal}>{finding.confidence}%</span>
                  </div>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Billing</span>
                  <span className={styles.metricMono}>{finding.billingRecord}</span>
                </div>
              </div>

              {/* Evidence — real PDF-style content */}
              <div className={styles.evidenceBlock}>
                <span className={styles.sectionLabel}>Evidence</span>
                <ContractPdf contract={finding.contract} billingRecord={finding.billingRecord} discrepancy={finding.discrepancy} />
                <BillingPdf billingRecord={finding.billingRecord} discrepancy={finding.discrepancy} />
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
