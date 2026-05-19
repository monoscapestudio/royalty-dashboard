const fs = require('fs');
let content = fs.readFileSync('src/pages/audit/AuditPage.tsx', 'utf8');

// 1. Add useState for showReadiness
content = content.replace(
  /const \[toast, setToast\] = useState<string \| null>\(null\);/,
  `const [showReadiness, setShowReadiness] = useState(false);\n\n  /* Toast */\n  const [toast, setToast] = useState<string | null>(null);`
);

// 2. Hide readiness section for COMPLETE
content = content.replace(
  /\{effectiveState !== 'NOT_YET_RUN' && \(/,
  `{effectiveState !== 'NOT_YET_RUN' && effectiveState !== 'COMPLETE' && (`
);

// 3. Update COMPLETE block
const completeBlock = `      {/* COMPLETE: hero findings + table */}
      {effectiveState === 'COMPLETE' && (
        <>
          <FindingsSummary findings={findingsToShow} onRerun={startAudit} />
          
          <div style={{ padding: '0 var(--content-px)', marginBottom: 32 }}>
            <button 
              onClick={() => setShowReadiness(!showReadiness)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--type-caption)',
                color: 'var(--text-secondary)', textDecoration: 'underline'
              }}
            >
              {showReadiness ? 'Hide readiness details' : 'View readiness details'}
            </button>
            
            {showReadiness && (
              <div style={{ marginTop: 16 }}>
                <span className={styles.sectionLabel} style={{ padding: '0 0 8px 0' }}>Pre-Audit Readiness</span>
                <div className={styles.readinessRow} style={{ padding: 0 }}>
                  <div className={styles.readinessCard}>
                    <span className={\`\${styles.readinessBadge} \${styles.badgeReady}\`}>Ready</span>
                    <span className={styles.readinessDesc}>Data Sources: 6 connected, 5 live, 1 needs fix</span>
                  </div>
                  <div className={styles.readinessCard}>
                    <span className={\`\${styles.readinessBadge} \${styles.badgeReady}\`}>Ready</span>
                    <span className={styles.readinessDesc}>Rules: 321 active across 3 sources</span>
                  </div>
                  <div className={styles.readinessCard}>
                    <span className={\`\${styles.readinessBadge} \${styles.badgeReady}\`}>96%</span>
                    <span className={styles.readinessDesc}>Coverage: 1,412,308 eligible records</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <FindingsTable findings={findingsToShow} onToast={showToast} />
        </>
      )}`;

content = content.replace(
  /\{\/\* COMPLETE: hero findings \+ table \*\/\}\s*\{effectiveState === 'COMPLETE' && \(\s*<>\s*<FindingsSummary findings=\{findingsToShow\} onRerun=\{startAudit\} \/>\s*<FindingsTable findings=\{findingsToShow\} onToast=\{showToast\} \/>\s*<\/>\s*\)\}/,
  completeBlock
);

// 4. Update FindingsSummary component
const newFindingsSummary = `/* ── Internal sub-component ── */
function FindingsSummary({ findings, onRerun }: { findings: Finding[]; onRerun?: () => void }) {
  const totalValue = findings.reduce((sum, f) => sum + f.discrepancyValue, 0);
  const maxConf = findings.length > 0 ? Math.max(...findings.map((f) => f.confidence)) : 0;
  const fmtValue = '$' + (totalValue >= 1_000_000
    ? (totalValue / 1_000_000).toFixed(1) + 'M'
    : totalValue.toLocaleString('en-US'));

  return (
    <div className={styles.findingsSummary}>
      <div className={styles.summaryHero}>
        <span className={styles.summaryHeroLabel}>Potential recovery found</span>
        <span className={styles.summaryHeroValue}>{fmtValue}</span>
        <span className={styles.summaryHeroSub}>
          Audit complete · April 21, 2026 · 1,412,308 records processed
        </span>
        {onRerun && (
          <button className={styles.rerunBtn} onClick={onRerun} style={{ marginTop: 32 }}>RE-RUN AUDIT</button>
        )}
      </div>
      <div className={styles.summaryMeta}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Findings</span>
          <span className={styles.statValue}>{findings.length.toLocaleString()}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Coverage</span>
          <span className={styles.statValue}>96%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Max Confidence</span>
          <span className={styles.statValue}>{maxConf}%</span>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(
  /\/\* ── Internal sub-component ── \*\/[\s\S]*?function FindingsSummary[\s\S]*?\}\s*\}\s*/,
  newFindingsSummary + '\n'
);

fs.writeFileSync('src/pages/audit/AuditPage.tsx', content, 'utf8');
