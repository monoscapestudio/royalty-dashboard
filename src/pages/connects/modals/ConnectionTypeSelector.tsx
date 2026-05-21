import type { SourceCategory, ConnectionType } from '../../../types';
import Modal from '../../../components/ui/Modal';
import styles from './ConnectionTypeSelector.module.css';

const CONTEXT_LABELS: Record<SourceCategory, string> = {
  contracts: 'Add Contracts Source',
  billing: 'Add Statements Source',
  recovery: 'Connect Recovery Channel',
};

const OPTIONS: {
  type: ConnectionType;
  desc: string;
  hint: string;
}[] = [
  {
    type: 'API',
    desc: 'Connect via API key and endpoint URL.',
    hint: 'For systems like SoundExchange, BMI, custom APIs.',
  },
  {
    type: 'OAuth',
    desc: "Sign in through the provider's authentication page.",
    hint: 'For systems like QuickBooks, Xero, NetSuite.',
  },
  {
    type: 'Folder',
    desc: 'Select a folder containing documents.',
    hint: 'For systems like Google Drive, Dropbox, SharePoint.',
  },
];

interface Props {
  category: SourceCategory;
  onSelect: (type: ConnectionType) => void;
  onClose: () => void;
}

export default function ConnectionTypeSelector({ category, onSelect, onClose }: Props) {
  return (
    <Modal
      contextLabel={CONTEXT_LABELS[category]}
      title="Choose connection type"
      onClose={onClose}
    >
      <p className={styles.question}>How does this system connect?</p>

      <div className={styles.options}>
        {OPTIONS.map(({ type, desc, hint }) => (
          <button
            key={type}
            className={styles.optionCard}
            onClick={() => onSelect(type)}
          >
            <div className={styles.optionLeft}>
              <span className={styles.typeBadge}>{type}</span>
              <span className={styles.optionDesc}>{desc}</span>
              <span className={styles.optionHint}>{hint}</span>
            </div>
            <span className={styles.selectCta}>Select →</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
