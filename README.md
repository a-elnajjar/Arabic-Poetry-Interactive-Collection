# Arabic Poetry — Interactive Collection

An interactive collection of Arabic poetry with bilingual (AR/EN) support, atmospheric visuals, and ambient effects.
SideNot: client prototypes for his restaurant projector
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

### 3. سيدتي — نزار قباني (My Lady — Nizar Qabbani)

A warm notebook-aesthetic presentation of Qabbani's love poem, featuring aged paper layers, floating word particles, colour-coded verses (gold, red, green, blue), and a bilingual language toggle.

**Files**
```
notebook-poem/
├── index.html   — markup & content
├── style.css    — all styles
└── script.js    — IIFE-wrapped JS (cursor, constellation, word particles, language toggle)
```

📓 **[View live page](https://a-elnajjar.github.io/Arabic-Poetry-Interactive-Collection/notebook-poem/index.html)**

---

### 4. عن الصمود — محمود درويش (On Steadfastness — Mahmoud Darwish)

An earthy, grounded presentation of Darwish's 1964 poem of Palestinian resistance, from the collection *Olive Leaves*. Features a three-depth animated wheat field, falling olive leaves, rising ember sparks, and a warm soil-glow horizon — all rendered on a fixed canvas in deep earth tones.

**Files**
```
on-steadfastness/
├── index.html   — markup & content (3 sections, 6 stanzas, bilingual)
├── style.css    — earth/olive/wheat gold colour palette
└── script.js    — canvas VFX: wheat stalks, olive leaves, embers, shimmer
```

🌿 **[View live page](https://a-elnajjar.github.io/Arabic-Poetry-Interactive-Collection/on-steadfastness/index.html)**

---

### 5. حصانٌ يهبطُ من تلّةٍ بيضاء — مريد البرغوثي (A Horse Descends a White Hill — Mourid Barghouti)

A dark cinematic experience of Barghouti's poem about an aging horse descending a misty white hill at dusk. A sprite-sheet horse silhouette (16 hand-drawn frames: an 8-frame walk cycle and an 8-frame gallop) walks down the hill as you scroll, breaks into a gallop when the scroll drags it fast or on hover, occasionally stumbles (but never falls), and leaps to scratch clouds when they're clicked — leaving faint hoof marks. Arabic-only verses (Amiri font) fade in like mist on scroll, ending in a trembling «ولا تسقطْ تمامًا يا حصانْ!» that glows as the cursor approaches. Includes gentle parallax and a synthesized wind-sound toggle.

**Files**
```
horse-poem/
├── index.html                 — markup, styles, and JS inline
└── assets/horse-sprites.png   — 8×2 sprite sheet (440×320 frames: walk row, gallop row)
```

🐎 **[View live page](https://a-elnajjar.github.io/Arabic-Poetry-Interactive-Collection/horse-poem/index.html)**

---

## Structure

```
maritime-poem/          — Nizar Qabbani poem (القصيدة البحرية)
ThinkofOthers/          — Mahmoud Darwish poem (فكِّر بغيرك)
notebook-poem/          — Nizar Qabbani poem (سيدتي)
on-steadfastness/       — Mahmoud Darwish poem (عن الصمود)
horse-poem/             — Mourid Barghouti poem (حصانٌ يهبطُ من تلّةٍ بيضاء)
README.md
```

## Features

- Bilingual AR / EN toggle with smooth fade transition
- Custom animated compass cursor with trail effect
- Scroll-triggered stanza reveals (IntersectionObserver)
- Constellation canvas that reacts to mouse movement
- JavaScript wrapped in an IIFE for clean scoping
