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

      // Replace hardcoded font sizes with tokens based on context
      // We'll use a regex to find CSS blocks
      const blockRegex = /([^{]+)\{([^}]+)\}/g;
      content = content.replace(blockRegex, (match, selector, block) => {
        let newBlock = block;
        
        // Check if it's mono
        const isMono = newBlock.includes('var(--font-mono)') || newBlock.includes('monospace');
        const isUppercase = newBlock.includes('uppercase');
        const isBold = newBlock.includes('font-weight: 500') || newBlock.includes('font-weight: 600') || newBlock.includes('font-weight: 700') || newBlock.includes('bold');
        
        // Find font-size declarations
        newBlock = newBlock.replace(/font-size:\s*(\d+)px;/g, (m, sizeStr) => {
          const size = parseInt(sizeStr, 10);
          if (size >= 64) return 'font-size: var(--type-hero);';
          if (size >= 32) return 'font-size: var(--type-metric);';
          
          if (isMono) {
            if (isUppercase || isBold || size <= 12) {
              return 'font-size: var(--type-label);';
            } else {
              return 'font-size: var(--type-data);';
            }
          } else {
            return 'font-size: var(--type-body);';
          }
        });

        // Also replace var(--type-...) if they are wrong for the font family
        newBlock = newBlock.replace(/font-size:\s*var\(--type-([^)]+)\);/g, (m, token) => {
          if (isMono) {
            if (token === 'hero' || token === 'metric' || token === 'body') {
              return isUppercase || isBold ? 'font-size: var(--type-label);' : 'font-size: var(--type-data);';
            }
          } else {
            if (token === 'data' || token === 'label') {
              return 'font-size: var(--type-body);';
            }
          }
          return m;
        });

        if (newBlock !== block) {
          modified = true;
        }
        return `${selector}{${newBlock}}`;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
