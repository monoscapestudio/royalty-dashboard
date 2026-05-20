import Modal from './Modal';
import modalStyles from './Modal.module.css';
import styles from './LogoutModal.module.css';

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function LogoutModal({ onConfirm, onClose }: Props) {
  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Modal
      contextLabel="Logout"
      title="Sign out of Revorion?"
      onClose={onClose}
      width={420}
      zIndex={400}
    >
      <div className={styles.messageBlock}>
        <p className={styles.message}>
          Any unsaved changes on this page may be lost. You can sign back in anytime
          with your Revorion credentials.
        </p>
      </div>

      <div className={modalStyles.footer}>
        <button type="button" className={modalStyles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <div className={modalStyles.footerRight}>
          <button type="button" className={modalStyles.btnDanger} onClick={handleConfirm}>
            Log out
          </button>
        </div>
      </div>
    </Modal>
  );
}
