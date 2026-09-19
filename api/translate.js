const MAX_TEXT_LENGTH = 5000;
const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res.status(204).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST /api/translate' });

  const { text, source = 'auto', target } = req.body || {};
  if (!target || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text and target are required' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(413).json({ error: `Text is limited to ${MAX_TEXT_LENGTH} characters per request` });
  }

  const langpair = `${source && source !== 'auto' ? source : 'en'}|${target}`;
  const url = new URL(MYMEMORY_ENDPOINT);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', langpair);
  url.searchParams.set('mt', '1');

  try {
    const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await upstream.json();
    const translation = data.responseData?.translatedText;
    if (!upstream.ok || !translation || data.responseStatus !== 200) {
      return res.status(502).json({ error: data.responseDetails || 'Translation provider error' });
    }
    return res.status(200).json({ translation, source, target, provider: 'MyMemory' });
  } catch {
    return res.status(503).json({ error: 'Translation service is temporarily unavailable' });
  }
}
