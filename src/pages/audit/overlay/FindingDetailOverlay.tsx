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

  const goTo = (newId: string) => {
    navigate(`/app/audit/finding/${newId}`, { replace: true });
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allIds.length - 1;

  if (!finding) {
    return (
      <>
        <div className={styles.scrim} onClick={close} />
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelHeaderTop}>
              <span className={styles.panelContext}>Audit Trail</span>
              <button className={styles.closeBtn} onClick={close}>✕</button>
            </div>
            <span className={styles.findingTitle}>Finding not found</span>
          </div>
        </div>
      </>
    );
  }

  const totalFindings = ALL_FINDINGS.length;

  return (
    <>
      {/* Scrim — click to close */}
      <div className={styles.scrim} onClick={close} />

      {/* Panel */}
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderTop}>
            <span className={styles.panelContext}>Audit Trail</span>
            <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
          </div>
          <span className={styles.findingTitle}>
            {finding.contract} / {finding.billingRecord} / {finding.discrepancy} discrepancy
          </span>
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <span className={styles.navCounter}>
            Finding {currentIndex + 1} of {totalFindings.toLocaleString()}
          </span>
          <div className={styles.navControls}>
            <button
              className={styles.navBtn}
              disabled={!hasPrev}
              onClick={() => goTo(allIds[currentIndex - 1])}
            >
              ← Previous
            </button>
            <button
              className={styles.navBtn}
              disabled={!hasNext}
              onClick={() => goTo(allIds[currentIndex + 1])}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className={styles.panelBody}>
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
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
                  {finding.confidence}%
                </span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Billing Record</span>
              <span className={styles.metaValue}>{finding.billingRecord}</span>
            </div>
          </div>

          {/* Document evidence panels */}
          <span className={styles.sectionLabel}>Evidence</span>
          <div className={styles.docPanels}>
            <div className={styles.docBox}>
              <span className={styles.docBoxLabel}>Contract</span>
              <span className={styles.docBoxId}>{finding.contract}</span>
            </div>
            <div className={styles.docBox}>
              <span className={styles.docBoxLabel}>Billing Record</span>
              <span className={styles.docBoxId}>{finding.billingRecord}</span>
            </div>
          </div>

          {/* Recovery action — only for New findings */}
          {finding.status === 'New' && (
            <div className={styles.recoverySection}>
              <span className={styles.recoveryTitle}>
                RECOVERY: {finding.contract} / {finding.billingRecord} / {finding.discrepancy} discrepancy
              </span>
              <span className={styles.emailPreviewLabel}>Email draft preview</span>
              <div className={styles.emailPreview}>
                <span className={styles.emailLine}>To: matthew@soundexchange.com</span>
                <span className={styles.emailSubject}>Subject: Following up on Invoice {finding.billingRecord}</span>
                <hr className={styles.emailDivider} />
                <span className={styles.emailBody}>
                  Hi Matthew,{'\n'}
                  I wanted to follow up on invoice {finding.billingRecord} for {finding.discrepancy}. Our records indicate a discrepancy against contract {finding.contract}. Could you review and confirm?
                </span>
              </div>
              <div className={styles.recoveryActions}>
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={() => {
                    showToast('Email queued for your approval — not sent in this wireframe.');
                    setTimeout(() => navigate('/app/audit', { replace: true }), 1600);
                  }}
                >
                  Send email
                </button>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => showToast('Opening composer is out of scope for this wireframe.')}
                >
                  Edit before sending
                </button>
                <button
                  type="button"
                  className={styles.botBtn}
                  onClick={() => showToast('Recovery bot armed for this invoice (wireframe).')}
                >
                  Activate bot only
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => navigate('/app/audit', { replace: true })}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Recovery status info for other states */}
          {finding.status === 'Recovery' && (
            <div className={styles.recoverySection}>
              <span className={styles.recoveryTitle}>Recovery in progress</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', display: 'block', marginBottom: 12 }}>
                A recovery email has been sent. Bot sequence is active and monitoring for a response.
              </span>
              <div className={styles.recoveryActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    showToast('Recovery cancelled (wireframe).');
                    setTimeout(() => navigate('/app/audit', { replace: true }), 900);
                  }}
                >
                  Cancel recovery
                </button>
              </div>
            </div>
          )}

          {finding.status === 'Recovered' && (
            <div className={styles.recoverySection}>
              <span className={styles.recoveryTitle}>Recovered successfully</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--status-live-text)', display: 'block' }}>
                Payment received. Finding resolved.
              </span>
            </div>
          )}

          {finding.status === 'Dismissed' && (
            <div className={styles.recoverySection}>
              <span className={styles.recoveryTitle}>Finding dismissed</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', display: 'block' }}>
                You chose not to pursue this finding. Archived but accessible.
              </span>
            </div>
          )}

          {finding.status === 'Disputed' && (
            <div className={styles.recoverySection}>
              <span className={styles.recoveryTitle}>Counterparty dispute</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--status-fix-text)', display: 'block' }}>
                Counterparty has contested the discrepancy. Requires manual review.
              </span>
            </div>
          )}
        </div>
      </div>
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
