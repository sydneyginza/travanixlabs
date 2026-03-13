/* ========================================
   Travanix Labs — Main JS
   Enhanced with sci-fi / Arknights: Endfield aesthetic
   ======================================== */

// --- Enhanced Particle Network Background ---
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse, tick = 0;

  const config = {
    particleCount: 90,
    maxDist: 160,
    speed: 0.35,
    sizeMin: 1.2,
    sizeMax: 3.5,
    goldRatio: 0.15, // 15% of particles are gold
    cyan: { r: 0, g: 229, b: 255 },
    gold: { r: 255, g: 181, b: 71 },
  };

  mouse = { x: null, y: null, radius: 200 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      const isGold = Math.random() < config.goldRatio;
      const col = isGold ? config.gold : config.cyan;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * (config.sizeMax - config.sizeMin) + config.sizeMin,
        color: col,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    tick += 0.02;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse interaction — stronger push
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += dx * force * 0.04;
          p.y += dy * force * 0.04;
        }
      }

      // Pulsing glow
      const pulse = 0.5 + 0.5 * Math.sin(tick * 2 + p.pulseOffset);
      const baseAlpha = 0.45 + pulse * 0.35;
      const glowRadius = p.size + pulse * 2;
      const { r, g, b } = p.color;

      // Outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowRadius + 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha * 0.15})`;
      ctx.fill();

      // Core particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.maxDist) {
          const opacity = (1 - dist / config.maxDist) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,229,255,${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  drawParticles();
})();

// --- Hex Grid / Dot Matrix Background ---
(function () {
  const sections = document.querySelectorAll('.services, .work, .about, .contact');
  if (!sections.length) return;

  // Create a single background canvas that covers the whole page below the home section
  const bgCanvas = document.createElement('canvas');
  bgCanvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.08;';
  document.body.insertBefore(bgCanvas, document.body.firstChild);

  const ctx = bgCanvas.getContext('2d');
  let w, h, animFrame;
  let offset = 0;

  function resizeBg() {
    w = bgCanvas.width = window.innerWidth;
    h = bgCanvas.height = window.innerHeight;
  }

  function drawHexGrid() {
    ctx.clearRect(0, 0, w, h);
    const spacing = 40;
    const dotSize = 1;
    const rows = Math.ceil(h / (spacing * 0.866)) + 2;
    const cols = Math.ceil(w / spacing) + 2;

    ctx.fillStyle = '#00e5ff';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xOff = row % 2 === 0 ? 0 : spacing / 2;
        const x = col * spacing + xOff;
        const y = row * spacing * 0.866 + ((offset * 0.3) % spacing);

        // Subtle pulsing per dot based on position
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin(offset * 0.015 + x * 0.005 + y * 0.005));

        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    offset++;
    animFrame = requestAnimationFrame(drawHexGrid);
  }

  window.addEventListener('resize', resizeBg);
  resizeBg();
  drawHexGrid();
})();

// --- Glitch Text Effect on Home Title ---
(function () {
  const title = document.querySelector('.home__title');
  if (!title) return;

  // Add glitch-active class briefly on load for CSS-driven distortion
  title.classList.add('glitch-active');
  setTimeout(() => {
    title.classList.remove('glitch-active');
  }, 1200);
})();

// --- Scan Line Animation ---
(function () {
  const home= document.getElementById('home');
  if (!home) return;

  const scanline = document.createElement('div');
  scanline.className = 'home__scanline';
  home.appendChild(scanline);

  // Inject scanline CSS
  const style = document.createElement('style');
  style.textContent = `
    .home__scanline {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.4) 20%, rgba(0,229,255,0.7) 50%, rgba(0,229,255,0.4) 80%, transparent 100%);
      pointer-events: none;
      z-index: 3;
      opacity: 0;
      animation: scanMove 4s ease-in-out infinite;
    }
    @keyframes scanMove {
      0%   { top: -2px; opacity: 0; }
      5%   { opacity: 1; }
      95%  { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    /* Glitch effect styles */
    .glitch-active {
      animation: glitchText 0.3s steps(2, end) 4;
    }
    @keyframes glitchText {
      0%   { text-shadow: 2px 0 #00e5ff, -2px 0 #ffb547; transform: translate(0); }
      25%  { text-shadow: -2px 0 #00e5ff, 2px 0 #ffb547; transform: translate(-1px, 1px); }
      50%  { text-shadow: 1px 0 #ffb547, -1px 0 #00e5ff; transform: translate(1px, -1px); }
      75%  { text-shadow: -1px 0 #ffb547, 1px 0 #00e5ff; transform: translate(-1px, 0); }
      100% { text-shadow: none; transform: translate(0); }
    }
  `;
  document.head.appendChild(style);
})();

