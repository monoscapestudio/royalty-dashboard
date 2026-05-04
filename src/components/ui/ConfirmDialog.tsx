import Modal from './Modal';
import Banner from './Banner';
import modalStyles from './Modal.module.css';
import styles from './ConfirmDialog.module.css';

interface MetaRow {
  key: string;
  value: string;
}

interface Props {
  title: string;
  warningTitle: string;
  warningBody: string;
  meta?: MetaRow[];
  confirmLabel: string;
  variant?: 'danger' | 'primary';
  width?: number;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  title,
  warningTitle,
  warningBody,
  meta = [],
  confirmLabel,
  variant = 'danger',
  width = 440,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal title={title} onClose={onClose} width={width}>
      <Banner variant="error" title={warningTitle} body={warningBody} />

      {meta.length > 0 && (
        <div className={styles.metaTable}>
          {meta.map(({ key, value }) => (
            <div key={key} className={styles.metaRow}>
              <span className={styles.metaKey}>{key}:</span>
              <span className={styles.metaValue}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className={modalStyles.footer}>
        <button className={modalStyles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <div className={modalStyles.footerRight}>
          <button
            className={variant === 'danger' ? modalStyles.btnDanger : modalStyles.btnPrimary}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
