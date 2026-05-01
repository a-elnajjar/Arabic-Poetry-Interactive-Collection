import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

// ============ CONSTELLATION CANVAS ============
const canvas = document.getElementById('constellation');
const ctx = canvas.getContext('2d');
let stars = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  stars = [];
  const count = Math.floor((W * H) / 8000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach((star) => {
    star.twinkle += star.twinkleSpeed;
    const tw = (Math.sin(star.twinkle) + 1) / 2;
    const op = star.opacity * (0.5 + tw * 0.5);

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(242, 235, 220, ${op})`;
    ctx.fill();

    if (star.r > 1) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
      gradient.addColorStop(0, `rgba(201, 168, 97, ${op * 0.4})`);
      gradient.addColorStop(1, 'rgba(201, 168, 97, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  });

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dist = Math.sqrt((stars[i].x - stars[j].x) ** 2 + (stars[i].y - stars[j].y) ** 2);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(201, 168, 97, ${(1 - dist / 120) * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resize);
resize();
drawStars();

// ============ MOTION.DEV ANIMATIONS ============

// --- Reading progress bar ---
const progressBar = document.createElement('div');
progressBar.id = 'reading-progress';
document.body.appendChild(progressBar);
scroll(animate(progressBar, { scaleX: [0, 1] }));

// --- Hero parallax: stage drifts up and fades as you scroll past ---
const stage = document.querySelector('.stage');
if (stage) {
  scroll(
    animate(stage, { y: [0, -80], opacity: [1, 0.15] }),
    { target: stage, offset: ['start start', 'end start'] }
  );
}

// --- Stanza scroll-triggered reveals with per-line stagger ---
inView('.stanza', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [50, 0] }, {
    duration: 0.85,
    easing: [0.25, 0.46, 0.45, 0.94],
  });

  const lines = target.querySelectorAll('.line');
  if (lines.length > 0) {
    animate(
      lines,
      { opacity: [0, 1], y: [18, 0] },
      {
        duration: 0.55,
        delay: stagger(0.09, { start: 0.4 }),
        easing: 'ease-out',
      }
    );
  }
}, { amount: 0.15 });

// --- Divider reveals ---
inView('.divider', ({ target }) => {
  animate(target, { opacity: [0, 0.7], scaleX: [0.6, 1] }, {
    duration: 0.6,
    easing: 'ease-out',
  });
}, { amount: 0.5 });

// --- Footer reveal ---
inView('.footer', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [30, 0] }, {
    duration: 0.8,
    easing: 'ease-out',
  });
}, { amount: 0.3 });

// --- Title entrance on load ---
const titleWords = document.querySelectorAll('.title .word');
if (titleWords.length > 0) {
  animate(titleWords, { opacity: [0, 1], y: [30, 0] }, {
    duration: 0.8,
    delay: stagger(0.15, { start: 0.3 }),
    easing: [0.25, 0.46, 0.45, 0.94],
  });
}

// --- Spring hover on stanza cards (skip opening refrain) ---
document.querySelectorAll('.stanza:not(.opening)').forEach((stanza) => {
  stanza.addEventListener('mouseenter', () => {
    animate(stanza, { scale: 1.013 }, { type: 'spring', stiffness: 280, damping: 22 });
  });
  stanza.addEventListener('mouseleave', () => {
    animate(stanza, { scale: 1 }, { type: 'spring', stiffness: 200, damping: 20 });
  });
});
