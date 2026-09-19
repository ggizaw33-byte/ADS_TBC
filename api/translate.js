const MAX_TEXT_LENGTH = 5000;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST /api/translate' });
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { text, source = 'auto', target } = req.body || {};
  if (!target || typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'text and target are required' });
  if (text.length > MAX_TEXT_LENGTH) return res.status(413).json({ error: `Text is limited to ${MAX_TEXT_LENGTH} characters per request` });
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) return res.status(503).json({ error: 'Translation service is not configured. Add GOOGLE_TRANSLATE_API_KEY in Vercel environment variables.' });

  const query = new URL('https://translation.googleapis.com/language/translate/v2');
  query.searchParams.set('key', process.env.GOOGLE_TRANSLATE_API_KEY);
  const body = { q: text, target, format: 'text' };
  if (source && source !== 'auto') body.source = source;
  try {
    const upstream = await fetch(query, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || 'Translation provider error' });
    const translation = data.data?.translations?.[0]?.translatedText;
    if (!translation) return res.status(502).json({ error: 'The translation provider returned no translation' });
    return res.status(200).json({ translation, detectedLanguage: data.data.translations[0].detectedSourceLanguage || source, source, target });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to reach translation provider' });
  }
}
