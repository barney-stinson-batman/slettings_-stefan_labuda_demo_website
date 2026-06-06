document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 1200));
    setTimeout(() => preloader.classList.add('done'), 2400);
  }

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');
  let backdrop = null;

  const closeMenu = () => {
    burger && burger.classList.remove('open');
    links  && links.classList.remove('open');
    document.body.style.overflow = '';
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
      backdrop = null;
    }
  };

  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = links.classList.contains('open');
      if (!isOpen) {
        burger.classList.add('open');
        links.classList.add('open');
        document.body.style.overflow = 'hidden';
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.addEventListener('click', closeMenu);
        document.body.appendChild(backdrop);
      } else {
        closeMenu();
      }
    });

    links.querySelectorAll('.nl').forEach(l => {
      l.addEventListener('click', closeMenu);
    });
  }

  document.querySelectorAll(
    '.path-card, .wp, .svc-card, .ha-card, .lls-card, .llb-card, ' +
    '.tic-card, .tr-item, .add-card, .ps-step, .af-item, ' +
    '.sd-header, .sd-description, .sd-includes, .svc-detail, ' +
    '.ll-intro, .tenant-intro, .process-section, .ll-benefits, ' +
    '.tenant-requirements, .area-text, .sec-head'
  ).forEach((el, i) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-right')) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    }
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => obs.observe(el));

  const statusEl = document.getElementById('openStatus');
  if (statusEl) {
    const now  = new Date();
    const day  = now.getDay();
    const h    = now.getHours() + now.getMinutes() / 60;
    const open = day >= 1 && day <= 5 && h >= 12.5 && h < 17.5;

    if (open) {
      statusEl.textContent = '● Open Now';
      statusEl.style.cssText = 'color:#1A6B35;background:#E8F5EE;padding:8px 14px;border-radius:8px;font-size:0.8rem;font-weight:600;display:inline-block;margin-top:12px';
    } else if (day === 0 || day === 6) {
      statusEl.textContent = '● Closed — Reopens Monday at 12:30pm';
      statusEl.style.cssText = 'color:#C0392B;background:#FDECEA;padding:8px 14px;border-radius:8px;font-size:0.8rem;font-weight:600;display:inline-block;margin-top:12px';
    } else if (h < 12.5) {
      statusEl.textContent = '● Opens today at 12:30pm';
      statusEl.style.cssText = 'color:#B8630A;background:#FEF3E6;padding:8px 14px;border-radius:8px;font-size:0.8rem;font-weight:600;display:inline-block;margin-top:12px';
    } else {
      statusEl.textContent = '● Closed — Opens tomorrow at 12:30pm';
      statusEl.style.cssText = 'color:#C0392B;background:#FDECEA;padding:8px 14px;border-radius:8px;font-size:0.8rem;font-weight:600;display:inline-block;margin-top:12px';
    }
  }

  const form = document.getElementById('contactForm');
  if (form) {
    const f     = (id) => document.getElementById(id);
    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const err   = (el, msg) => { if (el) el.textContent = msg; };
    const clr   = (el)      => { if (el) el.textContent = ''; };

    f('f-name')  && f('f-name').addEventListener('blur',  () => f('f-name').value.trim().length < 2  ? err(f('nameErr'),  'Please enter your name')  : clr(f('nameErr')));
    f('f-email') && f('f-email').addEventListener('blur', () => !isEmail(f('f-email').value.trim())   ? err(f('emailErr'), 'Valid email required')     : clr(f('emailErr')));
    f('f-msg')   && f('f-msg').addEventListener('blur',   () => f('f-msg').value.trim().length < 5   ? err(f('msgErr'),   'Please enter a message')   : clr(f('msgErr')));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      if (!f('f-name')  || f('f-name').value.trim().length < 2)  { err(f('nameErr'),  'Please enter your name');  ok = false; } else clr(f('nameErr'));
      if (!f('f-email') || !isEmail(f('f-email').value.trim()))   { err(f('emailErr'), 'Valid email required');    ok = false; } else clr(f('emailErr'));
      if (!f('f-msg')   || f('f-msg').value.trim().length < 5)    { err(f('msgErr'),   'Please enter a message'); ok = false; } else clr(f('msgErr'));
      if (!ok) return;

      const btn = f('submitBtn');
      if (f('btnTxt'))  f('btnTxt').style.display  = 'none';
      if (f('btnLoad')) f('btnLoad').style.display = 'inline';
      if (btn) btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        const s = f('formSuccess');
        if (s) { s.style.display = 'block'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }, 1400);
    });
  }

  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });

});
