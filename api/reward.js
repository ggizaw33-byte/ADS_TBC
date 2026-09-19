// Legacy reward endpoint intentionally disabled after migration to LingoBridge.
export default function handler(_req, res) { return res.status(410).json({ error: 'This endpoint was removed. Use /api/translate.' }); }
