import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

// ── Floating Word Particles ──────────────────────────
const words = [
  'كلمة','حرف','بيت','قصيدة','حب','دفتر',
  'شعر','قمر','بحر','ورد','نور','سيدة',
  'أصفر','أحمر','أزرق','أخضر','موجة','دواة',
  'صفحة','لون','ثوب','حلم','لحن','روح',
];

const rgbs = [
  [200, 152, 16],
  [192, 48,  32],
  [37,  88,  160],
  [26,  138, 72],
  [56,  200, 112],
  [139, 101, 72],
];

const container = document.getElementById('wordsFloat');

function spawnWord() {
  const el = document.createElement('div');
  el.className = 'word-particle';
  el.textContent = words[Math.floor(Math.random() * words.length)];
  const [r, g, b] = rgbs[Math.floor(Math.random() * rgbs.length)];
  const maxOpacity = 0.11 + Math.random() * 0.13;
  const duration  = 9 + Math.random() * 12;
  const rot       = (Math.random() - 0.5) * 28;
  const size      = 11 + Math.random() * 10;
  el.style.cssText = [
    `left: ${Math.random() * 94}%`,
    `top: ${8 + Math.random() * 82}%`,
    `color: rgba(${r},${g},${b},1)`,
    `font-size: ${size}px`,
    `--wr: ${rot}deg`,
    `--wo: ${maxOpacity}`,
    `animation-duration: ${duration}s`,
    `animation-delay: ${Math.random() * 5}s`,
  ].join(';');
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

(function scheduleWords() {
  spawnWord();
  setTimeout(scheduleWords, 480 + Math.random() * 820);
})();

// ── Cursor Trail ────────────────────────────────────
const trailHex = ['#c89810','#c03020','#2558a0','#1a8a48','#38c870'];
let lastTrail = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrail < 55) return;
  lastTrail = now;
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.style.left       = e.clientX + 'px';
  dot.style.top        = e.clientY + 'px';
  dot.style.background = trailHex[Math.floor(Math.random() * trailHex.length)];
  document.body.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
});

// ── Click Ink Drop + Ripple ──────────────────────────
const clickHex = ['#c89810','#c03020','#2558a0','#1a8a48'];

document.addEventListener('click', (e) => {
  const color = clickHex[Math.floor(Math.random() * clickHex.length)];
  const size  = 7 + Math.random() * 7;

  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left       = e.clientX + 'px';
  drop.style.top        = e.clientY + 'px';
  drop.style.width      = size + 'px';
  drop.style.height     = size + 'px';
  drop.style.background = color;
  document.body.appendChild(drop);
  drop.addEventListener('animationend', () => drop.remove());

  const ripple = document.createElement('div');
  ripple.className   = 'ripple';
  ripple.style.left  = e.clientX + 'px';
  ripple.style.top   = e.clientY + 'px';
  ripple.style.width  = '18px';
  ripple.style.height = '18px';
  ripple.style.color  = color;
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ── Constellation Canvas (mouse-following) ───────────
const canvas = document.getElementById('constellation');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const starRGB = [
  [200, 152, 16],
  [192, 48,  32],
  [37,  88,  160],
  [56,  200, 112],
];

document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.22 || stars.length >= 65) return;
  const [r, g, b] = starRGB[Math.floor(Math.random() * starRGB.length)];
  stars.push({
    x:    e.clientX + (Math.random() - 0.5) * 28,
    y:    e.clientY + (Math.random() - 0.5) * 28,
    r:    0.5 + Math.random() * 1.6,
    life: 1,
    rgb:  `${r},${g},${b}`,
  });
});

(function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars = stars.filter((s) => s.life > 0);
  stars.forEach((s) => { s.life -= 0.0038; });

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const a = Math.max(0, s.life);

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.rgb},${a * 0.65})`;
    ctx.fill();

    for (let j = i + 1; j < stars.length; j++) {
      const t = stars[j];
      const d = Math.hypot(s.x - t.x, s.y - t.y);
      if (d < 105) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = `rgba(${s.rgb},${(1 - d / 105) * Math.min(s.life, t.life) * 0.18})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
})();


// ============================================================
// MOTION.DEV ANIMATIONS — DELUXE NOTEBOOK EDITION
// ============================================================

// ─── 1. Reading Progress Bar ─────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'reading-progress';
document.body.appendChild(progressBar);
scroll(animate(progressBar, { scaleX: [0, 1] }));

