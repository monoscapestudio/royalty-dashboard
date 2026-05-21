import type { DataSource, SourceCategory } from '../../../types';
import StatusBadge from '../../../components/ui/StatusBadge';
import styles from './SourceSection.module.css';

const CATEGORY_META: Record<
  SourceCategory,
  { label: string; addLabel: string; hint: string }
> = {
  contracts: { label: 'Contract', addLabel: '+ Add source', hint: 'Where your deal terms live' },
  billing: { label: 'Billing', addLabel: '+ Add source', hint: 'Where payments are tracked' },
  recovery: { label: 'Recovery', addLabel: '+ Connect channel', hint: 'How you reach out to collect' },
};

function getTooltipText(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('soundexchange')) return "Syncs monthly royalty statements and tracks deduplication automatically.";
  if (lower.includes('google drive')) return "Scans uploaded PDFs for key terms and payout obligations.";
  if (lower.includes('quickbooks')) return "Reads inbound payment invoices and maps them against contract payouts.";
  if (lower.includes('spotify')) return "Pulls direct streaming data to cross-reference against payouts.";
  if (lower.includes('netsuite')) return "Connects to your general ledger to verify recorded receipts.";
  if (lower.includes('gmail')) return "Drafts recovery emails directly to licensors (requires your approval).";
  return "Connects to this system to read your records and verify payouts.";
}

interface Props {
  category: SourceCategory;
  sources: DataSource[];
  onAddSource: (category: SourceCategory) => void;
  onConfigure: (source: DataSource) => void;
  onRemove: (source: DataSource) => void;
  onReconnect?: (source: DataSource) => void;
  onRequestIntegration?: () => void;
  showRequestIntegration?: boolean;
}

export default function SourceSection({
  category,
  sources,
  onAddSource,
  onConfigure,
  onRemove,
  onReconnect,
  onRequestIntegration,
  showRequestIntegration = false,
}: Props) {
  const meta = CATEGORY_META[category];

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{meta.label}</span>
        <span className={styles.columnCount}>{sources.length}</span>
      </div>

      <div className={styles.columnHint}>{meta.hint}</div>

      <div className={styles.list}>
        {sources.map((src) => (
          <div key={src.id} className={styles.card}>
            <div className={styles.tooltip}>
              {getTooltipText(src.name)}
            </div>

            <div className={styles.cardTop}>
              <span className={styles.cardName}>{src.name}</span>
              <StatusBadge status={src.status} />
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.cardType}>{src.type}</span>
              <span className={styles.cardDot}>·</span>
              <span className={src.status === 'fix' ? styles.cardSyncFailed : styles.cardSync}>
                {src.lastSync}
              </span>
            </div>
            <div className={styles.cardActions}>
              {src.status === 'fix' ? (
                <button className={styles.reconnectBtn} onClick={() => onReconnect?.(src)}>
                  Reconnect
                </button>
              ) : src.status === 'pending' ? (
                <span className={styles.actionMuted}>Provisioning...</span>
              ) : (
                <>
                  <button className={styles.actionLink} onClick={() => onConfigure(src)}>
                    Configure
                  </button>
                  <button className={`${styles.actionLink} ${styles.actionLinkDanger}`} onClick={() => onRemove(src)}>
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addBtn} onClick={() => onAddSource(category)}>
        {meta.addLabel}
      </button>

      {showRequestIntegration && (
        <div className={styles.requestRow}>
          <span className={styles.requestText}>Don't see your system?</span>
          <button className={styles.requestLink} onClick={onRequestIntegration}>
            Request integration
          </button>
        </div>
      )}
    </div>
  );
}
