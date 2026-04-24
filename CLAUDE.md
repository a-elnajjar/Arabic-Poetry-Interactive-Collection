# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static-site collection of interactive Arabic poetry presentations. Each poem is a self-contained folder with three files (HTML, CSS, JS) and is deployed via GitHub Pages at `https://a-elnajjar.github.io/Arabic-Poetry-Interactive-Collection/`.

No build step, no package manager, no framework. Open any `index.html` directly in a browser, or use the VS Code Live Server extension (`.vscode/launch.json` is present).

## Poems

| Folder | Poem | Poet |
|---|---|---|
| `maritime-poem/` | القصيدة البحرية (Maritime Poem) | Nizar Qabbani |
| `ThinkofOthers/` | فكِّر بغيرك (Think of Others) | Mahmoud Darwish |

## Architecture

### Bilingual content pattern
Each poem supports Arabic (RTL) and English (LTR). The `<html>` element starts as `lang="ar" dir="rtl"`. Content is duplicated in the HTML with CSS classes:

- `.ar-content` — shown when `body.lang-ar` (or `body` without `.en-mode`)
- `.en-content` — shown when `body.lang-en` (or `body.en-mode`)

The language toggle button switches body class and flips `document.documentElement.dir`. The two poems use slightly different class naming conventions (`lang-ar`/`lang-en` vs `en-mode`) — keep each poem internally consistent when editing.

### JavaScript structure
All JS is wrapped in an IIFE `(() => { ... })()` and lives in `script.js` (linked via `<script src="script.js">`), except `ThinkofOthers` where the script is inlined in `index.html` instead.

Each script independently implements:
- **Custom cursor** — smooth-follow compass SVG cursor with `requestAnimationFrame`
- **Constellation canvas** — `<canvas id="constellation">` fixed behind content; `maritime-poem` draws stars that trail the mouse and fade; `ThinkofOthers` draws a static twinkling starfield with connected lines
- **Stanza reveal** — `IntersectionObserver` on `[data-stanza]` elements adds `.visible` class on scroll into view
- **Language toggle** — `#langToggle` button pair; `maritime-poem` adds a fade transition via `body.switching`

`maritime-poem` also has:
- **Ambient sea sound** — synthesized via Web Audio API (white noise → lowpass filter → LFO-modulated cutoff), no audio files required
- **Click ripple** — DOM-injected `.ripple` divs, removed after animation
- **Falling light rain** — 60 `<span>` elements injected into `#rain` with randomised CSS animation properties

### CSS conventions
- Dark atmospheric backgrounds; `maritime-poem` uses deep ocean blues/teals (`#5fb8b8`, `#c9a861`); `ThinkofOthers` uses aurora/night-sky palette with aurora CSS bands (`.aurora-band`)
- Google Fonts: `maritime-poem` uses Amiri + Cormorant Garamond; `ThinkofOthers` uses Reem Kufi + Cormorant Garamond
- The custom cursor `#cursor` is `position: fixed`, `pointer-events: none`, `z-index: 9999`

## Adding a new poem

1. Create a new folder (e.g. `new-poem/`) with `index.html`, `style.css`, `script.js`
2. Follow the bilingual `.ar-content`/`.en-content` pattern from an existing poem
3. Wrap all JS in an IIFE
4. Add `[data-stanza]` attributes to stanza elements for scroll-reveal
5. Update `README.md` with the poem entry and live link
