import type { Rule } from '../../../types';
import Modal from '../../../components/ui/Modal';
import modalStyles from '../../../components/ui/Modal.module.css';
import styles from './RuleEditImplicationsModal.module.css';

interface Props {
  rule: Rule;
  onEditAnyway: () => void;
  onCancel: () => void;
}

export default function RuleEditImplicationsModal({ rule, onEditAnyway, onCancel }: Props) {
  return (
    <Modal
      title="Edit rule"
      titleLarge
      onClose={onCancel}
      width={480}
      zIndex={400}
    >
      {/* Warning banner */}
      <div className={styles.warningBanner}>
        <span className={styles.warningBold}>
          This rule was used in your last audit run.
        </span>
        <span className={styles.warningBody}>
          Editing it will invalidate those results. A new audit will be required to reflect the change.
        </span>
      </div>

      {/* Read-only rule name */}
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>Rule</span>
        <input
          type="text"
          className={styles.readonlyField}
          value={rule.text}
          readOnly
          disabled
        />
      </div>

      {/* Last audit metadata */}
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>Last Audit Using This Rule</span>
        <div className={styles.auditMeta}>
          <span className={styles.auditDate}>April 21, 2026 at 14:32 UTC</span>
          <span className={styles.auditStat}>5 findings</span>
          <span className={styles.auditStat}>Rule set v321</span>
        </div>
      </div>

      <div className={modalStyles.footer}>
        <div />
        <div className={modalStyles.footerRight}>
          <button className={modalStyles.btnSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={modalStyles.btnPrimary}
            onClick={onEditAnyway}
            style={{ minWidth: '140px' }}
          >
            Edit anyway
          </button>
        </div>
      </div>
    </Modal>
  );
}
