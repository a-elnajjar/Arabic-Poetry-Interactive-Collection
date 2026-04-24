(() => {
  // Prevent double-tap zoom on touch devices while keeping normal scrolling.
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd < 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // ============ CUSTOM CURSOR ============
  const cursor = document.getElementById('cursor');
  if (cursor) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('button, .stanza, a, .line').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ============ STANZA REVEAL ============
  const revealTargets = document.querySelectorAll('[data-stanza]');
  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    document.body.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  // ============ LANGUAGE TOGGLE ============
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const langButtons = langToggle.querySelectorAll('button');

    langButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        langButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        langToggle.classList.remove('ar', 'en');
        langToggle.classList.add(lang);

        document.body.classList.add('switching');
        setTimeout(() => {
          document.body.classList.remove('lang-ar', 'lang-en');
          document.body.classList.add('lang-' + lang);
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
          setTimeout(() => document.body.classList.remove('switching'), 50);
        }, 300);
      });
    });
  }
})();
