import { useState } from 'react';
import styles from './RulesEmptyState.module.css';

interface Props {
  siloLabel: string;
  libraryCount: number;
  onLoadLibrary: () => void;
  onAddRule: (text: string) => void;
}

export default function RulesEmptyState({ siloLabel, libraryCount, onLoadLibrary, onAddRule }: Props) {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      {/* Industry library CTA */}
      <div className={styles.libraryCta}>
        <span className={styles.libraryCtaTitle}>Start with an industry library</span>
        <p className={styles.libraryCtaDesc}>
          {siloLabel} library includes {libraryCount} pre-built rules covering recoupment rates,
          mechanical royalties, distribution fees, and more. You can toggle individual rules on or off.
        </p>
        <div className={styles.libraryCtaActions}>
          <button className={styles.btnLoadLibrary} onClick={onLoadLibrary}>
            Load industry rules
          </button>
          <span className={styles.orScratch}>or start from scratch</span>
        </div>
      </div>

      {/* Custom rule input */}
      <span className={styles.customRuleLabel}>Or add your own rules</span>
      <div className={styles.inputRow}>
        <input
          className={styles.ruleInput}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Describe a rule in plain language, e.g. "Recoupment rate must be at least 0.005 per stream"`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.length >= 5) {
              onAddRule(inputValue);
              setInputValue('');
            }
          }}
        />
        <button
          className={styles.addBtn}
          onClick={() => { onAddRule(inputValue); setInputValue(''); }}
          disabled={inputValue.length < 5}
        >
          Add
        </button>
      </div>

      {/* Empty rules table area */}
      <span className={styles.emptyRulesLabel}>Current Rules</span>
      <div className={styles.emptyRulesBox}>
        <span className={styles.emptyRulesTitle}>No rules defined yet.</span>
        <span className={styles.emptyRulesHint}>Load the industry library or add a custom rule above.</span>
      </div>
    </>
  );
}
