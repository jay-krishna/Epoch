# Epoch — Development Notes

Developer-facing documentation. For end-user instructions see the root `README.md`.

## Overview

Epoch is a single-page timer app wrapped as an installable PWA. Almost all of the application — markup, styles, and logic — lives in one file, `index.html`. The remaining files exist only to make it installable, offline-capable, and hostable on GitHub Pages.

There is no build step, no bundler, and no framework. Edit `index.html` directly and reload.

## File structure

```
epoch/
├── index.html              # the entire app (HTML + CSS + JS inline)
├── manifest.webmanifest    # PWA manifest (name, icons, colors, display)
├── service-worker.js       # offline cache + install support
├── .nojekyll               # tells GitHub Pages to skip Jekyll processing
├── README.md               # end-user documentation
├── images/                 # icons and favicons
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png        (180×180, opaque)
│   ├── icon-192.png / icon-512.png (purpose: any, rounded, transparent corners)
│   └── icon-192-maskable.png / icon-512-maskable.png (purpose: maskable, full-bleed)
└── docs/
    └── development.md       # this file
```

## Running locally

Serve over HTTP — **do not** open `index.html` via `file://`. Two features fail on `file://`:

- **Service workers** require a secure origin (`https:` or `http://localhost`).
- **Speech recognition** aborts immediately without a real web origin.

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000/
```

Any static server works (`npx serve`, VS Code Live Server, etc.). `localhost` counts as a secure context, so the PWA installs and voice works there.

## The app (`index.html`)

Structure inside the single file:

- **`<head>`** — meta/PWA tags, Google Fonts (Hanken Grotesk for UI, Sora for the digits, Quicksand for the wordmark), an inline pre-paint script that sets the theme before first paint (avoids a flash), and the inline `<style>`.
- **`<body>`** — header (brand + theme/mic/keep-awake/log buttons), the timer face (SVG progress ring + editable hh/mm/ss inputs), footer controls, and a collapsible voice-log console.
- **`<script>`** — one IIFE holding the timer engine, audio (Web Audio API), voice control (Web Speech API), wake lock, theme persistence, and the debug console. A second small script registers the service worker.

Key implementation points:

- **Timer engine** uses `requestAnimationFrame` against an absolute end time, so it doesn't drift. Ticks for the final five seconds and the completion chime are synthesized with the Web Audio API (no audio files).
- **Theme** is stored in `localStorage` under `epoch-theme`; default is the system `prefers-color-scheme`. All colors are CSS custom properties under `:root` and `[data-theme="dark"]`.
- **Voice control** (`SpeechRecognition` / `webkitSpeechRecognition`) runs `continuous`, auto-restarts on `onend` to stay alive hands-free, and gates commands behind a wake-word regex (`const WAKE`). Command parsing lives in `parseDuration` / `handleCommand`; number words are normalized to digits in `wordsToDigits`.
- **Keep awake** uses the Screen Wake Lock API, acquired while a timer runs and re-acquired on `visibilitychange` when returning to the tab. The timer auto-pauses when the tab is hidden.
- **Debug console** ("Voice log") logs recognition lifecycle, live transcripts, parsed commands, and environment diagnostics. Hidden by default; toggled by the lines button.

## PWA specifics

### Manifest

`manifest.webmanifest` uses **relative** `start_url`/`scope` (`"./"`) and relative icon paths so the app works from a GitHub Pages project subpath (`https://<user>.github.io/<repo>/`). `background_color`/`theme_color` drive the splash and title-bar; the app's own light/dark theming is separate and handled by the `<meta name="theme-color">` media queries plus CSS.

### Service worker

`service-worker.js` is registered with a relative path so its scope is the app directory (subpath-safe). Strategy:

- **Navigations:** network-first, falling back to the cached shell offline.
- **Same-origin assets + Google Fonts:** cache-first, populating the cache on first fetch (so fonts work offline after the first load).

**Releasing updates:** bump the `CACHE` constant (e.g. `epoch-v1` → `epoch-v2`). The new worker installs, the `activate` handler deletes old caches, and clients update on next load. Without a version bump, cached assets may persist.

### Icons

Icons live in `images/`. Both `any` (rounded, transparent corners) and `maskable` (full-bleed, glyph kept inside the ~80% safe zone) variants are provided, plus an opaque `apple-touch-icon.png` (iOS applies its own mask) and an SVG + 32px favicon. They were generated programmatically from the app's clock glyph; regenerate at higher resolution or restyle as needed and keep the same filenames referenced by the manifest and `<head>`.

### `.nojekyll`

GitHub Pages runs Jekyll by default. `.nojekyll` disables it, guaranteeing every file (including anything that might start with `_`) is served verbatim and slightly speeding up publishing. Harmless to keep for a plain static site.

## Deploying to GitHub Pages

1. Push the contents of this folder to a repository (files at the repo root, or in `/docs` — adjust Pages settings accordingly).
2. In **Settings → Pages**, set the source branch and folder.
3. GitHub Pages serves over HTTPS, which satisfies the secure-context requirement for the service worker, install prompts, and speech recognition.
4. Because all paths are relative, it works whether the site is at a user/org root or a project subpath — no base-path edits required.

## Browser support

- **Install (PWA):** Chrome/Edge (Windows, macOS, Android), Safari (iOS/iPadOS via Add to Home Screen).
- **Voice control:** Chromium-based browsers with Google's speech backend — Chrome desktop and Chrome on Android. It relies on a cloud speech service, so it needs network access and won't work in Chromium builds that ship without the backend (e.g. Brave, ungoogled-chromium) or where the endpoint is blocked. There is no offline/on-device fallback.
- **Screen Wake Lock:** Chrome/Edge and recent Safari; degrades gracefully with a toast where unsupported.
- **Timer, audio, theming, offline:** all evergreen browsers.

## Customization pointers

- **Colors:** the CSS custom properties in `:root` / `[data-theme="dark"]`.
- **Fonts:** the Google Fonts `<link>` plus the relevant `font-family` declarations.
- **Wake words:** the `WAKE` regex.
- **Splash/brand colors:** `background_color` / `theme_color` in the manifest and the `theme-color` meta tags.

## Known limitations

- Voice recognition quality and availability depend entirely on the browser's speech service.
- The legacy iOS status-bar style is a single value and can't adapt per theme.
- Timer state is not persisted across reloads (only the theme choice is).
