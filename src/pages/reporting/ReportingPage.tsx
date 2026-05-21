import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Idea, ChevronLeft, ChevronRight } from '@carbon/icons-react';
import Modal from '../../components/ui/Modal';
import InlineBanner from '../../components/ui/InlineBanner';
import FormSelect from '../../components/ui/FormSelect';
import { useAppStore } from '../../store/app';
import { MOCK_AUDIT_RESULT } from '../../data/mockAudit';
import styles from './ReportingPage.module.css';

const TIPS = [
  'Generate, finalize, and share audit reports.',
  'Finalizing a report locks the contents to prevent accidental changes.',
  'Use the Draft mode to freely explore and adjust the report layout.',
  'Shared links dynamically reflect the latest finalized version of the report.',
];

/* ── Constants ── */
const ALL_BLOCKS = [
  'Findings Table',
  'Variance Chart',
  'Coverage Stats',
  'Rule Set Reference',
  'Custom Text',
  'Finding Detail',
  'Recovery Status',
] as const;

type BlockName = (typeof ALL_BLOCKS)[number];

type TemplateKey = 'executive' | 'technical' | 'blank';

const TEMPLATE_BLOCKS: Record<TemplateKey, BlockName[]> = {
  executive: ['Findings Table', 'Variance Chart', 'Custom Text'],
  technical: [
    'Findings Table',
    'Variance Chart',
    'Coverage Stats',
    'Rule Set Reference',
    'Recovery Status',
    'Custom Text',
  ],
  blank: [],
};

const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  executive: 'Executive Summary',
  technical: 'Detailed Technical',
  blank: 'Blank Canvas',
};

const TEMPLATE_OPTIONS = [
  { value: 'executive', label: 'Executive Summary' },
  { value: 'technical', label: 'Detailed Technical' },
  { value: 'blank', label: 'Blank Canvas' },
] as const;

const PAGE_FORMAT_OPTIONS = [
  { value: 'US Letter', label: 'US Letter' },
  { value: 'A4', label: 'A4' },
  { value: 'Custom', label: 'Custom' },
];

const SHARE_ACCESS_OPTIONS = [
  { value: 'anyone', label: 'Anyone with link' },
];

const SHARE_EXPIRATION_OPTIONS = [
  { value: '24 hours', label: '24 hours' },
  { value: '7 days', label: '7 days' },
  { value: '30 days', label: '30 days' },
  { value: 'No expiration', label: 'No expiration' },
];

const REPORT_HISTORY = [
  {
    id: 'REV-2026-0004', label: 'REV-2026-0004', meta: 'Draft', isCurrent: true,
    name: 'Q3 Royalties Analytics',
    batch: '8482-A9B', generated: '2026-04-21',
    recovery: MOCK_AUDIT_RESULT.totalValueFormatted,
    findings: MOCK_AUDIT_RESULT.findingsCount,
    coverage: MOCK_AUDIT_RESULT.coverage,
    records: MOCK_AUDIT_RESULT.recordsProcessed,
    ruleSet: 'v321 (April 21, 2026)',
    template: 'executive' as TemplateKey,
  },
  {
    id: 'REV-2026-0003', label: 'REV-2026-0003', meta: 'Apr 15', isCurrent: false,
    name: 'Q2 Royalties Analytics',
    batch: '7301-B4C', generated: '2026-04-15',
    recovery: '$0.28M',
    findings: 4,
    coverage: 94,
    records: 1_280_440,
    ruleSet: 'v318 (April 1, 2026)',
    template: 'executive' as TemplateKey,
  },
  {
    id: 'REV-2026-0002', label: 'REV-2026-0002', meta: 'Mar 28', isCurrent: false,
    name: 'Q1 Mechanical Audit',
    batch: '6540-D2E', generated: '2026-03-28',
    recovery: '$0.19M',
    findings: 3,
    coverage: 91,
    records: 980_112,
    ruleSet: 'v305 (March 15, 2026)',
    template: 'technical' as TemplateKey,
  },
  {
    id: 'REV-2026-0001', label: 'REV-2026-0001', meta: 'Mar 12', isCurrent: false,
    name: 'Initial Baseline Audit',
    batch: '5200-F1A', generated: '2026-03-12',
    recovery: '$0.08M',
    findings: 2,
    coverage: 87,
    records: 720_300,
    ruleSet: 'v298 (March 1, 2026)',
    template: 'executive' as TemplateKey,
  },
] as const;

