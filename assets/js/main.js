/* ==========================================================================
   Nur Azizan Hakiman bin Mohd Yusoff — CV / portfolio site
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ 1. theme */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const stored = (function () {
    try { return localStorage.getItem('na-theme'); } catch (e) { return null; }
  })();

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('na-theme', theme); } catch (e) { /* private mode */ }
    $$('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', theme === 'dark' ? '#0a1621' : '#081526');
    });
  }

  applyTheme(stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ------------------------------------------- 2. header, progress, to-top */
  const header   = $('#siteHeader');
  const progress = $('#progressBar');
  const toTop    = $('#toTop');
  let lastY = window.scrollY || window.pageYOffset;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }

    if (toTop) {
      // Shown while scrolling back up, or once you reach the end of the page,
      // so it never sits on top of the text you're reading on the way down.
      const goingUp  = y < lastY - 4;
      const atEnd    = y + window.innerHeight >= document.documentElement.scrollHeight - 4;
      toTop.classList.toggle('is-visible', y > 700 && (goingUp || atEnd));
    }

    if (Math.abs(y - lastY) > 4) lastY = y;
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------ 3. mobile menu */
  const navToggle = $('#navToggle');
  const nav       = $('#primaryNav');

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* --------------------------------------------------------- 4. scroll spy */
  const navLinks = $$('.nav-list a[href^="#"]');
  const sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      const visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----------------------------------------------------- 5. reveal on view */
  const revealables = $$('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // small stagger for items entering together
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* --------------------------------------------- 6. experience accordion */
  const tlItems = $$('.tl-item');

  tlItems.forEach(function (item) {
    const head = $('.tl-head', item);
    if (!head) return;

    head.addEventListener('click', function () {
      const willOpen = !item.classList.contains('open');

      tlItems.forEach(function (other) {
        const otherHead = $('.tl-head', other);
        other.classList.remove('open');
        if (otherHead) otherHead.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -------------------------------------------------- 7. skill filtering */
  const skillFilters = $$('.filter[data-filter]');
  const skillGroups  = $$('.skill-group');

  skillFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.getAttribute('data-filter');

      skillFilters.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      skillGroups.forEach(function (group) {
        const show = cat === 'all' || group.getAttribute('data-cat') === cat;
        group.classList.toggle('is-hidden', !show);
        if (show) {                       // replay the entry animation
          group.style.animation = 'none';
          void group.offsetWidth;
          group.style.animation = '';
        }
      });
    });
  });

  /* ------------------------------------------- 8. credential filtering */
  const certFilters = $$('.filter[data-cert]');
  const certs       = $$('.cert');

  certFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.getAttribute('data-cert');

      certFilters.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      certs.forEach(function (card) {
        const show = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('is-hidden', !show);
        card.classList.remove('is-visible');
        if (show) {
          card.classList.add('is-visible');
          card.style.transitionDelay = '0ms';
        }
      });
    });
  });

  /* --------------------------------------------------- 9. copy email addr */
  $$('[data-copy]').forEach(function (el) {
    const original = el.textContent;

    function flash(ok) {
      el.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      setTimeout(function () { el.textContent = original; }, 1600);
    }

    function copy() {
      const text = el.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { flash(true); }, function () { flash(false); });
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { flash(document.execCommand('copy')); } catch (e) { flash(false); }
      document.body.removeChild(ta);
    }

    el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); copy(); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); copy(); }
    });
  });

  /* ---------------------------------------- 10. contact form → mail client */
  const form   = $('#contactForm');
  const status = $('#formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = $('#fName');
      const email   = $('#fEmail');
      const subject = $('#fSubject');
      const message = $('#fMessage');
      const fields  = [name, email, message];
      let invalid   = null;

      fields.forEach(function (f) {
        const wrap = f.closest('.field');
        const bad  = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        if (wrap) wrap.classList.toggle('has-error', bad);
        if (bad && !invalid) invalid = f;
      });

      if (invalid) {
        status.textContent = 'Please complete the highlighted fields.';
        status.className = 'form-status is-error';
        invalid.focus();
        return;
      }

      const subj = subject.value.trim() || ('Website enquiry from ' + name.value.trim());
      const body = [
        message.value.trim(),
        '',
        '---',
        'From: ' + name.value.trim(),
        'Email: ' + email.value.trim()
      ].join('\n');

      status.className = 'form-status';
      status.textContent = 'Opening your mail client…';

      window.location.href = 'mailto:azizan@zen.com.my'
        + '?subject=' + encodeURIComponent(subj)
        + '&body=' + encodeURIComponent(body);
    });

    $$('.field input, .field textarea', form).forEach(function (f) {
      f.addEventListener('input', function () {
        const wrap = f.closest('.field');
        if (wrap) wrap.classList.remove('has-error');
        if (status && status.classList.contains('is-error')) {
          status.textContent = '';
          status.className = 'form-status';
        }
      });
    });
  }

  /* ------------------------------------------------------------ 11. year */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
