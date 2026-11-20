# Listen — PDF / Word / text to audio reader

A personal web app: pick a PDF, Word doc, text file, or paste text in,
and it's read aloud with the current line highlighted. It remembers
where you stopped in each document.

Three sets of voices:
- **On this phone** — your iPhone's built‑in voices. Free, offline, no setup.
- **☁ ElevenLabs** (Adam, or a voice you clone yourself) — called straight
  from your phone. You paste your own API key into the app once; it's
  stored only on your phone, never anywhere else.
- **🔷 Azure** (Guy, Davis, Jenny, Aria) — Microsoft's neural voices
  (the same ones behind Edge's "Read Aloud"), gotten the legitimate
  way through your own free Azure account. Azure doesn't allow a
  webpage to call it directly, so these go through a tiny helper
  function that lives on Netlify — your Azure key stays there and
  never touches your phone.

## Files
- `index.html` — the app itself
- `manifest.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — home‑screen install
- `netlify/functions/tts.js` — the small server‑side piece, used only for Azure voices
- `netlify.toml` — tells Netlify where that function lives

## 1. Put it on GitHub
Upload all of the files above through GitHub's "Upload files" button,
**including the `netlify` folder with `tts.js` inside it** — keep that
folder structure exactly as it is.

## 2. Deploy on Netlify
1. Netlify → **Add new site → Import an existing project** → pick your GitHub repo
2. Netlify will read `netlify.toml` automatically (no build command, publish directory `/`, function in `netlify/functions`)
3. Click **Deploy site**

At this point: device voices and the ElevenLabs voices already work.
Azure voices will show an error until the next step.

## 3a. Turn on Adam / your cloned voice (ElevenLabs — no Netlify setup needed)
1. Sign up free at **elevenlabs.io**
2. Profile icon (or "Developers" in the sidebar) → **API Keys** → **Create Key** → make sure "Text to Speech" is on
3. Copy the key immediately — it's shown once
4. In the app, tap the **Adam** pill (or **🔑 set API key**) and paste it in when asked

To clone your own voice: ElevenLabs → **Voice Lab → Add Voice →
Instant Voice Clone** → upload 1–2 minutes of clean audio of a voice
you have the right to clone → open it in the **Voice Library** → copy
its **Voice ID** → in the app, tap **"+ add my voice"** and paste
that ID in.

## 3b. Turn on Guy / Davis / Jenny / Aria (Azure — needs the Netlify step)
1. Go to **portal.azure.com**, sign up (there's a genuinely generous
   free tier — roughly 500,000 characters a month on Speech)
2. Create a resource: search for **"Speech"**, choose the **Speech
   service**, pick the **Free F0** pricing tier, and create it —
   note which **region** you picked (e.g. `eastus`), you'll need it
3. Once it's created: **Keys and Endpoint** in the left menu → copy **Key 1**
4. In Netlify: **Site configuration → Environment variables → Add a variable**, twice:
   - `AZURE_SPEECH_KEY` = the key you copied
   - `AZURE_SPEECH_REGION` = the region, lowercase, no spaces (e.g. `eastus`)
5. **Deploys → Trigger deploy → Deploy site** (new env vars only take effect after a redeploy)
6. Tap the **Guy**, **Davis**, **Jenny**, or **Aria** pill — they should talk

## Everyday use
- Tap any pill to hear a short sample and make it the active voice
- ☁ = ElevenLabs (asks for a key the first time, right in the app). 🔷 = Azure (key lives in Netlify, nothing to enter on your phone)
- The **−** / **+** control changes speed from 0.6× to 2×, live, without interrupting either cloud engine
- Cloud voices read a few sentences at a time rather than one at a time, to keep the number of paid calls down — highlighting jumps in slightly bigger steps than with device voices

## Worth knowing
- **ElevenLabs key**: lives in your phone's browser storage. Fine for a private app only you use — just don't share the Netlify link, and don't make the GitHub repo public if you'd rather no one see the key-entry flow (the key itself is never *in* the code, only typed in by you and kept on your device).
- **Azure key**: stays on Netlify's servers, never sent to your phone at all — the safer pattern of the two.
- **Cost**: ElevenLabs bills per character on your account; Azure's free tier is large enough that casual personal reading is unlikely to cost anything, but check both services' pricing pages if you're a heavy user.
- Onyx (OpenAI) still isn't included — OpenAI blocks direct browser calls the same way Azure does, and it wasn't asked for again, but it could be added to the same Netlify function later if you want it.
- iOS Safari usually pauses any voice — device, ElevenLabs, or Azure — if the screen locks or you switch apps. That's a platform limitation, not fixable from this app.
- Scanned PDFs (photos of pages, no real text layer) have nothing to extract — you'll get a message saying so.
