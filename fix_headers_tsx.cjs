const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  './src/pages/connects/ConnectsPage.tsx',
  './src/pages/audit/AuditPage.tsx',
  './src/pages/reporting/ReportingPage.tsx',
  './src/pages/rules/RulesPage.tsx'
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the pageHeader block
    // We want to wrap h1.pageTitle and span.pageSubtitle in a div.pageHeaderText
    
    // Simple regex to find the h1 and span
    const titleRegex = /(<h1 className=\{styles\.pageTitle\}>[^<]+<\/h1>\s*<span className=\{styles\.pageSubtitle\}>[^<]+<\/span>)/g;
    
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, '<div className={styles.pageHeaderText}>\n          $1\n        </div>');
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated TSX: ${file}`);
    }
  }
}
