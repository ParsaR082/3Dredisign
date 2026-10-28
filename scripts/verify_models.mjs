import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/components/3d/CampusInteriorDecorations.tsx', 'utf8');
const regex = /file=["']([^"']+)["']/g;
let match;
const files = new Set();
let totalProps = 0;

while ((match = regex.exec(content)) !== null) {
  files.add(match[1]);
  totalProps++;
}

console.log('Total <AutoProp> instances in CampusInteriorDecorations:', totalProps);
console.log('Unique GLB files referenced:', files.size);

const missing = [];
for (const f of files) {
  const p = path.join('public', '3Dmodels', f);
  if (!fs.existsSync(p)) {
    missing.push(f);
  }
}

if (missing.length === 0) {
  console.log('SUCCESS: All', files.size, 'GLB models exist in public/3Dmodels/!');
} else {
  console.log('ERROR: Missing models:', missing);
}
