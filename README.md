# Listen — PDF to audio reader

A small personal web app: pick a PDF, it reads the text aloud with the
current sentence highlighted, and it remembers where you stopped in
each file. No build step, no server — it's a handful of static files.

## Files
- `index.html` — the whole app (PDF parsing + text‑to‑speech)
- `manifest.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — so it can be added to your home screen like an app

## Put it on GitHub
```bash
cd pdf2audio
git init
git add .
git commit -m "Listen: PDF to audio reader"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Deploy on Netlify
1. Netlify → **Add new site → Import an existing project**
2. Pick the GitHub repo you just pushed
3. Leave the build command empty and set the publish directory to `/`
   (there's nothing to build — it's already static)
4. Deploy. Netlify gives you a `https://your-app.netlify.app` URL.

(You can also skip GitHub entirely and drag the `pdf2audio` folder
straight onto Netlify's "Deploy manually" box — either works.)

## Install it on your iPhone
1. Open the Netlify URL in **Safari** (it has to be Safari, not Chrome, for the install prompt to work)
2. Tap the Share icon → **Add to Home Screen**
3. It now opens full‑screen, with its own icon, no browser bar

## How it works
- **pdf.js** extracts text from PDFs, **mammoth.js** extracts text
  from Word (`.docx`) files, and plain `.txt` files are read
  directly — all in your browser, nothing is uploaded anywhere.
  You can also just paste text straight in instead of using a file.
- The text is split into sentence‑sized chunks and read with the
  **Web Speech API** (`speechSynthesis`), using whichever voice you
  tap in the voice row.
- Your spot in each document is saved in the browser's local storage
  (keyed by file name + size, or by the pasted text itself), so
  reopening the same thing offers to resume.

## About the 6 voices
There's no way for a web page to ship its own text‑to‑speech voices —
it has to use whatever voices are already installed on your iPhone.
The app looks at everything installed, picks up to 3 recognisably
female and 3 recognisably male voices, and shows them as tappable
pills; tap one to hear a short sample in that voice.

Most iPhones only ship with one or two English voices out of the
box, so you'll likely see a note under the voice row the first time
saying how many are currently available. To get the full 3‑and‑3
spread:
1. **Settings → Accessibility → Spoken Content → Voices → English**
2. Tap into any of the listed voices (Ava, Samantha, Tom, Daniel,
   Arthur, Nicky, Aaron, Karen, Moira, etc. are good varied ones) and
   download it — each is free, just a one‑time download (roughly
   50–200MB per voice, so Wi‑Fi is worth it)
3. Reopen the app — the new voices show up automatically

There's no built‑in way to control a *specific* age — Apple doesn't
expose that — but the voices do vary noticeably in pitch and pacing,
which is what gives the "mixed ages" feel.

## Known iOS limitations (Apple's, not fixable from here)
- Speech needs a user tap to start — that's why there's a visible
  Play button rather than autoplay.
- If the screen locks or you switch apps, iOS Safari will usually
  pause the speech — there's no public API for this page to keep it
  going in the background the way Music or Podcasts can. Keep the
  screen on while listening.
- Scanned PDFs (photos of pages, with no real text layer) won't have
  anything to read — the app will tell you if it can't find text.

## Ideas if you want to extend it later
- A "skip to next page" button in addition to next/previous sentence
- Swapping `speechSynthesis` for a cloud TTS API (e.g. via a Netlify
  function) for consistent, higher‑quality voices on any device and
  background playback that survives the screen locking
- Support for `.epub` files
