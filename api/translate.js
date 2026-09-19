const MAX_TEXT_LENGTH = 5000;
const TIMEOUT_MS = 12000;
const withTimeout = () => { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), TIMEOUT_MS); return { signal: controller.signal, clear: () => clearTimeout(timer) }; };
async function translate(text, source, target) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of [['client','gtx'],['sl',source === 'auto' ? 'auto' : source],['tl',target],['dt','t'],['q',text]]) url.searchParams.set(key, value);
  const request = withTimeout();
  try {
    const response = await fetch(url, { signal: request.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('provider unavailable');
    const data = await response.json();
    const translation = Array.isArray(data?.[0]) ? data[0].filter((part) => part?.[0]).map((part) => part[0]).join('') : '';
    if (!translation) throw new Error('empty translation');
    return { translation, detectedLanguage: data?.[2] || source, provider: 'Google web engine' };
  } finally { request.clear(); }
}
async function fallback(text, source, target) {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text); url.searchParams.set('langpair', `${source === 'auto' ? 'en' : source}|${target}`); url.searchParams.set('mt', '1');
  const request = withTimeout();
  try { const response = await fetch(url, { signal: request.signal, headers: { Accept: 'application/json' } }); const data = await response.json(); if (!response.ok || data?.responseStatus !== 200 || !data?.responseData?.translatedText) throw new Error('fallback unavailable'); return { translation: data.responseData.translatedText, detectedLanguage: source, provider: 'MyMemory fallback' }; } finally { request.clear(); }
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST /api/translate' });
  const { text, source = 'auto', target } = req.body || {};
  if (!target || typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'text and target are required' });
  if (text.length > MAX_TEXT_LENGTH) return res.status(413).json({ error: `Text is limited to ${MAX_TEXT_LENGTH} characters` });
  if (source === target) return res.status(200).json({ translation: text, source, target, provider: 'same language' });
  try { const result = await translate(text, source, target).catch(() => fallback(text, source, target)); return res.status(200).json({ ...result, source, target }); } catch { return res.status(503).json({ error: 'Translation service is temporarily unavailable. Please try again.' }); }
}
