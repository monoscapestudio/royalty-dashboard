import { useState } from 'react';
import type { Rule } from '../../../types';
import Modal from '../../../components/ui/Modal';
import modalStyles from '../../../components/ui/Modal.module.css';
import styles from './RuleEditModal.module.css';

interface Interpretation {
  ruleLine: string;
  sourceField: string;
  operator: string;
  threshold: string;
  unit: string;
}

function buildInterpretation(text: string): Interpretation {
  const lower = text.toLowerCase();
  if (lower.includes('recoupment') || lower.includes('stream')) {
    return { ruleLine: `IF stream.paid < 0.005 per unit THEN flag as recoupment shortfall`, sourceField: 'stream.paid', operator: 'less than', threshold: '0.005', unit: 'per stream' };
  }
  if (lower.includes('mechanical') || lower.includes('royalty')) {
    return { ruleLine: `IF royalty.rate < 0.0091 per unit THEN flag as mechanical royalty violation`, sourceField: 'royalty.rate', operator: 'less than', threshold: '0.0091', unit: 'per unit' };
  }
  if (lower.includes('distribution') || lower.includes('fee')) {
    return { ruleLine: `IF distribution.fee > 15% of gross revenue THEN flag as distribution fee violation`, sourceField: 'distribution.fee', operator: 'greater than', threshold: '15%', unit: 'of gross revenue' };
  }
  return { ruleLine: `IF value < threshold THEN flag as violation`, sourceField: 'value', operator: 'less than', threshold: 'threshold', unit: '' };
}

/* A rule is "used in audit" if it has a real lastModified (not "Just now") */
const hasAuditHistory = (rule: Rule): boolean =>
  rule.lastModified !== 'Just now';

interface Props {
  rule: Rule;
  onSave: (updated: Rule) => void;
  onDelete: (rule: Rule) => void;
  onClose: () => void;
  onNeedImplications: (updated: Rule) => void;
}

export default function RuleEditModal({ rule, onSave, onDelete, onClose, onNeedImplications }: Props) {
  const [description, setDescription] = useState(rule.text);
  const [isActive, setIsActive] = useState(rule.status === 'Active');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const interpretation = buildInterpretation(description);

  const handleSave = () => {
    const updated: Rule = {
      ...rule,
      text: description,
      status: isActive ? 'Active' : 'Inactive',
      lastModified: 'Just now',
    };
    if (hasAuditHistory(rule)) {
      onNeedImplications(updated);
    } else {
      onSave(updated);
      onClose();
    }
  };

  const handleConfirmDelete = () => {
    onDelete(rule);
    onClose();
  };

  const sourceColorClass =
    rule.source === 'AI' ? styles.sourceValueAi : styles.sourceValueUser;

  const sourceLabel = rule.source === 'AI' ? 'AI' : 'User-Defined';

  return (
    <Modal
      contextLabel="Edit Rule"
      title="Modify rule logic and parameters"
      onClose={onClose}
      width={560}
      zIndex={300}
    >
      {/* SOURCE row */}
      <div className={styles.sourceMeta}>
        <span className={styles.sourceLabel}>Source</span>
        <span className={sourceColorClass}>{sourceLabel}</span>
        <span className={styles.sourceTimestamp}>{rule.lastModified !== 'Just now' ? `Last modified ${rule.lastModified}` : 'Created just now'}</span>
      </div>

      {/* RULE DESCRIPTION */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Rule Description (plain language)</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Spotify recoupment rate must be minimum 0.005 per stream"
        />
      </div>

      {/* SYSTEM INTERPRETATION */}
      <div className={styles.interpretationGroup}>
        <span className={styles.fieldLabel}>System Interpretation</span>
        <div className={styles.interpretationPanel}>
          <span className={styles.interpRuleLine}>{interpretation.ruleLine}</span>
          <span className={styles.interpMeta}>Source field: {interpretation.sourceField}</span>
          <span className={styles.interpMeta}>Operator: {interpretation.operator}</span>
          <span className={styles.interpMeta}>Threshold: {interpretation.threshold}{interpretation.unit ? `  |  Unit: ${interpretation.unit}` : ''}</span>
        </div>
      </div>
      <span className={styles.reinterpretNote}>
        Edit the description above. The system will re-interpret when you save.
      </span>

      {/* STATUS toggle */}
      <div className={styles.statusGroup}>
        <span className={styles.fieldLabel}>Status</span>
        <div className={styles.statusRow}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className={styles.toggleTrack} />
            <span className={styles.toggleKnob} />
          </label>
          <span className={isActive ? styles.statusActive : styles.statusInactive}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Delete confirmation (inline) */}
      {confirmingDelete && (
        <div className={styles.deleteConfirm}>
          <span className={styles.deleteConfirmTitle}>This action cannot be undone.</span>
          <span className={styles.deleteConfirmBody}>
            Deleting this rule will remove it from your active rule set.
          </span>
          <div className={styles.deleteConfirmActions}>
            <button className={modalStyles.btnDanger} onClick={handleConfirmDelete}>
              Delete rule
            </button>
            <button
              className={modalStyles.btnCancel}
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={modalStyles.footer}>
        <button className={modalStyles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <div className={modalStyles.footerRight}>
          {!confirmingDelete && (
            <button
              className={modalStyles.btnDangerOutlined}
              onClick={() => setConfirmingDelete(true)}
            >
              Delete rule
            </button>
          )}
          <button
            className={modalStyles.btnPrimary}
            onClick={handleSave}
            disabled={!description.trim()}
            style={{ minWidth: '140px' }}
          >
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
