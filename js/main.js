/* ============================================================
   SAI NIRMAAN ARCHITECTS — main.js v2.1
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navbar scroll solidify ----- */
  const nav = document.getElementById('nav');
  const btt = document.getElementById('btt');

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('solid', y > 80);
    if (btt) btt.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Back to top ----- */
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ----- Hamburger ----- */
  const burger   = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  burger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (spans.length >= 3) {
      spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)'   : '';
      spans[1].style.opacity   = open ? '0' : '1';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    }
    // Lock body scroll when mobile menu is open
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      burger?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    })
  );

  /* ----- Active nav link ----- */
  const page = location.pathname.split('/').pop() || 'index.html';
  navLinks?.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ----- Fade-in / fade-up on scroll (both class names) ----- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in, .fade-up').forEach(el => io.observe(el));

  /* ----- Animated stat counters ----- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countEls = document.querySelectorAll('.hero-stat-n, .cred-value, .csr-num-val');

  function animateCount(el) {
    const raw = el.textContent;
    const match = raw.match(/\d+/);
    if (!match) return;
    const target = parseInt(match[0], 10);
    const idx = el.innerHTML.indexOf(match[0]);
    const prefix = el.innerHTML.slice(0, idx);
    const suffix = el.innerHTML.slice(idx + match[0].length);
    if (reduceMotion || target === 0) return; // leave final value untouched
    const duration = 1100;
    let startTs = null;
    function step(ts) {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (countEls.length) {
    const countIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countIO.observe(el));
  }

  /* ----- Portfolio filter ----- */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.pitem[data-category]').forEach(item => {
        const show = f === 'all' || f === '*' || item.dataset.category === f;
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s, transform 0.3s';
            item.style.opacity = '1';
            item.style.transform = '';
            item.style.pointerEvents = '';
          }));
        } else {
          item.style.transition = 'opacity 0.3s, transform 0.3s';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          item.style.pointerEvents = 'none';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 310);
        }
      });
    });
  });

  /* ----- Gallery modal ----- */
  const modalWrap    = document.getElementById('modal');
  const modalClose   = document.getElementById('modalClose');
  const modalGallery = document.getElementById('modalGallery');
  const modalPrev    = document.getElementById('modalPrev');
  const modalNext    = document.getElementById('modalNext');
  const modalCounter = document.getElementById('modalCounter');

  let galleryImages = [];
  let galleryIndex  = 0;
  let touchStartX   = 0;

  function setGallerySlide(idx) {
    galleryIndex = ((idx % galleryImages.length) + galleryImages.length) % galleryImages.length;
    modalGallery?.querySelectorAll('.modal-gallery-img').forEach((img, i) => {
      img.classList.toggle('active', i === galleryIndex);
    });
    if (modalCounter) modalCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
  }

  document.querySelectorAll('.pitem[data-title]').forEach(item => {
    // Keyboard access: cards are clickable divs, so expose them as buttons
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    if (!item.getAttribute('aria-label')) {
      item.setAttribute('aria-label', `${item.dataset.title || 'Project'} — view gallery`);
    }
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
    item.addEventListener('click', () => {
      const d = item.dataset;
      const img = item.querySelector('img');
      let firstSrc = img?.src || '';
      if (!firstSrc) {
        const bg = item.style.backgroundImage || getComputedStyle(item).backgroundImage;
        const m  = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (m) firstSrc = m[1];
      }
      const galleryAttr = d.gallery || '';
      galleryImages = galleryAttr ? galleryAttr.split('|').filter(Boolean) : (firstSrc ? [firstSrc] : []);
      if (!galleryImages.length && firstSrc) galleryImages = [firstSrc];

      modalGallery?.querySelectorAll('.modal-gallery-img').forEach(el => el.remove());
      galleryImages.forEach((src, i) => {
        const el = document.createElement('img');
        el.className = 'modal-gallery-img' + (i === 0 ? ' active' : '');
        el.src = src;
        el.alt = d.title || '';
        el.loading = 'lazy';
        if (modalPrev) modalGallery.insertBefore(el, modalPrev);
        else modalGallery?.appendChild(el);
      });
      galleryIndex = 0;
      const multi = galleryImages.length > 1;
      if (modalPrev)   modalPrev.style.display   = multi ? '' : 'none';
      if (modalNext)   modalNext.style.display   = multi ? '' : 'none';
      if (modalCounter) { modalCounter.style.display = multi ? '' : 'none'; modalCounter.textContent = `1 / ${galleryImages.length}`; }

      document.getElementById('modalTag').textContent      = d.tag      || '';
      document.getElementById('modalTitle').textContent    = d.title    || '';
      document.getElementById('modalLocation').textContent = d.location || '';
      document.getElementById('modalDesc').textContent     = d.desc     || '';
      document.getElementById('mClient').textContent       = d.client   || '—';
      document.getElementById('mType').textContent         = d.type     || '—';
      document.getElementById('mArea').textContent         = d.area     || '—';
      document.getElementById('mYear').textContent         = d.year     || '—';
      document.getElementById('mStatus').textContent       = d.status   || '—';

      if (modalWrap) {
        modalWrap.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => modalClose?.focus(), 50);
      }
    });
  });

  modalPrev?.addEventListener('click', e => { e.stopPropagation(); setGallerySlide(galleryIndex - 1); });
  modalNext?.addEventListener('click', e => { e.stopPropagation(); setGallerySlide(galleryIndex + 1); });

  modalGallery?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  modalGallery?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) setGallerySlide(galleryIndex + (dx < 0 ? 1 : -1));
  });

  const closeModal = () => {
    modalWrap?.classList.remove('open');
    document.body.style.overflow = '';
  };
  modalClose?.addEventListener('click', closeModal);
  modalWrap?.addEventListener('click', e => { if (e.target === modalWrap) closeModal(); });
  document.addEventListener('keydown', e => {
    if (!modalWrap?.classList.contains('open')) return;
    if (e.key === 'Escape')      { closeModal(); return; }
    if (e.key === 'ArrowLeft')   { setGallerySlide(galleryIndex - 1); return; }
    if (e.key === 'ArrowRight')  { setGallerySlide(galleryIndex + 1); return; }
    if (e.key === 'Tab') {
      const focusable = [...modalWrap.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* ----- Contact form with inline validation ----- */
  const form = document.getElementById('contact-form');
  if (form) {
    const validators = {
      name:    v => v.trim().length >= 2      || 'Please enter your name (at least 2 characters).',
      phone:   v => !v.trim() || /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()) || 'Enter a valid phone number.',
      email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
      message: v => v.trim().length >= 10    || 'Message must be at least 10 characters.',
    };

    function validateField(field) {
      const wrap  = field.closest('.form-group') || field.parentElement;
      const errEl = wrap?.querySelector('.field-error');
      const key   = field.name || field.id;
      const result = validators[key]?.(field.value);
      if (result === true || result === undefined) {
        wrap?.classList.remove('has-error');
        if (errEl) errEl.textContent = '';
        return true;
      }
      wrap?.classList.add('has-error');
      if (errEl) errEl.textContent = result;
      return false;
    }

    form.querySelectorAll('input[name], textarea[name]').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group')?.classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields   = [...form.querySelectorAll('input[name], textarea[name]')].filter(f => f.type !== 'checkbox');
      const allValid = fields.every(f => validateField(f));
      const consent  = form.querySelector('[name="consent"]');
      if (consent && !consent.checked) {
        const wrap  = consent.closest('.form-group') || consent.parentElement;
        const errEl = wrap?.querySelector('.field-error');
        wrap?.classList.add('has-error');
        if (errEl) errEl.textContent = 'Please accept the terms to continue.';
        return;
      }
      if (!allValid) return;
      const btn  = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.textContent = 'Sending…';
      btn.disabled    = true;
      const data = new FormData(form);
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            showNotif("Thank you — your message has been received. We'll be in touch within 24 hours.", 'success');
            form.reset();
            form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
          } else {
            console.error('Web3Forms error:', res);
            showNotif('Something went wrong. Please email us directly at suresh@sainirmaanarchitects.com', 'error');
          }
        })
        .catch(() => {
          showNotif('Could not send message. Please email us directly at suresh@sainirmaanarchitects.com', 'error');
        })
        .finally(() => {
          btn.innerHTML = orig;
          btn.disabled  = false;
        });
    });
  }

  /* ----- FAQ accordion — supports both .faq-q and .faq-question ----- */
  document.querySelectorAll('.faq-q, .faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ----- Notification helper ----- */
  function showNotif(msg, type = '') {
    document.querySelectorAll('.notif').forEach(n => n.remove());
    const n       = document.createElement('div');
    n.className   = `notif ${type}`;
    n.textContent = msg;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 400); }, 5500);
  }

  /* ----- Smooth anchor scroll ----- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ----- Skip-to-content link (injected, no-JS pages fall back gracefully) ----- */
  (() => {
    const target = document.querySelector('main, .page-hero, .hero, section');
    if (target && !target.id) target.id = 'main';
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + (target?.id || 'main');
    skip.textContent = 'Skip to content';
    skip.addEventListener('click', () => {
      if (target) { target.setAttribute('tabindex', '-1'); target.focus(); }
    });
    document.body.insertBefore(skip, document.body.firstChild);
  })();

  /* ----- Floating WhatsApp button ----- */
  (() => {
    const wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = 'https://wa.me/919704201438?text=' +
      encodeURIComponent("Hi Sai Nirmaan Architects, I'd like to discuss a project.");
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat with us on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.8.8.7-2.8-.2-.3a8.2 8.2 0 1 1 6.9 3.7z"/></svg>';
    document.body.appendChild(wa);
    // Appear on scroll (like back-to-top) so it never crowds the hero;
    // pages too short to scroll show it immediately
    const waScroll = () => {
      const shortPage = document.documentElement.scrollHeight - window.innerHeight < 300;
      wa.classList.toggle('show', shortPage || window.scrollY > 160);
    };
    window.addEventListener('scroll', waScroll, { passive: true });
    waScroll();
  })();

  /* ----- Hide floating buttons over the footer so they never cover its content ----- */
  (() => {
    const footer = document.querySelector('.footer');
    if (!footer || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      document.body.classList.toggle('footer-visible', entries[0].isIntersecting);
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    io.observe(footer);
  })();

  /* ----- Cookie consent (DPDP Act 2023) + Google Consent Mode wiring ----- */
  (() => {
    const STORE_KEY = 'sna-consent';
    const read = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { return null; } };

    // On rejection/withdrawal, actively delete any Google Analytics cookies so the
    // choice takes effect immediately (DPDP: withdrawal as effective as consent).
    const clearGaCookies = () => {
      const host = location.hostname;
      const domains = ['', host, '.' + host];
      const parts = host.split('.');
      if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
      document.cookie.split(';').forEach(c => {
        const name = c.split('=')[0].trim();
        if (name.startsWith('_ga') || name === '_gid') {
          domains.forEach(d => {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + (d ? ';domain=' + d : '');
          });
        }
      });
    };

    const save = (analytics) => {
      const rec = { necessary: true, analytics: !!analytics, ts: new Date().toISOString(), v: 1 };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(rec)); } catch (e) {}
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { 'analytics_storage': analytics ? 'granted' : 'denied' });
      }
      if (!analytics) clearGaCookies();
    };

    const banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cc-banner-inner">' +
        '<div class="cc-banner-text">' +
          '<strong>We value your privacy</strong>' +
          "<p>We use essential cookies to run this site and, with your consent, Google Analytics to understand how it's used. See our <a href=\"/cookie-policy.html\">Cookie Policy</a> and <a href=\"/privacy-policy.html\">Privacy Policy</a>.</p>" +
        '</div>' +
        '<div class="cc-banner-actions">' +
          '<button type="button" class="cc-btn cc-btn-ghost" data-cc="prefs">Preferences</button>' +
          '<button type="button" class="cc-btn cc-btn-ghost" data-cc="reject">Reject all</button>' +
          '<button type="button" class="cc-btn cc-btn-solid" data-cc="accept">Accept all</button>' +
        '</div>' +
      '</div>';

    const modal = document.createElement('div');
    modal.className = 'cc-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Cookie preferences');
    modal.innerHTML =
      '<div class="cc-modal-card">' +
        '<button type="button" class="cc-modal-close" data-cc="close" aria-label="Close">&#x2715;</button>' +
        '<h3>Cookie Preferences</h3>' +
        "<p class=\"cc-modal-lead\">Choose which cookies we may use. Essential cookies are always on because the site can't function without them. You can change this anytime from the footer.</p>" +
        '<div class="cc-row">' +
          '<div class="cc-row-text"><strong>Strictly necessary</strong><span>Remembers your cookie choice and keeps the site secure. Always active.</span></div>' +
          '<span class="cc-locked">Always on</span>' +
        '</div>' +
        '<div class="cc-row">' +
          '<div class="cc-row-text"><strong>Analytics — Google Analytics</strong><span>Helps us understand visits and improve the site. Sets <code>_ga</code> / <code>_ga_*</code> cookies.</span></div>' +
          '<label class="cc-switch"><input type="checkbox" id="cc-analytics"><span class="cc-slider"></span></label>' +
        '</div>' +
        '<div class="cc-modal-actions">' +
          '<button type="button" class="cc-btn cc-btn-ghost" data-cc="reject">Reject all</button>' +
          '<button type="button" class="cc-btn cc-btn-solid" data-cc="save">Save choices</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    const analyticsToggle = modal.querySelector('#cc-analytics');
    const hideBanner = () => banner.classList.remove('show');
    const openModal = () => {
      const cur = read();
      analyticsToggle.checked = cur ? !!cur.analytics : false;
      modal.classList.add('open');
      setTimeout(() => modal.querySelector('.cc-modal-close')?.focus(), 50);
    };
    const closeModal = () => modal.classList.remove('open');
    const finalize = (analytics) => { save(analytics); hideBanner(); closeModal(); };

    banner.addEventListener('click', e => {
      const a = e.target.closest('[data-cc]'); if (!a) return;
      const act = a.dataset.cc;
      if (act === 'accept') finalize(true);
      else if (act === 'reject') finalize(false);
      else if (act === 'prefs') openModal();
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) { closeModal(); return; }
      const a = e.target.closest('[data-cc]'); if (!a) return;
      const act = a.dataset.cc;
      if (act === 'close') closeModal();
      else if (act === 'reject') finalize(false);
      else if (act === 'save') finalize(analyticsToggle.checked);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Reopen preferences anytime (footer link / consent withdrawal — DPDP requires
    // withdrawal to be as easy as giving consent).
    window.openCookiePreferences = openModal;

    if (!read()) banner.classList.add('show');
  })();

  /* Footer legal links + build credit are now hardcoded in each page's HTML
     (real anchors — better for SEO and no-JS). The Cookie Preferences button
     uses an inline onclick that calls window.openCookiePreferences (defined above). */

  /* Page transitions are handled natively via the CSS View Transitions API
     (@view-transition), so no JS link interception is needed — this avoids
     the white-flash the old opacity fade-out caused. */

});
