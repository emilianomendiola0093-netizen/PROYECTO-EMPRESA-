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

/* ---------- Intersection Observer: fade-in on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.product-card, .about-card, .testi-card, .step, .contact-item, .stat'
).forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
  io.observe(el);
});

/* ---------- CSS fadeInUp keyframe (injected for filter) ---------- */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(style);
