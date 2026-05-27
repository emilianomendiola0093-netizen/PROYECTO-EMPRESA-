/* ================================================================
   ÓLEUM NATURA — JavaScript
   ================================================================ */

/* ---------- Cart State ---------- */
let cart = [];

/* ---------- Navbar: scroll opacity & hamburger ---------- */
const navbar    = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(26,18,8,.98)'
    : 'rgba(26,18,8,.92)';
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ---------- Smooth scroll for any anchor ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------- Hero Particles ---------- */
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  function createParticle() {
    const p    = document.createElement('div');
    const size = Math.random() * 6 + 2;
    p.classList.add('particle');
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:0;
      animation-duration:${Math.random() * 8 + 6}s;
      animation-delay:${Math.random() * 4}s;
      opacity:${Math.random() * .6 + .2};
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 14000);
  }

  for (let i = 0; i < 20; i++) createParticle();
  setInterval(createParticle, 700);
}

spawnParticles();

/* ---------- Filter Tabs ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeInUp .4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---------- Add to Cart ---------- */
function addToCart(btn, name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  btn.textContent = '✓ Agregado';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Agregar';
    btn.classList.remove('added');
  }, 1800);

  showToast(`¡${name} agregada al carrito!`);
  updateCartUI();
}

function showToast(msg) {
  const toast   = document.getElementById('cart-toast');
  const toastMsg = document.getElementById('toast-msg');
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;

  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    totalEl.textContent = '$0';
    return;
  }

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">x${item.qty} · $${item.price * item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = `$${total}`;
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartUI();
}

/* ---------- Cart Panel Toggle ---------- */
function toggleCart() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.classList.toggle('open');
  overlay.classList.toggle('show');
}

/* ---------- Checkout Modal ---------- */
function showCheckoutModal() {
  if (cart.length === 0) return;

  const existing = document.getElementById('checkout-modal-overlay');
  if (existing) existing.remove();

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const overlay = document.createElement('div');
  overlay.id = 'checkout-modal-overlay';
  overlay.className = 'checkout-modal-overlay';
  overlay.innerHTML = `
    <div class="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
      <button class="checkout-modal-close" onclick="closeCheckoutModal()" aria-label="Cerrar">&times;</button>
      <h3 id="checkout-modal-title">🕯️ Finalizar Pedido</h3>
      <p style="font-size:.85rem;color:#7A5C2A;margin-bottom:20px;">Total: <strong style="color:#5C3D11;font-size:1.1rem;">$${total}</strong></p>
      <form id="checkout-modal-form" onsubmit="submitCheckoutModal(event)">
        <div class="form-group">
          <label for="cm-name">Nombre completo</label>
          <input id="cm-name" type="text" name="payer_name" placeholder="Tu nombre" required />
        </div>
        <div class="form-group">
          <label for="cm-email">Correo electrónico</label>
          <input id="cm-email" type="email" name="payer_email" placeholder="tu@email.com" required />
        </div>
        <div class="form-group">
          <label for="cm-phone">Teléfono</label>
          <input id="cm-phone" type="tel" name="payer_phone" placeholder="+52 55 0000-0000" />
        </div>
        <div class="checkout-modal-actions">
          <button type="submit" class="btn-mp" id="btn-mp-submit">💳 Pagar con Mercado Pago</button>
          <button type="button" class="btn-wsp" onclick="checkoutWhatsApp()">📱 WhatsApp</button>
        </div>
      </form>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCheckoutModal();
  });

  document.body.appendChild(overlay);

  // Trap focus on first field
  setTimeout(() => {
    const first = overlay.querySelector('input');
    if (first) first.focus();
  }, 50);
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.remove();
}

async function submitCheckoutModal(e) {
  e.preventDefault();
  const form       = e.target;
  const payerName  = form.payer_name.value.trim();
  const payerEmail = form.payer_email.value.trim();
  const payerPhone = form.payer_phone.value.trim();
  const total      = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const mpItems = cart.map(i => ({
    title:      i.name,
    quantity:   i.qty,
    unit_price: i.price,
  }));

  const submitBtn = document.getElementById('btn-mp-submit');
  submitBtn.textContent = 'Procesando…';
  submitBtn.disabled = true;

  // Always attempt to save the order to Sheets (fire-and-forget)
  try {
    fetch('/.netlify/functions/save-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items:       mpItems,
        total,
        payer_name:  payerName,
        payer_email: payerEmail,
        payer_phone: payerPhone,
        status:      'pendiente',
      }),
    });
  } catch (_) {
    // Non-blocking — ignore errors
  }

  // Try Mercado Pago
  try {
    const res = await fetch('/.netlify/functions/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: mpItems, payer_email: payerEmail }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.init_point) {
      closeCheckoutModal();
      window.location.href = data.init_point;
      return;
    }

    throw new Error('No se recibió init_point');
  } catch (err) {
    console.warn('Mercado Pago no disponible, usando WhatsApp como fallback:', err.message);
    closeCheckoutModal();
    checkoutWhatsApp();
  }
}

/* ---------- Checkout via WhatsApp (fallback) ---------- */
function checkoutWhatsApp() {
  if (cart.length === 0) return;

  const lines = cart.map(i => `• ${i.name} x${i.qty} = $${i.price * i.qty}`).join('\n');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const msg   = encodeURIComponent(
    `Hola Óleum Natura! 🕯️ Quiero hacer el siguiente pedido:\n\n${lines}\n\nTotal: $${total}\n\n¿Pueden confirmar disponibilidad?`
  );

  window.open(`https://wa.me/5215512345678?text=${msg}`, '_blank');
}

