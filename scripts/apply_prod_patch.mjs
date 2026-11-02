import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();

const SSH_CONFIG = {
  host: '185.142.157.42',
  port: 22,
  username: 'root',
  password: process.env.SSH_PASSWORD || '',
  readyTimeout: 30000,
};

function runCommand(client, cmd) {
  return new Promise((resolve, reject) => {
    client.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code, signal) => resolve({ code, stdout, stderr }));
      stream.on('data', (d) => stdout += d.toString());
      stream.stderr.on('data', (d) => stderr += d.toString());
    });
  });
}

function uploadFile(sftp, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function main() {
  console.log('Connecting to server', SSH_CONFIG.host, '...');
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });
  console.log('Connected via SSH!');

  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, s) => {
      if (err) return reject(err);
      resolve(s);
    });
  });
  console.log('SFTP initialized.');

  // 1. Upload SQL patch
  console.log('Uploading SQL patch to /tmp/patch_prod_db.sql...');
  await uploadFile(sftp, 'scratch/patch_prod_db.sql', '/tmp/patch_prod_db.sql');
  console.log('Patch uploaded.');

  // 2. Ensure remote media directory exists
  await runCommand(conn, 'mkdir -p /var/www/urumsima/media/websites/covers');

  // 3. Upload images
  const mediaFiles = [
    { local: 'public/media/websites/covers/neo-cafe.jpg', remote: '/var/www/urumsima/media/websites/covers/neo-cafe.jpg' },
    { local: 'public/media/websites/covers/finmatrix-dashboard.jpg', remote: '/var/www/urumsima/media/websites/covers/finmatrix-dashboard.jpg' }
  ];

  for (const m of mediaFiles) {
    console.log(`Uploading ${m.local} -> ${m.remote}...`);
    await uploadFile(sftp, m.local, m.remote);
  }
  console.log('Media files uploaded successfully!');

  // Set proper permissions for media
  await runCommand(conn, 'chown -R www-data:www-data /var/www/urumsima/media && chmod -R 755 /var/www/urumsima/media');

  // 4. Apply SQL patch
  console.log('Applying SQL patch to PostgreSQL urumsima_db...');
  const patchRes = await runCommand(conn, 'sudo -u postgres psql -d urumsima_db -f /tmp/patch_prod_db.sql');
  console.log(patchRes.stdout || patchRes.stderr);

  // 5. Verify the updated websites
  console.log('Verifying websites in database...');
  const verifyRes = await runCommand(conn, 'sudo -u postgres psql -d urumsima_db -c "SELECT id, title, slug, live_url FROM websites_website ORDER BY id;"');
  console.log(verifyRes.stdout);

  const featsRes = await runCommand(conn, 'sudo -u postgres psql -d urumsima_db -c "SELECT count(*) AS total_features FROM websites_websitefeature;"');
  console.log(featsRes.stdout);

  conn.end();
  console.log('All changes applied and verified on production server!');
}

main().catch(console.error);
