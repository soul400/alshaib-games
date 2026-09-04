const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '.next');
const destDir = path.join(__dirname, 'apps', 'studio');
const dest = path.join(destDir, '.next');

if (fs.existsSync(src)) {
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.cpSync(src, dest, { recursive: true });
    console.log('Successfully prepared fallback output directory for Vercel at apps/studio/.next');
  } catch (err) {
    console.warn('Could not copy .next to fallback path:', err.message);
  }
}
