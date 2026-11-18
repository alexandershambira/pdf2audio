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
- **pdf.js** (loaded from a CDN) extracts the text from each page in
  your browser — nothing is uploaded anywhere.
- The text is split into sentence‑sized chunks and read with the
  **Web Speech API** (`speechSynthesis`), using whichever voice you
  pick from the ones iOS already has installed.
- Your spot in each PDF is saved in the browser's local storage
  (keyed by file name + size), so reopening the same file offers to
  resume.

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
  function) for more natural voices and background playback
