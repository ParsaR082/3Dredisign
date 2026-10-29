async function checkDetails() {
  const res = await fetch('https://altinpasha.ir/');
  const html = await res.text();
  const nextData = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (nextData) {
    const data = JSON.parse(nextData[1]);
    console.log('BuildId:', data.buildId);
    console.log('Props keys:', Object.keys(data.props || {}));
    console.log('pageProps:', JSON.stringify(data.props?.pageProps || {}).slice(0, 3000));
  } else {
    // Search for keywords
    console.log('Looking for text content in HTML...');
    const bodyText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                         .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                         .replace(/<[^>]+>/g, ' ')
                         .replace(/\s+/g, ' ');
    console.log(bodyText.slice(0, 2500));
  }
}

checkDetails();
