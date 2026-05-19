const fs = require('fs');

// FILE 3: ConnectsPage.module.css
let content = fs.readFileSync('src/pages/connects/ConnectsPage.module.css', 'utf8');
content = content.replace(/\.content\s*\{[^}]+\}/, `.content {
  padding: 32px var(--content-px) 40px;
  flex: 1;
  overflow-y: auto;
}`);
content = content.replace(/\.threeCol\s*\{[^}]+\}/, `.threeCol {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}`);
fs.writeFileSync('src/pages/connects/ConnectsPage.module.css', content, 'utf8');

// FILE 4: SourceSection.module.css
content = fs.readFileSync('src/pages/connects/components/SourceSection.module.css', 'utf8');
content = content.replace(/\.columnTitle\s*\{[^}]+\}/, `.columnTitle {
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-primary);
}`);
content = content.replace(/\.columnHeader\s*\{[^}]+\}/, `.columnHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-default);
}`);
content = content.replace(/\.card\s*\{[^}]+\}/, `.card {
  padding: 16px;
  border-bottom: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  gap: 12px;
}`);
content = content.replace(/\.cardName\s*\{[^}]+\}/, `.cardName {
  font-family: var(--font-display);
  font-size: var(--type-body);
  font-weight: 600;
  color: var(--text-primary);
}`);
content = content.replace(/\.addBtn\s*\{[^}]+\}/, `.addBtn {
  height: 48px;
  width: 100%;
  background: transparent;
  border: 1px dashed var(--border-default);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: 400;
  letter-spacing: var(--type-label-tracking);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.1s;
}`);
fs.writeFileSync('src/pages/connects/components/SourceSection.module.css', content, 'utf8');

// FILE 5: RulesPage.module.css
content = fs.readFileSync('src/pages/rules/RulesPage.module.css', 'utf8');
content = content.replace(/\.panelTitle\s*\{[^}]+\}/, `.panelTitle {
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-primary);
}`);
content = content.replace(/\.panelCount\s*\{[^}]+\}/, `.panelCount {
  font-family: var(--font-display);
  font-size: var(--type-title);
  font-weight: var(--type-title-weight);
  letter-spacing: var(--type-title-tracking);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--bg-table-header);
  border-radius: 50%;
}`);
content = content.replace(/\.panelHeader\s*\{[^}]+\}/, `.panelHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  height: auto;
  min-height: 48px;
  border-bottom: 1px solid var(--border-default);
}`);
fs.writeFileSync('src/pages/rules/RulesPage.module.css', content, 'utf8');

// FILE 6: CurrentRulesTable.module.css
content = fs.readFileSync('src/pages/rules/components/CurrentRulesTable.module.css', 'utf8');
content = content.replace(/\.row\s*\{[^}]+\}/, `.row {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 var(--content-px);
  border-bottom: 1px solid var(--border-default);
}`);
content = content.replace(/\.ruleText\s*\{[^}]+\}/, `.ruleText {
  font-family: var(--font-display);
  font-size: var(--type-body-sm);
  font-weight: 400;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`);
fs.writeFileSync('src/pages/rules/components/CurrentRulesTable.module.css', content, 'utf8');

// FILE 7: ReportingPage.module.css
content = fs.readFileSync('src/pages/reporting/ReportingPage.module.css', 'utf8');
content = content.replace(/\.metricValue\s*\{[^}]+\}/, `.metricValue {
  font-family: var(--font-display);
  font-size: var(--type-title);
  font-weight: var(--type-title-weight);
  letter-spacing: var(--type-title-tracking);
  line-height: var(--type-title-lh);
  color: var(--text-primary);
}`);
content = content.replace(/\.metricLabel\s*\{[^}]+\}/, `.metricLabel {
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-top: 4px;
}`);
content = content.replace(/\.leftHeaderSub\s*\{[^}]+\}/, `.leftHeaderSub {
  font-size: var(--type-caption);
  color: var(--text-muted);
}`);
content = content.replace(/\.sectionLabel\s*\{[^}]+\}/, `.sectionLabel {
  font-size: var(--type-caption);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}`);

// Fix all font-size values below 12px in ReportingPage.module.css
content = content.replace(/font-size:\s*10px;/g, 'font-size: 12px;');
content = content.replace(/font-size:\s*11px;/g, 'font-size: 12px;');
content = content.replace(/font-size:\s*9px;/g, 'font-size: 12px;');
content = content.replace(/font-size:\s*8px;/g, 'font-size: 12px;');
content = content.replace(/font-size:\s*7px;/g, 'font-size: 12px;');
content = content.replace(/font-size:\s*6px;/g, 'font-size: 12px;');

fs.writeFileSync('src/pages/reporting/ReportingPage.module.css', content, 'utf8');
