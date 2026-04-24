# Arabic Poetry — Interactive Collection

An interactive collection of Arabic poetry with bilingual (AR/EN) support, atmospheric visuals, and ambient effects.

---

## Poems

### 1. القصيدة البحرية — نزار قباني (Maritime Poem — Nizar Qabbani)

An immersive sea-themed presentation of Qabbani's maritime poem, featuring a deep ocean aesthetic, aurora rain effects, constellation trails, and synthesized wave sound.

**Files**
```
maritime-poem/
├── index.html   — markup & content
├── style.css    — all styles
└── script.js    — IIFE-wrapped JS (rain, cursor, constellation, sound, language toggle)
```

🌊 **[View live page](https://a-elnajjar.github.io/Arabic-Poetry-Interactive-Collection/maritime-poem/index.html)**

---

### 2. فكِّر بغيرك — محمود درويش (Think of Others — Mahmoud Darwish)

A night-sky aurora borealis presentation of Darwish's meditation on empathy, featuring animated aurora bands, twinkling constellation canvas, flying doves, and a bilingual language toggle.

**Files**
```
ThinkofOthers/
├── index.html   — markup & content
├── style.css    — all styles
└── script.js    — IIFE-wrapped JS (cursor, constellation, stanza reveal, language toggle)
```

🕊️ **[View live page](https://a-elnajjar.github.io/Arabic-Poetry-Interactive-Collection/ThinkofOthers/index.html)**

---

## Structure

```
maritime-poem/          — Nizar Qabbani poem
ThinkofOthers/          — Mahmoud Darwish poem
README.md
```

## Features

- Bilingual AR / EN toggle with smooth fade transition
- Custom animated compass cursor with trail effect
- Scroll-triggered stanza reveals (IntersectionObserver)
- Constellation canvas that reacts to mouse movement
- All CSS and JavaScript extracted into separate files
- JavaScript wrapped in an IIFE for clean scoping
