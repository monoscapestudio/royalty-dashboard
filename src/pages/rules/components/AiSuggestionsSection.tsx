import type { AiSuggestion } from '../../../types';
import styles from './AiSuggestionsSection.module.css';

interface Props {
  suggestions: AiSuggestion[];
  onReview: () => void;
}

export default function AiSuggestionsSection({ suggestions, onReview }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div className={styles.summaryBar}>
      <div className={styles.summaryTop}>
        <div className={styles.summaryTitleRow}>
          <span className={styles.aiBadge}>AI</span>
          <span className={styles.summaryLabel}>
            Identified
            <br />
            rules
          </span>
          <span className={styles.summaryCount}>{suggestions.length}</span>
        </div>
        <button className={styles.reviewBtn} onClick={onReview}>
          Review suggestions
        </button>
      </div>
      <span className={styles.summaryText}>
        AI identified new candidate rules based on recent audit patterns and source anomalies.
      </span>
    </div>
  );
}
