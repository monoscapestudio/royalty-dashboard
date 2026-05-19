import { useState } from 'react';
import type { AiSuggestion } from '../../../types';
import styles from './AiSuggestionsPanel.module.css';

interface Props {
  suggestions: AiSuggestion[];
  onApprove: (suggestion: AiSuggestion) => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
}

export default function AiSuggestionsPanel({ suggestions, onApprove, onDismiss, onClose }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = suggestions.filter((s) => !dismissed.has(s.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    onDismiss(id);
  };

  const handleApprove = (suggestion: AiSuggestion) => {
    setDismissed((prev) => new Set([...prev, suggestion.id]));
    onApprove(suggestion);
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.aiBadge}>AI</span>
            <span className={styles.panelTitle}>AI-Identified Rules</span>
          </div>
          <div className={styles.panelMeta}>
            {visible.length} suggestion{visible.length !== 1 ? 's' : ''} pending review
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </div>

        <div className={styles.panelBody}>
          {visible.length === 0 ? (
            <div className={styles.empty}>All suggestions reviewed.</div>
          ) : (
            visible.map((suggestion) => (
              <div key={suggestion.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <span className={styles.suggestionText}>{suggestion.text}</span>
                  <span className={styles.suggestionMeta}>
                    Confidence: {suggestion.confidence}%&nbsp;&nbsp;·&nbsp;&nbsp;
                    Affected records: {suggestion.affectedRecords}
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
            ))
          )}
        </div>
      </div>
    </>
  );
}
