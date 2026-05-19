import type { DataSource, SourceCategory } from '../../../types';
import StatusBadge from '../../../components/ui/StatusBadge';
import styles from './SourceSection.module.css';

const CATEGORY_META: Record<
  SourceCategory,
  { label: string; addLabel: string }
> = {
  contracts: { label: 'Contract', addLabel: '+ Add source' },
  billing: { label: 'Billing', addLabel: '+ Add source' },
  recovery: { label: 'Recovery', addLabel: '+ Connect channel' },
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

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{meta.label}</span>
        <span className={styles.columnCount}>{sources.length}</span>
      </div>

      {category === 'recovery' && (
        <div className={styles.disclaimer}>
          Emails are never sent without your explicit approval.
        </div>
      )}

      <div className={styles.list}>
        {sources.map((src) => (
          <div key={src.id} className={styles.card}>
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
