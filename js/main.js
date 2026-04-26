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

  /* ----- Page fade transition ----- */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
        href.startsWith('http') || a.getAttribute('target') === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.18s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 185);
    });
  });

});