// ─── 2. Ornament — Lines Draw In, Diamond Spins ──────
const ornament = document.querySelector('.ornament');
if (ornament) {
  ornament.style.opacity = '1';
  const ornLines = ornament.querySelectorAll('.line');
  const diamond  = ornament.querySelector('.diamond');
  animate(ornLines, { scaleX: [0, 1], opacity: [0, 1] }, {
    duration: 1.1,
    delay: stagger(0.22, { start: 0.15 }),
    easing: [0.25, 0.46, 0.45, 0.94],
  });
  if (diamond) {
    animate(diamond, { opacity: [0, 1], rotate: [-180, 45], scale: [0.1, 1.5, 1] }, {
      duration: 0.85,
      delay: 0.65,
      easing: [0.34, 1.56, 0.64, 1],
    });
  }
}

// ─── 3. Kinetic Title — Character-by-Character ────────
// Each character tumbles in with spring bounce easing
const titleEl = document.querySelector('.title');
if (titleEl) {
  titleEl.querySelectorAll('span').forEach(span => {
    const text = span.textContent;
    span.textContent = '';
    [...text].forEach(char => {
      const s = document.createElement('span');
      s.className = 'title-char';
      s.textContent = char === ' ' ? ' ' : char;
      span.appendChild(s);
    });
  });
  const chars = titleEl.querySelectorAll('.title-char');
  animate(chars, { opacity: [0, 1], y: [65, 0], rotateZ: [-22, 0] }, {
    duration: 0.65,
    delay: stagger(0.058, { start: 0.55 }),
    easing: [0.34, 1.56, 0.64, 1],
  });
}

// ─── 4. Eyebrow + Byline Fade-Up Sequence ────────────
animate(document.querySelectorAll('.eyebrow'), { opacity: [0, 1], y: [14, 0] }, {
  duration: 0.75, delay: stagger(0.1, { start: 1.25 }), easing: 'ease-out',
});
animate(document.querySelectorAll('.byline'), { opacity: [0, 1], y: [14, 0] }, {
  duration: 0.7, delay: stagger(0.1, { start: 1.65 }), easing: 'ease-out',
});

// ─── 5. Scroll Cue — Bounce In ────────────────────────
animate(document.querySelectorAll('.scroll-cue'), { opacity: [0, 1], y: [10, 0], scale: [0.8, 1] }, {
  duration: 0.55, delay: stagger(0.1, { start: 2.3 }), easing: [0.34, 1.56, 0.64, 1],
});

// ─── 6. Hero Parallax + Fade ──────────────────────────
const stage = document.querySelector('.stage');
if (stage) {
  scroll(
    animate(stage, { y: [0, -90], opacity: [1, 0] }),
    { target: stage, offset: ['start start', 'end start'] }
  );
}

// ─── 7. Dancing Words — "ترقص آلاف الكلمات" ──────────
// Split the accent lines in the opening stanza into word spans, then loop-animate
const openingStanza = document.querySelector('.stanza.opening');
if (openingStanza) {
  openingStanza.querySelectorAll('.verse').forEach(verse => {
    const accentLine = verse.querySelector('.line.accent');
    if (!accentLine) return;
    const ws = accentLine.textContent.trim().split(/\s+/);
    accentLine.textContent = '';
    ws.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'dance-word';
      s.textContent = w + (i < ws.length - 1 ? ' ' : '');
      accentLine.appendChild(s);
    });
  });
}

inView('.stanza.opening', () => {
  const danceWords = document.querySelectorAll('.dance-word');
  if (!danceWords.length) return;
  // Wave-like vertical bounce
  animate(danceWords, { y: [0, -13, 0] }, {
    duration: 2.1,
    delay: stagger(0.22),
    repeat: Infinity,
    easing: 'ease-in-out',
  });
  // Gentle rotation shimmer
  animate(danceWords, { rotate: [-3, 3, -3] }, {
    duration: 2.6,
    delay: stagger(0.18, { start: 0.1 }),
    repeat: Infinity,
    easing: 'ease-in-out',
  });
}, { amount: 0.3 });

// ─── 8. Stanza Scroll Reveals (non-final) — 3D Spring ─
inView('.stanza:not(.final)', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [55, 0], rotateX: [9, 0] }, {
    duration: 0.9,
    easing: [0.25, 0.46, 0.45, 0.94],
  });
  const lines = target.querySelectorAll('.line');
  if (lines.length) {
    animate(lines, { opacity: [0, 1], y: [20, 0] }, {
      duration: 0.55,
      delay: stagger(0.09, { start: 0.35 }),
      easing: [0.34, 1.56, 0.64, 1],
    });
  }
  const num = target.querySelector('.stanza-num');
  if (num) {
    animate(num, { opacity: [0, 0.5], letterSpacing: ['0.78em', '0.38em'] }, {
      duration: 1.05, delay: 0.18, easing: 'ease-out',
    });
  }
}, { amount: 0.15 });

