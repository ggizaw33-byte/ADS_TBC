# LingoBridge Translation Bot

A Vercel-ready translation website and JSON API for Amharic, Afaan Oromoo, English, and 100+ languages.

## Deploy on Vercel

1. Create a Google Cloud project and enable **Cloud Translation API**.
2. Create an API key, restrict it to the Cloud Translation API, and add it to Vercel as `GOOGLE_TRANSLATE_API_KEY`.
3. Import this repository into Vercel and deploy.
4. Set the environment variable for Production (and Preview if needed), then redeploy.

The site is available at `/` and the API is available at `POST /api/translate`.

## API example

```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/translate \
  -H 'Content-Type: application/json' \
  -d '{"text":"ሰላም ዓለም","source":"am","target":"om"}'
```

Response:

```json
{"translation":"...","detectedLanguage":"am","source":"am","target":"om"}
```

`source` may be `auto` for automatic detection. Requests accept up to 5,000 characters. Keep the API key only in Vercel environment variables; never put it in browser code.

## Capacity note

Vercel Functions can scale horizontally, but “20,000 requests/day” is not an unconditional guarantee: the actual limit depends on your Vercel plan, Google Cloud Translation quota, text volume, and billing. Set a daily quota/budget alert in Google Cloud and use a paid production plan for predictable capacity.

## Included language choices

Amharic, Afaan Oromoo, English, Arabic, French, Spanish, German, Italian, Portuguese, Russian, Chinese (Simplified/Traditional), Japanese, Korean, Hindi, Bengali, Urdu, Swahili, Somali, Hausa, Yoruba, Igbo, Afrikaans, Albanian, Armenian, Azerbaijani, Basque, Belarusian, Bosnian, Bulgarian, Catalan, Cebuano, Chichewa, Corsican, Croatian, Czech, Danish, Dutch, Esperanto, Estonian, Finnish, Frisian, Galician, Georgian, Greek, Gujarati, Haitian Creole, Hawaiian, Hebrew, Hmong, Hungarian, Icelandic, Indonesian, Irish, Javanese, Kannada, Kazakh, Khmer, Kurdish, Kyrgyz, Lao, Latin, Latvian, Lithuanian, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Maori, Marathi, Mongolian, Myanmar, Nepali, Norwegian, Pashto, Persian, Polish, Romanian, Samoan, Scots Gaelic, Serbian, Sesotho, Sinhala, Slovak, Slovenian, Sundanese, Swedish, Filipino, Tajik, Tamil, Telugu, Thai, Turkmen, Ukrainian, Uzbek, Vietnamese, Welsh, Xhosa, Yiddish, and Zulu.