const SHARE_URL = 'https://audit.revorion.ai/reports/REV-2026-0004/s/a8f2...';

/* ── Block content renderer ── */
function BlockContent({ name }: { name: BlockName }) {
  switch (name) {
    case 'Findings Table':
      return (
        <>
          <table className={styles.miniTable}>
            <thead>
              <tr>
                <th>Contract</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>SoundExchange #4401</td><td>INV-2026-0892</td><td>$142,000</td><td>98%</td></tr>
              <tr><td>SoundExchange #4401</td><td>INV-2026-0756</td><td>$98,400</td><td>97%</td></tr>
              <tr><td>Spotify Recoupment</td><td>INV-2026-1102</td><td>$67,200</td><td>95%</td></tr>
              <tr><td>BMI License #8827</td><td>INV-2026-0445</td><td>$34,800</td><td>92%</td></tr>
              <tr><td>Spotify Recoupment</td><td>INV-2026-0981</td><td>$21,600</td><td>91%</td></tr>
            </tbody>
          </table>
          <span className={styles.miniTableFooter}>... and {(MOCK_AUDIT_RESULT.findingsCount - 5).toLocaleString()} more findings. See full export for details.</span>
        </>
      );

    case 'Variance Chart': {
      const sources = [
        { label: 'SoundExchange #4401', value: 240400, share: 66.1 },
        { label: 'Spotify Recoupment',  value: 88800,  share: 24.4 },
        { label: 'BMI License #8827',   value: 34800,  share: 9.5 },
      ];
      const total = sources.reduce((s, b) => s + b.value, 0);
      const max = Math.max(...sources.map(s => s.value));
      return (
        <div className={styles.vc}>
          <div className={styles.vcHead}>
            <div className={styles.vcHeadLeft}>
              <span className={styles.vcLabel}>Variance Distribution</span>
              <span className={styles.vcSubLabel}>by contract source · Q1 2026</span>
            </div>
            <div className={styles.vcHeadRight}>
              <span className={styles.vcTotalLabel}>Total</span>
              <span className={styles.vcTotalValue}>${total.toLocaleString()}</span>
            </div>
          </div>
          <div className={styles.vcBody}>
            {sources.map((s, i) => (
              <div key={s.label} className={styles.vcItem}>
                <div className={styles.vcItemHead}>
                  <span className={styles.vcItemIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.vcItemName}>{s.label}</span>
                  <span className={styles.vcItemAmount}>${s.value.toLocaleString()}</span>
                </div>
                <div className={styles.vcBar}>
                  <div
                    className={styles.vcBarInner}
                    style={{ width: `${(s.value / max) * 100}%` }}
                  />
                </div>
                <span className={styles.vcItemShare}>{s.share}% of total variance</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'Coverage Stats': {
      const matched = Math.round(MOCK_AUDIT_RESULT.recordsProcessed * MOCK_AUDIT_RESULT.coverage / 100);
      const unmatched = MOCK_AUDIT_RESULT.recordsProcessed - matched;
      return (
        <div className={styles.coverageGrid}>
          <div className={styles.coverageStat}><strong>Records processed:</strong> {MOCK_AUDIT_RESULT.recordsProcessed.toLocaleString()}</div>
          <div className={styles.coverageStat}><strong>Coverage rate:</strong> {MOCK_AUDIT_RESULT.coverage}%</div>
          <div className={styles.coverageStat}><strong>Fully matched:</strong> {matched.toLocaleString()}</div>
          <div className={styles.coverageStat}><strong>Unmatched:</strong> {unmatched.toLocaleString()}</div>
        </div>
      );
    }

    case 'Rule Set Reference':
      return (
        <ul className={styles.ruleRefList}>
          <li>Spotify recoupment rate ≥ $0.005/stream (v321)</li>
          <li>SoundExchange minimum quarterly payout threshold (v318)</li>
          <li>BMI license fee cap: $12,000/quarter (v305)</li>
          <li>Mechanical royalty floor: 9.1¢/unit (v298)</li>
        </ul>
      );

    case 'Custom Text':
      return (
        <p className={styles.customText}>
          Analysis prepared by the Revorion AuditGraph system. This report reflects the rule set v321 active on April 21, 2026. All findings are subject to counterparty verification.
        </p>
      );

    case 'Finding Detail':
      return (
        <div className={styles.findingDetail}>
          <strong>Finding #1:</strong> Spotify Recoupment — INV-2026-1102 — $1,200 variance at 95% confidence.
          Contract clause 4.2 specifies minimum recoupment of $0.005/stream. Actual rate: $0.0032/stream.
        </div>
      );

    case 'Recovery Status':
      return (
        <table className={styles.recoveryTable}>
          <thead>
            <tr><th>Finding</th><th>Status</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>SoundExchange #4401</td><td>Recovery Sent</td><td>$142,000</td></tr>
            <tr><td>Spotify Recoupment</td><td>Disputed</td><td>$67,200</td></tr>
            <tr><td>BMI License #8827</td><td>Recovered</td><td>$34,800</td></tr>
          </tbody>
        </table>
      );

    default:
      return null;
  }
}

/* ── Share Link Modal ── */
function ShareLinkModal({
  onClose,
  onSave,
  onDisable,
}: {
  onClose: () => void;
  onSave: () => void;
  onDisable: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [access, setAccess] = useState('anyone');
  const [expiration, setExpiration] = useState('30 days');
  const [password, setPassword] = useState('');

  function handleCopy() {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(SHARE_URL);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal
      contextLabel="SHARE REPORT"
      title="Q3 Royalties Analytics (REV-2026-0004)"
      onClose={onClose}
      width={480}
    >
      <div className={styles.modalBodyStack}>
        <div className={styles.modalField}>
          <span className={styles.modalFieldLabel}>Shareable Link</span>
          <span className={styles.modalFieldHint}>
            Anyone with this link can view the report. No login required.
          </span>
        </div>
        <div className={styles.linkFieldRow}>
          <input
            className={styles.linkInput}
            readOnly
            value={SHARE_URL}
          />
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <FormSelect
          label="Access"
          value={access}
          onChange={setAccess}
          options={SHARE_ACCESS_OPTIONS.map((option) => ({ ...option }))}
          className={styles.modalSelect}
        />
        <FormSelect
          label="Link expiration"
          value={expiration}
          onChange={setExpiration}
          options={SHARE_EXPIRATION_OPTIONS.map((option) => ({ ...option }))}
          className={styles.modalSelect}
        />

        <div className={styles.modalField}>
          <span className={styles.modalFieldLabel}>Password protection (optional)</span>
          <input
            className={styles.modalTextInput}
            type="text"
            placeholder="No password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.disableLink} onClick={onDisable}>
            Disable Link
          </button>
          <div className={styles.modalFooterRight}>
            <button className={styles.modalCancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.modalPrimaryBtn} onClick={onSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── Revert to Draft Dialog ── */
function RevertToDraftDialog({
  onClose,
  onRevert,
}: {
  onClose: () => void;
  onRevert: () => void;
}) {
  return (
    <Modal
      contextLabel="REPORT STATUS"
      title="Revert to draft"
      onClose={onClose}
      width={440}
    >
      <div className={styles.modalBodyStack}>
        <div className={styles.revertBanner}>
          <span className={styles.revertBannerBold}>This report has been finalized.</span>
          <span className={styles.revertBannerText}>
            Reverting to draft will unlock editing. Any shared links will continue to show the last finalized version until you re-finalize.
          </span>
        </div>

        <div className={styles.revertMeta}>
          <span>Finalized by:</span>
          <span className={styles.revertMetaValue}>Sarah Cone on April 21, 2026 at 15:04 UTC</span>
        </div>

        <div className={styles.modalFooter}>
          <span />
          <div className={styles.modalFooterRight}>
            <button className={styles.modalCancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.modalPrimaryBtn} onClick={onRevert}>
              Revert to Draft
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── Main component ── */
export default function ReportingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const auditStateBySilo = useAppStore((s) => s.auditStateBySilo);

  const hasAuditResult = auditStateBySilo[activeSiloId] === 'COMPLETE';

  /* Dev override */
  const devParam = searchParams.get('reporting-state');

  let effectiveHasAudit = hasAuditResult;
  let devIsFinalized = false;
  if (devParam === 'reporting-empty') effectiveHasAudit = false;
  if (devParam === 'reporting-draft') { effectiveHasAudit = true; }
  if (devParam === 'reporting-finalized') { effectiveHasAudit = true; devIsFinalized = true; }

  /* Local state */
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('executive');
  const [pendingTemplate, setPendingTemplate] = useState<TemplateKey | null>(null);
  const [canvasBlocks, setCanvasBlocks] = useState<BlockName[]>(TEMPLATE_BLOCKS.executive);
  const [reportName, setReportName] = useState('Q3 Royalties Analytics');
  const [pageFormat, setPageFormat] = useState('US Letter');
  const [isFinalized, setIsFinalized] = useState(devIsFinalized);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRevertDialog, setShowRevertDialog] = useState(false);
  const [exportPdfState, setExportPdfState] = useState<'idle' | 'loading'>('idle');
  const [exportCsvState, setExportCsvState] = useState<'idle' | 'loading'>('idle');
  const [selectedHistory, setSelectedHistory] = useState('REV-2026-0004');
  const [toast, setToast] = useState<string | null>(null);

  const activeReport = REPORT_HISTORY.find((r) => r.id === selectedHistory) ?? REPORT_HISTORY[0];

  function selectHistoryItem(id: string) {
    setSelectedHistory(id);
    const report = REPORT_HISTORY.find((r) => r.id === id);
    if (report) {
      setReportName(report.name);
      setCanvasBlocks(TEMPLATE_BLOCKS[report.template]);
      setActiveTemplate(report.template);
      setIsFinalized(!report.isCurrent);
    }
  }

  /* Inline banners — session-dismissed */
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const dismissBanner = (id: string) => setDismissedBanners((prev) => [...prev, id]);

  /* Tip Carousel */
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % TIPS.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + TIPS.length) % TIPS.length);

  /* Sync dev param for finalized */
  useEffect(() => {
    if (devParam === 'reporting-finalized') setIsFinalized(true);
    if (devParam === 'reporting-draft') setIsFinalized(false);
    if (devParam === 'reporting-empty') setIsFinalized(false);
  }, [devParam]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* Template change */
  function handleTemplateChange(key: TemplateKey) {
    if (key === activeTemplate && canvasBlocks.length === TEMPLATE_BLOCKS[key].length) return;
    if (canvasBlocks.length > 0 && key !== activeTemplate) {
      setPendingTemplate(key);
    } else {
      applyTemplate(key);
    }
  }

  function applyTemplate(key: TemplateKey) {
    setActiveTemplate(key);
    setCanvasBlocks([...TEMPLATE_BLOCKS[key]]);
    setPendingTemplate(null);
    if (!REPORT_HISTORY.find(r => r.id === selectedHistory)?.isCurrent) return;
    setIsFinalized(false);
  }

  /* Block management */
  function removeBlock(name: BlockName) {
    setCanvasBlocks((prev) => prev.filter((b) => b !== name));
  }

  function addBlock(name: BlockName) {
    if (!canvasBlocks.includes(name)) {
      setCanvasBlocks((prev) => [...prev, name]);
    }
  }

  /* Export */
  function handleExportPdf() {
    if (exportPdfState === 'loading') return;
    setExportPdfState('loading');
    setTimeout(() => {
      setExportPdfState('idle');
      showToast('PDF exported successfully.');
    }, 2000);
  }

  function handleExportCsv() {
    if (exportCsvState === 'loading') return;
    setExportCsvState('loading');
    setTimeout(() => {
      setExportCsvState('idle');
      showToast('CSV exported successfully.');
    }, 2000);
  }

  /* Finalize */
  function handleFinalize() {
    setIsFinalized(true);
    showToast('Report finalized.');
  }

  /* Revert */
  function handleRevert() {
    setIsFinalized(false);
    setShowRevertDialog(false);
    showToast('Report reverted to draft.');
  }

  /* Dev toggle */
  function handleDevChange(val: string) {
    const p = new URLSearchParams(searchParams);
    if (val === '') {
      p.delete('reporting-state');
    } else {
      p.set('reporting-state', val);
    }
    setSearchParams(p, { replace: true });
  }

  /* ── Render: EMPTY ── */
  if (!effectiveHasAudit) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.topTipStrip}>
            <div className={styles.topTipInner}>
              <div className={styles.topTipContent}>
                <Idea size={20} className={styles.topTipIcon} />
                <span className={styles.topTipText}>{TIPS[currentTip]}</span>
              </div>
            </div>
            <div className={styles.topTipControls}>
              <button onClick={prevTip} className={styles.topTipBtn} aria-label="Previous tip">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextTip} className={styles.topTipBtn} aria-label="Next tip">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className={styles.emptyStage}>
          <div className={styles.emptyIntro}>
            <span className={styles.emptyEyebrow}>First report</span>
            <span className={styles.emptyHeroTitle}>Reporting starts when the first audit completes.</span>
            <p className={styles.emptyHeroBody}>
              AuditGraph assembles the first draft automatically from findings, recovery status,
              coverage, and the active rule set. Review it here once the run is done.
            </p>
            <div className={styles.emptyActionRow}>
              <button className={styles.goToAuditBtn} onClick={() => navigate('/app/audit')}>
                Go to Audit
              </button>
              <span className={styles.emptyActionNote}>No manual setup required before that.</span>
            </div>
          </div>

          <div className={styles.emptyMetaCard}>
            <span className={styles.emptyMetaLabel}>What appears here</span>
            <span className={styles.emptyMetaTitle}>Executive summary, findings, exports, and share links.</span>
            <span className={styles.emptyMetaBody}>
              Draft and finalized states will both live in this workspace, alongside report history
              and delivery controls for your stakeholders.
            </span>
          </div>
        </div>
        </div>

        {/* Simulate state toggle */}
        <div className={styles.devToggle}>
          <span>SIMULATE STATE</span>
          <select
            value={devParam ?? ''}
            onChange={(e) => handleDevChange(e.target.value)}
          >
            <option value="">Live state</option>
            <option value="reporting-empty">reporting-empty</option>
            <option value="reporting-draft">reporting-draft</option>
            <option value="reporting-finalized">reporting-finalized</option>
          </select>
        </div>
      </div>
    );
  }

  /* Reporting page inline banner */
  const reportingBanner = (() => {
    if (isFinalized && !dismissedBanners.includes('report-finalized')) {
      return (
        <InlineBanner
          id="report-finalized"
          variant="amber"
          title="Report finalized."
          body="This report is locked and cannot be edited. To make changes, revert to draft first."
          onDismiss={dismissBanner}
        />
      );
    }
    return null;
  })();

  /* ── Render: POPULATED ── */
  return (
    <div className={styles.page}>
      {reportingBanner}
      <div className={styles.content}>
        <div className={styles.topTipStrip}>
          <div className={styles.topTipInner}>
            <div className={styles.topTipContent}>
              <Idea size={20} className={styles.topTipIcon} />
              <span className={styles.topTipText}>{TIPS[currentTip]}</span>
            </div>
          </div>
          <div className={styles.topTipControls}>
            <button onClick={prevTip} className={styles.topTipBtn} aria-label="Previous tip">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextTip} className={styles.topTipBtn} aria-label="Next tip">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles.panels}>
        {/* ── Left panel ── */}
        <div className={styles.leftPanel}>
          <div className={styles.leftHeader}>
            <span className={styles.leftHeaderTitle}>Report Builder</span>
            <span className={styles.leftHeaderSub}>Build the document structure and choose what appears on the page.</span>
          </div>

          {/* Template selector */}
          <div className={styles.leftSection}>
            <FormSelect
              label="Template"
              value={pendingTemplate ?? activeTemplate}
              onChange={(value) => {
                if (!isFinalized) handleTemplateChange(value as TemplateKey);
              }}
              options={TEMPLATE_OPTIONS.map((option) => ({ ...option }))}
              className={`${styles.controlSelect} ${isFinalized ? styles.controlSelectDisabled : ''}`}
            />

            {pendingTemplate && (
              <div className={styles.templateConfirm}>
                <span className={styles.templateConfirmTitle}>Switch template?</span>
                <span className={styles.templateConfirmBody}>
                  Replace the current layout with {TEMPLATE_LABELS[pendingTemplate]}. Existing blocks on the canvas will be removed.
                </span>
                <div className={styles.templateConfirmActions}>
                  <button className={styles.confirmReplaceBtn} onClick={() => applyTemplate(pendingTemplate)}>Replace</button>
                  <button className={styles.confirmCancelBtn} onClick={() => setPendingTemplate(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Available blocks */}
          <div className={`${styles.leftSection} ${styles.sectionBreak}`}>
            <span className={styles.sectionLabel}>Available Blocks</span>
            {ALL_BLOCKS.map((block) => {
              const onCanvas = canvasBlocks.includes(block);
              return (
                <button
                  key={block}
                  className={`${styles.blockItem} ${onCanvas ? styles.blockItemOnCanvas : ''}`}
                  onClick={() => !isFinalized && !onCanvas && addBlock(block)}
                  disabled={isFinalized || onCanvas}
                  title={onCanvas ? 'Already on canvas' : `Add ${block} to canvas`}
                >
                  <span className={styles.blockItemHandle}>≡</span>
                  <span>{block}</span>
                </button>
              );
            })}
          </div>

          {/* Report history */}
          <div className={`${styles.leftSection} ${styles.sectionBreak} ${styles.historySection}`}>
            <span className={styles.sectionLabel}>Report History</span>
            {REPORT_HISTORY.map((item) => (
              <div
                key={item.id}
                className={`${styles.historyItem} ${selectedHistory === item.id ? styles.historyItemActive : ''}`}
                onClick={() => selectHistoryItem(item.id)}
              >
                <div className={styles.historyText}>
                  <span className={selectedHistory === item.id ? styles.historyId : styles.historyIdInactive}>
                    {item.label}
                  </span>
                  <span className={styles.historyMeta}>{item.meta}</span>
                </div>
                {item.isCurrent && <span className={styles.currentBadge}>Current</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Center canvas panel ── */}
        <div className={styles.centerPanel}>
          <div className={styles.canvasTopBar}>
            <span className={styles.canvasTopLabel}>Report Canvas</span>
          </div>

          <div className={styles.canvasArea}>
            <div className={styles.reportPage}>
              {/* Finalized banner */}
              {isFinalized && (
                <div className={styles.finalizedBanner}>
                  <span className={styles.finalizedBannerText}>
                    This report has been finalized and cannot be edited.
                  </span>
                </div>
              )}

              <div className={styles.reportContent}>
                {/* Page document header (permanent — not removable) */}
                <div className={styles.docHeader}>
                  <div className={styles.docLogoRow}>
                    <img src="/header/brand-mark.png" alt="Revorion" className={styles.docLogoImg} />
                  </div>
                  <span className={styles.docReportLabel}>Audit Execution Report</span>
                  <span className={styles.docTitle}>{reportName}</span>
                  <span className={styles.docMeta}>Batch: {activeReport.batch} | Silo: Music &amp; Royalty | Generated: {activeReport.generated}</span>
                  <hr className={styles.docDivider} />

                  <div className={styles.docSummary}>
                    <div className={styles.docSummaryHero}>
                      <span className={styles.docSummaryLabel}>Potential Recovery</span>
                      <span className={styles.docSummaryHeroValue}>{activeReport.recovery}</span>
                      <span className={styles.docSummarySub}>Total variance across all findings</span>
                    </div>
                    <div className={styles.docSummaryRow}>
                      <div className={styles.docSummaryItem}>
                        <span className={styles.docSummaryLabel}>Findings</span>
                        <span className={styles.docSummaryValue}>{activeReport.findings.toLocaleString()}</span>
                        <span className={styles.docSummarySub}>Across {activeReport.isCurrent ? '9' : Math.max(2, activeReport.findings + 1)} contract sources</span>
                      </div>
                      <div className={styles.docSummaryItem}>
                        <span className={styles.docSummaryLabel}>Coverage</span>
                        <span className={styles.docSummaryValue}>{activeReport.coverage}%</span>
                        <span className={styles.docSummarySub}>Of {activeReport.records.toLocaleString()} eligible records</span>
                      </div>
                    </div>
                  </div>
                  <hr className={styles.docDivider} />
                </div>

                {/* Canvas blocks */}
                {canvasBlocks.length === 0 ? (
                  <div className={styles.dropZone}>
                    <span className={styles.dropZoneTitle}>Drop Zone</span>
                    <span className={styles.dropZoneText}>Drag and drop report blocks here</span>
                    <span className={styles.dropZoneText}>from the left pane</span>
                  </div>
                ) : (
                  canvasBlocks.map((blockName) => (
                    <div key={blockName} className={styles.block}>
                      {!isFinalized && (
                        <div className={styles.blockControls}>
                          <span className={styles.blockDragHandle} title="Drag to reorder">≡</span>
                          <button
                            className={styles.blockRemoveBtn}
                            onClick={() => removeBlock(blockName)}
                            title="Remove block"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      <div className={styles.blockHeader}>
                        <span className={styles.blockHeaderLabel}>Block: {blockName}</span>
                      </div>
                      <BlockContent name={blockName} />
                      <hr className={styles.docDivider} />
                    </div>
                  ))
                )}

                {/* Page footer */}
                <div className={styles.docFooter}>
                  <span className={styles.docFooterText}>REVORION · AUDITGRAPH</span>
                  <span className={styles.docFooterText}>CONFIDENTIAL · INTERNAL</span>
                  <span className={styles.docFooterText}>01 / 01</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className={styles.rightPanel}>
          <div className={styles.rightHeader}>
            <span className={styles.rightHeaderTitle}>Properties</span>
          </div>

          <div className={`${styles.rightSection} ${styles.rightSectionForm}`}>
            <div className={styles.propField}>
              <span className={styles.propLabel}>Report Name</span>
              <input
                className={styles.propInput}
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                disabled={isFinalized}
              />
            </div>

            <div className={styles.propField}>
              <FormSelect
                label="Page Format"
                value={pageFormat}
                onChange={(value) => {
                  if (!isFinalized) setPageFormat(value);
                }}
                options={PAGE_FORMAT_OPTIONS}
                className={`${styles.controlSelect} ${isFinalized ? styles.controlSelectDisabled : ''}`}
              />
            </div>

            <div className={styles.propField}>
              <span className={styles.propLabel}>Status</span>
              <span className={isFinalized ? styles.statusBadgeFinal : styles.statusBadgeDraft}>
                {isFinalized ? 'Final' : 'Draft'}
              </span>
            </div>

            <div className={styles.propField}>
              <span className={styles.propLabel}>Generated</span>
              <span className={styles.propValue}>{MOCK_AUDIT_RESULT.completedAt}</span>
              <span className={styles.propMeta}>Auto-generated on audit completion</span>
            </div>

            {isFinalized && (
              <div className={styles.propField}>
                <span className={styles.propLabel}>Finalized</span>
                <span className={styles.propValue}>April 21, 2026 at 15:04 UTC</span>
                <span className={styles.propMeta}>by Sarah Cone</span>
              </div>
            )}
          </div>

          <hr className={styles.rightDivider} />

          <div className={`${styles.rightSection} ${styles.rightSectionCompact}`}>
            <span className={styles.propLabel}>Rule Set Version</span>
            <span className={`${styles.propValue} ${styles.propValueTight}`}>{activeReport.ruleSet}</span>
          </div>

          <hr className={styles.rightDivider} />

          <div className={`${styles.rightSection} ${styles.rightSectionActions}`}>
            <span className={styles.propLabel}>Actions</span>

            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={handleExportPdf}
              disabled={exportPdfState === 'loading'}
            >
              {exportPdfState === 'loading' ? 'Generating PDF…' : 'Export PDF'}
            </button>

            <button
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={handleExportCsv}
              disabled={exportCsvState === 'loading'}
            >
              {exportCsvState === 'loading' ? 'Generating CSV…' : 'Export CSV'}
            </button>

            <button
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={() => setShowShareModal(true)}
            >
              Share link
            </button>

            {isFinalized ? (
              <button
                className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                onClick={() => setShowRevertDialog(true)}
              >
                Revert to Draft
              </button>
            ) : (
              <button
                className={`${styles.actionBtn} ${styles.actionBtnFinalize}`}
                onClick={handleFinalize}
              >
                Finalize
              </button>
            )}

            {!isFinalized && (
              <p className={styles.actionDisclaimer}>
                Finalizing locks the report and marks it as the official record.
              </p>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showShareModal && (
        <ShareLinkModal
          onClose={() => setShowShareModal(false)}
          onSave={() => { setShowShareModal(false); showToast('Link settings saved.'); }}
          onDisable={() => { setShowShareModal(false); showToast('Share link disabled.'); }}
        />
      )}

      {showRevertDialog && (
        <RevertToDraftDialog
          onClose={() => setShowRevertDialog(false)}
          onRevert={handleRevert}
        />
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Simulate state toggle */}
      <div className={styles.devToggle}>
        <span>SIMULATE STATE</span>
        <select
          value={devParam ?? ''}
          onChange={(e) => handleDevChange(e.target.value)}
        >
          <option value="">Live state</option>
          <option value="reporting-empty">reporting-empty</option>
          <option value="reporting-draft">reporting-draft</option>
          <option value="reporting-finalized">reporting-finalized</option>
        </select>
      </div>
    </div>
  );
}
