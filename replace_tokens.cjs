const fs = require('fs');
const path = require('path');

const directory = './src';

const replacements = [
  // Typography replacements
  { regex: /--type-display(-weight|-tracking|-lh)?/g, replace: '--type-hero$1' },
  { regex: /--type-headline(-weight|-tracking|-lh)?/g, replace: '--type-metric$1' },
  { regex: /--type-title(-weight|-tracking|-lh)?/g, replace: '--type-body$1' },
  { regex: /--type-subtitle(-weight|-tracking|-lh)?/g, replace: '--type-body$1' },
  { regex: /--type-body-sm(-weight|-tracking|-lh)?/g, replace: '--type-body$1' },
  { regex: /--type-caption(-weight|-tracking|-lh)?/g, replace: '--type-data$1' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css') && !fullPath.includes('tokens.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
