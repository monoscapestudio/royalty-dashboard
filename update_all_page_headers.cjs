const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  './src/pages/audit/AuditPage.module.css',
  './src/pages/reporting/ReportingPage.module.css',
  './src/pages/rules/RulesPage.module.css'
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Update .pageTitle to use --type-hero (96px)
    const titleRegex = /\.pageTitle\s*\{([^}]+)\}/g;
    content = content.replace(titleRegex, (match, block) => {
      modified = true;
      let newBlock = block;
      newBlock = newBlock.replace(/var\(--type-metric\)/g, 'var(--type-hero)');
      newBlock = newBlock.replace(/var\(--type-metric-weight\)/g, 'var(--type-hero-weight)');
      newBlock = newBlock.replace(/var\(--type-metric-tracking\)/g, 'var(--type-hero-tracking)');
      newBlock = newBlock.replace(/var\(--type-metric-lh\)/g, 'var(--type-hero-lh)');
      return `.pageTitle {${newBlock}}`;
    });

    // Update .pageSubtitle to use --type-metric (48px)
    const subtitleRegex = /\.pageSubtitle\s*\{([^}]+)\}/g;
    content = content.replace(subtitleRegex, (match, block) => {
      modified = true;
      return `.pageSubtitle {
  font-family: var(--font-display);
  font-size: var(--type-metric);
  font-weight: var(--type-metric-weight);
  letter-spacing: var(--type-metric-tracking);
  line-height: var(--type-metric-lh);
  color: var(--text-secondary);
}`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated CSS: ${file}`);
    }
  }
}
