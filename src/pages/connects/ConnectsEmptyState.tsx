import type { SourceCategory } from '../../types';
import styles from './ConnectsEmptyState.module.css';

interface Props {
  onAddSource: (category: SourceCategory) => void;
  onRequestIntegration: () => void;
}

export default function ConnectsEmptyState({ onAddSource, onRequestIntegration }: Props) {
  return (
    <div className={styles.emptyRoot}>
      <h2 className={styles.heading}>No data sources connected yet</h2>
      <p className={styles.subheading}>
        AuditGraph compares your contracts against billing records to find discrepancies.
        Connect at least one contract source and one billing source to begin.
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Contracts</span>
          <span className={styles.cardQuestion}>Where are your contracts stored?</span>
          <span className={styles.cardDescription}>
            Connect systems that hold your agreements, licenses, and terms.
          </span>
          <button className={styles.cardCta} onClick={() => onAddSource('contracts')}>
            + Add contract source
          </button>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Statements</span>
          <span className={styles.cardQuestion}>Where are your invoices?</span>
          <span className={styles.cardDescription}>
            Connect systems that hold your billing records and payment data.
          </span>
          <button className={styles.cardCta} onClick={() => onAddSource('billing')}>
            + Add billing source
          </button>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Recovery</span>
          <span className={styles.cardQuestion}>How should we draft recovery emails?</span>
          <span className={styles.cardDescription}>
            Connect your email so we can draft recovery messages. We never send without your
            explicit approval.
          </span>
          <button className={styles.cardCta} onClick={() => onAddSource('recovery')}>
            + Connect email (optional)
          </button>
        </div>
      </div>

      <p className={styles.requestLink}>
        Don't see your system?{' '}
        <strong onClick={onRequestIntegration}>Request integration</strong>
      </p>
    </div>
  );
}
