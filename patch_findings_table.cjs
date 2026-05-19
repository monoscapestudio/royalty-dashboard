const fs = require('fs');
let content = fs.readFileSync('src/pages/audit/components/FindingsTable.module.css', 'utf8');

content = content.replace(/\.tableRow\s*\{[^}]+\}/, `.tableRow {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 var(--content-px);
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-white);
}`);

content = content.replace(/\.discrepancy\s*\{[^}]+\}/, `.discrepancy {
  font-family: var(--font-display);
  font-size: var(--type-subtitle);
  font-weight: var(--type-subtitle-weight);
  letter-spacing: var(--type-subtitle-tracking);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}`);

content = content.replace(/\.contract\s*\{[^}]+\}/, `.contract {
  font-family: var(--font-display);
  font-size: var(--type-body-sm);
  font-weight: 400;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`);

content = content.replace(/\.billing\s*\{[^}]+\}/, `.billing {
  font-family: var(--font-mono);
  font-size: var(--type-data);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`);

content = content.replace(/\.confPct\s*\{[^}]+\}/, `.confPct {
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  color: var(--text-secondary);
  min-width: 32px;
  text-align: right;
}`);

content = content.replace(/\.colLabel\s*\{[^}]+\}/, `.colLabel {
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-secondary);
}`);

content = content.replace(/\.colHeader\s*\{[^}]+\}/, `.colHeader {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 var(--content-px);
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-white);
}`);

content = content.replace(/\.statusBadge\s*\{[^}]+\}/, `.statusBadge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--radius-badge);
  font-size: var(--type-caption);
  font-weight: 600;
  white-space: nowrap;
}`);

fs.writeFileSync('src/pages/audit/components/FindingsTable.module.css', content, 'utf8');
