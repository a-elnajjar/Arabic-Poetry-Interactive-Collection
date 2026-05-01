import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

// ── Floating Word Particles ──────────────────────────
const words = [
  'كلمة','حرف','بيت','قصيدة','حب','دفتر',
  'شعر','قمر','بحر','ورد','نور','سيدة',
  'أصفر','أحمر','أزرق','أخضر','موجة','دواة',
  'صفحة','لون','ثوب','حلم','لحن','روح',
];

const rgbs = [
  [200, 152, 16],   // gold
  [192, 48,  32],   // red
  [37,  88,  160],  // blue
  [26,  138, 72],   // green
  [56,  200, 112],  // green-moon
  [139, 101, 72],   // muted brown
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
  [200, 152, 16],   // gold
  [192, 48,  32],   // red
  [37,  88,  160],  // blue
  [56,  200, 112],  // green
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

// ============ MOTION.DEV ANIMATIONS ============

// Reading progress bar
const progressBar = document.createElement('div');
progressBar.id = 'reading-progress';
document.body.appendChild(progressBar);
scroll(animate(progressBar, { scaleX: [0, 1] }));

// Hero parallax: stage drifts up and fades as you scroll past
const stage = document.querySelector('.stage');
if (stage) {
  scroll(
    animate(stage, { y: [0, -80], opacity: [1, 0.15] }),
    { target: stage, offset: ['start start', 'end start'] }
  );
}

// Stanza scroll-triggered reveals with per-line stagger
inView('.stanza', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [50, 0] }, {
    duration: 0.85,
    easing: [0.25, 0.46, 0.45, 0.94],
  });
  const lines = target.querySelectorAll('.line');
  if (lines.length > 0) {
    animate(lines, { opacity: [0, 1], y: [18, 0] }, {
      duration: 0.55,
      delay: stagger(0.09, { start: 0.4 }),
      easing: 'ease-out',
    });
  }
}, { amount: 0.15 });

// Divider reveals
inView('.divider', ({ target }) => {
  animate(target, { opacity: [0, 0.7], scaleX: [0.6, 1] }, {
    duration: 0.6,
    easing: 'ease-out',
  });
}, { amount: 0.5 });

// Footer reveal
inView('.footer', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [30, 0] }, {
    duration: 0.8,
    easing: 'ease-out',
  });
}, { amount: 0.3 });

// Title entrance on load
const titleSpans = document.querySelectorAll('.title span');
if (titleSpans.length > 0) {
  animate(titleSpans, { opacity: [0, 1], y: [30, 0] }, {
    duration: 0.8,
    delay: stagger(0.15, { start: 0.3 }),
    easing: [0.25, 0.46, 0.45, 0.94],
  });
}

// Spring hover on stanzas
document.querySelectorAll('.stanza:not(.opening)').forEach((stanza) => {
  stanza.addEventListener('mouseenter', () => {
    animate(stanza, { scale: 1.013 }, { type: 'spring', stiffness: 280, damping: 22 });
  });
  stanza.addEventListener('mouseleave', () => {
    animate(stanza, { scale: 1 }, { type: 'spring', stiffness: 200, damping: 20 });
  });
});
