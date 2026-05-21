import { useState } from 'react';
import type { SourceCategory, DataSource } from '../../../types';
import Modal from '../../../components/ui/Modal';
import FormSelect from '../../../components/ui/FormSelect';
import FormField from '../../../components/ui/FormField';
import modalStyles from '../../../components/ui/Modal.module.css';
import styles from './AddSourceFolderModal.module.css';

const CONTEXT_LABELS: Record<SourceCategory, string> = {
  contracts: 'Add Contracts Source',
  billing: 'Add Statements Source',
  recovery: 'Add Recovery Source',
};

const PROVIDER_OPTIONS = [
  { value: 'google-drive', label: 'Google Drive' },
  { value: 'dropbox', label: 'Dropbox' },
  { value: 'sharepoint', label: 'SharePoint' },
  { value: 'onedrive', label: 'OneDrive' },
];

const FILE_TYPE_OPTIONS = [
  { value: 'pdf-docx-txt', label: 'PDF, DOCX, TXT' },
  { value: 'pdf', label: 'PDF only' },
  { value: 'all', label: 'All document types' },
];

const SYNC_FREQUENCY_OPTIONS = [
  { value: '1h', label: 'Every 1 hour' },
  { value: '6h', label: 'Every 6 hours' },
  { value: '24h', label: 'Every 24 hours' },
  { value: 'weekly', label: 'Weekly' },
];

interface Props {
  category: SourceCategory;
  source?: DataSource;
  onSave: (source: Partial<DataSource>) => void;
  onClose: () => void;
}

export default function AddSourceFolderModal({ category, source, onSave, onClose }: Props) {
  const [provider, setProvider] = useState(PROVIDER_OPTIONS[0].value);
  const [folderPath, setFolderPath] = useState('');
  const [fileTypes, setFileTypes] = useState(FILE_TYPE_OPTIONS[0].value);
  const [syncFrequency, setSyncFrequency] = useState(SYNC_FREQUENCY_OPTIONS[1].value);
  const [testing, setTesting] = useState(false);

  const providerLabel = PROVIDER_OPTIONS.find((p) => p.value === provider)?.label ?? provider;

  const handleTest = () => {
    if (!folderPath) return;
    setTesting(true);
    setTimeout(() => {
      onSave({
        name: `${providerLabel} (${providerLabel.includes('Drive') ? 'Contracts' : category})`,
        type: 'Folder',
        status: 'live',
        category,
      });
      setTesting(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      contextLabel={CONTEXT_LABELS[category]}
      title="Folder / File Selection"
      onClose={onClose}
      width={500}
    >
      <div className={styles.typeMeta}>
        <span className={styles.typeBadge}>Folder</span>
        <span className={styles.typeHint}>Select a folder containing contract documents</span>
      </div>

      <div className={styles.fields}>
        <FormSelect
          label="Provider"
          value={provider}
          onChange={setProvider}
          options={PROVIDER_OPTIONS}
        />

        <div className={styles.pathRow}>
          <div className={styles.pathInput}>
            <FormField
              label="Folder Path"
              value={folderPath}
              onChange={setFolderPath}
              placeholder="/Contracts/Music & Royalty/2026"
            />
          </div>
          <button className={styles.browseBtn}>Browse</button>
        </div>

        <FormSelect
          label="File Types"
          value={fileTypes}
          onChange={setFileTypes}
          options={FILE_TYPE_OPTIONS}
        />

        <FormSelect
          label="Sync Frequency"
          value={syncFrequency}
          onChange={setSyncFrequency}
          options={SYNC_FREQUENCY_OPTIONS}
        />
      </div>

      <div className={styles.disclaimer}>
        <span className={styles.disclaimerText}>
          Read-only access. AuditGraph will not modify or delete any files.
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
            disabled={!folderPath || testing}
          >
            {testing ? 'Testing…' : 'Test and save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
