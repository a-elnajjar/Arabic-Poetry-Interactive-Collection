(() => {
  // ============ FALLING LIGHT ============
  const rain = document.getElementById('rain');
  for (let i = 0; i < 60; i++) {
    const drop = document.createElement('span');
    drop.style.left = Math.random() * 100 + '%';
    drop.style.height = (30 + Math.random() * 80) + 'px';
    drop.style.animationDuration = (3 + Math.random() * 5) + 's';
    drop.style.animationDelay = -(Math.random() * 5) + 's';
    drop.style.opacity = 0.3 + Math.random() * 0.5;
    rain.appendChild(drop);
  }

  // ============ CURSOR TRAIL ============
  let lastTrailTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 60) {
      lastTrailTime = now;
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.background = Math.random() > 0.5 ? '#5fb8b8' : '#c9a861';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 1200);
    }
  });

  // ============ CLICK RIPPLE ============
  document.addEventListener('click', (e) => {
    if (e.target.closest('.sound-toggle')) return;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1400);
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

  // ============ CONSTELLATION TRAIL ============
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
    if (Math.random() > 0.85) {
      stars.push({
        x: e.clientX + (Math.random() - 0.5) * 40,
        y: e.clientY + (Math.random() - 0.5) * 40,
        r: 0.5 + Math.random() * 1.5,
        life: 1,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    if (stars.length > 80) stars.shift();
  });

  function drawConstellation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.life -= 0.003;
      s.twinkle += 0.05;
      const alpha = Math.max(0, s.life) * (0.6 + Math.sin(s.twinkle) * 0.4);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 223, 208, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 97, ${alpha * 0.15})`;
      ctx.fill();
    });
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i], b = stars[j];
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
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
    stars = stars.filter((s) => s.life > 0);
    requestAnimationFrame(drawConstellation);
  }
  drawConstellation();

  // ============ AMBIENT SEA SOUND ============
  const soundBtn = document.getElementById('soundToggle');
  let seaNodes = null;
  let playing = false;

  function createSeaSound() {
    const soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * soundCtx.sampleRate;
    const noiseBuffer = soundCtx.createBuffer(1, bufferSize, soundCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = soundCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = soundCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    const lfo = soundCtx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = soundCtx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

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
})();
