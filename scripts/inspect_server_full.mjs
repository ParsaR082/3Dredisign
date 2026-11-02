import { Client } from 'ssh2';

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
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });

  console.log('Connected to server!');

  const commands = [
    'node -v || true',
    'npm -v || true',
    'pm2 -v || true',
    'git --version || true',
    'free -m',
    'df -h /',
    'cat /etc/nginx/sites-enabled/* 2>/dev/null',
    'systemctl status urumsima-gunicorn.service --no-pager -n 5 || true',
    'sudo -u postgres psql -d urumsima_db -c "SELECT count(*) FROM websites_website;" || true'
  ];

  for (const cmd of commands) {
    console.log(`\n=================== [CMD: ${cmd}] ===================`);
    const res = await runCommand(conn, cmd);
    console.log(res.stdout || res.stderr || '(empty)');
  }

  conn.end();
}

main().catch(console.error);
