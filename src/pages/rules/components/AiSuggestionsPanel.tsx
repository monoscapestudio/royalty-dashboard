import { useState } from 'react';
import type { AiSuggestion } from '../../../types';
import styles from './AiSuggestionsPanel.module.css';

interface Props {
  suggestions: AiSuggestion[];
  onApprove: (suggestion: AiSuggestion) => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
  mode?: 'overlay' | 'page';
}

export default function AiSuggestionsPanel({
  suggestions,
  onApprove,
  onDismiss,
  onClose,
  mode = 'overlay',
}: Props) {
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

  const header = (
    <div className={styles.panelHeader}>
      <div className={styles.panelTitleGroup}>
        <span className={styles.aiBadge}>AI</span>
        <span className={styles.panelTitle}>AI-Identified Rules</span>
      </div>
      <div className={styles.panelMeta}>
        {visible.length} suggestion{visible.length !== 1 ? 's' : ''} pending review
      </div>
      <button className={styles.closeBtn} onClick={onClose} aria-label={mode === 'page' ? 'Back to rules' : 'Close panel'}>
        {mode === 'page' ? 'Back' : '✕'}
      </button>
    </div>
  );

  const body = (
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
  );

  if (mode === 'page') {
    return (
      <div className={styles.pageShell}>
        <div className={styles.pageIntro}>
          <div className={styles.pageIntroTop}>
            <span className={styles.pageEyebrow}>Apply Rules</span>
            <span className={styles.pageCount}>{visible.length}</span>
          </div>
          <h2 className={styles.pageTitle}>AI-identified rules</h2>
          <p className={styles.pageBody}>
            Review candidate rules separately from the main rule set. Approve what should be added, dismiss what should not.
          </p>
        </div>
        <div className={styles.pagePanel}>
          {header}
          {body}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel}>
        {header}
        {body}
      </div>
    </>
  );
}
