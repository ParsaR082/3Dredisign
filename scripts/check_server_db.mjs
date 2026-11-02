import { Client } from 'ssh2';

const client = new Client();

client.on('ready', () => {
  const pyCode = `
import sys; sys.path.insert(0, '/var/www/urumsima')
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.conf import settings
print('ACTIVE DB ENGINE:', settings.DATABASES['default']['ENGINE'])
print('ACTIVE DB NAME:', settings.DATABASES['default']['NAME'])
`;

  client.exec(`/var/www/urumsima/venv/bin/python3 -c "${pyCode.replace(/\n/g, ' ')}"`, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      client.end();
    });
  });
}).connect({
  host: '185.142.157.42',
  port: 22,
  username: 'root',
  password: process.env.SSH_PASSWORD || ''
});
