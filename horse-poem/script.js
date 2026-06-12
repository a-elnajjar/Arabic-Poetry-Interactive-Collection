(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scene metrics & hill geometry ---------- */
  const hillsSvg = document.getElementById('hills');
  const hillMain = document.getElementById('hill-main');
  const hillFar  = document.getElementById('hill-far');
  let W = 0, H = 0;

  // top edge of the white hill: high crest on the right, sloping down leftwards
  function hillTopY(t) {                       // t in [0,1], left → right
    return H * (0.92 - 0.34 * Math.pow(t, 1.5));
  }
  function farTopY(t) {                        // distant dark ridge, crest on the left
    return H * (0.70 - 0.16 * Math.pow(1 - t, 1.8));
  }

  function buildPath(fn) {
    const steps = 40;
    let d = 'M0,' + H.toFixed(1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      d += ' L' + (t * W).toFixed(1) + ',' + fn(t).toFixed(1);
    }
    return d + ' L' + W.toFixed(1) + ',' + H.toFixed(1) + ' Z';
  }

  function layoutScene() {
    W = window.innerWidth;
    H = window.innerHeight;
    hillsSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    hillMain.setAttribute('d', buildPath(hillTopY));
    hillFar.setAttribute('d', buildPath(farTopY));
  }
  layoutScene();
  window.addEventListener('resize', layoutScene);

  /* ---------- horse: descent tied to scroll, with smoothing ---------- */
  const horse = document.getElementById('horse');
  const horseInner = horse.querySelector('.horse-inner');
  const T_START = 0.84, T_END = 0.13;          // hill position: crest → foot
  let tCurrent = T_START;

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function slopeAngleDeg(t) {
    const e = 0.012;
    const dy = hillTopY(Math.min(1, t + e)) - hillTopY(Math.max(0, t - e));
    return Math.atan2(dy, 2 * e * W) * 180 / Math.PI;  // negative → nose downhill
  }

  let lastFrame = 0;
  function frame(now) {
    const dt = Math.min(50, now - lastFrame);
    lastFrame = now;

    const target = T_START - (T_START - T_END) * scrollProgress();
    tCurrent += (target - tCurrent) * Math.min(1, dt * 0.0022);

    const hw = horse.offsetWidth;
    const hh = hw * (320 / 440);               // sprite frame ratio
    const bob = Math.sin(now / 460) * 1.6;     // walking bob
    const x = tCurrent * W - hw / 2;
    const y = hillTopY(tCurrent) - hh * 0.96 + bob;
    horse.style.transform =
      'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) ' +
      'rotate(' + slopeAngleDeg(tCurrent).toFixed(2) + 'deg)';

    updateGait(now, Math.abs(target - tCurrent) * W);

    maybePrint(tCurrent);
    applyParallax();
    updateGlow();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- hoofprints fading in the snow ---------- */
  const printsLayer = document.getElementById('hoofprints');
  let lastPrintX = T_START * W;

  function maybePrint(t) {
    const x = t * W;
    if (Math.abs(x - lastPrintX) < 34) return;
    lastPrintX = x;
    if (REDUCED) return;
    const p = document.createElement('div');
    p.className = 'hoofprint';
    p.style.left = (x - 6) + 'px';
    p.style.top  = (hillTopY(t) - 4) + 'px';
    p.style.transform = 'rotate(' + slopeAngleDeg(t).toFixed(1) + 'deg)';
    printsLayer.appendChild(p);
    if (printsLayer.children.length > 40) printsLayer.firstChild.remove();
    setTimeout(() => p.remove(), 7200);
  }

  /* ---------- gentle parallax ---------- */
  const stars = document.getElementById('stars');
  const moon = document.getElementById('moon');
  const clouds = document.getElementById('clouds');

  function applyParallax() {
    const p = scrollProgress();
    stars.style.transform  = 'translate3d(0,' + (p * 36) + 'px,0)';
    moon.style.transform   = 'translate3d(0,' + (p * 24) + 'px,0)';
    clouds.style.transform = 'translate3d(0,' + (p * 58) + 'px,0)';
    hillsSvg.style.transform = 'translate3d(0,' + (p * -14) + 'px,0)';
  }

  /* ---------- gait: walk by default, gallop when pushed ---------- */
  // gallops while the scroll drags it down the hill fast (with hysteresis
  // so it doesn't flicker between gaits), or for a burst on hover / tap
  let gallopUntil = 0, isGalloping = false;

  function updateGait(now, gapPx) {
    const galloping = now < gallopUntil || gapPx > (isGalloping ? 30 : 90);
    if (galloping !== isGalloping) {
      isGalloping = galloping;
      horse.classList.toggle('galloping', galloping);
    }
  }

  function gallopBurst() { gallopUntil = performance.now() + 1400; }
  horse.addEventListener('mouseenter', gallopBurst);
  horse.addEventListener('click', gallopBurst);

  /* ---------- one-shot horse animations ---------- */
  function playOnce(cls) {
    if (REDUCED || horseInner.classList.contains(cls)) return;
    horseInner.classList.add(cls);
    horseInner.addEventListener('animationend',
      () => horseInner.classList.remove(cls), { once: true });
  }

  /* ---------- occasional stumble — but never a fall ---------- */
  function triggerStumble() {
    if (!horseInner.classList.contains('leap')) playOnce('stumble');
  }

  function scheduleStumble() {
    setTimeout(() => {
      triggerStumble();
      scheduleStumble();
    }, 7000 + Math.random() * 6000);
  }
  scheduleStumble();

  /* ---------- breath vapour from the muzzle ---------- */
  const fx = document.getElementById('fx');

  function breathe(n) {
    if (REDUCED) return;
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const r = horse.getBoundingClientRect();
        const b = document.createElement('div');
        b.className = 'breath';
        b.style.left = (r.left + r.width * 0.13 + (Math.random() * 10 - 5)) + 'px';
        b.style.top  = (r.top + r.height * 0.24 + (Math.random() * 8 - 4)) + 'px';
        fx.appendChild(b);
        setTimeout(() => b.remove(), 1800);
      }, i * 140);
    }
  }

  (function ambientBreath() {                  // panting in the cold night
    setTimeout(() => {
      breathe(isGalloping ? 3 : 1);
      ambientBreath();
    }, 3500 + Math.random() * 3000);
  })();

  /* ---------- cough & vanish ---------- */
  function cough() {
    playOnce('cough');
    breathe(4);
  }

  function vanish() {                          // gone in two blinks
    gallopBurst();
    horse.classList.add('vanish');
    setTimeout(() => horse.classList.remove('vanish'), 1100);
  }

  /* ---------- click a cloud: the horse leaps and scratches it ---------- */
  function leapAndScratch(cloud, cx, cy) {
    if (horseInner.classList.contains('leap')) return;
    horseInner.classList.remove('stumble');
    horseInner.classList.add('leap');
    horseInner.addEventListener('animationend',
      () => horseInner.classList.remove('leap'), { once: true });

    const r = cloud.getBoundingClientRect();
    const mark = document.createElement('div');
    mark.className = 'scratch';
    mark.style.left = Math.max(0, cx - r.left - 18) + 'px';
    mark.style.top  = Math.max(0, cy - r.top - 14) + 'px';
    cloud.appendChild(mark);
    if (cloud.querySelectorAll('.scratch').length > 6) {
      cloud.querySelector('.scratch').remove();
    }
  }

  const allClouds = Array.from(document.querySelectorAll('.cloud'));
  allClouds.forEach(cloud => {
    cloud.addEventListener('click', e => leapAndScratch(cloud, e.clientX, e.clientY));
  });

  function scratchRandomCloud() {
    const visible = allClouds.filter(c => {
      const r = c.getBoundingClientRect();
      return r.right > 0 && r.left < W;
    });
    const pool = visible.length ? visible : allClouds;
    const cloud = pool[Math.floor(Math.random() * pool.length)];
    const r = cloud.getBoundingClientRect();
    leapAndScratch(cloud,
      r.left + r.width  * (0.3 + Math.random() * 0.4),
      r.top  + r.height * (0.3 + Math.random() * 0.4));
  }

  /* ---------- golden words in the poem command the horse ---------- */
  const wordActions = {
    breath:  () => breathe(5),
    cough:   cough,
    vanish:  vanish,
    stumble: triggerStumble,
    gallop:  gallopBurst,
    scratch: scratchRandomCloud
  };
  document.querySelectorAll('.word-action').forEach(w => {
    w.addEventListener('click', () => {
      const act = wordActions[w.dataset.act];
      if (act) act();
    });
  });

  /* ---------- click the sky: a shooting star ---------- */
  document.getElementById('scene').addEventListener('click', e => {
    if (REDUCED || e.target.closest('.cloud, #horse')) return;
    if (e.clientY > H * 0.55) return;          // only the sky, above the hill
    const m = document.createElement('div');
    m.className = 'meteor';
    m.style.left = e.clientX + 'px';
    m.style.top  = e.clientY + 'px';
    fx.appendChild(m);
    setTimeout(() => m.remove(), 1000);
  });

  /* ---------- stanza reveal on scroll ---------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        observer.unobserve(en.target);
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.stanza').forEach(s => observer.observe(s));

  /* ---------- click-to-advance hint ---------- */
  const hint = document.getElementById('next-hint');
  const sections = Array.from(document.querySelectorAll('#poem section'));
  hint.addEventListener('click', () => {
    const next = sections.find(s =>
      s.getBoundingClientRect().top > window.innerHeight * 0.4);
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    hint.classList.toggle('hidden', scrollProgress() > 0.96);
  }, { passive: true });

  /* ---------- final line: trembles, glows as the cursor nears ---------- */
  const finalLine = document.getElementById('final-line');
  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
  }, { passive: true });

  function updateGlow() {
    if (steadied) return;
    const r = finalLine.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const d = Math.hypot(mouseX - cx, mouseY - cy);
    const g = Math.max(0, Math.min(1, 1 - d / 340));
    finalLine.style.setProperty('--g', g.toFixed(3));
  }

  /* click the line: it steadies, the horse rears — and does not fall */
  let steadied = false;
  finalLine.addEventListener('click', () => {
    steadied = true;
    finalLine.classList.add('steady');
    finalLine.style.setProperty('--g', '1');
    playOnce('rear');
    breathe(3);
    sparkBurst(finalLine);
  });

  function sparkBurst(el) {
    if (REDUCED) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.style.left = (r.left + Math.random() * r.width) + 'px';
      s.style.top  = (r.top + Math.random() * r.height) + 'px';
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 70;
      s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d - 30).toFixed(0) + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  /* ---------- soft wind sound (WebAudio, no asset) ---------- */
  const windBtn = document.getElementById('wind-toggle');
  let audioCtx = null, windOn = false;

  function buildWind() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const len = audioCtx.sampleRate * 3;
    const buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {            // brown noise
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.6;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.05;

    const lfo = audioCtx.createOscillator();   // slow gusts
    lfo.frequency.value = 0.07;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.028;
    lfo.connect(lfoGain).connect(gain.gain);

    src.connect(filter).connect(gain).connect(audioCtx.destination);
    src.start();
    lfo.start();
  }

  windBtn.addEventListener('click', () => {
    if (!audioCtx) buildWind();
    windOn = !windOn;
    if (windOn) audioCtx.resume(); else audioCtx.suspend();
    windBtn.classList.toggle('on', windOn);
    windBtn.setAttribute('aria-pressed', String(windOn));
  });
})();
