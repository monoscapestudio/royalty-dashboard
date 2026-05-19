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
    
    // Remove overflow-y: auto; from .content
    const contentRegex = /\.content\s*\{([^}]+)\}/g;
    content = content.replace(contentRegex, (match, block) => {
      const newBlock = block.replace(/\s*overflow-y:\s*auto;/g, '');
      return `.content {${newBlock}}`;
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated CSS: ${file}`);
  }
}
