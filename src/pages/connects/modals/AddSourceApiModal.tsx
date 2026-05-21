import { useState, useEffect } from 'react';
import type { SourceCategory, DataSource } from '../../../types';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import modalStyles from '../../../components/ui/Modal.module.css';
import Banner from '../../../components/ui/Banner';
import styles from './AddSourceApiModal.module.css';

const CONTEXT_LABELS: Record<SourceCategory, string> = {
  contracts: 'Add Contracts Source',
  billing: 'Add Statements Source',
  recovery: 'Add Recovery Source',
};

type TestState = 'idle' | 'testing' | 'failed' | 'success';

interface Props {
  category: SourceCategory;
  source?: DataSource; // pre-fill when reconnecting
  onSave: (source: Partial<DataSource>) => void;
  onClose: () => void;
}

export default function AddSourceApiModal({ category, source, onSave, onClose }: Props) {
  const [name, setName] = useState(source?.name ?? '');
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [testState, setTestState] = useState<TestState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /* Auto-close 2 s after success */
  useEffect(() => {
    if (testState !== 'success') return;
    const timer = setTimeout(() => {
      onSave({ name, type: 'API', status: 'live', category });
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [testState]);

  const handleTest = () => {
    if (!name || !endpoint || !apiKey) return;
    setTestState('testing');
    /* Simulate test — replace with real API call */
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success in mock
      if (success) {
        setTestState('success');
      } else {
        setTestState('failed');
        setErrorMessage('HTTP 401: Unauthorized. The API key was rejected by the server. Check your credentials and try again.');
      }
    }, 1200);
  };

  const isFailed = testState === 'failed';
  const isSuccess = testState === 'success';
  const isTesting = testState === 'testing';

  return (
    <Modal
      contextLabel={CONTEXT_LABELS[category]}
      title="API Integration"
      onClose={onClose}
      width={500}
    >
      <div className={styles.typeMeta}>
        <span className={styles.typeBadge}>API</span>
        <span className={styles.typeHint}>Requires API key and endpoint URL</span>
      </div>

      {isFailed && (
        <Banner
          variant="error"
          title="Connection test failed"
          body={errorMessage}
          style={{ marginBottom: '16px' }}
        />
      )}

      {isSuccess && (
        <div className={styles.successBanner}>
          <span className={styles.successTitle}>Connection successful.</span>
          <span className={styles.successBody}>1,412 records found. Closing in 2 seconds…</span>
        </div>
      )}

      <div className={styles.fields}>
        <FormField
          label="Source Name"
          value={name}
          onChange={setName}
          placeholder="e.g. SoundExchange, BMI Licensing"
        />
        <FormField
          label="API Endpoint URL"
          value={endpoint}
          onChange={setEndpoint}
          placeholder="https://api.example.com/v1"
          type="url"
        />
        <FormField
          label="API Key"
          value={apiKey}
          onChange={setApiKey}
          type="password"
          error={isFailed ? 'Invalid API key. Check that you are using the correct key for this endpoint.' : undefined}
        />
        <FormField
          label="API Secret (if required)"
          value={apiSecret}
          onChange={setApiSecret}
          placeholder="Optional"
        />
      </div>

      <div className={styles.disclaimer} style={{ marginTop: '16px' }}>
        <span className={styles.disclaimerText}>
          Credentials are encrypted. Connection will be tested before saving.
        </span>
      </div>

      <div className={modalStyles.footer}>
        <button className={modalStyles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <div className={modalStyles.footerRight}>
          <button
            className={modalStyles.btnPrimary}
            onClick={handleTest}
            disabled={!name || !endpoint || !apiKey || isTesting || isSuccess}
          >
            {isTesting ? 'Testing…' : isFailed ? 'Test again' : 'Test and save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
