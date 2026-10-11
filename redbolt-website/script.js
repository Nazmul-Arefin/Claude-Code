(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const root = document.documentElement;

  document.getElementById('year').textContent = new Date().getFullYear();

  // Intro: reveal hero once fonts are ready (with a safety timeout)
  const ready = () => root.classList.add('is-loaded');
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 700))]).then(() => requestAnimationFrame(ready));

  /* ---------- Nav: hide on scroll down, show on scroll up ---------- */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;

  /* ---------- Active link spy ---------- */
  const navAnchors = [...document.querySelectorAll('.nav-pill a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) navAnchors.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navAnchors.forEach(a => { const s = document.querySelector(a.hash); if (s) spy.observe(s); });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('open'));
    } else {
      menu.classList.remove('open');
      setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 400);
    }
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  /* ---------- Rotating hero phrase ---------- */
  const rotator = document.getElementById('rotator');
  const phrases = ['strike like lightning.', 'load in a flash.', 'scale with you.', 'people remember.'];
  if (!reduceMotion) {
    let i = 0;
    setInterval(() => {
      rotator.classList.add('out');
      setTimeout(() => {
        i = (i + 1) % phrases.length;
        rotator.textContent = phrases[i];
        rotator.classList.remove('out');
        rotator.classList.add('in');
        requestAnimationFrame(() => requestAnimationFrame(() => rotator.classList.remove('in')));
      }, 450);
    }, 3400);
  }

  /* ---------- Scroll reveals ---------- */
  document.querySelectorAll('.svc').forEach(el => el.classList.add('reveal-row'));
  const revealEls = document.querySelectorAll('.reveal-title, .svc, .prod');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sibs = [...el.parentElement.children];
      el.style.transitionDelay = el.matches('.svc, .prod') ? `${Math.min(sibs.indexOf(el) * 0.07, 0.35)}s` : '';
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(() => { el.style.transitionDelay = ''; }, 1500);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => reduceMotion ? el.classList.add('in') : io.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
      countIO.unobserve(el);
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const start = performance.now(), dur = 1400;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Statement: word-by-word highlight ---------- */
  const statement = document.querySelector('[data-words]');
  const words = [];
  if (statement) {
    const text = statement.textContent.trim().replace(/\s+/g, ' ');
    statement.setAttribute('aria-label', text);
    statement.textContent = '';
    text.split(' ').forEach((w, i, arr) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      statement.appendChild(s);
      if (i < arr.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(s);
    });
  }

  /* ---------- Horizontal work scroller ---------- */
  const work = document.querySelector('.work');
  const track = document.getElementById('workTrack');
  const desktopMQ = window.matchMedia('(min-width: 901px)');
  let workDistance = 0;
  const sizeWork = () => {
    if (!desktopMQ.matches || reduceMotion) { work.style.height = ''; track.style.transform = ''; workDistance = 0; return; }
    workDistance = Math.max(track.scrollWidth - window.innerWidth, 0);
    work.style.height = `${window.innerHeight + workDistance}px`;
  };

  /* ---------- Showcase scale on scroll ---------- */
  const showcase = document.getElementById('showcase');

  /* ---------- Single rAF-throttled scroll handler ---------- */
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY, vh = window.innerHeight;

    if (!menuBtn.matches('[aria-expanded="true"]')) nav.classList.toggle('hidden', y > lastY && y > 400);
    lastY = y;

    if (!reduceMotion) {
      const r = showcase.getBoundingClientRect();
      showcase.style.setProperty('--p', clamp(1 - (r.top - 80) / (vh * 0.6), 0, 1).toFixed(3));

      if (statement) {
        const sr = statement.getBoundingClientRect();
        const p = clamp((vh * 0.85 - sr.top) / (sr.height + vh * 0.35), 0, 1);
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      }

      if (workDistance) {
        const wr = work.getBoundingClientRect();
        const p = clamp(-wr.top / (work.offsetHeight - vh), 0, 1);
        track.style.transform = `translate3d(${-p * workDistance}px,0,0)`;
      }
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', () => { sizeWork(); onScroll(); });
  window.addEventListener('load', () => { sizeWork(); onScroll(); });
  if (reduceMotion) words.forEach(w => w.classList.add('on'));
  sizeWork(); onScroll();

  /* ---------- Pointer-only effects ---------- */
  if (finePointer && !reduceMotion) {
    // Cursor follower
    const cursor = document.querySelector('.cursor');
    let cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', e => {
      const view = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, summary, label');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !view && !!link);
    });

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.25}px`);
        btn.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.35}px`);
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--mx', '0px'); btn.style.setProperty('--my', '0px'); });
    });

    // Showcase parallax
    const layers = showcase.querySelectorAll('[data-depth]');
    showcase.addEventListener('pointermove', e => {
      const r = showcase.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(l => { const d = +l.dataset.depth; l.style.transform = `translate3d(${x * d * 30}px, ${y * d * 24}px, 0)`; });
    });
    showcase.addEventListener('pointerleave', () => layers.forEach(l => { l.style.transform = ''; }));

    // Product card tilt
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`);
        card.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 6}deg`);
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const status = form.querySelector('.form-status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    message: v => v.trim().length >= 10 || 'Tell us a little more (at least 10 characters).',
  };
  const validate = input => {
    const rule = rules[input.name];
    if (!rule) return true;
    const res = rule(input.value);
    const field = input.closest('.field');
    field.classList.toggle('invalid', res !== true);
    field.querySelector('.error').textContent = res === true ? '' : res;
    input.setAttribute('aria-invalid', String(res !== true));
    return res === true;
  };
  const fields = [...form.querySelectorAll('#name, #email, #message')];
  fields.forEach(i => i.addEventListener('blur', () => validate(i)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const results = fields.map(validate);
    if (results.includes(false)) { fields[results.indexOf(false)].focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('span');
    btn.disabled = true;
    label.textContent = 'Sending…';
    // TODO: replace this timeout with a real request (e.g. fetch to Formspree or your own API).
    setTimeout(() => {
      btn.disabled = false;
      label.textContent = 'Send message';
      status.textContent = "Thanks! We'll get back to you within one business day.";
      form.reset();
    }, 900);
  });
})();
