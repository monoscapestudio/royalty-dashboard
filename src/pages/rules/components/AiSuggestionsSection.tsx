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
      <div className={styles.summaryLeft}>
        <span className={styles.aiBadge}>AI</span>
        <span className={styles.summaryText}>
          <strong>{suggestions.length}</strong> AI-identified rules
        </span>
      </div>
      <button className={styles.reviewBtn} onClick={onReview}>
        Click to review →
      </button>
    </div>
  );
}
