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

      const blockRegex = /([^{]+)\{([^}]+)\}/g;
      content = content.replace(blockRegex, (match, selector, block) => {
        if (block.includes('var(--type-label)') && !block.includes('text-transform: uppercase')) {
          modified = true;
          return `${selector}{${block}  text-transform: uppercase;\n}`;
        }
        return match;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
