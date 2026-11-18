# Listen — PDF / Word / text to audio reader

A personal web app: pick a PDF, Word doc, text file, or paste text in,
and it's read aloud with the current line highlighted. It remembers
where you stopped in each document.

Two sets of voices:
- **On this phone** — your iPhone's built‑in voices. Free, works
  offline, no setup.
- **Studio voices** — Adam (ElevenLabs), Onyx (OpenAI), or a voice you
  clone yourself. Much more natural, but needs a one‑time setup below
  and a small per‑character cost from whichever service you use.

## Files
- `index.html` — the app itself
- `manifest.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — home‑screen install
- `netlify/functions/tts.js` — a small server‑side function that talks to ElevenLabs/OpenAI so your API key never sits in the browser
- `netlify.toml` — tells Netlify where that function lives

## 1. Put it on GitHub
Create a new repository and upload **all** of these files and folders
(including the `netlify` folder with `tts.js` inside it) through
GitHub's "Upload files" button on the repo page — keep the folder
structure exactly as it is, don't flatten it.

## 2. Deploy on Netlify
1. Netlify → **Add new site → Import an existing project** → pick your GitHub repo
2. Leave build settings as Netlify auto‑detects them (the `netlify.toml` already says "no build, publish directory is `/`, functions live in `netlify/functions`")
3. Click **Deploy site**

At this point the app works with the on‑device voices already — the
cloud voices will show a message until you do the next step.

## 3. Turn on the studio voices (optional, but this is what you asked for)

### Adam (ElevenLabs)
1. Sign up at **elevenlabs.io** (there's a free tier with limited characters per month)
2. Go to your **Profile → API Keys** and copy your key
3. In Netlify: open your site → **Site configuration → Environment variables → Add a variable**
   - Key: `ELEVENLABS_API_KEY`
   - Value: *(paste the key)*
4. Netlify → **Deploys → Trigger deploy → Deploy site** (env vars only take effect after a redeploy)
5. Adam will now work. If it ever errors, open ElevenLabs' **Voice Library**, find "Adam", copy his current Voice ID, and tell me — the function has a default ID baked in but ElevenLabs could change it.

### Onyx (OpenAI)
1. Sign up at **platform.openai.com** and add a payment method (TTS is billed per character — a typical document costs a few cents)
2. **API keys** in the left sidebar → **Create new secret key** → copy it
3. In Netlify, add another environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: *(paste the key)*
4. Trigger a redeploy (same as step 4 above)

### Your own cloned voice (ElevenLabs)
1. In ElevenLabs, go to **Voice Lab → Add Voice → Instant Voice Clone**
2. Upload 1–2 minutes of clean audio of the voice you want to clone (your own voice, with your own permission — don't clone anyone else's voice without their consent)
3. Once it's created, open it in the **Voice Library** and copy its **Voice ID**
4. In the app, tap **"+ add my voice"** at the end of the Studio Voices row, and paste that ID in
   - No redeploy needed for this part — it's stored right in the app on your phone

## Everyday use
- Tap any pill in either voice row to hear a short sample and make it the active voice
- The **−** / **+** control changes playback speed from 0.6× to 2× and applies live to whichever voice is currently talking
- Device voices restart the current sentence when you change speed; studio voices change speed instantly without interruption
- Studio voices read in bigger chunks (a few sentences at a time) rather than one sentence at a time, to keep the number of paid API calls down — the highlighted text will jump in slightly bigger steps than with device voices

## Known limitations
- **iOS Safari limitation (device voices only):** if the screen locks or you switch apps, the on‑device voice usually pauses — there's no public API for a web page to keep it going in the background. Cloud voices use a real `<audio>` element, which behaves a bit better but still isn't guaranteed to survive a locked screen on an installed home‑screen app.
- **Studio voices cost money per character**, billed directly by ElevenLabs/OpenAI to whatever payment method you put on your own account — this app doesn't mark anything up, your key is only ever used by your own function.
- Scanned PDFs (photos of pages, no real text layer) have nothing to extract — you'll get a message saying so.
- The ElevenLabs "Adam" voice ID is hard‑coded as a sensible default; if ElevenLabs ever retires or renames it, grab the current ID from their Voice Library and I can update the function.

## Ideas if you want to extend it later
- A visible running cost counter (ElevenLabs/OpenAI both report character counts you could log)
- Support for `.epub` files
- Pre‑generating and caching a whole chapter's audio ahead of time so a flaky connection doesn't interrupt playback
