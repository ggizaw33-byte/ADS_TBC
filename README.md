<!doctype html>
<html lang="am">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0f1d37" />
  <title>LingoBridge</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #0d1d35;
      --panel: #12294a;
      --panel-2: #18365d;
      --card: rgba(18, 41, 74, 0.96);
      --line: #2d4f78;
      --text: #edf6ff;
      --muted: #a6bed7;
      --blue: #67a8ff;
      --blue-strong: #2b74ff;
      --blue-soft: #9cc4ff;
      --button: linear-gradient(135deg, #7db8ff, #3d8dff);
      --shadow: rgba(31, 78, 148, 0.35);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--bg);
      color: var(--text);
    }

    body {
      font-family: "Noto Sans Ethiopic", "Plus Jakarta Sans", system-ui, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(78, 134, 255, 0.2), transparent 30%),
        linear-gradient(180deg, #0a162a 0%, #0d1d35 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button, select, textarea {
      font: inherit;
    }

    .app {
      width: min(100%, 600px);
      height: 100dvh;
      padding: max(10px, env(safe-area-inset-top)) 14px max(10px, env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
      background: transparent;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 2px 10px;
      flex: none;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font: 800 15px "Plus Jakarta Sans", sans-serif;
      letter-spacing: 0.2px;
    }

    .logo {
      width: 34px;
      height: 34px;
      border-radius: 11px;
      display: grid;
      place-items: center;
      color: #eaf4ff;
      background: linear-gradient(135deg, #7db8ff, #2b74ff);
      box-shadow: 0 8px 24px rgba(64, 122, 255, 0.45);
      font-size: 18px;
    }

    .online {
      border: 1px solid rgba(127, 177, 255, 0.56);
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 10px;
      color: #dfeeff;
      background: rgba(24, 52, 96, 0.5);
      letter-spacing: 0.4px;
    }

    .online::before {
      content: "";
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #74ffb6;
      margin-right: 6px;
      vertical-align: middle;
      box-shadow: 0 0 10px rgba(116, 255, 182, 0.8);
    }

    .header-text {
      padding: 8px 2px 12px;
      flex: none;
    }

    .header-text small {
      color: var(--blue-soft);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .header-text h1 {
      margin: 9px 0 5px;
      font: 800 clamp(28px, 7vw, 42px)/1.12 "Plus Jakarta Sans", "Noto Sans Ethiopic", sans-serif;
      letter-spacing: -0.8px;
    }

    .header-text p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
      max-width: 500px;
    }

    .translator {
      background: rgba(18, 41, 74, 0.96);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 13px;
      box-shadow: 0 18px 50px var(--shadow);
      display: flex;
      flex-direction: column;
      min-height: 0;
      flex: 1;
    }

    .lang-row {
      display: grid;
      grid-template-columns: 1fr 40px 1fr;
      gap: 8px;
      align-items: end;
      flex: none;
    }

    .field label {
      display: block;
      color: var(--muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      margin: 0 4px 6px;
    }

    select {
      width: 100%;
      appearance: none;
      background: var(--panel-2);
      color: var(--text);
      border: 1px solid var(--line);
      border-radius: 13px;
      padding: 12px 30px 12px 12px;
      outline: none;
      font-size: 12px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7l5 6 5-6' stroke='%23dfeeff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
    }

    .swap {
      width: 40px;
      height: 40px;
      border: 1px solid rgba(125, 184, 255, 0.4);
      border-radius: 50%;
      background: rgba(26, 56, 92, 0.7);
      color: #dfeeff;
      font-size: 20px;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .swap:active { transform: scale(0.96); }

    .editor-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      flex: 1;
      min-height: 0;
      margin-top: 12px;
    }

    .editor {
      position: relative;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .editor-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      margin: 0 4px 6px;
      flex: none;
    }

    .count {
      color: #d4e3f9;
      font-weight: 500;
    }

    textarea {
      width: 100%;
      height: 100%;
      min-height: 120px;
      resize: none;
      background: rgba(11, 24, 40, 0.8);
      border: 1px solid var(--line);
      border-radius: 16px;
      color: var(--text);
      padding: 12px;
      outline: none;
      font-size: 14px;
      line-height: 1.5;
    }

    textarea:focus, select:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 2px rgba(103, 168, 255, 0.15);
    }

    textarea::placeholder {
      color: #7f97b4;
    }

    .copy {
      position: absolute;
      right: 8px;
      top: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(25, 49, 82, 0.9);
      color: var(--text);
      padding: 5px 9px;
      cursor: pointer;
      font-size: 10px;
    }

    .bottom-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      flex: none;
    }

    .status {
      flex: 1;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.4;
      min-height: 15px;
    }

    .translate {
      border: none;
      border-radius: 12px;
      padding: 12px 18px;
      font: 800 13px "Plus Jakarta Sans", sans-serif;
      color: #eff8ff;
      background: var(--button);
      box-shadow: 0 10px 22px rgba(59, 126, 255, 0.35);
      cursor: pointer;
    }

    .translate:disabled {
      opacity: 0.62;
      cursor: wait;
    }

    .footer-note {
      text-align: center;
      color: #90a8c5;
      font-size: 10px;
      margin-top: 10px;
      flex: none;
    }

    @media (max-width: 500px) {
      .editor-wrap {
        grid-template-columns: 1fr;
      }

      .header-text p {
        display: none;
      }

      .app {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
  </style>
</head>
<body>
  <main class="app">
    <header class="topbar">
      <div class="brand">
        <div class="logo">文</div>
        <span>LingoBridge</span>
      </div>
      <div class="online">ONLINE</div>
    </header>

    <section class="header-text">
      <small>TRANSLATION MINI APP</small>
      <h1>በማንኛውም ቋንቋ ይናገሩ።</h1>
      <p>አማርኛ፣ Afaan Oromoo እና 100+ ቋንቋዎች።</p>
    </section>

    <section class="translator" aria-label="Language translator">
      <div class="lang-row">
        <div class="field">
          <label>ከ</label>
          <select id="source"></select>
        </div>
        <button class="swap" id="swap" title="Swap languages">⇄</button>
        <div class="field">
          <label>ወደ</label>
          <select id="target"></select>
        </div>
      </div>

      <div class="editor-wrap">
        <div class="editor">
          <div class="editor-title">
            <span>ጽሑፍ</span>
            <span class="count" id="count">0/5000</span>
          </div>
          <textarea id="input" maxlength="5000" placeholder="እዚህ ይጻፉ…"></textarea>
        </div>

        <div class="editor">
          <div class="editor-title">
            <span>ትርጉም</span>
          </div>
          <textarea id="result" readonly placeholder="ትርጉሙ እዚህ ይታያል…"></textarea>
          <button class="copy" id="copy">Copy</button>
        </div>
      </div>

      <div class="bottom-row">
        <div class="status" id="status">ለመተርጎም ዝግጁ ነው</div>
        <button class="translate" id="translate">ተርጉም →</button>
      </div>
    </section>

    <div class="footer-note">LingoBridge • Telegram Mini App</div>
  </main>

  <script>
    const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) tg.setHeaderColor('#0d1d35');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#0d1d35');
    }

    const languages = [
      ['auto', 'ራስ-ሰር መለየት'],
      ['am', 'አማርኛ — Amharic'],
      ['om', 'Afaan Oromoo'],
      ['en', 'English'],
      ['ar', 'العربية'],
      ['fr', 'Français'],
      ['es', 'Español'],
      ['de', 'Deutsch'],
      ['it', 'Italiano'],
      ['pt', 'Português'],
      ['ru', 'Русский'],
      ['zh-CN', '中文'],
      ['ja', '日本語'],
      ['ko', '한국어'],
      ['hi', 'हिन्दी'],
      ['sw', 'Kiswahili'],
      ['so', 'Soomaali'],
      ['tr', 'Türkçe'],
      ['nl', 'Nederlands'],
      ['ro', 'Română'],
      ['uk', 'Українська'],
      ['vi', 'Tiếng Việt'],
      ['id', 'Bahasa Indonesia'],
      ['fa', 'فارسی'],
      ['ta', 'தமிழ்'],
      ['te', 'తెలుగు'],
      ['bn', 'বাংলা'],
      ['zu', 'isiZulu']
    ];

    const source = document.getElementById('source');
    const target = document.getElementById('target');
    const input = document.getElementById('input');
    const result = document.getElementById('result');
    const status = document.getElementById('status');
    const goBtn = document.getElementById('translate');
    const count = document.getElementById('count');

    languages.forEach(([value, label]) => {
      source.add(new Option(label, value));
      target.add(new Option(label, value));
    });

    source.value = 'auto';
    target.value = 'am';

    input.addEventListener('input', () => {
      count.textContent = `${input.value.length}/5000`;
    });

    document.getElementById('swap').addEventListener('click', () => {
      if (source.value === 'auto') return;
      const oldSource = source.value;
      source.value = target.value;
      target.value = oldSource;
      [input.value, result.value] = [result.value, input.value];
      count.textContent = `${input.value.length}/5000`;
    });

    document.getElementById('copy').addEventListener('click', async () => {
      if (!result.value) return;
      try {
        await navigator.clipboard.writeText(result.value);
        status.textContent = 'ተቀድቷል ✓';
        setTimeout(() => {
          status.textContent = 'ለመተርጎም ዝግጁ ነው';
        }, 1500);
      } catch {
        status.textContent = 'የቅጂ አልተሳካም';
      }
    });

    goBtn.addEventListener('click', async () => {
      const text = input.value.trim();

      if (!text) {
        status.textContent = 'እባክዎ ጽሑፍ ያስገቡ';
        return;
      }

      if (source.value === target.value) {
        result.value = text;
        status.textContent = 'ተመሳሳይ ቋንቋ ነው';
        return;
      }

      goBtn.disabled = true;
      status.textContent = 'እየተረጎመ ነው…';

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, source: source.value, target: target.value })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'ትርጉም አልተሳካም');
        }

        result.value = data.translation || '';
        status.textContent = 'በትክክል ተተርጉሟል ✓';
      } catch (error) {
        status.textContent = error.message || 'ትርጉም አልተሳካም';
      } finally {
        goBtn.disabled = false;
      }
    });
  </script>
</body>
</html>
