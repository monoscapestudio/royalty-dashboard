import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/app';
import { mockSources } from '../../data/mock';
import type { DataSource, SourceCategory, ConnectionType } from '../../types';
import Banner from '../../components/ui/Banner';
import SourceSection from './components/SourceSection';
import ConnectsEmptyState from './ConnectsEmptyState';
import ConnectionTypeSelector from './modals/ConnectionTypeSelector';
import AddSourceApiModal from './modals/AddSourceApiModal';
import AddSourceOAuthModal from './modals/AddSourceOAuthModal';
import AddSourceFolderModal from './modals/AddSourceFolderModal';
import ConfigureExistingModal from './modals/ConfigureExistingModal';
import RequestIntegrationModal from './modals/RequestIntegrationModal';
import RemoveConfirmationDialog from './modals/RemoveConfirmationDialog';
import styles from './ConnectsPage.module.css';

type ModalState =
  | { type: 'connection-type-selector'; category: SourceCategory }
  | { type: 'add-api'; category: SourceCategory; source?: DataSource }
  | { type: 'add-oauth'; category: SourceCategory; source?: DataSource }
  | { type: 'add-folder'; category: SourceCategory; source?: DataSource }
  | { type: 'configure'; source: DataSource }
  | { type: 'request-integration' }
  | { type: 'remove-confirm'; source: DataSource }
  | null;

let _nextId = 1000;
const nextId = () => String(++_nextId);

export default function ConnectsPage() {
  const activeSiloId = useAppStore((s) => s.activeSiloId);

  /* Local sources state — reset when silo changes */
  const [sources, setSources] = useState<DataSource[]>(
    () => mockSources[activeSiloId] ?? []
  );
  useEffect(() => {
    setSources(mockSources[activeSiloId] ?? []);
  }, [activeSiloId]);

  const contracts = sources.filter((s) => s.category === 'contracts');
  const billing = sources.filter((s) => s.category === 'billing');
  const recovery = sources.filter((s) => s.category === 'recovery');

  const failedSources = sources.filter((s) => s.status === 'fix');
  const isEmpty = sources.length === 0;

  const [modal, setModal] = useState<ModalState>(null);
  const closeModal = () => setModal(null);

  /* ── Type selector → specific add modal ── */
  const handleTypeSelected = (connectionType: ConnectionType) => {
    if (!modal || modal.type !== 'connection-type-selector') return;
    const { category } = modal;
    if (connectionType === 'API') setModal({ type: 'add-api', category });
    else if (connectionType === 'OAuth') setModal({ type: 'add-oauth', category });
    else setModal({ type: 'add-folder', category });
  };

  /* ── Add source callback ── */
  const handleSaveSource = (partial: Partial<DataSource>) => {
    const newSource: DataSource = {
      id: nextId(),
      name: partial.name ?? 'Unnamed',
      type: partial.type ?? 'API',
      status: partial.status ?? 'live',
      category: partial.category ?? 'contracts',
      lastSync: 'Just now',
    };
    setSources((prev) => [...prev, newSource]);
  };

  /* ── Configure save ── */
  const handleConfigureSave = (updated: DataSource) => {
    setSources((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  /* ── Remove source ── */
  const handleRemoveConfirm = (source: DataSource) => {
    setSources((prev) => prev.filter((s) => s.id !== source.id));
  };

  /* ── Reconnect (re-open add modal with pre-fill) ── */
  const handleReconnect = (src: DataSource) => {
    if (src.type === 'API') setModal({ type: 'add-api', category: src.category, source: src });
    else if (src.type === 'OAuth') setModal({ type: 'add-oauth', category: src.category, source: src });
    else setModal({ type: 'add-folder', category: src.category, source: src });
  };

  const openAddModal = (category: SourceCategory) =>
    setModal({ type: 'connection-type-selector', category });

  return (
    <>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Connects</h1>
        <span className={styles.pageSubtitle}>
          Add data sources and configure recovery pipeline.
        </span>
      </div>

      {/* ── Page content ── */}
      <div className={styles.content}>
        {isEmpty ? (
          <ConnectsEmptyState
            onAddSource={openAddModal}
            onRequestIntegration={() => setModal({ type: 'request-integration' })}
          />
        ) : (
          <>
            {failedSources.length > 0 && (
              <Banner
                variant="error"
                title="Action required."
                body={
                  failedSources.length === 1
                    ? `${failedSources[0].name} connection has failed. Reconnect before running audit.`
                    : `${failedSources.length} connections have failed. Reconnect before running audit.`
                }
              />
            )}

            <SourceSection
              category="contracts"
              sources={contracts}
              onAddSource={openAddModal}
              onConfigure={(src) => setModal({ type: 'configure', source: src })}
              onRemove={(src) => setModal({ type: 'remove-confirm', source: src })}
              onReconnect={handleReconnect}
            />

            <SourceSection
              category="billing"
              sources={billing}
              onAddSource={openAddModal}
              onConfigure={(src) => setModal({ type: 'configure', source: src })}
              onRemove={(src) => setModal({ type: 'remove-confirm', source: src })}
              onReconnect={handleReconnect}
              showRequestIntegration
              onRequestIntegration={() => setModal({ type: 'request-integration' })}
            />

            <SourceSection
              category="recovery"
              sources={recovery}
              onAddSource={openAddModal}
              onConfigure={(src) => setModal({ type: 'configure', source: src })}
              onRemove={(src) => setModal({ type: 'remove-confirm', source: src })}
              onReconnect={handleReconnect}
            />
          </>
        )}
      </div>

      {/* ── Modal layer ── */}
      {modal?.type === 'connection-type-selector' && (
        <ConnectionTypeSelector
          category={modal.category}
          onSelect={handleTypeSelected}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'add-api' && (
        <AddSourceApiModal
          category={modal.category}
          source={modal.source}
          onSave={handleSaveSource}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'add-oauth' && (
        <AddSourceOAuthModal
          category={modal.category}
          source={modal.source}
          onSave={handleSaveSource}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'add-folder' && (
        <AddSourceFolderModal
          category={modal.category}
          source={modal.source}
          onSave={handleSaveSource}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'configure' && (
        <ConfigureExistingModal
          source={modal.source}
          onSave={handleConfigureSave}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'request-integration' && (
        <RequestIntegrationModal onClose={closeModal} />
      )}

      {modal?.type === 'remove-confirm' && (
        <RemoveConfirmationDialog
          source={modal.source}
          onConfirm={handleRemoveConfirm}
          onClose={closeModal}
        />
      )}
    </>
  );
}
