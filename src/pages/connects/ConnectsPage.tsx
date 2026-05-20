import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Idea, ChevronLeft, ChevronRight } from '@carbon/icons-react';
import { useAppStore } from '../../store/app';
import { mockSources } from '../../data/mock';
import type { DataSource, SourceCategory, ConnectionType } from '../../types';
import Banner from '../../components/ui/Banner';
import Modal from '../../components/ui/Modal';
import modalStyles from '../../components/ui/Modal.module.css';
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

const TIPS = [
  'Connect at least one source in each column — contracts in, recovery out.',
  'Data flows left to right: contracts are compared against billing records.',
  'Recovery channels are never triggered without your explicit approval.',
  'Click on any live connection to configure its specific sync rules.',
];

type ModalState =
  | { type: 'connection-type-selector'; category: SourceCategory }
  | { type: 'add-api'; category: SourceCategory; source?: DataSource }
  | { type: 'add-oauth'; category: SourceCategory; source?: DataSource }
  | { type: 'add-folder'; category: SourceCategory; source?: DataSource }
  | { type: 'configure'; source: DataSource }
  | { type: 'request-integration' }
  | { type: 'remove-confirm'; source: DataSource }
  | { type: 'reconnect'; source: DataSource }
  | null;

let _nextId = 1000;
const nextId = () => String(++_nextId);

export default function ConnectsPage() {
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const [searchParams] = useSearchParams();
  const firstAuditMode = searchParams.get('first-audit') === '1';
  const setContractSourceReady = useAppStore((s) => s.setContractSourceReady);

  const [sources, setSources] = useState<DataSource[]>(
    () => (firstAuditMode ? [] : mockSources[activeSiloId] ?? [])
  );

  useEffect(() => {
    setSources(firstAuditMode ? [] : mockSources[activeSiloId] ?? []);
  }, [activeSiloId, firstAuditMode]);

  const contracts = sources.filter((s) => s.category === 'contracts');
  const billing = sources.filter((s) => s.category === 'billing');
  const recovery = sources.filter((s) => s.category === 'recovery');

  const failedSources = sources.filter((s) => s.status === 'fix');
  const isEmpty = sources.length === 0;

  const [modal, setModal] = useState<ModalState>(null);
  const closeModal = () => setModal(null);

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (firstAuditMode) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [firstAuditMode]);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % TIPS.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + TIPS.length) % TIPS.length);

  const handleTypeSelected = (connectionType: ConnectionType) => {
    if (!modal || modal.type !== 'connection-type-selector') return;
    const { category } = modal;
    if (connectionType === 'API') setModal({ type: 'add-api', category });
    else if (connectionType === 'OAuth') setModal({ type: 'add-oauth', category });
    else setModal({ type: 'add-folder', category });
  };

  const handleSaveSource = (partial: Partial<DataSource>) => {
    const newSource: DataSource = {
      id: nextId(),
      name: partial.name ?? 'Unnamed',
      type: partial.type ?? 'API',
      status: partial.status ?? 'live',
      category: partial.category ?? 'contracts',
      lastSync: 'Just now',
    };
    setSources((prev) => {
      const next = [...prev, newSource];
      setContractSourceReady(
        activeSiloId,
        next.some((source) => source.category === 'contracts')
      );
      return next;
    });
  };

  const handleConfigureSave = (updated: DataSource) => {
    setSources((prev) => {
      const next = prev.map((s) => (s.id === updated.id ? updated : s));
      setContractSourceReady(
        activeSiloId,
        next.some((source) => source.category === 'contracts')
      );
      return next;
    });
  };

  const handleRemoveConfirm = (source: DataSource) => {
    setSources((prev) => {
      const next = prev.filter((s) => s.id !== source.id);
      setContractSourceReady(
        activeSiloId,
        next.some((item) => item.category === 'contracts')
      );
      return next;
    });
  };

  const handleReconnect = (src: DataSource) => {
    if (src.status === 'fix') {
      setModal({ type: 'reconnect', source: src });
      return;
    }
    if (src.type === 'API') setModal({ type: 'add-api', category: src.category, source: src });
    else if (src.type === 'OAuth') setModal({ type: 'add-oauth', category: src.category, source: src });
    else setModal({ type: 'add-folder', category: src.category, source: src });
  };

  const [reconnecting, setReconnecting] = useState(false);
  const handleReconnectConfirm = (src: DataSource) => {
    setReconnecting(true);
    setTimeout(() => {
      setSources((prev) => {
        const next = prev.map((s) =>
          s.id === src.id ? { ...s, status: 'live' as const, lastSync: 'Just now' } : s
        );
        setContractSourceReady(
          activeSiloId,
          next.some((source) => source.category === 'contracts')
        );
        return next;
      });
      setReconnecting(false);
      closeModal();
    }, 1500);
  };

  const openAddModal = (category: SourceCategory) =>
    setModal({ type: 'connection-type-selector', category });

  return (
    <>
      <div className={styles.content}>
        <div className={styles.topTipStrip}>
          <div className={styles.topTipInner}>
            <div className={styles.topTipContent}>
              <Idea size={20} className={styles.topTipIcon} />
              <span className={styles.topTipText}>
                {firstAuditMode
                  ? 'Step 1 of 2: add a contract source to unlock your first audit.'
                  : TIPS[currentTip]}
              </span>
            </div>
            {!firstAuditMode && (
              <div className={styles.topTipControls}>
                <button onClick={prevTip} className={styles.topTipBtn} aria-label="Previous tip">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextTip} className={styles.topTipBtn} aria-label="Next tip">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

      {firstAuditMode && contracts.length > 0 && (
          <div className={styles.stepCompleteBanner}>
            <span className={styles.stepCompleteCheck}>✓</span>
            <div className={styles.stepCompleteText}>
              <strong>Step 1 complete.</strong> Contract source connected.
              You can add more sources, or continue setup.
            </div>
            <Link to="/app/rules?first-audit=1" className={styles.stepCompleteBtn}>
              Next: Apply Rules →
            </Link>
          </div>
        )}

        {isEmpty ? (
          <ConnectsEmptyState
            onAddSource={openAddModal}
            onRequestIntegration={() => setModal({ type: 'request-integration' })}
          />
        ) : (
          <>
            <div className={styles.threeCol}>
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
            </div>
          </>
        )}
      </div>

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
      {modal?.type === 'reconnect' && (
        <Modal
          contextLabel="Reconnect Source"
          title={modal.source.name}
          onClose={closeModal}
          width={460}
        >
          <div className={styles.reconnectBody}>
            <p className={styles.reconnectMessage}>
              Authentication for <strong>{modal.source.name}</strong> has expired.
              Re-authorize access to resume syncing documents.
            </p>
            <div className={styles.reconnectMeta}>
              <span className={styles.reconnectMetaRow}>
                <span className={styles.reconnectMetaLabel}>Type</span>
                <span className={styles.reconnectMetaValue}>{modal.source.type}</span>
              </span>
              <span className={styles.reconnectMetaRow}>
                <span className={styles.reconnectMetaLabel}>Status</span>
                <span className={styles.reconnectMetaValue}>Authentication expired</span>
              </span>
            </div>
          </div>
          <div className={modalStyles.footer}>
            <button className={modalStyles.btnCancel} onClick={closeModal}>
              Cancel
            </button>
            <div className={modalStyles.footerRight}>
              <button
                className={modalStyles.btnPrimary}
                onClick={() => handleReconnectConfirm(modal.source)}
                disabled={reconnecting}
              >
                {reconnecting ? 'Reconnecting…' : 'Reconnect'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
