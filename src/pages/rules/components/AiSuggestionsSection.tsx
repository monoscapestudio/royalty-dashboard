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
          <span className={styles.summaryLabel}>
            AI Identified
            <br />
            rules
          </span>
        </div>
        <button className={styles.reviewBtn} onClick={onReview}>
          Review suggestions
        </button>
      </div>
      <span className={styles.summaryText}>
        {suggestions.length} new candidate rules were detected by cross-referencing
        recent audit findings with your contract terms and historical billing
        patterns. Review each suggestion to approve, edit, or dismiss before
        it becomes active.
      </span>
    </div>
  );
}
