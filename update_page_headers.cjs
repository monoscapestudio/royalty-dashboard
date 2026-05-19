const fs = require('fs');
const path = require('path');

const directory = './src';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css') && !fullPath.includes('TopNav.module.css') && !fullPath.includes('tokens.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Find .pageHeader block
      const headerRegex = /\.pageHeader\s*\{([^}]+)\}/g;
      content = content.replace(headerRegex, (match, block) => {
        modified = true;
        return `.pageHeader {
  padding: 80px var(--content-px) 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  background: transparent;
  border-bottom: none;
}`;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('TopNav.tsx')) {
      // Need to adjust the TSX if we changed flex-direction to column, 
      // but actually flex-direction: column is fine as is, the button will just appear below the subtitle.
      // Let's wrap the title and subtitle in a div so they stack, and keep the button on the right?
      // Or just let them stack. Stacking is fine.
    }
  }
}

processDirectory(directory);
