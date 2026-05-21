import { useState } from 'react';
import type { SourceCategory, DataSource } from '../../../types';
import Modal from '../../../components/ui/Modal';
import FormSelect from '../../../components/ui/FormSelect';
import modalStyles from '../../../components/ui/Modal.module.css';
import styles from './AddSourceOAuthModal.module.css';

const CONTEXT_LABELS: Record<SourceCategory, string> = {
  contracts: 'Add Contracts Source',
  billing: 'Add Statements Source',
  recovery: 'Connect Recovery Channel',
};

const PERMISSIONS: Record<string, string> = {
  quickbooks: 'Read invoices, Read payments, Read accounts. No write access.',
  xero: 'Read invoices, Read payments, Read accounts. No write access.',
  netsuite: 'Read transactions, Read accounts, Read contacts. No write access.',
  salesforce: 'Read contracts, Read opportunities. No write access.',
  gmail: 'Read and compose emails. AuditGraph never sends without your approval.',
  outlook: 'Read and compose emails. AuditGraph never sends without your approval.',
};

const PROVIDER_OPTIONS_BILLING = [
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'xero', label: 'Xero' },
  { value: 'netsuite', label: 'NetSuite' },
  { value: 'salesforce', label: 'Salesforce' },
];

const PROVIDER_OPTIONS_RECOVERY = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
];

interface Props {
  category: SourceCategory;
  source?: DataSource;
  onSave: (source: Partial<DataSource>) => void;
  onClose: () => void;
}

export default function AddSourceOAuthModal({ category, source, onSave, onClose }: Props) {
  const providerOptions =
    category === 'recovery' ? PROVIDER_OPTIONS_RECOVERY : PROVIDER_OPTIONS_BILLING;

  const [provider, setProvider] = useState(source?.name?.toLowerCase() ?? providerOptions[0].value);

  const selectedLabel = providerOptions.find((p) => p.value === provider)?.label ?? provider;
  const permissions = PERMISSIONS[provider] ?? 'Read-only access. No write access.';

  const handleAuthorize = () => {
    /* In production: open OAuth popup window, listen for callback */
    onSave({
      name: selectedLabel,
      type: 'OAuth',
      status: 'live',
      category,
    });
    onClose();
  };

  return (
    <Modal
      contextLabel={CONTEXT_LABELS[category]}
      title="OAuth Connection"
      onClose={onClose}
      width={500}
    >
      <div className={styles.typeMeta}>
        <span className={styles.typeBadge}>OAuth</span>
        <span className={styles.typeHint}>Sign in through the provider's authentication page</span>
      </div>

      <FormSelect
        label="Select Provider"
        value={provider}
        onChange={setProvider}
        options={providerOptions}
      />

      <p className={styles.instruction}>
        Clicking "Authorize" will open a new window where you sign in to {selectedLabel}.<br />
        AuditGraph will request read-only access to your billing data.
      </p>

      <div className={styles.permissionsBlock}>
        <span className={styles.permissionsTitle}>Permissions requested:</span>
        <span className={styles.permissionsBody}>{permissions}</span>
      </div>

      <div className={modalStyles.footer}>
        <button className={modalStyles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <div className={modalStyles.footerRight}>
          <button className={modalStyles.btnPrimary} onClick={handleAuthorize}>
            Authorize
          </button>
        </div>
      </div>
    </Modal>
  );
}
