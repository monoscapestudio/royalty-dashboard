const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  './src/pages/account/notifications/NotificationsPage.module.css',
  './src/pages/account/roles/RolesPage.module.css',
  './src/pages/account/support/SupportPage.module.css',
  './src/pages/account/team/TeamPage.module.css'
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    const titleRegex = /\.pageTitle\s*\{([^}]+)\}/g;
    content = content.replace(titleRegex, (match, block) => {
      modified = true;
      return `.pageTitle {
  font-family: var(--font-display);
  font-size: var(--type-hero);
  font-weight: 500;
  letter-spacing: var(--type-hero-tracking);
  line-height: var(--type-hero-lh);
  color: var(--text-primary);
  margin: 0 0 4px;
}`;
    });

    const subtitleRegex = /\.pageSubtitle\s*\{([^}]+)\}/g;
    content = content.replace(subtitleRegex, (match, block) => {
      modified = true;
      return `.pageSubtitle {
  font-family: var(--font-display);
  font-size: var(--type-metric);
  font-weight: var(--type-metric-weight);
  letter-spacing: var(--type-metric-tracking);
  line-height: var(--type-metric-lh);
  color: var(--text-secondary);
  margin: 0 0 48px;
}`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated CSS: ${file}`);
    }
  }
}
