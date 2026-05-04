import type { DataSource } from '../../../types';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

interface Props {
  source: DataSource;
  onConfirm: (source: DataSource) => void;
  onClose: () => void;
}

export default function RemoveConfirmationDialog({ source, onConfirm, onClose }: Props) {
  return (
    <ConfirmDialog
      title="Remove connection"
      warningTitle="This action cannot be undone."
      warningBody="Removing this connection will delete its configuration. Active audits using this source will be affected."
      meta={[
        { key: 'Source', value: source.name },
        { key: 'Type', value: source.type },
      ]}
      confirmLabel="Remove"
      variant="danger"
      onConfirm={() => onConfirm(source)}
      onClose={onClose}
    />
  );
}
