/* =========================================================
   Hôtel Glodi VIP — interactions partagées
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const WA = {
    hotel: '243820600712',
    residences: '243824322239',
    restaurant: '243827299744',
  };
  const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ } },
  };

  /* ---------- Thème clair / sombre ---------- */
  $$('[data-theme-toggle]').forEach((btn) => {
    const sync = () => {
      const dark = root.classList.contains('dark');
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Activer le thème clair' : 'Activer le thème sombre');
    };
    sync();
    btn.addEventListener('click', () => {
      const dark = !root.classList.contains('dark');
      root.classList.toggle('dark', dark);
      storage.set('theme', dark ? 'dark' : 'light');
      $$('[data-theme-toggle]').forEach((b) => {
        b.setAttribute('aria-pressed', String(dark));
        b.setAttribute('aria-label', dark ? 'Activer le thème clair' : 'Activer le thème sombre');
      });
    });
  });

  /* ---------- En-tête au défilement ---------- */
  const header = $('.site-header');
  const toTop = $('.to-top');
  const mobileCta = $('.mobile-cta');
  const hero = $('[data-hero]');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (toTop) toTop.classList.toggle('is-visible', y > 900);
    if (mobileCta) {
      const limit = hero ? hero.offsetHeight * 0.7 : 400;
      const show = y > limit;
      mobileCta.classList.toggle('is-visible', show);
      document.body.classList.toggle('has-mobile-cta', show);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Lien de navigation actif ---------- */
  const navLinks = $$('.nav-link[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    navLinks.forEach((a) => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) map.set(target, a);
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        map.get(entry.target)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, section) => spy.observe(section));
  }

  /* ---------- Menu mobile ---------- */
  const menu = $('#mobileMenu');
  const menuOpenBtn = $('[data-menu-open]');
  const menuCloseBtn = $('[data-menu-close]');
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    menuOpenBtn?.setAttribute('aria-expanded', String(open));
    if (open) {
      $$('nav a', menu).forEach((a, i) => { a.style.transitionDelay = `${0.05 + i * 0.04}s`; });
      setTimeout(() => menuCloseBtn?.focus(), 50);
    } else {
      menuOpenBtn?.focus({ preventScroll: true });
    }
  };
  menuOpenBtn?.addEventListener('click', () => setMenu(true));
  menuCloseBtn?.addEventListener('click', () => setMenu(false));
  $$('a', menu || document.createElement('div')).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Apparition au défilement ---------- */
  const reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Carrousels ---------- */
  const icon = {
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  $$('[data-carousel]').forEach((carousel) => {
    const slides = $$('.carousel-slide', carousel);
    if (slides.length < 2) { slides[0]?.classList.add('is-active'); return; }
    const label = carousel.getAttribute('aria-label') || 'Photos';
    let index = 0;
    let timer = null;

    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'carrousel');
    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'diapositive');
      s.setAttribute('aria-label', `${i + 1} sur ${slides.length}`);
    });

    const prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'carousel-btn prev'; prev.innerHTML = icon.prev;
    prev.setAttribute('aria-label', `${label} : photo précédente`);
    const next = document.createElement('button');
    next.type = 'button'; next.className = 'carousel-btn next'; next.innerHTML = icon.next;
    next.setAttribute('aria-label', `${label} : photo suivante`);
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    const count = document.createElement('span');
    count.className = 'carousel-count';
    count.setAttribute('aria-hidden', 'true');

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', `Afficher la photo ${i + 1}`);
      d.addEventListener('click', () => { go(i); restart(); });
      dots.appendChild(d);
    });
    carousel.append(prev, next, dots, count);

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const active = n === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
      });
      $$('button', dots).forEach((d, n) => d.setAttribute('aria-current', String(n === index)));
      count.textContent = `${index + 1} / ${slides.length}`;
    }
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      if (reduceMotion || carousel.dataset.autoplay === 'false') return;
      stop();
      timer = setInterval(() => go(index + 1), Number(carousel.dataset.interval) || 5500);
    };
    const restart = () => { stop(); start(); };

    prev.addEventListener('click', () => { go(index - 1); restart(); });
    next.addEventListener('click', () => { go(index + 1); restart(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { go(index - 1); }
      if (e.key === 'ArrowRight') { go(index + 1); }
    });
    // Glisser au doigt
    let x0 = null;
    carousel.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      x0 = null; start();
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    go(0);
    // Décaler les carrousels pour éviter qu'ils changent tous en même temps
    setTimeout(start, Math.random() * 2000);
  });

  /* ---------- Filtres de galerie ---------- */
  $$('[data-gallery-filters]').forEach((group) => {
    const grid = document.getElementById(group.dataset.galleryFilters);
    if (!grid) return;
    const buttons = $$('button[data-filter]', group);
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      $$('.g-item', grid).forEach((item) => {
        item.hidden = !(f === 'all' || item.dataset.cat === f);
      });
    }));
  });

  /* ---------- Visionneuse (lightbox) ---------- */
  let lb = null;
  let lbItems = [];
  let lbIndex = 0;
  let lbReturn = null;

  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visionneuse de photos');
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = `
      <span class="lb-count" aria-live="polite"></span>
      <button type="button" class="lb-btn lb-close" aria-label="Fermer la visionneuse">${icon.close}</button>
      <button type="button" class="lb-btn lb-prev" aria-label="Photo précédente">${icon.prev}</button>
      <figure><img alt="" /><figcaption></figcaption></figure>
      <button type="button" class="lb-btn lb-next" aria-label="Photo suivante">${icon.next}</button>`;
    document.body.appendChild(lb);
    $('.lb-close', lb).addEventListener('click', closeLightbox);
    $('.lb-prev', lb).addEventListener('click', () => showLightbox(lbIndex - 1));
    $('.lb-next', lb).addEventListener('click', () => showLightbox(lbIndex + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
      if (e.key === 'Tab') { // piège de focus
        const f = $$('button', lb);
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function showLightbox(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    const img = $('img', lb);
    img.src = item.dataset.src || item.getAttribute('href');
    img.alt = item.dataset.caption || $('img', item)?.alt || '';
    $('figcaption', lb).textContent = item.dataset.caption || '';
    $('.lb-count', lb).textContent = `${lbIndex + 1} / ${lbItems.length}`;
    const multi = lbItems.length > 1;
    $('.lb-prev', lb).hidden = !multi;
    $('.lb-next', lb).hidden = !multi;
  }

  function openLightbox(trigger) {
    if (!lb) buildLightbox();
    const group = trigger.dataset.lightbox;
    lbItems = $$(`[data-lightbox="${group}"]`).filter((el) => !el.hidden && el.offsetParent !== null || el === trigger);
    lbReturn = trigger;
    showLightbox(Math.max(0, lbItems.indexOf(trigger)));
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    setTimeout(() => $('.lb-close', lb).focus(), 30);
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    lbReturn?.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const expand = e.target.closest('[data-expand]');
    if (expand) {
      const active = expand.closest('[data-carousel]')?.querySelector('.carousel-slide.is-active');
      if (active) openLightbox(active);
      return;
    }
    const first = e.target.closest('[data-open-first]');
    if (first) {
      const item = $(`[data-lightbox="${first.dataset.openFirst}"]`);
      if (item) { openLightbox(item); lbReturn = first; }
      return;
    }
    const trigger = e.target.closest('[data-lightbox]');
    if (!trigger || e.target.closest('.carousel-btn, .carousel-dots')) return;
    e.preventDefault();
    openLightbox(trigger);
  });

  /* ---------- Dates : minimum aujourd'hui, départ après arrivée ---------- */
  const today = new Date();
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $$('input[type="date"][data-checkin]').forEach((input) => {
    input.min = iso(today);
    const out = document.getElementById(input.dataset.checkin);
    if (!out) return;
    out.min = iso(new Date(today.getTime() + 86400000));
    input.addEventListener('change', () => {
      if (!input.value) return;
      const next = new Date(input.value);
      next.setDate(next.getDate() + 1);
      out.min = iso(next);
      if (!out.value || out.value <= input.value) out.value = iso(next);
    });
  });

  const fmtDate = (v) => {
    if (!v) return '';
    const [y, m, d] = v.split('-');
    return `${d}/${m}/${y}`;
  };

  /* ---------- Barre de réservation -> WhatsApp ---------- */
  $$('form[data-booking]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const select = form.querySelector('select[name="stay"]');
      const opt = select?.selectedOptions[0];
      const number = WA[opt?.dataset.line || form.dataset.line || 'hotel'];
      const stay = data.get('stay') || 'un hébergement';
      const lines = [
        'Bonjour Hôtel Glodi VIP,',
        `je souhaite vérifier la disponibilité pour : ${stay}.`,
      ];
      if (data.get('checkin')) lines.push(`Arrivée : ${fmtDate(data.get('checkin'))}`);
      if (data.get('checkout')) lines.push(`Départ : ${fmtDate(data.get('checkout'))}`);
      if (data.get('guests')) lines.push(`Personnes : ${data.get('guests')}`);
      lines.push('Merci de me confirmer le tarif et la disponibilité.');
      window.open(waLink(number, lines.join('\n')), '_blank', 'noopener');
    });
  });

  /* ---------- Boutons « Réserver » -> pré-remplissage du formulaire ---------- */
  const preselect = (value) => {
    const select = $('#reservation-form select[name="Hébergement"]');
    if (!select || !value) return;
    const match = Array.from(select.options).find((o) => o.value === value);
    if (match) select.value = value;
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-book]');
    if (btn) preselect(btn.dataset.book);
  });
  // Arrivée depuis une page appartement : ?sejour=Appartement%20VIP#contact
  try { preselect(new URLSearchParams(window.location.search).get('sejour')); } catch (e) { /* ignore */ }

  /* ---------- Envoi des formulaires (Web3Forms) ---------- */
  function validateField(field) {
    const input = field.querySelector('input, select, textarea');
    if (!input) return true;
    const ok = input.checkValidity();
    field.classList.toggle('has-error', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  $$('form[data-ajax]').forEach((form) => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const fields = $$('.field', form);

    fields.forEach((field) => {
      const input = field.querySelector('input, select, textarea');
      input?.addEventListener('blur', () => { if (input.value) validateField(field); });
      input?.addEventListener('input', () => { if (field.classList.contains('has-error')) validateField(field); });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalid = fields.filter((f) => !validateField(f));
      if (invalid.length) {
        invalid[0].querySelector('input, select, textarea')?.focus();
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Merci de compléter les champs signalés.';
        }
        return;
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const original = button?.innerHTML;
      if (button) { button.disabled = true; button.textContent = 'Envoi en cours…'; }
      if (status) { status.className = 'form-status'; status.textContent = ''; }

      try {
        const payload = Object.fromEntries(new FormData(form));
        ['Arrivée', 'Départ'].forEach((k) => { if (payload[k]) payload[k] = fmtDate(payload[k]); });
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (res.ok && result.success !== false) {
          if (status) {
            status.className = 'form-status is-success';
            status.textContent = form.dataset.success || 'Merci ! Votre message a bien été envoyé.';
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Erreur');
        }
      } catch (err) {
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = "L'envoi a échoué. Réessayez ou contactez-nous sur WhatsApp au +243 820 600 712.";
        }
      } finally {
        if (button) { button.disabled = false; button.innerHTML = original; }
      }
    });
  });

  /* ---------- Année du pied de page ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