// ─── 9. Divider Reveals — Lines Draw + Symbol Spins ──
inView('.divider', ({ target }) => {
  const dLines = target.querySelectorAll('.line');
  const wave   = target.querySelector('.wave');
  animate(dLines, { scaleX: [0, 1], opacity: [0, 1] }, {
    duration: 0.7,
    delay: stagger(0.13),
    easing: 'ease-out',
  });
  if (wave) {
    animate(wave, { opacity: [0, 0.9], scale: [0.15, 1.5, 1], rotate: [360, 0] }, {
      duration: 0.9, delay: 0.2, easing: [0.34, 1.56, 0.64, 1],
    });
  }
}, { amount: 0.5 });

// ─── 10. Color Line Shimmer Loops ─────────────────────
// Colored lines pulse their opacity to create a breathing glow effect
function pulseColor(selector, lo, hi) {
  inView(selector, ({ target }) => {
    animate(target, { opacity: [lo, hi, lo] }, {
      duration: 2.6, delay: 0.4, repeat: Infinity, easing: 'ease-in-out',
    });
  }, { amount: 0.5 });
}
pulseColor('.yellow-line', 0.72, 1);
pulseColor('.red-line',    0.72, 1);
pulseColor('.green-line',  0.68, 1);

// ─── 11. Green Moon Stanza — Radial Glow Pulse ────────
inView('.moon-stanza', ({ target }) => {
  const glow = document.createElement('div');
  glow.className = 'moon-glow-pulse';
  target.appendChild(glow);
  animate(glow, { opacity: [0, 0.85, 0], scale: [0.55, 1.45, 0.55] }, {
    duration: 3.8, repeat: Infinity, easing: 'ease-in-out',
  });
}, { amount: 0.4 });

// ─── 12. 3D Perspective Tilt on Stanza Hover ─────────
document.querySelectorAll('.stanza:not(.opening)').forEach(stanza => {
  stanza.addEventListener('mousemove', e => {
    const rect = stanza.getBoundingClientRect();
    const x = ((e.clientX - rect.left)  / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)   / rect.height - 0.5) * 14;
    animate(stanza, { rotateY: x, rotateX: -y, scale: 1.016 }, {
      type: 'spring', stiffness: 265, damping: 24,
    });
  });
  stanza.addEventListener('mouseleave', () => {
    animate(stanza, { rotateY: 0, rotateX: 0, scale: 1 }, {
      type: 'spring', stiffness: 205, damping: 20,
    });
  });
});

// ─── 13. Final Stanza — Cinematic Sequence ────────────
// Standard lines stagger → color words burst → green moon glows → refrains cascade
inView('.stanza.final', ({ target }) => {
  // Stanza entrance
  animate(target, { opacity: [0, 1], y: [55, 0] }, {
    duration: 0.9, easing: [0.25, 0.46, 0.45, 0.94],
  });

  // Stanza number
  const num = target.querySelector('.stanza-num');
  if (num) {
    animate(num, { opacity: [0, 0.5], letterSpacing: ['0.78em', '0.38em'] }, {
      duration: 1.05, delay: 0.18, easing: 'ease-out',
    });
  }

  // Standard lines (excluding the dramatic climax lines)
  const standardLines = [...target.querySelectorAll('.line')].filter(
    l => !l.classList.contains('big-green') && !l.classList.contains('big-refrain')
  );
  animate(standardLines, { opacity: [0, 1], y: [20, 0] }, {
    duration: 0.55,
    delay: stagger(0.1, { start: 0.35 }),
    easing: [0.34, 1.56, 0.64, 1],
  });

  // Color words — each word explodes in from above
  const colorWords = target.querySelectorAll('.white-word, .red-word, .blue-word, .yellow-word');
  animate(colorWords, { opacity: [0, 1], scale: [0.35, 1.3, 1], y: [-16, 0] }, {
    duration: 0.52,
    delay: stagger(0.21, { start: 0.72 }),
    easing: [0.34, 1.56, 0.64, 1],
  });

  // "كالقمر الأخضر" — the green moon line rises with scale bloom
  const bigGreen = target.querySelector('.big-green');
  if (bigGreen) {
    animate(bigGreen, { opacity: [0, 1], scale: [0.78, 1.07, 1], y: [22, 0] }, {
      duration: 1.15, delay: 1.35, easing: [0.34, 1.56, 0.64, 1],
    });
  }

  // Refrain lines — cascading gold entrance
  const refrains = [...target.querySelectorAll('.big-refrain')];
  animate(refrains, { opacity: [0, 1], y: [30, 0], scale: [0.88, 1] }, {
    duration: 0.9,
    delay: stagger(0.38, { start: 2.0 }),
    easing: [0.25, 0.46, 0.45, 0.94],
  });
}, { amount: 0.2 });

