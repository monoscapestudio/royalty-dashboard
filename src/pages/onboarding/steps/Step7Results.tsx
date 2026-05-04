import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/app';
import styles from '../onboarding.module.css';

const TOP_FINDINGS = [
  { source: 'SoundExchange', rule: 'Mechanical royalty rate minimum', amount: '$47,230', conf: '97%' },
  { source: 'SoundExchange', rule: 'Streaming recoupment threshold exceeded', amount: '$38,412', conf: '95%' },
  { source: 'QuickBooks', rule: 'Quarterly statement delivery compliance', amount: '$31,890', conf: '92%' },
  { source: 'Google Drive', rule: 'Sync license fee reconciliation', amount: '$28,105', conf: '94%' },
  { source: 'QuickBooks', rule: 'Performance royalty split verification', amount: '$24,667', conf: '89%' },
];

export default function Step7Results() {
  const navigate = useNavigate();
  const { updateOnboardingData } = useAppStore();

  function handleExit(path: string) {
    updateOnboardingData({ firstAuditRun: true });
    navigate(path);
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.card900}>
        <span className={styles.siloBadge}>MUSIC &amp; ROYALTY</span>

        <h1 className={styles.heading}>Your First Audit is Complete</h1>
        <p className={styles.body}>
          AuditGraph analyzed 26,644 records against 141 rules and identified
          <br />recoverable revenue in your billing data.
        </p>

        {/* Key metrics */}
        <div className={styles.resultsMetrics}>
          <div className={styles.resultsMetricItem}>
            <span className={styles.resultsBigBlack}>$284,739</span>
            <span className={styles.resultsSubLabel}>Total recoverable amount</span>
          </div>
          <div className={styles.resultsMetricItem} style={{ paddingLeft: 40 }}>
            <span className={styles.resultsBigBlue}>1,390</span>
            <span className={styles.resultsSubLabel}>Findings identified</span>
          </div>
          <div className={styles.resultsMetricItem} style={{ paddingLeft: 40 }}>
            <span className={styles.resultsBigGreen}>94.2%</span>
            <span className={styles.resultsSubLabel}>Confidence score (avg)</span>
          </div>
        </div>

        {/* Top findings table */}
        <span className={styles.resultsTableLabel}>Top Findings by Discrepancy</span>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Source</th>
              <th>Rule Triggered</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'right' }}>Conf.</th>
            </tr>
          </thead>
          <tbody>
            {TOP_FINDINGS.map((row) => (
              <tr key={row.rule}>
                <td className={styles.tdSource}>{row.source}</td>
                <td className={styles.tdRule}>{row.rule}</td>
                <td className={styles.tdAmount}>{row.amount}</td>
                <td className={styles.tdConf}>{row.conf}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Info card */}
        <div className={styles.infoBannerBlue}>
          A draft report has been generated automatically. Review and finalize it in Reporting.
        </div>

        {/* CTA buttons */}
        <div className={styles.ctaRow}>
          <button className={styles.ctaPrimary} onClick={() => handleExit('/app/audit')}>
            View Full Audit Results
          </button>
          <button className={styles.ctaSecondary} onClick={() => handleExit('/app/reporting')}>
            Go to Report Builder
          </button>
        </div>

        {/* What's next */}
        <span className={styles.whatsNext}>What's Next</span>
        <p className={styles.whatsNextText}>
          Add more data sources to improve coverage. Review individual findings and initiate recovery.
          <br />Customize rules for your specific contract terms. Share the audit report with your team.
        </p>
      </div>
    </div>
  );
}
