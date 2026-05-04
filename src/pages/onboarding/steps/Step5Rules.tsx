import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import styles from '../onboarding.module.css';

const INDUSTRY_RULES = [
  { id: 'r1', name: 'Mechanical royalty rate minimum', desc: 'Verify mechanical royalty rate meets statutory minimum per stream' },
  { id: 'r2', name: 'Sync license fee reconciliation', desc: 'Compare sync license fees against master use agreement terms' },
  { id: 'r3', name: 'Performance royalty split verification', desc: 'Validate publisher/writer splits match registered percentages' },
  { id: 'r4', name: 'Streaming recoupment threshold', desc: 'Check that recoupment deductions do not exceed contractual caps' },
  { id: 'r5', name: 'Quarterly statement delivery compliance', desc: 'Flag missing or late quarterly royalty statements per contract terms' },
];

export default function Step5Rules() {
  const navigate = useNavigate();
  const { updateOnboardingData, setOnboardingStep } = useAppStore();
  const [ruleToggles, setRuleToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INDUSTRY_RULES.map((r) => [r.id, true]))
  );
  const [suggestionApproved, setSuggestionApproved] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function toggleRule(id: string) {
    setRuleToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleContinue() {
    updateOnboardingData({ rulesReviewed: true });
    setOnboardingStep(6);
    navigate('/onboard/step-6');
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.card900}>
        <span className={styles.siloBadge}>MUSIC &amp; ROYALTY</span>

        <h1 className={styles.heading}>Review Your Audit Rules</h1>
        <p className={styles.body}>
          AuditGraph has activated 134 industry-standard rules for Music &amp; Royalty.
          <br />Review them below. You can enable, disable, or add custom rules.
        </p>

        {/* Summary bar */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricBigBlue}>134</span>
            <span className={styles.metricSubLabel}>industry rules active</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricBigBlack}>0</span>
            <span className={styles.metricSubLabel}>custom rules</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricBigGreen}>7</span>
            <span className={styles.metricSubLabel}>AI suggestions</span>
          </div>
        </div>

        {/* Industry rules section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className={styles.sectionLabel}>INDUSTRY LIBRARY RULES</span>
          <button className={styles.requestIntegrationLink} style={{ fontSize: 12 }}>Show all 134 →</button>
        </div>
        <hr className={styles.sectionDivider} />

        {INDUSTRY_RULES.map((rule) => (
          <div key={rule.id}>
            <div className={styles.toggleRow}>
              <button
                className={`${styles.toggle} ${ruleToggles[rule.id] ? '' : styles.toggleOff}`}
                onClick={() => toggleRule(rule.id)}
                aria-pressed={ruleToggles[rule.id]}
              >
                <span className={`${styles.toggleThumb} ${ruleToggles[rule.id] ? '' : styles.toggleThumbOff}`} />
              </button>
              <div>
                <span className={styles.toggleRuleName}>{rule.name}</span>
                <span className={styles.toggleRuleDesc}>{rule.desc}</span>
              </div>
            </div>
            <hr className={styles.sectionDivider} style={{ marginLeft: 48 }} />
          </div>
        ))}

        {/* AI Suggestions section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#219654' }}>AI SUGGESTIONS</span>
          <span className={styles.sectionHelper}>Based on your data, we identified 7 additional rules</span>
        </div>
        <hr className={styles.sectionDivider} />

        {!suggestionDismissed && (
          <div className={styles.aiSuggCard}>
            <div>
              <span className={styles.aiSuggTitle}>SoundExchange underpayment detection</span>
              <span className={styles.aiSuggDesc}>AI identified pattern: 23 instances where reported streams &lt; contract minimum</span>
            </div>
            {!suggestionApproved && (
              <div className={styles.aiSuggActions}>
                <button className={styles.approveBtn} onClick={() => setSuggestionApproved(true)}>Approve</button>
                <button className={styles.dismissBtn} onClick={() => setSuggestionDismissed(true)}>Dismiss</button>
              </div>
            )}
            {suggestionApproved && (
              <span style={{ fontSize: 12, color: '#219654', fontWeight: 600, alignSelf: 'center', marginLeft: 12 }}>✓ Approved</span>
            )}
          </div>
        )}

        <button
          className={styles.addCustomRuleLink}
          onClick={() => showToast('You can add custom rules from the Rules screen after setup is complete.')}
        >
          + Add custom rule in plain language
        </button>

        <div className={styles.navRow}>
          <button className={styles.backBtn} onClick={() => navigate('/onboard/step-4')}>← Back</button>
          <button className={styles.continueBtn} onClick={handleContinue}>Continue</button>
        </div>

        <div className={styles.devSkip}>
          Skip to:{' '}
          {[1, 2, 3, 4, 6, 7].map((n) => (
            <button key={n} className={styles.devSkipLink} onClick={() => {
              setOnboardingStep(n);
              navigate(`/onboard/step-${n}`);
            }}>
              Step {n}
            </button>
          ))}
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
