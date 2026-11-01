async function check() {
  try {
    const r1 = await fetch('https://neo-cafe.vercel.app/');
    const h1 = await r1.text();
    console.log('--- Neo Cafe ---');
    console.log('Status:', r1.status);
    console.log('Title:', h1.match(/<title>([^<]+)<\/title>/)?.[1]);
    
    const r2 = await fetch('https://digital-dashboard-beta.vercel.app/');
    const h2 = await r2.text();
    console.log('--- Digital Dashboard ---');
    console.log('Status:', r2.status);
    console.log('Title:', h2.match(/<title>([^<]+)<\/title>/)?.[1]);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
check();
