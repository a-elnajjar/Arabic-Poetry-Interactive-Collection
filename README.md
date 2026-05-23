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

## Structure

```
maritime-poem/          — Nizar Qabbani poem (القصيدة البحرية)
ThinkofOthers/          — Mahmoud Darwish poem (فكِّر بغيرك)
notebook-poem/          — Nizar Qabbani poem (سيدتي)
on-steadfastness/       — Mahmoud Darwish poem (عن الصمود)
README.md
```

## Features

- Bilingual AR / EN toggle with smooth fade transition
- Custom animated compass cursor with trail effect
- Scroll-triggered stanza reveals (IntersectionObserver)
- Constellation canvas that reacts to mouse movement
- JavaScript wrapped in an IIFE for clean scoping
