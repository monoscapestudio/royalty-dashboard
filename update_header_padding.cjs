const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  './src/pages/connects/ConnectsPage.module.css',
  './src/pages/audit/AuditPage.module.css',
  './src/pages/reporting/ReportingPage.module.css',
  './src/pages/rules/RulesPage.module.css'
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    const headerRegex = /\.pageHeader\s*\{([^}]+)\}/g;
    content = content.replace(headerRegex, (match, block) => {
      modified = true;
      let newBlock = block.replace(/padding:\s*80px\s+var\(--content-px\)\s+48px;/, 'padding: 40px var(--content-px) 24px;');
      return `.pageHeader {${newBlock}}`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated CSS: ${file}`);
    }
  }
}