// --- Parallax-Lite on Home Content ---
(function () {
  const homeContent = document.querySelector('.home__content');
  const home= document.getElementById('home');
  if (!homeContent || !home) return;

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  const maxShift = 8; // px

  home.addEventListener('mousemove', (e) => {
    const rect = home.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    targetX = ((mx - cx) / cx) * maxShift;
    targetY = ((my - cy) / cy) * maxShift;
  });

  home.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    homeContent.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
    requestAnimationFrame(animate);
  }

  animate();
})();

// --- Floating HUD Parallax ---
(function () {
  const home = document.getElementById('home');
  const floats = document.querySelectorAll('.hud-float');
  if (!home || !floats.length) return;

  const state = Array.from(floats).map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0.3,
    cx: 0,
    cy: 0,
    tx: 0,
    ty: 0,
  }));

  home.addEventListener('mousemove', (e) => {
    const rect = home.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;
    state.forEach((s) => {
      s.tx = mx * s.speed * 60;
      s.ty = my * s.speed * 60;
    });
  });

  home.addEventListener('mouseleave', () => {
    state.forEach((s) => { s.tx = 0; s.ty = 0; });
  });

  function animate() {
    state.forEach((s) => {
      s.cx += (s.tx - s.cx) * 0.06;
      s.cy += (s.ty - s.cy) * 0.06;
      s.el.style.transform = `translate(${s.cx.toFixed(1)}px, ${s.cy.toFixed(1)}px)`;
    });
    requestAnimationFrame(animate);
  }

  animate();
})();

// --- Sidebar active link tracking ---
(function () {
  const sidebarLinks = document.querySelectorAll('.sidebar__link[href^="#"]');
  const sections = [];

  sidebarLinks.forEach((link) => {
    const id = link.getAttribute('href').substring(1);
    const section = document.getElementById(id);
    if (section) sections.push({ el: section, link: link });
  });

  function updateActive() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let current = sections[0];

    for (const s of sections) {
      if (scrollY >= s.el.offsetTop) {
        current = s;
      }
    }

    sidebarLinks.forEach((l) => l.classList.remove('sidebar__link--active'));
    if (current) current.link.classList.add('sidebar__link--active');
  }

  window.addEventListener('scroll', updateActive);
  updateActive();
})();

// --- Mobile nav toggle ---
(function () {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('nav__toggle--active');
    menu.classList.toggle('mobile-menu--open');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('nav__toggle--active');
      menu.classList.remove('mobile-menu--open');
    });
  });
})();

// --- Scroll reveal with staggered children ---
(function () {
  const revealElements = document.querySelectorAll(
    '.service-card, .work-card, .about__pillar, .contact__info, .contact__form'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  // Stagger: inject per-element transition-delay for sibling groups
  const staggerGroups = document.querySelectorAll(
    '.services__grid, .work__grid, .footer__grid'
  );
  staggerGroups.forEach((group) => {
    const children = group.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.add('reveal');
      children[i].style.transitionDelay = `${i * 0.1}s`;
    }
  });

  // Also stagger footer columns
  const footerCols = document.querySelectorAll('.footer__brand, .footer__col');
  footerCols.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  // Observe all reveal elements (including newly added ones)
  const allReveal = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  allReveal.forEach((el) => observer.observe(el));
})();

// --- Counter Animation for About Stats ---
(function () {
  const stats = document.querySelectorAll('.stat__number');
  if (!stats.length) return;

  let animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;

    stats.forEach((el) => {
      const text = el.textContent.trim(); // e.g. "50+"
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;

      const target = parseInt(match[1], 10);
      const suffix = match[2]; // e.g. "+"
      const duration = 1500; // ms
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const aboutStats = document.querySelector('.about__stats');
  if (aboutStats) {
    observer.observe(aboutStats);
  }
})();

// --- Iframe preview scaling ---
(function () {
  const wrap = document.querySelector('.work-card__iframe-wrap');
  if (!wrap) return;
  const iframe = wrap.querySelector('iframe');
  const iframeW = 1440;

  function scale() {
    const cardW = wrap.offsetWidth;
    iframe.style.transform = 'scale(' + (cardW / iframeW) + ')';
  }

  scale();
  window.addEventListener('resize', scale);
})();

// --- Back to Top button ---
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      btn.classList.add('back-to-top--visible');
    } else {
      btn.classList.remove('back-to-top--visible');
    }
  });
})();

// --- Contact form ---
(function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;
    status.textContent = '';
    status.className = 'form__status';

    try {
      const res = await fetch('https://api.travanixlabs.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        status.textContent = 'Message sent! We\'ll get back to you soon.';
        status.classList.add('form__status--success');
        form.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch {
      status.textContent = 'Something went wrong. Please email us directly.';
      status.classList.add('form__status--error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
})();
