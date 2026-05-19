const fs = require('fs');
let content = fs.readFileSync('src/pages/audit/AuditPage.module.css', 'utf8');

content = content.replace(/\.findingsSummary\s*\{[^}]+\}/, `.findingsSummary {
  margin: 0 var(--content-px) 0;
  padding: 80px 0 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  border-bottom: 1px solid var(--border-default);
}`);

content = content.replace(/\.summaryHeroValue\s*\{[^}]+\}/, `.summaryHeroValue {
  font-family: var(--font-display);
  font-size: var(--type-hero);
  font-weight: var(--type-hero-weight);
  letter-spacing: var(--type-hero-tracking);
  line-height: var(--type-hero-lh);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  display: block;
  margin-bottom: 0;
}`);

content = content.replace(/\.summaryHeroSub\s*\{[^}]+\}/, `.summaryHeroSub {
  font-family: var(--font-mono);
  font-size: var(--type-data);
  letter-spacing: var(--type-data-tracking);
  color: var(--text-muted);
  margin-top: 20px;
  display: block;
}`);

content = content.replace(/\.summaryMeta\s*\{[^}]+\}/, `.summaryMeta {
  display: flex;
  align-items: flex-start;
  gap: 64px;
  border-top: 1px solid var(--border-default);
  padding-top: 32px;
}`);

content = content.replace(/\.rerunBtnSmall\s*\{[^}]+\}\n\.rerunBtnSmall:hover\s*\{[^}]+\}/, '');

content = content.replace(/\.rerunBtn\s*\{[^}]+\}\n\.rerunBtn:hover\s*\{[^}]+\}/, `.rerunBtn {
  height: 48px;
  padding: 0 28px;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border-default);
  cursor: pointer;
  transition: background 0.15s ease;
  align-self: flex-start;
}
.rerunBtn:hover {
  background: var(--bg-table-header);
}`);

fs.writeFileSync('src/pages/audit/AuditPage.module.css', content, 'utf8');
