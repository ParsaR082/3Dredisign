async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/preview-proxy?url=https://altinpasha.ir/');
    console.log('Proxy Status:', res.status);
    console.log('CSP:', res.headers.get('content-security-policy'));
    const html = await res.text();
    console.log('HTML Length:', html.length);
    console.log('Has base tag:', html.includes('<base href="https://altinpasha.ir/">'));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
