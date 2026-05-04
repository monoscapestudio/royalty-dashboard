import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import styles from '../onboarding.module.css';

const SILOS = [
  {
    value: 'music-royalty',
    label: 'MUSIC & ROYALTY',
    desc: 'Royalty reconciliation, mechanical licensing, streaming revenue, sync fees, publishing',
  },
  {
    value: 'healthcare-claims',
    label: 'HEALTHCARE & CLAIMS',
    desc: 'Claims adjudication, reimbursement verification, provider billing, payer contracts',
  },
  {
    value: 'logistics-freight',
    label: 'LOGISTICS & FREIGHT',
    desc: 'Freight invoice audit, carrier contracts, accessorial charges, fuel surcharges',
  },
  {
    value: 'fintech-ip',
    label: 'FINTECH & IP',
    desc: 'Licensing revenue, patent royalties, SaaS contract compliance, usage-based billing',
  },
] as const;

export default function Step2Silo() {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData, setOnboardingStep } = useAppStore();
  const [selected, setSelected] = useState(onboardingData.selectedSilo || 'music-royalty');

  function handleContinue() {
    updateOnboardingData({ selectedSilo: selected });
    setOnboardingStep(3);
    navigate('/onboard/step-3');
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.card700}>
        <span className={styles.logotype}>AUDITGRAPH</span>

        <h1 className={styles.heading}>Select Your Sovereign Silo</h1>
        <p className={styles.body}>
          Each Sovereign Silo contains its own data sources, rules, and audit findings.
          <br />Your connections, rules, and reports are isolated per silo.
        </p>

        {SILOS.map(({ value, label, desc }) => (
          <div
            key={value}
            className={`${styles.radioCard} ${selected === value ? styles.radioCardSelected : ''}`}
            onClick={() => setSelected(value)}
          >
            <span className={`${styles.radioCircle} ${selected === value ? styles.radioCircleSelected : ''}`} style={{ marginTop: 2 }}>
              {selected === value && <span className={styles.radioCircleDot} />}
            </span>
            <span>
              <span className={styles.radioCardTitle}>{label}</span>
              <span className={styles.radioCardDesc}>{desc}</span>
            </span>
          </div>
        ))}

        <p className={styles.helperText} style={{ marginTop: 12 }}>
          You can add more silos later from your account settings.
        </p>

        <div className={styles.navRow}>
          <button className={styles.backBtn} onClick={() => navigate('/onboard/step-1')}>← Back</button>
          <button className={styles.continueBtn} onClick={handleContinue}>Continue</button>
        </div>

        {import.meta.env.DEV && (
          <div className={styles.devSkip}>
            Skip to:{' '}
            {[1,3,4,5,6,7].map(n => (
              <button key={n} className={styles.devSkipLink} onClick={() => { setOnboardingStep(n); navigate(`/onboard/step-${n}`); }}>
                Step {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
