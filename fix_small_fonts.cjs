const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('src', function(filePath) {
  if (!filePath.endsWith('.css')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/font-size:\s*(6|7|8|9|10|11)px;/g, 'font-size: 12px;');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
