import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();

const SSH_CONFIG = {
  host: '185.142.157.42',
  port: 22,
  username: 'root',
  password: process.env.SSH_PASSWORD || '',
  readyTimeout: 20000,
};

function runCommand(client, cmd) {
  return new Promise((resolve, reject) => {
    client.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code, signal) => {
        resolve({ code, stdout, stderr });
      });
      stream.on('data', (data) => {
        stdout += data.toString();
      });
      stream.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    });
  });
}

async function main() {
  console.log('Connecting to', SSH_CONFIG.host, 'as', SSH_CONFIG.username, '...');
  
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });

  console.log('Connected successfully via SSH!');

  // 1. Inspect running services & web directories
  const commands = [
    'uptime',
    'uname -a',
    'ls -la /var/www /var/www/urumsima 2>/dev/null || true',
    'find /var/www /home /root -name "*.sqlite3" 2>/dev/null || true',
    'systemctl list-units --type=service --state=running | grep -E "gunicorn|urumsima|nginx|postgres|mysql|node|pm2" || true',
    'cat /etc/nginx/sites-enabled/* 2>/dev/null | grep -E "server_name|proxy_pass|root|alias|listen" || true',
    'ps aux | grep -E "gunicorn|python|node|postgres" | grep -v grep || true',
  ];

  for (const cmd of commands) {
    console.log(`\n--- [RUN]: ${cmd} ---`);
    const res = await runCommand(conn, cmd);
    console.log(res.stdout || res.stderr || '(no output)');
  }

  // 2. Also ensure ~/.ssh/authorized_keys has the user's public key if available
  const pubKeyPath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.ssh', 'id_ed25519.pub');
  if (fs.existsSync(pubKeyPath)) {
    const pubKey = fs.readFileSync(pubKeyPath, 'utf8').trim();
    console.log('\n--- Adding local SSH key to /root/.ssh/authorized_keys ---');
    await runCommand(conn, `mkdir -p /root/.ssh && chmod 700 /root/.ssh && grep -q "${pubKey.slice(0, 40)}" /root/.ssh/authorized_keys 2>/dev/null || echo "${pubKey}" >> /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys`);
    console.log('Local SSH public key installed successfully!');
  }

  conn.end();
}

main().catch(err => {
  console.error('SSH Error:', err);
  process.exit(1);
});
