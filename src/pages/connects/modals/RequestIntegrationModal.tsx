import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import FormSelect from '../../../components/ui/FormSelect';
import modalStyles from '../../../components/ui/Modal.module.css';
import styles from './RequestIntegrationModal.module.css';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category…' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'billing', label: 'Billing' },
  { value: 'both', label: 'Both' },
];

interface Props {
  onClose: () => void;
}

export default function RequestIntegrationModal({ onClose }: Props) {
  const [category, setCategory] = useState('');
  const [systemName, setSystemName] = useState('');
  const [systemUrl, setSystemUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = category && systemName;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <Modal
      title="Request Integration"
      onClose={onClose}
      width={520}
    >
      {submitted ? (
        <div className={styles.successState}>
          <span className={styles.successTitle}>Request submitted.</span>
          <p className={styles.successBody}>
            Integration will be live within 48 hours. You will receive an email notification when it's ready.
          </p>
          <div className={modalStyles.footer}>
            <div />
            <button className={modalStyles.btnPrimary} onClick={onClose} style={{ marginTop: '8px' }}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
          <span className={styles.stepIndicator}>Step 1 of 2: Select system</span>

          <div className={styles.fields}>
            <FormSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
            <FormField
              label="System Name"
              value={systemName}
              onChange={setSystemName}
              placeholder="e.g. SAP Business One, Xero, custom ERP"
            />
            <FormField
              label="System URL (optional)"
              value={systemUrl}
              onChange={setSystemUrl}
              placeholder="https://"
              type="url"
            />

            <div>
              <span className={styles.textareaLabel} style={{ marginBottom: 0 }}>Credentials</span>
              <div className={styles.credentialsRow} style={{ marginTop: '6px' }}>
                <FormField
                  label=""
                  value={username}
                  onChange={setUsername}
                  placeholder="Username or email"
                />
                <FormField
                  label=""
                  value={password}
                  onChange={setPassword}
                  placeholder="Password or API key"
                  type="password"
                />
              </div>
            </div>

            <div className={styles.disclaimer}>
              <span className={styles.disclaimerText}>
                Credentials are encrypted at rest and in transit. Used only for integration setup.
              </span>
            </div>

            <div className={styles.textareaGroup}>
              <span className={styles.textareaLabel}>Additional Notes (optional)</span>
              <textarea
                className={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific configuration details or requirements"
              />
            </div>

            <div className={styles.slaBanner}>
              <span className={styles.slaBannerTitle}>Typical turnaround: 48 hours.</span>
              <span className={styles.slaBannerBody}>
                You will receive an email notification when the integration is live.
              </span>
            </div>
          </div>

          <div className={modalStyles.footer}>
            <button className={modalStyles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <div className={modalStyles.footerRight}>
              <button
                className={modalStyles.btnPrimary}
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
