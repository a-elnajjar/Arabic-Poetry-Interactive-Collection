(function () {
  'use strict';

  const canvas = document.getElementById('vfx-canvas');
  const ctx = canvas.getContext('2d');

  let W, H;
  let leaves = [];
  let embers = [];
  let stalks = [];
  let touchRipples = [];
  let scrollDust = [];
  let t = 0;
  let scrollVelocity = 0;
  let lastScrollY = 0;

  // ====================================================
  // RESIZE + WHEAT STALKS
  // ====================================================
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStalks();
  }

  function buildStalks() {
    stalks = [];

    // Three depth layers: back (dark, small), mid, front (bright, tall)
    const layers = [
      {
        count: Math.ceil(W / 22),
        yBaseFrac: 0.985,
        heightMin: 14, heightMax: 26,
        swayBase: 0.003, swayRange: 0.005,
        swayAmtBase: 1, swayAmtRange: 2,
        thickness: [0.5, 0.9],
        stemRgb: '72,44,8',
        headRgb: '82,52,10',
        alpha: 0.32,
      },
      {
        count: Math.ceil(W / 16),
        yBaseFrac: 0.970,
        heightMin: 26, heightMax: 44,
        swayBase: 0.007, swayRange: 0.007,
        swayAmtBase: 2, swayAmtRange: 3,
        thickness: [0.7, 1.2],
        stemRgb: '118,76,16',
        headRgb: '138,90,20',
        alpha: 0.55,
      },
      {
        count: Math.ceil(W / 19),
        yBaseFrac: 0.950,
        heightMin: 40, heightMax: 62,
        swayBase: 0.013, swayRange: 0.010,
        swayAmtBase: 3.5, swayAmtRange: 4,
        thickness: [0.9, 1.6],
        stemRgb: '178,120,26',
        headRgb: '212,148,32',
        alpha: 0.78,
      },
    ];

    for (const layer of layers) {
      for (let i = 0; i < layer.count; i++) {
        const xFrac = (i + 0.1 + Math.random() * 0.8) / layer.count;
        stalks.push({
          x: xFrac * W * 1.06 - W * 0.03 + (Math.random() - 0.5) * 16,
          baseY: H * layer.yBaseFrac + (Math.random() - 0.5) * H * 0.018,
          height: layer.heightMin + Math.random() * (layer.heightMax - layer.heightMin),
          thickness: layer.thickness[0] + Math.random() * (layer.thickness[1] - layer.thickness[0]),
          swaySpeed: layer.swayBase + Math.random() * layer.swayRange,
          swayAmt: layer.swayAmtBase + Math.random() * layer.swayAmtRange,
          swayOffset: Math.random() * Math.PI * 2,
          stemRgb: layer.stemRgb,
          headRgb: layer.headRgb,
          alpha: layer.alpha * (0.65 + Math.random() * 0.35),
        });
      }
    }
  }

  // ====================================================
  // OLIVE LEAVES
  // ====================================================
  function newLeaf(scatterY) {
    const g = 80 + Math.floor(Math.random() * 60);
    const r = 48 + Math.floor(Math.random() * 38);
    const b = 22 + Math.floor(Math.random() * 24);
    return {
      x: Math.random() * W,
      y: scatterY !== undefined ? scatterY : -25,
      size: 6 + Math.random() * 10,
      aspect: 0.28 + Math.random() * 0.16,
      speed: 0.3 + Math.random() * 0.65,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.024,
      swayAmt: 0.25 + Math.random() * 0.55,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.009,
      r, g, b,
      alpha: 0.4 + Math.random() * 0.45,
    };
  }

  // ====================================================
  // EMBERS
  // ====================================================
  function newEmber() {
    const r = 195 + Math.floor(Math.random() * 60);
    const g = 65 + Math.floor(Math.random() * 110);
    return {
      x: Math.random() * W,
      y: H + 5,
      size: 0.9 + Math.random() * 2.2,
      speedY: 0.22 + Math.random() * 0.7,
      driftX: (Math.random() - 0.5) * 0.45,
      life: 0,
      maxLife: 150 + Math.floor(Math.random() * 210),
      r, g,
    };
  }

  // ====================================================
  // INIT PARTICLES
  // ====================================================
  function init() {
    // Scatter leaves across the full screen at start
    leaves = Array.from({ length: 28 }, () => newLeaf(Math.random() * H * 0.85));

    // Scatter embers already mid-flight at start
    embers = Array.from({ length: 55 }, () => {
      const e = newEmber();
      e.y = H * 0.72 + Math.random() * H * 0.28;
      e.life = Math.floor(Math.random() * e.maxLife);
      return e;
    });
  }

  // ====================================================
  // DRAW: SOIL GRADIENT STRIP
  // ====================================================
  function drawSoil() {
    const grad = ctx.createLinearGradient(0, H * 0.78, 0, H);
    grad.addColorStop(0, 'rgba(28, 14, 4, 0)');
    grad.addColorStop(0.38, 'rgba(32, 16, 4, 0.52)');
    grad.addColorStop(1, 'rgba(18, 9, 2, 0.94)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * 0.78, W, H * 0.22);
  }

  // ====================================================
  // DRAW: WHEAT STALKS
  // ====================================================
  function drawStalks() {
    for (const s of stalks) {
      const sway = Math.sin(t * s.swaySpeed + s.swayOffset) * s.swayAmt;
      const topX = s.x + sway;
      const topY = s.baseY - s.height;

      // Curved stem (quadratic bezier)
      ctx.beginPath();
      ctx.moveTo(s.x, s.baseY);
      ctx.quadraticCurveTo(s.x + sway * 0.45, (s.baseY + topY) * 0.5, topX, topY);
      ctx.strokeStyle = `rgba(${s.stemRgb},${s.alpha})`;
      ctx.lineWidth = s.thickness;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Grain head — elongated ellipse at stalk tip
      const grainH = s.height * 0.23 + 3;
      ctx.save();
      ctx.translate(topX, topY - grainH * 0.35);
      ctx.rotate(sway * 0.035);
      ctx.beginPath();
      ctx.ellipse(0, 0, s.thickness * 2.4, grainH, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.headRgb},${s.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // ====================================================
  // DRAW: FALLING OLIVE LEAVES
  // ====================================================
  function drawLeaves() {
    for (const l of leaves) {
      l.y += l.speed;
      l.x += Math.sin(t * l.swaySpeed + l.swayOffset) * l.swayAmt;
      l.angle += l.rotSpeed;

      if (l.y > H + 35) Object.assign(l, newLeaf());

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);

      // Leaf body
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size * l.aspect, l.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${l.r},${l.g},${l.b},${l.alpha})`;
      ctx.fill();

      // Midrib vein
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 0.9);
      ctx.lineTo(0, l.size * 0.9);
      ctx.strokeStyle = `rgba(24,48,12,${l.alpha * 0.55})`;
      ctx.lineWidth = 0.45;
      ctx.stroke();

      ctx.restore();
    }
  }

  // ====================================================
  // DRAW: RISING EMBERS
  // ====================================================
  function drawEmbers() {
    for (const e of embers) {
      e.y -= e.speedY;
      e.x += e.driftX;
      e.life++;

      // Respawn when off-screen or life expired
      if (e.life > e.maxLife || e.y < H * 0.25) {
        Object.assign(e, newEmber());
        e.y = H * 0.80 + Math.random() * H * 0.16;
        e.life = 0;
      }

      const progress = e.life / e.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.62;
      const radius = e.size * (1 - progress * 0.45);

      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${e.r},${e.g},0,${alpha * 0.35})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${e.r},${e.g},12,${alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // ====================================================
  // TOUCH RIPPLES
  // ====================================================
  function addTouchRipple(x, y) {
    touchRipples.push({ x, y, life: 0, maxLife: 55, maxRadius: 48 + Math.random() * 28 });

    // Burst a few leaves from touch point
    for (let i = 0; i < 3; i++) {
      const l = newLeaf();
      l.x = x + (Math.random() - 0.5) * 60;
      l.y = y + (Math.random() - 0.5) * 30;
      l.speed *= 1.8;
      leaves.push(l);
    }
    if (leaves.length > 44) leaves.length = 44;

    // Burst an ember from touch point
    const e = newEmber();
    e.x = x + (Math.random() - 0.5) * 40;
    e.y = y;
    e.speedY = 0.8 + Math.random() * 1.5;
    embers.push(e);
    if (embers.length > 68) embers.length = 68;
  }

  function drawTouchRipples() {
    for (let i = touchRipples.length - 1; i >= 0; i--) {
      const r = touchRipples[i];
      r.life++;
      if (r.life >= r.maxLife) { touchRipples.splice(i, 1); continue; }

      const progress = r.life / r.maxLife;
      const radius = 4 + progress * r.maxRadius;
      const alpha = (1 - progress) * 0.7;

      ctx.save();

      // Outer expanding ring
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,162,39,${alpha})`;
      ctx.lineWidth = 1.8 * (1 - progress * 0.6);
      ctx.stroke();

      // Second inner ring, offset in time
      if (progress > 0.15) {
        const r2 = radius * 0.55;
        const a2 = (1 - progress) * 0.35;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,172,46,${a2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Centre glow that fades fast
      if (progress < 0.25) {
        const glowAlpha = (1 - progress / 0.25) * 0.9;
        const glow = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 12);
        glow.addColorStop(0, `rgba(212,172,46,${glowAlpha})`);
        glow.addColorStop(1, 'rgba(212,172,46,0)');
        ctx.beginPath();
        ctx.arc(r.x, r.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // ====================================================
  // SCROLL DUST
  // ====================================================
  function addScrollDust(count) {
    for (let i = 0; i < count; i++) {
      scrollDust.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 0.8 + Math.random() * 1.8,
        speedX: (Math.random() - 0.5) * 1.8,
        speedY: -0.6 - Math.random() * 1.6,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 22),
        r: 195 + Math.floor(Math.random() * 20),
        g: 150 + Math.floor(Math.random() * 25),
      });
    }
    if (scrollDust.length > 80) scrollDust.length = 80;
  }

  function drawScrollDust() {
    for (let i = scrollDust.length - 1; i >= 0; i--) {
      const p = scrollDust[i];
      p.life++;
      if (p.life >= p.maxLife) { scrollDust.splice(i, 1); continue; }
      p.x += p.speedX;
      p.y += p.speedY;

      const progress = p.life / p.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.55;

      ctx.save();
      ctx.shadowBlur = 5;
      ctx.shadowColor = `rgba(${p.r},${p.g},30,${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r},${p.g},30,${alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // ====================================================
  // PARALLAX SHIMMER — subtle horizontal grain texture
  // ====================================================
  let shimmerOffset = 0;

  function drawShimmer() {
    shimmerOffset = (shimmerOffset + 0.18) % (W * 2);
    const grad = ctx.createLinearGradient(shimmerOffset - W, 0, shimmerOffset, H * 0.6);
    grad.addColorStop(0, 'rgba(201,162,39,0)');
    grad.addColorStop(0.5, 'rgba(201,162,39,0.013)');
    grad.addColorStop(1, 'rgba(201,162,39,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H * 0.6);
  }

  // ====================================================
  // ANIMATION LOOP
  // ====================================================
  function animate() {
    ctx.clearRect(0, 0, W, H);
    t++;

    // Decay scroll velocity each frame
    scrollVelocity *= 0.88;

    drawShimmer();
    drawSoil();
    drawEmbers();
    drawStalks();
    drawLeaves();
    drawScrollDust();
    drawTouchRipples();

    requestAnimationFrame(animate);
  }

  // ====================================================
  // BOOT
  // ====================================================
  window.addEventListener('resize', resize);

  // Touch ripples
  window.addEventListener('touchstart', (e) => {
    for (const touch of e.changedTouches) {
      addTouchRipple(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    for (const touch of e.changedTouches) {
      if (Math.random() < 0.25) addTouchRipple(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  // Scroll dust
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const delta = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;
    scrollVelocity = delta;
    const dustCount = Math.min(Math.floor(delta / 12), 6);
    if (dustCount > 0) addScrollDust(dustCount);
  }, { passive: true });

  resize();
  init();
  animate();
})();
