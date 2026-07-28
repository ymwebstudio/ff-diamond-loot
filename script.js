/* =========================================================
   FF DIAMOND LOOT — script.js
   Vanilla JavaScript. No libraries. No frameworks.
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. CONFIG — edit here to change UPI ID / Telegram handle
     ========================================================= */
  const CONFIG = {
    upiId: '9557923807@fam',
    telegramHandle: '@ffdiamondloot',
    telegramUrl: 'https://t.me/ffdiamondloot'
  };

  /* =========================================================
     2. PRODUCT DATA — edit this array to add/remove/change packs
        category: 'freefire' | 'bgmi' | 'giftcard'
        badge:    'popular' | 'best' | 'hot' | 'recommended' | null
     ========================================================= */
  const PRODUCTS = [
    { id: 'ff-100',  category: 'freefire', title: '100 Diamonds',  desc: 'Small top-up, instant delivery to your UID.', price: 79,   oldPrice: 99,   badge: null },
    { id: 'ff-310',  category: 'freefire', title: '310 Diamonds',  desc: 'Popular starter pack for weekly events.',     price: 229,  oldPrice: 279,  badge: 'popular' },
    { id: 'ff-520',  category: 'freefire', title: '520 Diamonds',  desc: 'Best value per-diamond ratio in this range.', price: 379,  oldPrice: 459,  badge: 'best' },
    { id: 'ff-1060', category: 'freefire', title: '1060 Diamonds', desc: 'Great for grabbing bundles & elite pass.',    price: 739,  oldPrice: 899,  badge: 'hot' },
    { id: 'ff-2180', category: 'freefire', title: '2180 Diamonds', desc: 'High-volume pack for serious collectors.',   price: 1479, oldPrice: 1799, badge: 'recommended' },
    { id: 'ff-5600', category: 'freefire', title: '5600 Diamonds', desc: 'Max value pack — biggest discount tier.',    price: 3699, oldPrice: 4599, badge: 'hot' },

    { id: 'bgmi-60',   category: 'bgmi', title: '60 UC',   desc: 'Quick UC refill for crates and skins.',        price: 89,   oldPrice: 109,  badge: null },
    { id: 'bgmi-325',  category: 'bgmi', title: '325 UC',  desc: 'Balanced pack, most picked by squads.',        price: 419,  oldPrice: 499,  badge: 'popular' },
    { id: 'bgmi-660',  category: 'bgmi', title: '660 UC',  desc: 'Best value for royale pass + extras.',         price: 819,  oldPrice: 979,  badge: 'best' },
    { id: 'bgmi-1800', category: 'bgmi', title: '1800 UC', desc: 'Bulk pack for premium crates & outfits.',      price: 2199, oldPrice: 2599, badge: 'recommended' },
    { id: 'bgmi-3850', category: 'bgmi', title: '3850 UC', desc: 'High roller pack — huge savings.',             price: 4599, oldPrice: 5499, badge: 'hot' },

    { id: 'gp-100',  category: 'giftcard', title: 'Google Play ₹100', desc: 'Digital code delivered after verification.', price: 99,   oldPrice: 110,  badge: null },
    { id: 'gp-300',  category: 'giftcard', title: 'Google Play ₹300', desc: 'Great for app subscriptions & in-app buys.', price: 289,  oldPrice: 320,  badge: 'popular' },
    { id: 'gp-500',  category: 'giftcard', title: 'Google Play ₹500', desc: 'Best value redeem code in this tier.',       price: 469,  oldPrice: 530,  badge: 'best' },
    { id: 'gp-1000', category: 'giftcard', title: 'Google Play ₹1000',desc: 'Bulk gift code — ideal for gifting.',        price: 929,  oldPrice: 1050, badge: 'recommended' }
  ];

  const BADGE_LABELS = {
    popular: { text: 'Most Popular', cls: 'badge-popular' },
    best: { text: 'Best Value', cls: 'badge-best' },
    hot: { text: 'Hot', cls: 'badge-hot' },
    recommended: { text: 'Recommended', cls: 'badge-recommended' }
  };

  const CATEGORY_LABELS = {
    freefire: 'Free Fire',
    bgmi: 'BGMI UC',
    giftcard: 'Google Play'
  };

  let state = {
    filter: 'all',
    query: ''
  };

  /* =========================================================
     3. UTILITIES
     ========================================================= */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function formatINR(num) {
    return '₹' + Number(num).toLocaleString('en-IN');
  }

  function calcDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* =========================================================
     4. LOADING SCREEN
     ========================================================= */
  function initLoadingScreen() {
    const screen = $('#loading-screen');
    const barFill = $('#loader-bar-fill');
    if (!screen || !barFill) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) {
        progress = 100;
        barFill.style.width = progress + '%';
        clearInterval(interval);
        setTimeout(() => {
          screen.classList.add('hidden');
          document.body.style.overflow = '';
        }, 300);
      } else {
        barFill.style.width = progress + '%';
      }
    }, 160);

    document.body.style.overflow = 'hidden';
    // Safety fallback in case load event stalls
    window.addEventListener('load', () => {
      setTimeout(() => {
        progress = 100;
        barFill.style.width = '100%';
      }, 200);
    });
  }

  /* =========================================================
     5. PARTICLE BACKGROUND (canvas)
     ========================================================= */
  function initParticles() {
    const canvas = $('#particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const colors = ['#00eaff', '#b026ff', '#ffd24c'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(70, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.15
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(tick);
    }

    resize();
    createParticles();
    tick();

    window.addEventListener('resize', debounce(() => {
      resize();
      createParticles();
    }, 200));
  }

  /* =========================================================
     6. NAVBAR — scroll state + mobile menu
     ========================================================= */
  function initNavbar() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const navLinks = $('#nav-links');

    window.addEventListener('scroll', debounce(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
      toggleBackToTop();
    }, 10));

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    $$('.nav-link', navLinks).forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    $('#track-btn').addEventListener('click', () => {
      document.getElementById('tracking').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function toggleBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    btn.classList.toggle('show', window.scrollY > 500);
  }

  /* =========================================================
     7. PARALLAX (hero)
     ========================================================= */
  function initParallax() {
    const layers = $$('[data-parallax]');
    if (!layers.length) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    window.addEventListener('scroll', debounce(() => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translateY(${y * speed}px)`;
      });
    }, 5));
  }

  /* =========================================================
     8. ANIMATED COUNTERS
     ========================================================= */
  function initCounters() {
    const counters = $$('.stat-num');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const decimal = parseInt(el.dataset.decimal, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      let value = target * eased;
      if (decimal) {
        value = (target + decimal / 10) * eased;
        el.textContent = value.toFixed(1);
      } else {
        el.textContent = Math.floor(value).toLocaleString('en-IN') + suffix;
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
     9. SCROLL REVEAL
     ========================================================= */
  function initScrollReveal() {
    const targets = $$('.game-card, .product-card, .member-card, .feature-card, .faq-item, .section-head');
    targets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((el) => observer.observe(el));
  }

  /* =========================================================
     10. PRODUCT RENDERING
     ========================================================= */
  function renderProducts() {
    const grid = $('#product-grid');
    const emptyState = $('#empty-state');
    if (!grid) return;

    const query = state.query.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      const matchesFilter = state.filter === 'all' || p.category === state.filter;
      const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });

    grid.innerHTML = '';
    emptyState.hidden = filtered.length !== 0;

    filtered.forEach((p, i) => {
      const discount = calcDiscount(p.price, p.oldPrice);
      const badge = BADGE_LABELS[p.badge];
      const card = document.createElement('article');
      card.className = 'product-card';
      card.style.animationDelay = (i * 0.05) + 's';
      card.innerHTML = `
        <div class="product-art placeholder-art">
          ${badge ? `<div class="product-badges"><span class="badge ${badge.cls}">${badge.text}</span></div>` : ''}
          ${discount > 0 ? `<span class="discount-tag">-${discount}%</span>` : ''}
          <span class="ph-label">IMAGE PLACEHOLDER</span>
          <svg class="ph-icon" viewBox="0 0 120 120"><polygon points="60,10 100,35 100,85 60,110 20,85 20,35" fill="none" stroke="currentColor" stroke-width="4"/></svg>
        </div>
        <div class="product-body">
          <span class="product-cat">${CATEGORY_LABELS[p.category]}</span>
          <h3 class="product-title">${p.title}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="price-row">
            <span class="price-new">${formatINR(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${formatINR(p.oldPrice)}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-block buy-btn" data-id="${p.id}">Buy Now</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // re-observe new cards for reveal + attach buy listeners
    $$('.product-card', grid).forEach((el) => el.classList.add('in-view'));
    $$('.buy-btn', grid).forEach((btn) => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.id));
    });
  }

  /* =========================================================
     11. FILTER + SEARCH
     ========================================================= */
  function initFilters() {
    const chips = $$('.filter-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        state.filter = chip.dataset.filter;
        renderProducts();
      });
    });

    $$('[data-scroll-filter]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = btn.dataset.scrollFilter;
        const chip = chips.find((c) => c.dataset.filter === target);
        if (chip) chip.click();
      });
    });
  }

  function initSearch() {
    const input = $('#live-search');
    if (!input) return;
    input.addEventListener('input', debounce((e) => {
      state.query = e.target.value;
      renderProducts();
    }, 200));
  }

  /* =========================================================
     12. PRODUCT MODAL
     ========================================================= */
  function openProductModal(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    $('#modal-title').textContent = product.title;
    $('#modal-desc').textContent = product.desc;
    $('#modal-price').textContent = formatINR(product.price);
    $('#modal-old-price').textContent = product.oldPrice ? formatINR(product.oldPrice) : '';
    $('#modal-old-price').style.display = product.oldPrice ? 'inline' : 'none';
    $('#modal-uid').value = '';

    const modal = $('#product-modal');
    modal.dataset.activeProduct = id;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('show'));
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    const modal = $('#product-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 300);
  }

  function initModal() {
    const modal = $('#product-modal');
    $('#modal-close').addEventListener('click', closeProductModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProductModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeProductModal();
    });

    $('#modal-confirm').addEventListener('click', () => {
      const uid = $('#modal-uid').value.trim();
      const productId = modal.dataset.activeProduct;
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!uid) {
        showToast('Please enter your Game UID first.', 'error');
        return;
      }
      closeProductModal();
      showToast(`${product ? product.title : 'Order'} added — scroll down to complete UPI payment.`, 'success');
      setTimeout(() => {
        document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
      }, 350);
    });

    $$('.buy-member').forEach((btn) => {
      btn.addEventListener('click', () => {
        const plan = btn.dataset.plan;
        showToast(`${plan} selected — scroll down to pay via UPI.`, 'success');
        document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* =========================================================
     13. TOAST NOTIFICATIONS
     ========================================================= */
  function showToast(message, type) {
    const stack = $('#toast-stack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type || ''}`.trim();
    toast.innerHTML = `<span>${message}</span>`;
    stack.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 320);
    }, 3600);
  }

  /* =========================================================
     14. COPY UPI ID
     ========================================================= */
  function initCopyUpi() {
    const btn = $('#copy-upi-btn');
    const label = $('#copy-upi-label');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.upiId);
      } catch (err) {
        // fallback for older browsers
        const temp = document.createElement('textarea');
        temp.value = CONFIG.upiId;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      label.textContent = 'Copied!';
      showToast('UPI ID copied to clipboard.', 'success');
      setTimeout(() => { label.textContent = 'Copy UPI ID'; }, 2000);
    });
  }

  /* =========================================================
     15. ORDER TRACKER (demo simulation)
     ========================================================= */
  function initTracker() {
    const form = $('#tracker-form');
    if (!form) return;
    const steps = $$('.tracker-step');
    const lineFill = $('#tracker-line-fill');
    const hint = $('#tracker-hint');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = $('#order-id-input').value.trim();
      if (!value) {
        showToast('Enter an order ID to track.', 'error');
        return;
      }

      // deterministic pseudo-random stage based on order id characters
      let seed = 0;
      for (let i = 0; i < value.length; i++) seed += value.charCodeAt(i);
      const stage = (seed % 4) + 1;

      steps.forEach((step) => {
        const stepNum = parseInt(step.dataset.step, 10);
        step.classList.toggle('active', stepNum <= stage);
        step.classList.toggle('current', stepNum === stage);
      });

      const pct = ((stage - 1) / (steps.length - 1)) * 100;
      const isDesktop = window.matchMedia('(min-width:960px)').matches;
      if (isDesktop) {
        lineFill.style.height = '100%';
        lineFill.style.width = pct + '%';
      } else {
        lineFill.style.width = '100%';
        lineFill.style.height = pct + '%';
      }

      const labels = ['Order Received', 'Payment Verified', 'Processing', 'Completed'];
      hint.textContent = `Order ${value.toUpperCase()} — current status: ${labels[stage - 1]}. (Demo preview only.)`;
      showToast('Order status updated.', 'success');
    });
  }

  /* =========================================================
     16. FAQ ACCORDION
     ========================================================= */
  function initFAQ() {
    $$('.faq-item').forEach((item) => {
      const question = $('.faq-q', item);
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        $$('.faq-item').forEach((el) => {
          el.classList.remove('open');
          $('.faq-q', el).setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* =========================================================
     17. LEGAL MODAL (Privacy / Terms)
     ========================================================= */
  const LEGAL_CONTENT = {
    privacy: {
      title: 'Privacy Policy',
      body: `
        <p>FF Diamond Loot collects only the information needed to process your top-up order: your in-game UID/player ID and payment confirmation details you send us via Telegram.</p>
        <h4>What we collect</h4>
        <p>Game UID, order amount, and payment screenshots shared for verification purposes only.</p>
        <h4>What we don't do</h4>
        <p>We never ask for your UPI PIN, OTP, card number or account password. We never sell your data to third parties.</p>
        <h4>Data retention</h4>
        <p>Order records are kept only as long as needed to resolve support queries or disputes.</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      body: `
        <p>By placing an order on FF Diamond Loot, you agree to provide an accurate Game UID and to pay the exact listed amount for your chosen pack.</p>
        <h4>Delivery</h4>
        <p>All orders are manually verified before delivery. Delivery times are estimates, not guarantees.</p>
        <h4>Refunds</h4>
        <p>Refunds are evaluated case-by-case for verified, undelivered orders. Incorrect UIDs submitted by the buyer are not eligible for refund.</p>
        <h4>Fair use</h4>
        <p>This store is not affiliated with Garena Free Fire, Krafton BGMI or Google Play — all trademarks belong to their respective owners.</p>
      `
    }
  };

  function initLegalModal() {
    const modal = $('#legal-modal');
    const title = $('#legal-title');
    const body = $('#legal-body');

    function openLegal(key) {
      const content = LEGAL_CONTENT[key];
      if (!content) return;
      title.textContent = content.title;
      body.innerHTML = content.body;
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('show'));
      document.body.style.overflow = 'hidden';
    }

    function closeLegal() {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      setTimeout(() => { modal.hidden = true; }, 300);
    }

    $('#privacy-link').addEventListener('click', (e) => { e.preventDefault(); openLegal('privacy'); });
    $('#terms-link').addEventListener('click', (e) => { e.preventDefault(); openLegal('terms'); });
    $('#legal-close').addEventListener('click', closeLegal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeLegal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeLegal();
    });
  }

  /* =========================================================
     18. RIPPLE EFFECT ON BUTTONS
     ========================================================= */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.style.position = btn.style.position || 'relative';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  /* =========================================================
     19. BACK TO TOP
     ========================================================= */
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* =========================================================
     20. FOOTER YEAR + UPI TEXT
     ========================================================= */
  function initFooter() {
    $('#footer-year').textContent = new Date().getFullYear();
    const footerUpi = $('#footer-upi');
    if (footerUpi) footerUpi.textContent = CONFIG.upiId;
  }

  /* =========================================================
     21. INIT
     ========================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initParticles();
    initNavbar();
    initParallax();
    initCounters();
    initScrollReveal();
    renderProducts();
    initFilters();
    initSearch();
    initModal();
    initCopyUpi();
    initTracker();
    initFAQ();
    initLegalModal();
    initRipple();
    initBackToTop();
    initFooter();
  });
})();