/* ---------- Checkout (entry point called from cart button) ---------- */
function checkout() {
  if (cart.length === 0) return;
  showCheckoutModal();
}

/* ---------- Contact Form ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ ¡Mensaje enviado!';
  btn.style.background = 'linear-gradient(135deg, #52B788, #2D6A4F)';
  setTimeout(() => {
    btn.textContent = 'Enviar Mensaje 🕯️';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

/* ================================================================
   ÓLEUM NATURA — UI/UX UPGRADE (Senior Pass)
   ================================================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_DESKTOP = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768;
const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

/* SAFETY NET: si algo deja elementos invisibles, forzar visibilidad después de 2.5s */
setTimeout(() => {
  document.querySelectorAll(
    '.about-card, .testi-card, .step, .step-arrow, .contact-item, .stat, .pillar-card, .impact-item, .product-card, .contact-info, .contact-form, .hero-eyebrow, .hero-title, .hero-slogan, .hero-desc, .hero-cta .btn, .hero-badges .badge, .compare-table tbody tr, .catalog .section-header'
  ).forEach(el => {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.1) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
}, 2500);

/* Keep fadeInUp keyframe for filter animation */
const _kfStyle = document.createElement('style');
_kfStyle.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(_kfStyle);

/* ---------- Apple-style easing curves ---------- */
const EASE = {
  apple:   'expo.out',                  // GSAP's expo.out matches Apple's signature feel
  smooth:  'power4.out',
  spring:  'elastic.out(1, 0.55)',
  gentle:  'power2.inOut',
};
const APPLE_CSS_BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* ---------- Lenis smooth scroll — SOLO desktop ---------- */
let lenis = null;
function initLenis() {
  if (!window.Lenis || REDUCED_MOTION || IS_TOUCH) return;
  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.2,
    wheelMultiplier: 1.0,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hook into anchor links to use Lenis scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    }, true);
  });
}

/* ---------- Wait for GSAP, then init scroll animations ---------- */
function whenGSAP(cb) {
  if (window.gsap && window.ScrollTrigger) { cb(); return; }
  let tries = 0;
  const id = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(id);
      cb();
    } else if (++tries > 60) {
      clearInterval(id);
      console.warn('GSAP no cargó, usando fallback');
      initFallbackAnimations();
    }
  }, 100);
}

function initFallbackAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        if (entry.target.classList.contains('pillar-card')) entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.product-card, .about-card, .testi-card, .step, .contact-item, .stat, .pillar-card, .impact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity .9s ${APPLE_CSS_BEZIER}, transform .9s ${APPLE_CSS_BEZIER}`;
    io.observe(el);
  });
}

/* ---------- Counter helper that respects prefix/suffix and decimals ---------- */
function animateCounter(el, target, suffix, prefix, duration) {
  const isInt = Number.isInteger(target);
  gsap.fromTo({ v: 0 }, { v: 0 }, {
    v: target, duration: duration || 2.0, ease: EASE.apple,
    onUpdate: function() {
      const v = this.targets()[0].v;
      const display = isInt ? Math.round(v) : v.toFixed(1);
      el.textContent = (prefix || '') + display + (suffix || '');
    },
    onComplete: () => {
      const display = isInt ? Math.round(target) : target.toFixed(1);
      el.textContent = (prefix || '') + display + (suffix || '');
    }
  });
}

/* ---------- Mobile-safe animations: solo count-ups + fade simple con CSS ---------- */
function runMobileAnimations() {
  // Count-up para stats e impact-num (con IntersectionObserver para no depender de ScrollTrigger)
  const counters = document.querySelectorAll('.stat .stat-num, .impact-num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';

      let target, prefix = '', suffix = '';
      if (el.classList.contains('impact-num')) {
        target = parseFloat(el.dataset.target);
        suffix = el.dataset.suffix || '';
        prefix = el.dataset.prefix || '';
      } else {
        const m = el.textContent.trim().match(/^([+]?)([\d.]+)(.*)$/);
        if (!m) return;
        prefix = m[1]; target = parseFloat(m[2]); suffix = m[3];
      }
      if (isNaN(target)) return;
      animateCounter(el, target, suffix, prefix, 1.6);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(el => io.observe(el));

  // Fade-in suave para cards al entrar en viewport (sin gsap.from que las deja invisibles)
  const fadeEls = document.querySelectorAll(
    '.about-card, .testi-card, .step, .pillar-card, .product-card, .impact-item'
  );
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .7s cubic-bezier(0.16,1,0.3,1), transform .7s cubic-bezier(0.16,1,0.3,1)';
  });
  const fadeIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        if (entry.target.classList.contains('pillar-card')) entry.target.classList.add('in-view');
        fadeIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => fadeIO.observe(el));
}

whenGSAP(() => {
  initLenis();
  if (REDUCED_MOTION) { initFallbackAnimations(); return; }
  gsap.registerPlugin(ScrollTrigger);

  // Lenis ↔ ScrollTrigger sync
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* En móvil: SOLO contadores + tilt + modal. NO animaciones de entrada
     (causan secciones invisibles si ScrollTrigger no dispara con scroll táctil). */
  if (!IS_DESKTOP) {
    runMobileAnimations();
    return;
  }

  /* Hero entrance */
  const heroTl = gsap.timeline({ defaults: { ease: EASE.apple } });
  heroTl
    .from('.hero-eyebrow', { y: 30, opacity: 0, duration: 1.0 })
    .from('.hero-title',   { y: 50, opacity: 0, duration: 1.2 }, '-=0.7')
    .from('.hero-slogan',  { y: 25, opacity: 0, duration: 1.0 }, '-=0.8')
    .from('.hero-desc',    { y: 25, opacity: 0, duration: 1.0 }, '-=0.8')
    .from('.hero-cta .btn',     { y: 25, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.7')
    .from('.hero-badges .badge',{ y: 20, opacity: 0, duration: 0.7, stagger: 0.10 }, '-=0.6');

  /* About cards */
  gsap.from('.about-card', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 82%' },
    y: 70, opacity: 0, duration: 1.2, stagger: 0.18, ease: EASE.apple,
  });

  /* Stats count-up */
  document.querySelectorAll('.stat').forEach(stat => {
    const numEl = stat.querySelector('.stat-num');
    if (!numEl) return;
    const raw = numEl.textContent.trim();
    const match = raw.match(/^([+]?)([\d.]+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    ScrollTrigger.create({
      trigger: stat, start: 'top 85%', once: true,
      onEnter: () => animateCounter(numEl, target, suffix, prefix, 2.2)
    });
  });

  /* Pillars */
  gsap.from('.pillar-card', {
    scrollTrigger: { trigger: '.pillars-grid', start: 'top 80%' },
    y: 60, opacity: 0, duration: 1.1, stagger: 0.12, ease: EASE.apple,
    onComplete: () => document.querySelectorAll('.pillar-card').forEach(c => c.classList.add('in-view'))
  });

  /* Comparison rows */
  gsap.from('.compare-table tbody tr', {
    scrollTrigger: { trigger: '.compare-table', start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.8, stagger: 0.10, ease: EASE.apple,
  });

  /* Impact counters — respect data-prefix/data-suffix */
  document.querySelectorAll('.impact-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (isNaN(target)) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => animateCounter(el, target, suffix, prefix, 2.4)
    });
  });

  /* Catalog header */
  gsap.from('.catalog .section-header', {
    scrollTrigger: { trigger: '.catalog', start: 'top 80%' },
    y: 50, opacity: 0, duration: 1.0, ease: EASE.apple
  });

  /* Product cards entrance */
  gsap.from('.product-card', {
    scrollTrigger: { trigger: '.products-grid', start: 'top 75%' },
    y: 60, opacity: 0, duration: 1.0, stagger: 0.1, ease: EASE.apple,
  });

  /* Process steps */
  gsap.from('.step', {
    scrollTrigger: { trigger: '.steps', start: 'top 80%' },
    y: 50, opacity: 0, duration: 0.95, stagger: 0.18, ease: EASE.apple,
  });
  gsap.from('.step-arrow', {
    scrollTrigger: { trigger: '.steps', start: 'top 80%' },
    scale: 0, opacity: 0, duration: 0.7, stagger: 0.18, delay: 0.3, ease: EASE.spring,
  });

  /* Testimonials */
  gsap.from('.testi-card', {
    scrollTrigger: { trigger: '.testi-grid', start: 'top 80%' },
    y: 50, opacity: 0, scale: 0.96, duration: 1.0, stagger: 0.18, ease: EASE.apple,
  });

  /* Contact */
  gsap.from('.contact-info', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    x: -60, opacity: 0, duration: 1.1, ease: EASE.apple,
  });
  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    x: 60, opacity: 0, duration: 1.1, ease: EASE.apple,
  });

  /* Magnetic CTAs (desktop only) — smoother lerp via GSAP */
  if (IS_DESKTOP) {
    document.querySelectorAll('.btn-primary, .hero-cta .btn').forEach(btn => {
      const quickX = gsap.quickTo(btn, 'x', { duration: 0.6, ease: EASE.apple });
      const quickY = gsap.quickTo(btn, 'y', { duration: 0.6, ease: EASE.apple });
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        quickX(x * 0.3);
        quickY(y * 0.3);
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: EASE.spring });
      });
    });
  }

  /* Refresh ScrollTrigger after filters */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(() => ScrollTrigger.refresh(), 100));
  });
});

/* ---------- 3D TILT on product cards — SMOOTH LERP version (Apple-like) ---------- */
if (IS_DESKTOP && !REDUCED_MOTION) {
  document.querySelectorAll('.product-card').forEach(card => {
    const state = {
      tx: 0, ty: 0,         // target rotations
      cx: 0, cy: 0,         // current rotations (lerped)
      tmx: 0.5, tmy: 0.5,   // target mouse position (0..1)
      cmx: 0.5, cmy: 0.5,   // current mouse (lerped)
      active: false,
      raf: null,
    };
    const LERP = 0.10;       // lower = smoother, higher = snappier
    const LERP_RETURN = 0.06;

    function loop() {
      const lerp = state.active ? LERP : LERP_RETURN;
      state.cx  += (state.tx  - state.cx)  * lerp;
      state.cy  += (state.ty  - state.cy)  * lerp;
      state.cmx += (state.tmx - state.cmx) * lerp;
      state.cmy += (state.tmy - state.cmy) * lerp;

      card.style.setProperty('--rx', state.cx.toFixed(3) + 'deg');
      card.style.setProperty('--ry', state.cy.toFixed(3) + 'deg');
      card.style.setProperty('--mx', (state.cmx * 100).toFixed(2) + '%');
      card.style.setProperty('--my', (state.cmy * 100).toFixed(2) + '%');

      const stillMoving =
        Math.abs(state.cx - state.tx) > 0.01 ||
        Math.abs(state.cy - state.ty) > 0.01 ||
        Math.abs(state.cmx - state.tmx) > 0.001 ||
        Math.abs(state.cmy - state.tmy) > 0.001;

      if (state.active || stillMoving) {
        state.raf = requestAnimationFrame(loop);
      } else {
        state.raf = null;
        card.classList.remove('tilt-active');
      }
    }

    card.addEventListener('mouseenter', () => {
      state.active = true;
      card.classList.add('tilt-active');
      if (!state.raf) state.raf = requestAnimationFrame(loop);
    });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      state.tx = (y - 0.5) * -7;   // softer angle (was -10)
      state.ty = (x - 0.5) * 7;
      state.tmx = x;
      state.tmy = y;
    });
    card.addEventListener('mouseleave', () => {
      state.active = false;
      state.tx = 0;
      state.ty = 0;
      state.tmx = 0.5;
      state.tmy = 0.5;
      if (!state.raf) state.raf = requestAnimationFrame(loop);
    });
  });
}

/* ---------- QUICK VIEW MODAL ---------- */
const PRODUCTS_DATA = (() => {
  try { return JSON.parse(document.getElementById('products-data').textContent); }
  catch (e) { console.error('Products data load failed', e); return {}; }
})();

function openQuickView(id) {
  const data = PRODUCTS_DATA[id];
  if (!data) return;
  const overlay = document.getElementById('qv-overlay');
  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  const wrap = card ? card.querySelector('.product-img-wrap') : null;
  const svgCopy = card ? card.querySelector('.candle-svg').cloneNode(true) : null;

  document.getElementById('qv-category').textContent = data.category;
  document.getElementById('qv-name').textContent = data.name;
  document.getElementById('qv-story').textContent = data.story;
  document.getElementById('qv-hours').textContent = '~' + data.hours + ' hrs';
  document.getElementById('qv-grams').textContent = data.grams + ' g';
  document.getElementById('qv-mood').textContent = data.mood;
  document.getElementById('qv-pairing').textContent = data.pairing;
  document.getElementById('qv-price').textContent = data.price;

  const notesEl = document.getElementById('qv-notes');
  notesEl.innerHTML = data.notes.map(n => `<span class="qv-chip">${n}</span>`).join('');
  const ingrEl = document.getElementById('qv-ingredients');
  ingrEl.innerHTML = data.ingredients.map(i => `<li>${i}</li>`).join('');

  const visualEl = document.getElementById('qv-visual');
  visualEl.innerHTML = '';
  if (svgCopy) visualEl.appendChild(svgCopy);
  if (wrap) {
    const style = wrap.getAttribute('style') || '';
    visualEl.setAttribute('style', style);
  }

  const addBtn = document.getElementById('qv-add');
  addBtn.onclick = () => {
    addToCart(addBtn, data.name, data.price);
    closeQuickView();
  };

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('qv-close').focus(), 100);
}

function closeQuickView() {
  const overlay = document.getElementById('qv-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.quick-view-btn');
  if (btn) {
    e.stopPropagation();
    openQuickView(btn.dataset.id);
  }
});

document.getElementById('qv-close')?.addEventListener('click', closeQuickView);
document.getElementById('qv-overlay')?.addEventListener('click', e => {
  if (e.target.id === 'qv-overlay') closeQuickView();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQuickView();
});

/* ---------- THREE.JS HERO SCENE ---------- */
function initHeroThree() {
  if (!window.THREE || !IS_DESKTOP) return;
  const canvas = document.getElementById('hero-3d');
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    console.warn('WebGL no disponible'); return;
  }

  const hero = document.querySelector('.hero');
  const w = hero.clientWidth;
  const h = hero.clientHeight;
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 1, 6);
  camera.lookAt(0, 1, 0);

  // Position canvas to right half
  canvas.style.left = '50%';
  canvas.style.width = '50%';

  // Recompute on next frame
  setTimeout(() => {
    const w2 = canvas.clientWidth;
    const h2 = canvas.clientHeight;
    renderer.setSize(w2, h2, false);
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
  }, 50);

  // Lights
  const ambient = new THREE.AmbientLight(0xfff0d0, 0.5);
  scene.add(ambient);
  const flameLight = new THREE.PointLight(0xffaa44, 2.5, 8, 1.8);
  flameLight.position.set(0, 2.6, 0.5);
  scene.add(flameLight);
  const fillLight = new THREE.DirectionalLight(0xffeec0, 0.7);
  fillLight.position.set(3, 4, 5);
  scene.add(fillLight);

  // Candle body
  const candleGroup = new THREE.Group();
  const waxGeo = new THREE.CylinderGeometry(0.85, 0.9, 2.6, 48, 1);
  const waxMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5e6c8, roughness: 0.4, metalness: 0.05,
    clearcoat: 0.4, clearcoatRoughness: 0.3,
    emissive: 0xffd699, emissiveIntensity: 0.18,
  });
  const wax = new THREE.Mesh(waxGeo, waxMat);
  wax.position.y = 0;
  candleGroup.add(wax);

  // Top disc (slight indent)
  const topGeo = new THREE.CylinderGeometry(0.78, 0.85, 0.1, 48);
  const topMat = new THREE.MeshPhysicalMaterial({ color: 0xe8d2a4, roughness: 0.6 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 1.35;
  candleGroup.add(top);

  // Wick
  const wickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
  const wickMat = new THREE.MeshBasicMaterial({ color: 0x2a1810 });
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.y = 1.55;
  candleGroup.add(wick);

  // Flame (procedural sprite-like)
  const flameGeo = new THREE.SphereGeometry(0.18, 16, 16);
  flameGeo.scale(1, 2.2, 1);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xffaa33, transparent: true, opacity: 0.92
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.y = 1.95;
  candleGroup.add(flame);

  const flameCoreGeo = new THREE.SphereGeometry(0.08, 12, 12);
  flameCoreGeo.scale(1, 1.8, 1);
  const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xfff8a0 });
  const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
  flameCore.position.y = 1.93;
  candleGroup.add(flameCore);

  // Glow halo (sprite)
  const haloMat = new THREE.SpriteMaterial({ color: 0xffaa44, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(3.5, 3.5, 1);
  halo.position.y = 2;
  candleGroup.add(halo);

  // Base/surface reflection plate
  const baseGeo = new THREE.CircleGeometry(2.5, 32);
  const baseMat = new THREE.MeshBasicMaterial({ color: 0x2a1810, transparent: true, opacity: 0.25 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.rotation.x = -Math.PI / 2;
  base.position.y = -1.32;
  candleGroup.add(base);

  candleGroup.position.y = 0.2;
  scene.add(candleGroup);

  // Floating particles
  const partCount = 80;
  const partGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(partCount * 3);
  for (let i = 0; i < partCount; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 5;
    positions[i*3+1] = (Math.random() - 0.5) * 4;
    positions[i*3+2] = (Math.random() - 0.5) * 3;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({ color: 0xffd877, size: 0.04, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
  });

  // Resize
  window.addEventListener('resize', () => {
    const w2 = canvas.clientWidth;
    const h2 = canvas.clientHeight;
    if (w2 === 0 || h2 === 0) return;
    renderer.setSize(w2, h2, false);
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
  });

  // Animation loop
  let t = 0;
  function animate() {
    t += 0.016;
    candleGroup.rotation.y += 0.004;
    const flicker = 1 + Math.sin(t * 18) * 0.08 + Math.sin(t * 11) * 0.05;
    flame.scale.set(flicker, 0.95 + 0.08 * Math.sin(t * 14), flicker);
    flameCore.scale.set(flicker * 0.9, 0.95 + 0.06 * Math.sin(t * 17), flicker * 0.9);
    flameLight.intensity = 2.3 + Math.sin(t * 12) * 0.6;
    halo.material.opacity = 0.22 + Math.sin(t * 8) * 0.05;

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < partCount; i++) {
      positions[i*3+1] += 0.005;
      if (positions[i*3+1] > 2.5) positions[i*3+1] = -2;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    camera.position.x = mouseX * 0.8;
    camera.position.y = 1 + mouseY * 0.4;
    camera.lookAt(0, 1, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  canvas.classList.add('ready');
}

if (document.readyState === 'complete') {
  setTimeout(initHeroThree, 200);
} else {
  window.addEventListener('load', () => setTimeout(initHeroThree, 200));
}
