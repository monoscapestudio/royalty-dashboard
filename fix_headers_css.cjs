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
    
    const headerRegex = /\.pageHeader\s*\{([^}]+)\}/g;
    content = content.replace(headerRegex, (match, block) => {
      return `.pageHeader {
  padding: 80px var(--content-px) 48px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  background: transparent;
  border-bottom: none;
}

.pageHeaderText {
  display: flex;
  flex-direction: column;
  gap: 12px;
}`;
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated CSS: ${file}`);
  }
}
