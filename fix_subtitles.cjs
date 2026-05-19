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

      const blockRegex = /\.pageSubtitle\s*\{([^}]+)\}/g;
      content = content.replace(blockRegex, (match, block) => {
        let newBlock = block;
        newBlock = newBlock.replace(/font-family:[^;]+;/g, '');
        newBlock = newBlock.replace(/font-size:[^;]+;/g, '');
        newBlock = newBlock.replace(/font-weight:[^;]+;/g, '');
        
        const cleanBlock = newBlock.replace(/^\s*[\r\n]/gm, ''); // remove empty lines
        
        modified = true;
        return `.pageSubtitle {
  font-family: var(--font-display);
  font-size: var(--type-body);
  font-weight: var(--type-body-weight);${cleanBlock}}`;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
