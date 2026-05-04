import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import styles from '../onboarding.module.css';

export default function Step1Welcome() {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData, setOnboardingStep } = useAppStore();

  const [orgName, setOrgName] = useState(onboardingData.orgName);
  const [userName, setUserName] = useState(onboardingData.userName);
  const [role, setRole] = useState<'cfo' | 'revops' | 'other'>(onboardingData.userRole);
  const [toast, setToast] = useState<string | null>(null);

  const canContinue = orgName.trim().length > 0 && userName.trim().length > 0;

  function handleContinue() {
    updateOnboardingData({ orgName: orgName.trim(), userName: userName.trim(), userRole: role });
    setOnboardingStep(2);
    navigate('/onboard/step-2');
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.card700}>
        <span className={styles.logotype}>AUDITGRAPH</span>

        <h1 className={styles.heading}>Welcome to AuditGraph</h1>
        <p className={styles.body}>
          Let's set up your workspace. This will take about 5 minutes.
          <br />You can pause and return at any time.
        </p>

        <label className={styles.fieldLabel} htmlFor="orgName">Organization Name</label>
        <input
          id="orgName"
          className={styles.fieldInput}
          type="text"
          placeholder="e.g. Acme Records"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <label className={styles.fieldLabel} htmlFor="userName">Your Name</label>
        <input
          id="userName"
          className={styles.fieldInput}
          type="text"
          placeholder="e.g. Sarah Cone"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label className={styles.fieldLabel}>Your Role</label>
        <span className={styles.fieldHelper}>This determines your default dashboard view.</span>

        {(
          [
            { value: 'cfo', label: 'CFO / Finance Lead' },
            { value: 'revops', label: 'VP RevOps / Head of Billing' },
            { value: 'other', label: 'Other' },
          ] as const
        ).map(({ value, label }) => (
          <label key={value} className={styles.radioOpt} onClick={() => setRole(value)}>
            <span className={`${styles.radioCircle} ${role === value ? styles.radioCircleSelected : ''}`}>
              {role === value && <span className={styles.radioCircleDot} />}
            </span>
            <span className={styles.radioLabel}>{label}</span>
          </label>
        ))}

        <div className={`${styles.navRow} ${styles.navRowRight}`} style={{ marginTop: 24 }}>
          <button
            className={`${styles.continueBtn} ${styles.continueBtnFull}`}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue
          </button>
        </div>

        <p className={styles.signInRow}>
          Already have an account?{' '}
          <button
            type="button"
            className={styles.signInLinkBtn}
            onClick={() => {
              setToast('Sign-in flow is out of scope for this wireframe.');
              setTimeout(() => setToast(null), 2500);
            }}
          >
            Sign in
          </button>
        </p>

        {toast && <div className={styles.toast}>{toast}</div>}

        <div className={styles.devSkip}>
          Skip to:{' '}
          {[2, 3, 4, 5, 6, 7].map((n) => (
            <button key={n} className={styles.devSkipLink} onClick={() => {
              setOnboardingStep(n);
              navigate(`/onboard/step-${n}`);
            }}>
              Step {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
