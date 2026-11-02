import { Client } from 'ssh2';

const conn = new Client();

const SSH_CONFIG = {
  host: '185.142.157.42',
  port: 22,
  username: 'root',
  password: process.env.SSH_PASSWORD || '',
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

async function main() {
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });

  const cmd = `sudo -u postgres psql -d urumsima_db -c "\\d websites_website"`;
  const res = await runCommand(conn, cmd);
  console.log(res.stdout || res.stderr);

  conn.end();
}

main().catch(console.error);
