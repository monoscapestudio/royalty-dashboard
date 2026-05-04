import type { DataSource, SourceCategory } from '../../../types';
import StatusBadge from '../../../components/ui/StatusBadge';
import styles from './SourceSection.module.css';

const COL_GRID = 'minmax(160px, 2fr) 96px 96px 160px minmax(140px, 1fr)';

const CATEGORY_META: Record<
  SourceCategory,
  { label: string; addLabel: string; colHeader: string }
> = {
  contracts: {
    label: 'Contracts',
    addLabel: '+ Add contract source',
    colHeader: 'Source',
  },
  billing: {
    label: 'Billing',
    addLabel: '+ Add billing source',
    colHeader: 'Source',
  },
  recovery: {
    label: 'Recovery',
    addLabel: '+ Connect email channel',
    colHeader: 'Channel',
  },
};

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
  const liveCount = sources.filter((s) => s.status === 'live').length;

  return (
    <div className={styles.section}>
      {/* Section label */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>{meta.label}</span>
        <span className={styles.sectionCount}>
          {sources.length} {sources.length === 1 ? 'source' : category === 'recovery' ? 'channel' : 'sources'}
        </span>
      </div>

      <div className={styles.table} style={{ '--col-grid': COL_GRID } as React.CSSProperties}>
        {/* Recovery section: disclaimer banner before column headers */}
        {category === 'recovery' && (
          <div className={styles.recoveryDisclaimer}>
            <span className={styles.recoveryDisclaimerText}>
              Revorion drafts emails on your behalf but never sends without your explicit approval.
            </span>
          </div>
        )}

        {/* Column headers */}
        <div className={styles.colHeader}>
          <span className={styles.colHeaderCell}>{meta.colHeader}</span>
          <span className={styles.colHeaderCell}>Type</span>
          <span className={styles.colHeaderCell}>Status</span>
          <span className={styles.colHeaderCell}>Last Sync</span>
          <span className={styles.colHeaderCell}>Actions</span>
        </div>

        {/* Data rows */}
        {sources.map((src) => (
          <div key={src.id} className={styles.row}>
            <span className={styles.cellSource}>{src.name}</span>
            <span className={styles.cellType}>{src.type}</span>
            <StatusBadge status={src.status} />
            <span className={src.status === 'fix' ? styles.cellSyncFailed : styles.cellSync}>
              {src.lastSync}
            </span>
            <div className={styles.cellActions}>
              {src.status === 'fix' ? (
                <button className={styles.reconnectBtn} onClick={() => onReconnect?.(src)}>
                  Reconnect
                </button>
              ) : src.status === 'pending' ? (
                <span className={`${styles.actionLink} ${styles.actionLinkMuted}`}>
                  Provisioning...
                </span>
              ) : (
                <>
                  <button className={styles.actionLink} onClick={() => onConfigure(src)}>
                    Configure
                  </button>
                  <button
                    className={`${styles.actionLink} ${styles.actionLinkMuted}`}
                    onClick={() => onRemove(src)}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add source dashed row */}
        <button className={styles.addRow} onClick={() => onAddSource(category)}>
          <span className={styles.addRowLabel}>{meta.addLabel}</span>
        </button>
      </div>

      {/* Request integration (billing only per wireframe) */}
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
