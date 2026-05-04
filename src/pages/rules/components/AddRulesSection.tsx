import { useState } from 'react';
import type { Rule } from '../../../types';
import styles from './AddRulesSection.module.css';

interface Interpretation {
  inputText: string;
  ruleLine: string;
  metadata: string;
}

interface Props {
  showLibraryBanner: boolean;
  siloLabel: string;
  libraryCount: number;
  existingRules: Rule[];
  onAddRule: (rule: Rule) => void;
}

/* Generates a mock NL interpretation from free text input */
function buildInterpretation(text: string): Interpretation {
  const lower = text.toLowerCase();
  let field = 'stream.paid';
  let operator = 'less than';
  let threshold = '0.005';
  let unit = 'per stream';
  let flag = 'shortfall';

  if (lower.includes('recoupment')) {
    field = 'stream.paid'; operator = 'less than'; threshold = '0.005'; unit = 'per stream'; flag = 'recoupment shortfall';
  } else if (lower.includes('mechanical') || lower.includes('royalty')) {
    field = 'royalty.rate'; operator = 'less than'; threshold = '0.0091'; unit = 'per unit'; flag = 'mechanical royalty violation';
  } else if (lower.includes('distribution') || lower.includes('fee')) {
    field = 'distribution.fee'; operator = 'greater than'; threshold = '15%'; unit = 'of gross revenue'; flag = 'distribution fee violation';
  }

  return {
    inputText: text,
    ruleLine: `Rule: IF ${field} ${operator} ${threshold} THEN flag as ${flag}`,
    metadata: `Source field: ${field}  |  Operator: ${operator}  |  Threshold: ${threshold}  |  Unit: ${unit}`,
  };
}

/* Check if the new rule is likely a duplicate of an existing one */
function findDuplicate(text: string, rules: Rule[]): Rule | null {
  const lower = text.toLowerCase();
  const keywords = lower.split(' ').filter((w) => w.length > 4);
  return (
    rules.find((r) =>
      keywords.some((kw) => r.text.toLowerCase().includes(kw))
    ) ?? null
  );
}

let _id = 2000;

export default function AddRulesSection({
  showLibraryBanner,
  siloLabel,
  libraryCount,
  existingRules,
  onAddRule,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [duplicate, setDuplicate] = useState<Rule | null>(null);

  const handleAdd = () => {
    if (inputValue.length < 5) return;
    const interp = buildInterpretation(inputValue);
    const dup = findDuplicate(inputValue, existingRules);
    setInterpretation(interp);
    setDuplicate(dup);
  };

  const handleConfirm = () => {
    if (!interpretation) return;
    onAddRule({
      id: `user-new-${++_id}`,
      text: interpretation.inputText,
      source: 'User',
      status: 'Active',
      lastModified: 'Just now',
    });
    setInputValue('');
    setInterpretation(null);
    setDuplicate(null);
  };

  const handleAddAnyway = () => {
    handleConfirm();
  };

  const handleEdit = () => {
    /* Return focus to input with original text */
    setInterpretation(null);
    setDuplicate(null);
  };

  const handleDiscard = () => {
    setInputValue('');
    setInterpretation(null);
    setDuplicate(null);
  };

  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>Add Rules</span>

      {showLibraryBanner && (
        <div className={styles.libraryBanner}>
          <span className={styles.libraryBannerText}>
            Started with {libraryCount} rules from the {siloLabel} industry library. You can toggle individual library rules on or off below.
          </span>
        </div>
      )}

      <label className={styles.inputLabel}>Add a rule in plain language</label>
      <div className={styles.inputRow}>
        <input
          className={styles.ruleInput}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (interpretation) {
              setInterpretation(null);
              setDuplicate(null);
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={`e.g. "Spotify recoupment rate must be minimum 0.005 per stream"`}
        />
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={inputValue.length < 5 || !!interpretation}
        >
          Add
        </button>
      </div>

      {interpretation && !duplicate && (
        <div className={styles.interpretation}>
          <span className={styles.interpretationLabel}>
            System interpretation (confirm before activation)
          </span>
          <span className={styles.interpretationRule}>{interpretation.ruleLine}</span>
          <span className={styles.interpretationMeta}>{interpretation.metadata}</span>
          <div className={styles.interpretationActions}>
            <button className={styles.btnConfirm} onClick={handleConfirm}>Confirm</button>
            <button className={styles.btnEdit} onClick={handleEdit}>Edit</button>
            <button className={styles.btnDiscard} onClick={handleDiscard}>Discard</button>
          </div>
        </div>
      )}

      {interpretation && duplicate && (
        <div className={styles.duplicateWarning}>
          <span className={styles.duplicateTitle}>Possible duplicate detected</span>
          <span className={styles.duplicateRule}>Your rule: "{interpretation.inputText}"</span>
          <span className={styles.duplicateExisting}>
            Existing rule: "{duplicate.text}" ({duplicate.source}, {duplicate.status})
          </span>
          <div className={styles.duplicateActions}>
            <button className={styles.btnAddAnyway} onClick={handleAddAnyway}>Add anyway</button>
            <button className={styles.btnDiscard} onClick={handleDiscard}>Discard</button>
          </div>
        </div>
      )}
    </div>
  );
}
