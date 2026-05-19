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

    const titleRegex = /\.pageTitle\s*\{([^}]+)\}/g;
    content = content.replace(titleRegex, (match, block) => {
      modified = true;
      let newBlock = block.replace(/font-weight:\s*var\(--type-hero-weight\);/, 'font-weight: 500;');
      return `.pageTitle {${newBlock}}`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated CSS: ${file}`);
    }
  }
}
