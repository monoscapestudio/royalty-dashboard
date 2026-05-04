import { useState } from 'react';
import type { DataSource } from '../../../types';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import StatusBadge from '../../../components/ui/StatusBadge';
import modalStyles from '../../../components/ui/Modal.module.css';
import styles from './ConfigureExistingModal.module.css';

const SYNC_HISTORY = [
  { date: 'Apr 21 14:30', status: 'Success', records: '1,412' },
  { date: 'Apr 21 14:00', status: 'Success', records: '1,412' },
  { date: 'Apr 21 13:30', status: 'Success', records: '1,410' },
];

interface Props {
  source: DataSource;
  onSave: (source: DataSource) => void;
  onClose: () => void;
}

export default function ConfigureExistingModal({ source, onSave, onClose }: Props) {
  const [name, setName] = useState(source.name);
  const [endpoint, setEndpoint] = useState('https://api.soundexchange.com/v2');
  const [changingKey, setChangingKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => setTesting(false), 1200);
  };

  const handleSave = () => {
    onSave({ ...source, name });
    onClose();
  };

  return (
    <Modal
      contextLabel="Configure Connection"
      title={`${source.name} (${source.type})`}
      titleSuffix={<StatusBadge status={source.status} />}
      onClose={onClose}
      width={500}
    >
      <div className={styles.fields}>
        <FormField label="Source Name" value={name} onChange={setName} />
        <FormField
          label="API Endpoint URL"
          value={endpoint}
          onChange={setEndpoint}
          type="url"
        />
        <FormField
          label="API Key"
          value={changingKey ? apiKey : '••••••••••••••••'}
          onChange={setApiKey}
          type={changingKey ? 'password' : 'text'}
          readOnly={!changingKey}
          rightAction={
            !changingKey ? (
              <button
                onClick={() => setChangingKey(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--type-badge-text)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                Change
              </button>
            ) : undefined
          }
        />

        <div className={styles.syncInfo}>
          <span className={styles.syncLabel}>Last Sync</span>
          <span className={styles.syncValue}>2 minutes ago. Next sync in 28 minutes.</span>
        </div>

        <div className={styles.syncHistory}>
          <span className={styles.syncHistoryLabel}>Sync History</span>
          <div className={styles.syncHistoryLog}>
            {SYNC_HISTORY.map((row) => (
              <span key={row.date} className={styles.syncLogRow}>
                {`${row.date}  ${row.status}  ${row.records} records`}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={modalStyles.footer}>
        <button className={modalStyles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <div className={modalStyles.footerRight}>
          <button
            className={modalStyles.btnSecondary}
            onClick={handleTestConnection}
            disabled={testing}
          >
            {testing ? 'Testing…' : 'Test connection'}
          </button>
          <button className={modalStyles.btnPrimary} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