// ─── 14. Footer — Reveal + Celebration Burst ─────────
const burstColors = ['#c89810','#c03020','#2558a0','#1a8a48','#38c870','#e8c440','#a070e0'];

inView('.footer', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [32, 0] }, { duration: 0.85, easing: 'ease-out' });

  // Signature + meta stagger
  animate(target.querySelectorAll('.signature, .meta'), { opacity: [0, 1], y: [12, 0] }, {
    duration: 0.6,
    delay: stagger(0.15, { start: 0.3 }),
    easing: 'ease-out',
  });

  // Celebration particle burst — completes the poem's journey
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const p    = document.createElement('div');
      p.className = 'celebration-particle';
      const isRound = Math.random() > 0.42;
      const size    = 3 + Math.random() * 10;
      p.style.cssText = [
        `left:${rect.left + Math.random() * rect.width}px`,
        `top:${window.scrollY + rect.top + Math.random() * rect.height * 0.7}px`,
        `background:${burstColors[Math.floor(Math.random() * burstColors.length)]}`,
        `width:${size}px`,
        `height:${size}px`,
        `border-radius:${isRound ? '50%' : '3px'}`,
      ].join(';');
      document.body.appendChild(p);
      animate(p, {
        y:      [0, -(90 + Math.random() * 150)],
        x:      [(Math.random() - 0.5) * 100],
        opacity:[0.95, 0],
        rotate: [0, (Math.random() - 0.5) * 660],
        scale:  [1, 0.08],
      }, { duration: 1.35 + Math.random() * 0.95, easing: 'ease-out' })
        .then(() => p.remove());
    }, i * 50);
  }
}, { amount: 0.4 });

// ─── 15. Ink SVG Underlines — Draw Into Each Stanza ──
// Classic calligraphic stroke effect: path draws from zero to full length
const inkCurves = [
  'M2,6 Q50,2 100,6 Q150,10 198,5',
  'M2,5 Q60,1 110,7 Q158,10 198,4',
  'M2,7 C45,2 82,10 130,5 C164,1 185,8 198,5',
  'M2,4 Q52,9 100,4 Q150,0 198,6',
  'M2,6 C38,1 78,10 122,5 C157,1 180,8 198,5',
  'M2,5 Q55,9 100,3 Q148,8 198,5',
];

document.querySelectorAll('.stanza:not(.opening)').forEach((stanza, i) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'ink-underline');
  svg.setAttribute('viewBox', '0 0 200 12');
  svg.setAttribute('preserveAspectRatio', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', inkCurves[i % inkCurves.length]);
  path.setAttribute('class', 'ink-path');
  svg.appendChild(path);
  stanza.appendChild(svg);

  // Set dash values after element is in DOM
  const len = path.getTotalLength();
  path.style.strokeDasharray  = String(len);
  path.style.strokeDashoffset = String(len);
});

inView('.stanza:not(.opening)', ({ target }) => {
  const path = target.querySelector('.ink-path');
  if (!path) return;
  const len = parseFloat(path.style.strokeDasharray) || path.getTotalLength();
  animate(path, { strokeDashoffset: [len, 0] }, {
    duration: 1.25, delay: 0.8, easing: 'ease-in-out',
  });
}, { amount: 0.3 });

// ─── 16. Line Hover — Ink-Feather Flick ───────────────
// When a line is hovered, a tiny feather particle flicks off the dot marker
document.querySelectorAll('.verse .line:not(.color-parade)').forEach(line => {
  line.addEventListener('mouseenter', () => {
    animate(line, { x: [-4, 0] }, {
      type: 'spring', stiffness: 400, damping: 18,
    });
  });
});

// ─── 17. Poem Section Scroll Depth Indicator ──────────
// Each stanza subtly shifts its opacity based on how centered it is in viewport
const allStanzas = document.querySelectorAll('.stanza');
allStanzas.forEach(stanza => {
  scroll(
    animate(stanza, { opacity: [0.65, 1, 0.65] }),
    { target: stanza, offset: ['start 80%', 'center center', 'end 20%'] }
  );
});
