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

    // Update .pageSubtitle to use --type-subtitle (24px)
    const subtitleRegex = /\.pageSubtitle\s*\{([^}]+)\}/g;
    content = content.replace(subtitleRegex, (match, block) => {
      modified = true;
      return `.pageSubtitle {
  font-family: var(--font-display);
  font-size: var(--type-subtitle);
  font-weight: var(--type-subtitle-weight);
  letter-spacing: var(--type-subtitle-tracking);
  line-height: var(--type-subtitle-lh);
  color: var(--text-secondary);
}`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated CSS: ${file}`);
    }
  }
}
