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

content = content.replace(/\.summaryHeroLabel\s*\{[^}]+\}/, `.summaryHeroLabel {
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 16px;
}`);

content = content.replace(/\.summaryHeroSub\s*\{[^}]+\}/, `.summaryHeroSub {
  font-family: var(--font-mono);
  font-size: var(--type-data);
  font-weight: var(--type-data-weight);
  letter-spacing: var(--type-data-tracking);
  color: var(--text-muted);
  margin-top: 20px;
  display: block;
}`);

content = content.replace(/\.statLabel\s*\{[^}]+\}/, `.statLabel {
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}`);

content = content.replace(/\.statValue\s*\{[^}]+\}/, `.statValue {
  font-family: var(--font-display);
  font-size: var(--type-headline);
  font-weight: var(--type-headline-weight);
  letter-spacing: var(--type-headline-tracking);
  line-height: var(--type-headline-lh);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  display: block;
}`);

content = content.replace(/\.summaryMeta\s*\{[^}]+\}/, `.summaryMeta {
  display: flex;
  align-items: flex-start;
  gap: 64px;
  border-top: 1px solid var(--border-default);
  padding-top: 40px;
}`);

content = content.replace(/\.stateCardBtnPrimary\s*\{[^}]+\}/, `.stateCardBtnPrimary {
  height: 52px;
  padding: 0 32px;
  background: var(--btn-primary-bg);
  color: #fff;
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: 600;
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  border-radius: var(--radius-btn);
  border: none;
  cursor: pointer;
  transition: background 0.1s;
}`);

content = content.replace(/\.stateCardBtnSecondary\s*\{[^}]+\}/, `.stateCardBtnSecondary {
  height: 52px;
  padding: 0 24px;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: 400;
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border-default);
  cursor: pointer;
  transition: background 0.1s;
}`);

content = content.replace(/\.runBtn\s*\{[^}]+\}/, `.runBtn {
  margin-left: auto;
  height: 48px;
  padding: 0 28px;
  background: var(--btn-primary-bg);
  color: #fff;
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: 600;
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  border-radius: var(--radius-btn);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s;
}`);

content = content.replace(/\.sectionLabel\s*\{[^}]+\}/, `.sectionLabel {
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-secondary);
  display: block;
  padding: 12px var(--content-px) 8px;
}`);

fs.writeFileSync('src/pages/audit/AuditPage.module.css', content, 'utf8');
