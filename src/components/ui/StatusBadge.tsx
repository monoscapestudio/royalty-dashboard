import type { ConnectionStatus } from '../../types';
import styles from './StatusBadge.module.css';

const LABELS: Record<ConnectionStatus, string> = {
  live: 'Live',
  fix: 'Fix',
  pending: 'Pending',
  inactive: 'Inactive',
  'never-connected': '—',
};

interface Props {
  status: ConnectionStatus;
  label?: string;
}

export default function StatusBadge({ status, label }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {label ?? LABELS[status]}
    </span>
  );
}
