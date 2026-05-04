import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import type { SourceCategory, ConnectionType } from '../../../types';
import ConnectionTypeSelector from '../../connects/modals/ConnectionTypeSelector';
import AddSourceApiModal from '../../connects/modals/AddSourceApiModal';
import AddSourceOAuthModal from '../../connects/modals/AddSourceOAuthModal';
import AddSourceFolderModal from '../../connects/modals/AddSourceFolderModal';
import RequestIntegrationModal from '../../connects/modals/RequestIntegrationModal';
import styles from '../onboarding.module.css';

type ModalState =
  | { type: 'none' }
  | { type: 'type-selector'; category: SourceCategory }
  | { type: 'add-api'; category: SourceCategory }
  | { type: 'add-oauth'; category: SourceCategory }
  | { type: 'add-folder'; category: SourceCategory }
  | { type: 'request-integration' };

const NAME_FOR_TYPE: Record<ConnectionType, string> = {
  API: 'New API Source',
  OAuth: 'New OAuth Source',
  Folder: 'New Folder Source',
};

let _idCounter = 100;

export default function Step3Sources() {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData, setOnboardingStep } = useAppStore();
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [toast, setToast] = useState<string | null>(null);

  const contractSources = onboardingData.connectedSources.filter((s) => s.category === 'contracts');
  const billingSources = onboardingData.connectedSources.filter((s) => s.category === 'billing');
  const recoverySources = onboardingData.connectedSources.filter((s) => s.category === 'recovery');

  const canContinue = contractSources.length > 0 && billingSources.length > 0;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleTypeSelected(type: ConnectionType, category: SourceCategory) {
    if (type === 'API') setModal({ type: 'add-api', category });
    else if (type === 'OAuth') setModal({ type: 'add-oauth', category });
    else setModal({ type: 'add-folder', category });
  }

  function handleSourceSaved(partial: { name?: string }, category: SourceCategory, connType: string) {
    const newSource = {
      id: String(++_idCounter),
      name: partial.name || NAME_FOR_TYPE[connType as ConnectionType] || 'New Source',
      type: connType,
      category,
    };
    updateOnboardingData({
      connectedSources: [...onboardingData.connectedSources, newSource],
    });
    setModal({ type: 'none' });
    showToast(`${newSource.name} connected.`);
  }

  function handleContinue() {
    setOnboardingStep(4);
    navigate('/onboard/step-4');
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.card900}>
        <span className={styles.siloBadge}>MUSIC &amp; ROYALTY</span>

        <h1 className={styles.heading}>Connect Your Data Sources</h1>
        <p className={styles.body}>
          AuditGraph needs at least one contract source and one billing source to run an audit.
          <br />Connect your systems below.
        </p>

        {/* CONTRACTS section */}
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>CONTRACTS</span>
          <span className={styles.sectionHelper}>Sources where your contracts and agreements live</span>
        </div>
        <hr className={styles.sectionDivider} />

        {contractSources.map((src) => (
          <div key={src.id} className={`${styles.sourceRow} ${styles.sourceRowLive}`}>
            <div>
              <span className={styles.sourceRowName}>{src.name}</span>
              <span className={styles.sourceRowType}>{src.type} Integration</span>
            </div>
            <div className={styles.sourceRowActions}>
              <button className={styles.configureLink}>Configure</button>
              <span className={styles.liveBadge}>Live</span>
            </div>
          </div>
        ))}

        <div
          className={`${styles.sourceRow} ${styles.addSourceRow}`}
          onClick={() => setModal({ type: 'type-selector', category: 'contracts' })}
        >
          <span className={styles.addSourceText}>+ Add contract source</span>
        </div>

        {/* BILLING section */}
        <div className={styles.sectionHead} style={{ marginTop: 20 }}>
          <span className={styles.sectionLabel}>BILLING</span>
          <span className={styles.sectionHelper}>Sources where your invoices and billing records live</span>
        </div>
        <hr className={styles.sectionDivider} />

        {billingSources.map((src) => (
          <div key={src.id} className={`${styles.sourceRow} ${styles.sourceRowLive}`}>
            <div>
              <span className={styles.sourceRowName}>{src.name}</span>
              <span className={styles.sourceRowType}>{src.type} Integration</span>
            </div>
            <div className={styles.sourceRowActions}>
              <button className={styles.configureLink}>Configure</button>
              <span className={styles.liveBadge}>Live</span>
            </div>
          </div>
        ))}

        <div
          className={`${styles.sourceRow} ${styles.addSourceRow}`}
          onClick={() => setModal({ type: 'type-selector', category: 'billing' })}
        >
          <span className={styles.addSourceText}>+ Add billing source</span>
        </div>

        {billingSources.length === 0 && (
          <div className={styles.warningBanner}>
            ⚠&nbsp; At least one billing source is required before you can run an audit.
          </div>
        )}

        {/* RECOVERY PIPELINE section */}
        <div className={styles.sectionHead} style={{ marginTop: 20 }}>
          <span className={styles.sectionLabel}>RECOVERY PIPELINE</span>
          <span className={styles.sectionHelper}>Optional. Connect your email to send recovery notices.</span>
        </div>
        <hr className={styles.sectionDivider} />

        <div className={styles.infoBanner}>
          AuditGraph will never send email on your behalf. All emails are drafted for your review and approval.
        </div>

        {recoverySources.map((src) => (
          <div key={src.id} className={`${styles.sourceRow} ${styles.sourceRowLive}`}>
            <div>
              <span className={styles.sourceRowName}>{src.name}</span>
              <span className={styles.sourceRowType}>{src.type} Integration</span>
            </div>
            <div className={styles.sourceRowActions}>
              <button className={styles.configureLink}>Configure</button>
              <span className={styles.liveBadge}>Live</span>
            </div>
          </div>
        ))}

        <div
          className={`${styles.sourceRow} ${styles.addSourceRow}`}
          onClick={() => setModal({ type: 'type-selector', category: 'recovery' })}
        >
          <span className={`${styles.addSourceText} ${styles.addSourceTextOptional}`}>+ Connect email (optional)</span>
        </div>

        <div className={styles.requestIntegrationRow}>
          <span className={styles.requestIntegrationText}>Don't see your system?</span>
          <button
            className={styles.requestIntegrationLink}
            onClick={() => setModal({ type: 'request-integration' })}
          >
            Request integration
          </button>
        </div>

        <div className={styles.navRow}>
          <button className={styles.backBtn} onClick={() => navigate('/onboard/step-2')}>← Back</button>
          <button
            className={styles.continueBtn}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue
          </button>
        </div>

        {import.meta.env.DEV && (
          <div className={styles.devSkip}>
            Skip to:{' '}
            {[1,2,4,5,6,7].map(n => (
              <button key={n} className={styles.devSkipLink} onClick={() => { setOnboardingStep(n); navigate(`/onboard/step-${n}`); }}>
                Step {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal.type === 'type-selector' && (
        <ConnectionTypeSelector
          category={modal.category}
          onSelect={(t) => handleTypeSelected(t, modal.category)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'add-api' && (
        <AddSourceApiModal
          category={modal.category}
          onSave={(p) => handleSourceSaved(p, modal.category, 'API')}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'add-oauth' && (
        <AddSourceOAuthModal
          category={modal.category}
          onSave={(p) => handleSourceSaved(p, modal.category, 'OAuth')}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'add-folder' && (
        <AddSourceFolderModal
          category={modal.category}
          onSave={(p) => handleSourceSaved(p, modal.category, 'Folder')}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'request-integration' && (
        <RequestIntegrationModal onClose={() => setModal({ type: 'none' })} />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
