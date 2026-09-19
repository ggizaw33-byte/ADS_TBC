# LingoBridge Translation Bot

ይህ የVercel-ready የትርጉም ድር ጣቢያ ነው። የGoogle API key አያስፈልገውም፤ `/api/translate` የMyMemory Translation APIን ይጠቀማል።

## Vercel deployment

1. Repositoryውን ወደ Vercel አስገባ።
2. ምንም environment variable መጨመር አያስፈልግም።
3. Deploy አድርግ።

Website: `/`
API: `POST /api/translate`

## API ምሳሌ

```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/translate \
  -H 'Content-Type: application/json' \
  -d '{"text":"ሰላም ዓለም","source":"am","target":"om"}'
```

Response:

```json
{"translation":"...","source":"am","target":"om","provider":"MyMemory"}
```

`source` እንደ `auto` መላክ ይቻላል። የMyMemory ነፃ አገልግሎት የራሱ የquota/rate limit አለው፤ ስለዚህ 20,000 requests/day በነፃ የሚረጋገጥ አይደለም። ብዙ ተጠቃሚ ካሉ የራስህን LibreTranslate ወይም Argos Translate server በVPS ላይ ማስቀመጥ ይመከራል።

የሚደገፉ ቋንቋዎች በwebsite ውስጥ ያሉት 100+ ናቸው፣ ከእነሱም Amharic (`am`), Afaan Oromoo (`om`), English (`en`), Arabic (`ar`), French (`fr`), Spanish (`es`) እና ሌሎችም ይገኙበታል።
