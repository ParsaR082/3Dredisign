import fs from 'fs';
import path from 'path';

function checkComponent(file) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /['"]\/3Dmodels\/([^'"]+)['"]/g;
  let match;
  const files = new Set();
  while ((match = regex.exec(content)) !== null) {
    files.add(match[1]);
  }
  const autoRegex = /file=["']([^"']+)["']/g;
  while ((match = autoRegex.exec(content)) !== null) {
    files.add(match[1]);
  }
  const missing = [];
  for (const f of files) {
    const p = path.join('public', '3Dmodels', f);
    if (!fs.existsSync(p)) {
      missing.push(f);
    }
  }
  console.log(file, '-> Total files:', files.size, 'Missing:', missing);
}

checkComponent('src/components/3d/CampusInteriorDecorations.tsx');
checkComponent('src/components/3d/DigitalArchitectureCampus.tsx');
checkComponent('src/components/3d/CorporateOfficeEnvironment.tsx');
