(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Nav: glass background on scroll + active link
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Scroll reveal with stagger among siblings
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i * 0.08, 0.5)}s`);
  });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          el.classList.add('is-visible');
          io.unobserve(el);
          // Once revealed, drop the stagger delay so hover feels instant
          setTimeout(() => el.classList.add('settled'), 1400);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = el => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1600, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  // Rotating hero phrase
  const rotator = document.getElementById('rotator');
  const phrases = ['strike like lightning.', 'load in a flash.', 'turn visitors into clients.', 'grow your business.'];
  if (!reduceMotion) {
    let idx = 0;
    setInterval(() => {
      rotator.classList.add('out');
      setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        rotator.textContent = phrases[idx];
        rotator.classList.remove('out');
      }, 400);
    }, 3200);
  }

  // Pointer effects: cursor glow, card spotlight, hero tilt
  if (finePointer && !reduceMotion) {
    const root = document.documentElement;
    window.addEventListener('pointermove', e => {
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });

    const visual = document.querySelector('.hero-visual');
    const tilt = document.querySelector('.tilt');
    visual.addEventListener('pointermove', e => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotateY(${-10 + x * 14}deg) rotateX(${6 - y * 12}deg)`;
    });
    visual.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  }

  // Portfolio filter
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.work-card');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => { c.classList.toggle('active', c === chip); c.setAttribute('aria-selected', String(c === chip)); });
    const f = chip.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hide', !show);
      if (show) card.classList.add('is-visible');
    });
  }));

  // Contact form validation (front-end only — connect to your backend or a form service)
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
  form.querySelectorAll('input, textarea').forEach(i => i.addEventListener('blur', () => validate(i)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll('input, textarea')];
    const results = inputs.map(validate);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.firstChild.textContent = 'Sending… ';
    // TODO: replace this timeout with a real request (e.g. fetch to Formspree or your API).
    setTimeout(() => {
      btn.disabled = false;
      btn.firstChild.textContent = 'Send message ';
      status.textContent = "Thanks! We'll get back to you within one business day.";
      form.reset();
    }, 900);
  });
})();
