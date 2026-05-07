import { useState } from 'react';
import type { AiSuggestion } from '../../../types';
import styles from './AiSuggestionsSection.module.css';

interface Props {
  suggestions: AiSuggestion[];
  onApprove: (suggestion: AiSuggestion) => void;
  onDismiss: (id: string) => void;
}

let _id = 3000;

export default function AiSuggestionsSection({ suggestions, onApprove, onDismiss }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (suggestions.length === 0) return null;

  const visible = suggestions.filter((s) => !dismissed.has(s.id));
  if (visible.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    onDismiss(id);
  };

  const handleApprove = (suggestion: AiSuggestion) => {
    setDismissed((prev) => new Set([...prev, suggestion.id]));
    onApprove(suggestion);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>AI-Identified Rules</span>
        <span className={styles.suggestionCount}>{visible.length} suggestion{visible.length !== 1 ? 's' : ''}</span>
      </div>

      {visible.map((suggestion) => (
        <div key={suggestion.id} className={styles.card}>
          <div className={styles.cardLeft}>
            <span className={styles.aiBadge}>AI Suggestion</span>
            <span className={styles.suggestionText}>{suggestion.text}</span>
            <span className={styles.suggestionMeta}>
              {`Confidence: ${suggestion.confidence}%  |  Affected records: ${suggestion.affectedRecords}`}
            </span>
          </div>
          <div className={styles.cardActions}>
            <button className={styles.btnApprove} onClick={() => handleApprove(suggestion)}>
              Approve
            </button>
            <button className={styles.btnEdit}>Edit</button>
            <button className={styles.btnDismiss} onClick={() => handleDismiss(suggestion.id)}>
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
