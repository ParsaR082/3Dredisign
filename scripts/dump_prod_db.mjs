import { Client } from 'ssh2';
import fs from 'fs';

const SSH_CONFIG = {
  host: '185.142.157.42',
  port: 22,
  username: 'root',
  password: process.env.SSH_PASSWORD || '',
  readyTimeout: 30000,
};

async function connectWithRetry(retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`Connecting to ${SSH_CONFIG.host} (attempt ${i}/${retries})...`);
      const conn = new Client();
      await new Promise((resolve, reject) => {
        conn.on('ready', () => resolve(conn));
        conn.on('error', reject);
        conn.connect(SSH_CONFIG);
      });
      return conn;
    } catch (err) {
      console.warn(`Connection attempt ${i} failed:`, err.message);
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

function runCmd(client, cmd) {
  return new Promise((resolve, reject) => {
    client.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code) => resolve({ code, stdout, stderr }));
      stream.on('data', d => stdout += d.toString());
      stream.stderr.on('data', d => stderr += d.toString());
    });
  });
}

async function main() {
  const conn = await connectWithRetry();
  console.log('Connected! Dumping updated database on server...');
  await runCmd(conn, 'sudo -u postgres pg_dump urumsima_db > /tmp/urumsima_prod_updated.sql');
  
  const sizeRes = await runCmd(conn, 'ls -lh /tmp/urumsima_prod_updated.sql');
  console.log(sizeRes.stdout.trim());

  console.log('Downloading updated SQL dump via SFTP...');
  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, s) => {
      if (err) return reject(err);
      resolve(s);
    });
  });

  await new Promise((resolve, reject) => {
    sftp.fastGet('/tmp/urumsima_prod_updated.sql', 'scratch/urumsima_prod_updated.sql', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  console.log('Updated dump downloaded to scratch/urumsima_prod_updated.sql successfully!');
  conn.end();
}

main().catch(console.error);
