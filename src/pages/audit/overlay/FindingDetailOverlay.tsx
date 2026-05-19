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

function PdfMock({ title, highlight }: { title: string; highlight?: boolean }) {
  return (
    <div className={styles.pdfMock}>
      <div className={styles.pdfHeader}>
        <span className={styles.pdfTitle}>{title}</span>
      </div>
      <div className={styles.pdfPage}>
        <div className={styles.pdfLine} style={{ width: '80%' }} />
        <div className={styles.pdfLine} style={{ width: '65%' }} />
        <div className={styles.pdfLine} style={{ width: '72%' }} />
        <div className={styles.pdfLine} style={{ width: '55%' }} />
        {highlight && (
          <div className={styles.pdfHighlight}>
            <div className={styles.pdfLineDark} style={{ width: '90%' }} />
            <div className={styles.pdfLineDark} style={{ width: '75%' }} />
          </div>
        )}
        <div className={styles.pdfLine} style={{ width: '60%' }} />
        <div className={styles.pdfLine} style={{ width: '68%' }} />
        <div className={styles.pdfLine} style={{ width: '50%' }} />
        {!highlight && (
          <div className={styles.pdfHighlight}>
            <div className={styles.pdfLineDark} style={{ width: '82%' }} />
          </div>
        )}
        <div className={styles.pdfLine} style={{ width: '77%' }} />
        <div className={styles.pdfLine} style={{ width: '40%' }} />
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
      <>
        <div className={styles.scrim} onClick={close} />
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.findingTitle}>Finding not found</span>
            <button className={styles.closeBtn} onClick={close}>✕</button>
          </div>
        </div>
      </>
    );
  }

  const totalFindings = ALL_FINDINGS.length;

  return (
    <>
      <div className={styles.scrim} onClick={close} />

      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <span className={styles.findingTitle}>
              {finding.contract} / {finding.billingRecord} / {finding.discrepancy} discrepancy
            </span>
            <div className={styles.nav}>
              <span className={styles.navCounter}>
                Finding {currentIndex + 1} of {totalFindings.toLocaleString()}
              </span>
              <button className={styles.navBtn} disabled={!hasPrev} onClick={() => goTo(allIds[currentIndex - 1])}>← Prev</button>
              <button className={styles.navBtn} disabled={!hasNext} onClick={() => goTo(allIds[currentIndex + 1])}>Next →</button>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
        </div>

        {/* Two-column body */}
        <div className={styles.twoCol}>
          {/* ── LEFT: Audit Trail ── */}
          <div className={styles.colLeft}>
            <span className={styles.colLabel}>Audit Trail</span>

            {/* Metadata */}
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Discrepancy</span>
                <span className={styles.discrepancyValue}>{finding.discrepancy}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Status</span>
                <span className={`${styles.statusBadge} ${statusClass(finding.status)}`}>
                  {finding.status}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Confidence</span>
                <div className={styles.confRow}>
                  <div className={styles.confBar}>
                    <div className={styles.confFill} style={{ width: `${finding.confidence}%` }} />
                  </div>
                  <span className={styles.confText}>{finding.confidence}%</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Billing Record</span>
                <span className={styles.metaValue}>{finding.billingRecord}</span>
              </div>
            </div>

            {/* PDF mocks */}
            <span className={styles.evidenceLabel}>Evidence</span>
            <PdfMock title={`Contract: ${finding.contract}`} highlight />
            <PdfMock title={`Billing: ${finding.billingRecord}`} />

            {/* Discrepancy description */}
            <div className={styles.discrepancyDesc}>
              <span className={styles.descLabel}>Discrepancy description</span>
              <span className={styles.descText}>
                The contract specifies a minimum rate of $0.005 per stream for mechanical royalties.
                Billing record {finding.billingRecord} reports a rate of $0.0031 — a shortfall of {finding.discrepancy}.
                This affects all streams processed between March 1 and March 31, 2026.
              </span>
            </div>
          </div>

          {/* ── RIGHT: Recovery ── */}
          <div className={styles.colRight}>
            <span className={styles.colLabel}>Recovery</span>

            {finding.status === 'New' && (
              <>
                <div className={styles.recoveryDummy}>
                  <span className={styles.emailPreviewLabel}>Email draft</span>
                  <div className={styles.emailPreview}>
                    <span className={styles.emailLine}>To: matthew@soundexchange.com</span>
                    <span className={styles.emailSubject}>Subject: Following up on Invoice {finding.billingRecord}</span>
                    <hr className={styles.emailDivider} />
                    <span className={styles.emailBody}>
                      Hi Matthew,{'\n\n'}
                      I wanted to follow up on invoice {finding.billingRecord} for {finding.discrepancy}. Our records indicate a discrepancy against contract {finding.contract}. Could you review and confirm?{'\n\n'}
                      Best regards,{'\n'}AuditGraph
                    </span>
                  </div>
                  <div className={styles.recoveryActions}>
                    <button className={styles.sendBtn} onClick={() => showToast('Email queued for your approval — not sent in this wireframe.')}>
                      Send email
                    </button>
                    <button className={styles.editBtn} onClick={() => showToast('Opening composer is out of scope for this wireframe.')}>
                      Edit before sending
                    </button>
                    <button className={styles.botBtn} onClick={() => showToast('Recovery bot armed for this invoice (wireframe).')}>
                      Activate bot only
                    </button>
                    <button className={styles.cancelBtn} onClick={close}>
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}

            {finding.status === 'Recovery' && (
              <div className={styles.statusInfo}>
                <span className={styles.statusInfoTitle}>Recovery in progress</span>
                <span className={styles.statusInfoBody}>
                  A recovery email has been sent. Bot sequence is active and monitoring for a response.
                </span>
                <button className={styles.cancelBtn} onClick={() => { showToast('Recovery cancelled (wireframe).'); setTimeout(close, 900); }}>
                  Cancel recovery
                </button>
              </div>
            )}

            {finding.status === 'Recovered' && (
              <div className={styles.statusInfo}>
                <span className={styles.statusInfoTitle}>Recovered successfully</span>
                <span className={`${styles.statusInfoBody} ${styles.statusInfoBodyPositive}`}>
                  Payment received. Finding resolved.
                </span>
              </div>
            )}

            {finding.status === 'Dismissed' && (
              <div className={styles.statusInfo}>
                <span className={styles.statusInfoTitle}>Finding dismissed</span>
                <span className={styles.statusInfoBody}>
                  You chose not to pursue this finding. Archived but accessible.
                </span>
              </div>
            )}

            {finding.status === 'Disputed' && (
              <div className={styles.statusInfo}>
                <span className={styles.statusInfoTitle}>Counterparty dispute</span>
                <span className={`${styles.statusInfoBody} ${styles.statusInfoBodyNegative}`}>
                  Counterparty has contested the discrepancy. Requires manual review.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
