async function test() {
  const urls = [
    'http://localhost:3000/websites/',
    'http://localhost:3000/websites/neo-cafe/',
    'http://localhost:3000/websites/digital-dashboard/',
    'http://localhost:3000/media/websites/covers/neo-cafe.jpg',
    'http://localhost:3000/media/websites/covers/finmatrix-dashboard.jpg'
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u);
      const isImg = u.endsWith('.jpg');
      if (isImg) {
        console.log(`[${res.status}] ${u} -> content-type: ${res.headers.get('content-type')}, length: ${res.headers.get('content-length')}`);
      } else {
        const text = await res.text();
        const hasCafe = text.includes('neo-cafe') || text.includes('نئو');
        const hasFin = text.includes('digital-dashboard') || text.includes('فین‌ماتریکس');
        const hasLiveUrlCafe = text.includes('https://neo-cafe.vercel.app/');
        const hasLiveUrlFin = text.includes('https://digital-dashboard-beta.vercel.app/');
        console.log(`[${res.status}] ${u} -> cafe:${hasCafe}, fin:${hasFin}, liveCafeBtn:${hasLiveUrlCafe}, liveFinBtn:${hasLiveUrlFin}`);
      }
    } catch(err) {
      console.error('Failed for', u, err.message);
    }
  }
}

test();
