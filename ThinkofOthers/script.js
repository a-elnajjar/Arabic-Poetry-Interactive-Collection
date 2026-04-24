(() => {
  // ============ CONSTELLATION CANVAS — static twinkling starfield ============
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
})();
