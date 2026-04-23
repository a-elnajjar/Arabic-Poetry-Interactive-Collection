// ============ FALLING LIGHT ============
const rain = document.getElementById('rain');
for (let i = 0; i < 60; i++) {
  const drop = document.createElement('span');
  const h = 30 + Math.random() * 80;
  const dur = 3 + Math.random() * 5;
  const delay = Math.random() * 5;
  drop.style.left = Math.random() * 100 + '%';
  drop.style.height = h + 'px';
  drop.style.animationDuration = dur + 's';
  drop.style.animationDelay = -delay + 's';
  drop.style.opacity = 0.3 + Math.random() * 0.5;
  rain.appendChild(drop);
}

// ============ STANZA REVEAL ON SCROLL ============
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('[data-stanza]').forEach((el) => io.observe(el));

// ============ CUSTOM CURSOR + TRAIL ============
const cursor = document.getElementById('cursor');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';

  // sparse trail — one drop every 60ms max
  const now = Date.now();
  if (now - lastTrailTime > 60) {
    lastTrailTime = now;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = mouseX + 'px';
    trail.style.top = mouseY + 'px';
    trail.style.background = Math.random() > 0.5 ? '#5fb8b8' : '#c9a861';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 1200);
  }
});

// cursor grows on interactive elements
document.querySelectorAll('.line, .sound-toggle, .lang-toggle button').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ============ CLICK RIPPLE ============
document.addEventListener('click', (e) => {
  // don't ripple on the sound toggle
  if (e.target.closest('.sound-toggle')) return;

  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top = e.clientY + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1400);

  // second, slower ripple for depth
  setTimeout(() => {
    const r2 = document.createElement('div');
    r2.className = 'ripple';
    r2.style.left = e.clientX + 'px';
    r2.style.top = e.clientY + 'px';
    r2.style.animationDuration = '2s';
    document.body.appendChild(r2);
    setTimeout(() => r2.remove(), 2000);
  }, 200);
});

// ============ CONSTELLATION ============
// "وأصيدُ ملايينَ الأقمار" — mouse leaves behind stars that connect
const canvas = document.getElementById('constellation');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

document.addEventListener('mousemove', (e) => {
  // add stars sparingly
  if (Math.random() > 0.85) {
    stars.push({
      x: e.clientX + (Math.random() - 0.5) * 40,
      y: e.clientY + (Math.random() - 0.5) * 40,
      r: 0.5 + Math.random() * 1.5,
      life: 1,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
  // cap at 80 stars to keep it light
  if (stars.length > 80) stars.shift();
});

function drawConstellation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw stars
  stars.forEach((s) => {
    s.life -= 0.003;
    s.twinkle += 0.05;
    const alpha = Math.max(0, s.life) * (0.6 + Math.sin(s.twinkle) * 0.4);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 223, 208, ${alpha})`;
    ctx.fill();

    // glow halo
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 97, ${alpha * 0.15})`;
    ctx.fill();
  });

  // connect close stars with thin lines
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const a = stars[i];
      const b = stars[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * Math.min(a.life, b.life) * 0.25;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(95, 184, 184, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // remove dead stars
  stars = stars.filter((s) => s.life > 0);
  requestAnimationFrame(drawConstellation);
}
drawConstellation();

// ============ AMBIENT SEA SOUND (synthesized, no files) ============
const soundBtn = document.getElementById('soundToggle');
let seaNodes = null;
let playing = false;

function createSeaSound() {
  const soundCtx = new (window.AudioContext || window.webkitAudioContext)();

  // gentle white noise -> filtered = wave sound
  const bufferSize = 2 * soundCtx.sampleRate;
  const noiseBuffer = soundCtx.createBuffer(1, bufferSize, soundCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = soundCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  // band-pass filter to make it sound like waves (not static)
  const filter = soundCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  filter.Q.value = 0.5;

  // slow LFO modulates filter cutoff = rolling wave sensation
  const lfo = soundCtx.createOscillator();
  lfo.frequency.value = 0.12; // very slow
  const lfoGain = soundCtx.createGain();
  lfoGain.gain.value = 250;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  // main gain — fade in softly
  const gain = soundCtx.createGain();
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.18, soundCtx.currentTime + 2);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(soundCtx.destination);

  noise.start();
  lfo.start();

  return { ctx: soundCtx, gain, noise, lfo };
}

soundBtn.addEventListener('click', () => {
  if (!playing) {
    if (!seaNodes) seaNodes = createSeaSound();
    else {
      seaNodes.gain.gain.cancelScheduledValues(seaNodes.ctx.currentTime);
      seaNodes.gain.gain.linearRampToValueAtTime(0.18, seaNodes.ctx.currentTime + 1.5);
    }
    soundBtn.classList.add('playing');
    playing = true;
  } else {
    seaNodes.gain.gain.cancelScheduledValues(seaNodes.ctx.currentTime);
    seaNodes.gain.gain.linearRampToValueAtTime(0, seaNodes.ctx.currentTime + 1);
    soundBtn.classList.remove('playing');
    playing = false;
  }
});

// ============ LANGUAGE TOGGLE ============
const langToggle = document.getElementById('langToggle');
const langButtons = langToggle.querySelectorAll('button');
const html = document.documentElement;
const body = document.body;

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    const currentLang = body.classList.contains('en-mode') ? 'en' : 'ar';
    if (lang === currentLang) return;

    // fade out -> switch -> fade in
    body.classList.add('switching');

    setTimeout(() => {
      if (lang === 'en') {
        body.classList.add('en-mode');
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        langToggle.classList.remove('ar');
        langToggle.classList.add('en');
      } else {
        body.classList.remove('en-mode');
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        langToggle.classList.remove('en');
        langToggle.classList.add('ar');
      }

      // update active button state
      langButtons.forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));

      // fade back in
      setTimeout(() => body.classList.remove('switching'), 50);
    }, 300);
  });
});
