import fs from 'fs';
import path from 'path';

const files = [
  'portfolio/thumbnails/Black_leather_cardholder_silver_key_202607111724.jpeg',
  'portfolio/mockups/desktop/Screenshot_2026-10-14_144606.webp',
  'portfolio/mockups/tablet/Screenshot_2026-10-14_144641.webp',
  'portfolio/mockups/mobile/Screenshot_2026-10-14_144621.webp',
  'portfolio/gallery/scania-r-450-2018.jpg',
  'portfolio/gallery/scania-r-450-2019.jpg',
  'portfolio/gallery/c06bfb12-3bf1-4b01-b863-7d35ba08eb90.jpg',
  'portfolio/gallery/scania_s_520.jpg',
  'portfolio/gallery/rena_t_520-high.jpg',
  'portfolio/gallery/rena_t_520.jpg',
  'portfolio/gallery/rena480.jpg',
  'portfolio/gallery/rena520.jpg',
  'portfolio/gallery/daf530.jpg',
  'portfolio/gallery/Renault_T480.jpg',
  'portfolio/gallery/rena.jpg',
  'portfolio/gallery/volvo_FH_500.jpg',
];

async function downloadFile(relPath) {
  const localPath = path.join(process.cwd(), 'public', 'media', relPath);
  if (fs.existsSync(localPath) && fs.statSync(localPath).size > 0) {
    console.log(`Already exists: ${relPath}`);
    return;
  }

  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const url = `https://urumsima.ir/media/${relPath}`;
  console.log(`Downloading: ${url} -> ${localPath}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed ${url}: ${res.status}`);
      return;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(localPath, buffer);
    console.log(`Saved: ${relPath} (${buffer.length} bytes)`);
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
  }
}

async function main() {
  console.log('Starting Altin Pasha media sync...');
  for (const f of files) {
    await downloadFile(f);
  }
  console.log('Finished media download.');
}

main();
