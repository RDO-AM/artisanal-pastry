/**
 * Shared Navigation, Mobile Drawer, Advanced Boutique Cart & Invisible Easter Egg Auth
 * Artisanal Pastry Luxury Experience
 */

(function() {
  'use strict';

  // Global cart UI state
  let cartState = {
    giftPackaging: false,
    giftMessage: '',
    appliedCoupon: null,
    orderNote: ''
  };

  const FREE_SHIPPING_THRESHOLD = 500000;
  const STANDARD_SHIPPING_COST = 35000;
  const GIFT_PACKAGING_COST = 35000;

  // ==========================================================================
  // Luxury Persian Toast Notification System
  // ==========================================================================
  function getOrCreateToastContainer() {
    let c = document.getElementById('pastry-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'pastry-toast-container';
      c.className = 'pastry-toast-container';
      c.setAttribute('aria-live', 'polite');
      document.body.appendChild(c);
    }
    return c;
  }

  window.showLuxuryToast = function(title, message = '', type = 'info', duration = 3800) {
    const container = getOrCreateToastContainer();
    const toast = document.createElement('div');
    toast.className = `pastry-toast toast-${type}`;

    const icons = {
      success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    toast.innerHTML = `
      <div class="toast-icon-box">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close-btn" aria-label="بستن">✕</button>
      <div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismiss = () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  };

  // ==========================================================================
  // Luxury Persian Dialogs (Confirm & Prompt)
  // ==========================================================================
  window.showLuxuryConfirm = function({ title, message, confirmText = 'بله، تایید', cancelText = 'انصراف', isDanger = false, onConfirm, onCancel }) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'pastry-dialog-overlay';

      const iconSvg = isDanger ? 
        `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>` :
        `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

      overlay.innerHTML = `
        <div class="pastry-dialog-box" role="alertdialog">
          <div class="pastry-dialog-icon ${isDanger ? 'danger' : ''}">
            ${iconSvg}
          </div>
          <h3 class="pastry-dialog-title">${title}</h3>
          <p class="pastry-dialog-desc">${message}</p>
          <div class="pastry-dialog-actions">
            <button class="btn-dialog-confirm ${isDanger ? 'danger' : ''}" id="dlg-btn-confirm">${confirmText}</button>
            <button class="btn-dialog-cancel" id="dlg-btn-cancel">${cancelText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const cleanup = () => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s';
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 200);
      };

      overlay.querySelector('#dlg-btn-confirm').addEventListener('click', () => {
        cleanup();
        if (typeof onConfirm === 'function') onConfirm();
        resolve(true);
      });

      overlay.querySelector('#dlg-btn-cancel').addEventListener('click', () => {
        cleanup();
        if (typeof onCancel === 'function') onCancel();
        resolve(false);
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup();
          if (typeof onCancel === 'function') onCancel();
          resolve(false);
        }
      });
    });
  };

  window.showLuxuryPrompt = function({ title, message, placeholder = '', defaultValue = '', confirmText = 'ثبت و تایید', cancelText = 'انصراف', inputType = 'text', onConfirm, onCancel }) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'pastry-dialog-overlay';

      overlay.innerHTML = `
        <div class="pastry-dialog-box" role="dialog">
          <div class="pastry-dialog-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
          <h3 class="pastry-dialog-title">${title}</h3>
          ${message ? `<p class="pastry-dialog-desc">${message}</p>` : ''}
          <div style="margin: 1.2rem 0 1.4rem;">
            <input type="${inputType}" id="dlg-prompt-input" value="${defaultValue}" placeholder="${placeholder}" style="width: 100%; padding: 0.8rem 1rem; border-radius: 12px; border: 1.5px solid #D1D5DB; font-family: inherit; font-size: 0.95rem; box-sizing: border-box; outline: none; transition: border-color 0.2s;" />
          </div>
          <div class="pastry-dialog-actions">
            <button class="btn-dialog-confirm" id="dlg-btn-prompt-confirm">${confirmText}</button>
            <button class="btn-dialog-cancel" id="dlg-btn-prompt-cancel">${cancelText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      const input = overlay.querySelector('#dlg-prompt-input');
      input.focus();
      input.select();

      const cleanup = () => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s';
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 200);
      };

      const handleConfirm = () => {
        const val = input.value;
        cleanup();
        if (typeof onConfirm === 'function') onConfirm(val);
        resolve(val);
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') {
          cleanup();
          if (typeof onCancel === 'function') onCancel();
          resolve(null);
        }
      });

      overlay.querySelector('#dlg-btn-prompt-confirm').addEventListener('click', handleConfirm);
      overlay.querySelector('#dlg-btn-prompt-cancel').addEventListener('click', () => {
        cleanup();
        if (typeof onCancel === 'function') onCancel();
        resolve(null);
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup();
          if (typeof onCancel === 'function') onCancel();
          resolve(null);
        }
      });
    });
  };

  // Helper for live GPS geolocation
  window.detectCurrentGPSLocation = function(prefix = 'chk') {
    if (!navigator.geolocation) {
      window.showLuxuryToast('خطا در موقعیت‌یابی', 'مرورگر شما از قابلیت مکان‌یابی پشتیبانی نمی‌کند.', 'warning');
      return;
    }
    window.showLuxuryToast('در حال دریافت لوکیشن...', 'لطفاً دسترسی به GPS مرورگر را تایید فرمایید.', 'info', 2500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        const badge = document.getElementById(`${prefix}-coords-badge`);
        const pin = document.getElementById(`${prefix}-map-pin`);
        const addrInput = document.getElementById(prefix === 'chk' ? 'chk-address' : 'new-loc-address');

        if (pin) {
          pin.style.left = '52%';
          pin.style.top = '48%';
        }
        if (badge) {
          badge.textContent = `${lat}° N, ${lng}° E (موقعیت زنده GPS)`;
        }
        if (addrInput && (!addrInput.value || addrInput.value.includes('موقعیت') || addrInput.value.includes('زعفرانیه'))) {
          addrInput.value = `تهران، موقعیت دقیق GPS (${lat}, ${lng})`;
        }
        window.showLuxuryToast('موقعیت مکانی ثبت شد', `مختصات جغرافیایی شما (${lat}, ${lng}) با موفقیت اعمال گردید.`, 'success');
      },
      (err) => {
        let msg = 'دسترسی به لوکیشن مرورگر برقرار نشد.';
        if (err.code === 1) msg = 'دسترسی به لوکیشن توسط کاربر رد شد.';
        window.showLuxuryToast('مکان‌یابی انجام نشد', msg + ' می‌توانید محله را از لیست انتخاب فرمایید.', 'warning');
      },
      { timeout: 8000 }
    );
  };

  function initNavAndCart() {
    // 1. Mobile Hamburger Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('mobile-drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    function openMobileMenu() {
      if (mobileDrawer) mobileDrawer.classList.add('active');
      if (drawerOverlay) drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

    // 2. Side Cart Drawer Elements
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartDrawer = document.getElementById('cart-side-drawer');
    const cartCloseBtn = document.getElementById('cart-close-btn');

    function openCart(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      renderSideCart();
      if (cartDrawer) cartDrawer.classList.add('active');
      if (cartOverlay) cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      if (cartDrawer) cartDrawer.classList.remove('active');
      if (cartOverlay) cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    window.openPastryCart = openCart;
    window.closePastryCart = closeCart;

    // Purge any stale event listeners and attach fresh click listener to all cart buttons
    document.querySelectorAll('.btn-cart-nav, #cart-btn').forEach(btn => {
      const freshBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(freshBtn, btn);
      }
      freshBtn.addEventListener('click', openCart);
    });

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // 3. Render Advanced Cart Content
    window.renderSideCart = function() {
      if (!cartDrawer || !window.pastryStore) return;

      const items = window.pastryStore.getCart();
      const count = window.pastryStore.getCartCount();
      const subtotal = window.pastryStore.getCartTotal();

      // Recalculate discount if coupon applied
      let discountAmount = 0;
      if (cartState.appliedCoupon) {
        const valRes = window.pastryStore.validateCoupon(cartState.appliedCoupon.code, subtotal);
        if (valRes.valid) {
          discountAmount = valRes.discountAmount;
        } else {
          cartState.appliedCoupon = null;
        }
      }

      const giftCost = cartState.giftPackaging ? GIFT_PACKAGING_COST : 0;
      const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
      const shippingCost = items.length === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_COST);
      const finalTotal = Math.max(0, subtotal - discountAmount + giftCost + shippingCost);

      // Free shipping progress calculation
      const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

      // Render full drawer inner markup
      cartDrawer.innerHTML = `
        <div class="cart-drawer-head" style="padding: 1.2rem 1.4rem; border-bottom: 1px solid rgba(45,35,25,0.08); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--text-primary);">سبد خرید لوکس شما</h3>
            <span style="font-size: 0.78rem; background: rgba(184,134,11,0.12); color: var(--accent-gold); padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 700;">
              ${new Intl.NumberFormat('fa-IR').format(count)} قلم
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            ${items.length > 0 ? `
              <button onclick="window.clearAllCartItems()" style="background: none; border: none; color: #EF4444; font-size: 0.75rem; font-family: inherit; font-weight: 700; cursor: pointer; text-decoration: underline;">
                خالی کردن
              </button>
            ` : ''}
            <button id="cart-drawer-close-x" onclick="window.closePastryCart()" style="background: none; border: none; cursor: pointer; color: #888; font-size: 1.3rem; line-height: 1; padding: 4px;">✕</button>
          </div>
        </div>

        <!-- Free shipping progress bar -->
        ${items.length > 0 ? `
          <div style="background: #FAF7F2; padding: 0.75rem 1.4rem; border-bottom: 1px solid rgba(45,35,25,0.06);">
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; display: flex; justify-content: space-between;">
              <span>${isFreeShipping ? '✨ تبریک! سفارش شما شامل ارسال رایگان است' : `تنها ${window.pastryStore.formatPrice(remainingForFree)} تا ارسال رایگان`}</span>
              <span>${progressPercent}٪</span>
            </div>
            <div style="width: 100%; height: 6px; background: #e5e0d8; border-radius: 10px; overflow: hidden;">
              <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #D4AF37, #B8860B); transition: width 0.35s ease;"></div>
            </div>
          </div>
        ` : ''}

        <!-- Items list -->
        <div class="cart-items-list" style="flex-grow: 1; overflow-y: auto; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.85rem;">
          ${items.length === 0 ? `
            <div style="text-align: center; padding: 3.5rem 1rem; color: var(--text-muted);">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #FAF5EB; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--accent-gold);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h4 style="font-weight: 800; color: var(--text-primary); margin-bottom: 0.4rem; font-size: 1.05rem;">سبد خرید شما خالی است</h4>
              <p style="font-size: 0.82rem; margin-bottom: 1.4rem;">دسرهای تازه و شیرینی‌های بوتیکی را به سبد خود بیفزایید.</p>
              <a href="products.html" onclick="window.closePastryCart()" class="btn-checkout-now" style="display: inline-block; width: auto; padding: 0.65rem 1.6rem; text-decoration: none; font-size: 0.88rem;">
                مشاهده منوی شیرینی‌ها
              </a>
            </div>
          ` : items.map(item => `
            <div class="cart-item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0.9rem; background: #FAF7F2; border-radius: 14px; gap: 0.6rem; border: 1px solid rgba(45,35,25,0.04);">
              <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0;">
                <div style="width: 48px; height: 48px; border-radius: 10px; overflow: hidden; background: #eee; flex-shrink: 0;">
                  ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">` : `
                    <div style="width: 100%; height: 100%; background: #FAF5EB; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: var(--accent-gold); font-weight: 700; text-align: center; padding: 2px;">عکس محصول</div>
                  `}
                </div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
                  <div style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 700; margin-top: 2px;">${window.pastryStore.formatPrice(item.price)}</div>
                </div>
              </div>

              <!-- Stepper and Delete -->
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
                <div style="display: flex; align-items: center; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                  <button onclick="window.updateCartQty('${item.productId}', ${item.quantity - 1})" style="width: 26px; height: 26px; border: none; background: transparent; cursor: pointer; font-weight: 800; font-size: 0.95rem; color: #555;">−</button>
                  <span style="font-size: 0.85rem; font-weight: 800; min-width: 22px; text-align: center;">${new Intl.NumberFormat('fa-IR').format(item.quantity)}</span>
                  <button onclick="window.updateCartQty('${item.productId}', ${item.quantity + 1})" style="width: 26px; height: 26px; border: none; background: transparent; cursor: pointer; font-weight: 800; font-size: 0.95rem; color: #555;">+</button>
                </div>
                <button onclick="window.removeCartItem('${item.productId}')" title="حذف" style="background: none; border: none; color: #999; cursor: pointer; padding: 4px; display: flex; align-items: center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          `).join('')}

          ${items.length > 0 ? `
            <!-- Value Added Options: Gift wrap & Coupon -->
            <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <!-- Gift Wrap Option -->
              <div style="background: #fff; border: 1px dashed rgba(184,134,11,0.3); border-radius: 12px; padding: 0.8rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">
                  <input type="checkbox" id="cart-gift-packaging-check" ${cartState.giftPackaging ? 'checked' : ''} onchange="window.toggleGiftPackaging(this.checked)" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
                  <span>🎁 بسته‌بندی هدیه بوتیکی با روبان طلاکوب (+۳۵,۰۰۰ تومان)</span>
                </label>
                ${cartState.giftPackaging ? `
                  <div style="margin-top: 0.6rem;">
                    <input type="text" id="cart-gift-msg-input" placeholder="متن تبریک روی کارت پستال هدیه..." value="${cartState.giftMessage || ''}" oninput="window.setGiftMessage(this.value)" style="width: 100%; padding: 0.5rem 0.7rem; border-radius: 8px; border: 1px solid #ccc; font-family: inherit; font-size: 0.78rem;">
                  </div>
                ` : ''}
              </div>

              <!-- Coupon Code Input -->
              <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 0.8rem;">
                ${cartState.appliedCoupon ? `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: #ECFDF5; border: 1px solid #A7F3D0; padding: 0.45rem 0.75rem; border-radius: 8px;">
                    <div style="font-size: 0.8rem; color: #065F46; font-weight: 700;">
                      کد تخفیف: <strong>${cartState.appliedCoupon.code}</strong> (${cartState.appliedCoupon.label})
                    </div>
                    <button onclick="window.removeAppliedCoupon()" style="background: none; border: none; color: #EF4444; font-size: 0.78rem; font-weight: 700; cursor: pointer;">✕ لغو کد</button>
                  </div>
                ` : `
                  <div style="display: flex; gap: 0.4rem;">
                    <input type="text" id="cart-coupon-input" placeholder="کد تخفیف (مثال: LUXURY یا VIP)" style="flex: 1; padding: 0.55rem 0.75rem; border-radius: 8px; border: 1px solid #ccc; font-family: inherit; font-size: 0.8rem; text-transform: uppercase;">
                    <button onclick="window.applyCartCoupon()" style="padding: 0.55rem 1rem; border-radius: 8px; border: none; background: var(--accent-gold); color: #fff; font-family: inherit; font-size: 0.8rem; font-weight: 700; cursor: pointer;">اعمال</button>
                  </div>
                `}
                <div id="cart-coupon-msg" style="font-size: 0.74rem; margin-top: 0.35rem; display: none;"></div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Footer Breakdown & Checkout -->
        ${items.length > 0 ? `
          <div class="cart-drawer-footer" style="padding: 1.2rem 1.4rem; border-top: 1px solid rgba(45,35,25,0.08); background: #FAF8F5;">
            <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
                <span>جمع اقلام:</span>
                <span>${window.pastryStore.formatPrice(subtotal)}</span>
              </div>
              ${discountAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; color: #10B981; font-weight: 700;">
                  <span>تخفیف اعمال‌شده:</span>
                  <span>- ${window.pastryStore.formatPrice(discountAmount)}</span>
                </div>
              ` : ''}
              ${cartState.giftPackaging ? `
                <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
                  <span>بسته‌بندی کادویی:</span>
                  <span>${window.pastryStore.formatPrice(GIFT_PACKAGING_COST)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
                <span>هزینه ارسال:</span>
                <span>${isFreeShipping ? '<strong style="color: #10B981;">رایگان (اکسپرس)</strong>' : window.pastryStore.formatPrice(STANDARD_SHIPPING_COST)}</span>
              </div>
              <div style="height: 1px; background: rgba(45,35,25,0.08); margin: 0.3rem 0;"></div>
              <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span style="color: var(--accent-gold);">${window.pastryStore.formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button class="btn-checkout-now" onclick="window.openCheckoutModal()" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>تکمیل نهایی و پرداخت</span>
            </button>
          </div>
        ` : ''}
      `;
    };

    window.closePastryCart = closeCart;

    window.updateCartQty = function(id, qty) {
      if (window.pastryStore) {
        window.pastryStore.updateCartQuantity(id, qty);
        renderSideCart();
      }
    };

    window.removeCartItem = function(id) {
      if (window.pastryStore) {
        window.pastryStore.removeFromCart(id);
        renderSideCart();
      }
    };

    window.clearAllCartItems = function() {
      window.showLuxuryConfirm({
        title: 'خالی کردن سبد خرید',
        message: 'آیا از حذف تمام محصولات از سبد خرید خود اطمینان دارید؟',
        confirmText: 'بله، سبد خالی شود',
        cancelText: 'انصراف',
        isDanger: true,
        onConfirm: () => {
          if (window.pastryStore) {
            window.pastryStore.clearCart();
            cartState.appliedCoupon = null;
            cartState.giftPackaging = false;
            renderSideCart();
            window.showLuxuryToast('سبد خرید خالی شد', 'تمام اقلام با موفقیت از سبد خرید حذف شدند.', 'info');
          }
        }
      });
    };

    window.toggleGiftPackaging = function(checked) {
      cartState.giftPackaging = checked;
      renderSideCart();
    };

    window.setGiftMessage = function(msg) {
      cartState.giftMessage = msg;
    };

    window.applyCartCoupon = function() {
      const input = document.getElementById('cart-coupon-input');
      const msgBox = document.getElementById('cart-coupon-msg');
      if (!input || !window.pastryStore) return;

      const code = input.value.trim();
      const subtotal = window.pastryStore.getCartTotal();
      const res = window.pastryStore.validateCoupon(code, subtotal);

      if (res.valid) {
        cartState.appliedCoupon = { code: res.code, label: res.label, discountAmount: res.discountAmount };
        renderSideCart();
        window.showLuxuryToast('کد تخفیف اعمال شد', res.message, 'success');
      } else {
        if (msgBox) {
          msgBox.textContent = res.message;
          msgBox.style.color = '#EF4444';
          msgBox.style.display = 'block';
        }
        window.showLuxuryToast('کد تخفیف نامعتبر', res.message, 'warning');
      }
    };

    window.removeAppliedCoupon = function() {
      cartState.appliedCoupon = null;
      renderSideCart();
      window.showLuxuryToast('لغو تخفیف', 'کد تخفیف با موفقیت از سفارش حذف شد.', 'info');
    };

    // 4. Header scroll styling
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // 5. Checkout Modal Workflow
    setupCheckoutModal();

    // 6. Customer Account & Locations Modal
    setupCustomerAccountModal();

    // 7. Unified Customer Login + Invisible Staff Easter Egg
    setupUnifiedAuthModal();
  }

  // --- Checkout Modal ---
  function setupCheckoutModal() {
    let modal = document.getElementById('pastry-checkout-modal');
    if (!modal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'pastry-checkout-modal';
      modalEl.className = 'modal-overlay';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.style.display = 'none';
      document.body.appendChild(modalEl);
      modal = modalEl;
    }

    window.openCheckoutModal = function() {
      if (!window.pastryStore) return;
      const items = window.pastryStore.getCart();
      if (items.length === 0) {
        openCart();
        return;
      }

      const subtotal = window.pastryStore.getCartTotal();
      let discountAmount = 0;
      if (cartState.appliedCoupon) {
        const valRes = window.pastryStore.validateCoupon(cartState.appliedCoupon.code, subtotal);
        if (valRes.valid) discountAmount = valRes.discountAmount;
      }
      const giftCost = cartState.giftPackaging ? GIFT_PACKAGING_COST : 0;
      const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
      const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
      const finalTotal = Math.max(0, subtotal - discountAmount + giftCost + shippingCost);

      const custUser = window.pastryStore.getCustomerUser() || {};
      const savedLocations = window.pastryStore.getUserLocations() || [];
      const defaultLoc = window.pastryStore.getDefaultUserLocation() || savedLocations[0] || null;

      const popularDistricts = ['زعفرانیه', 'نیاوران', 'الهیه', 'سعادت‌آباد', 'شهرک غرب', 'تجریش', 'ولنجک', 'ونک', 'جردن', 'پاسداران'];

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 580px; width: 95%; max-height: 90vh; overflow-y: auto;">
          <button class="modal-close-btn" onclick="window.closeCheckoutModal()" aria-label="بستن">✕</button>

          <div style="text-align: center; margin-bottom: 1.2rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(184,134,11,0.1); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.2rem;">تکمیل نهایی و پرداخت سفارش</h3>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              مبلغ قابل پرداخت: <strong style="color: var(--accent-gold); font-size: 1rem;">${window.pastryStore.formatPrice(finalTotal)}</strong>
            </p>
          </div>

          <form id="checkout-order-form" onsubmit="event.preventDefault(); window.submitCheckoutOrder(${finalTotal}, ${discountAmount}, ${giftCost}, ${shippingCost});" style="display: flex; flex-direction: column; gap: 0.85rem;">
            
            <!-- Customer Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">نام تحویل‌گیرنده:</label>
                <input type="text" id="chk-name" value="${custUser.name || defaultLoc?.recipientName || ''}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #ccc; font-family: inherit;" required placeholder="مثال: مریم تهرانی">
              </div>
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">شماره همراه:</label>
                <input type="tel" id="chk-phone" value="${custUser.phone || defaultLoc?.recipientPhone || ''}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #ccc; font-family: inherit; direction: ltr;" required placeholder="۰۹۱۲۳۴۵۶۷۸۹">
              </div>
            </div>

            <!-- Interactive Location Picker Card -->
            <div class="location-picker-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: var(--accent-gold); font-size: 1.1rem;">📍</span>
                  <strong style="font-size: 0.88rem; color: var(--text-primary);">انتخاب موقعیت و آدرس تحویل سفارش</strong>
                </div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">ارسال در بسته‌بندی عایق</span>
              </div>

              <!-- Saved Locations Dropdown / Buttons -->
              ${savedLocations.length > 0 ? `
                <div style="margin-bottom: 0.7rem;">
                  <label style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">
                    آدرس‌های ذخیره‌شده شما:
                  </label>
                  <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                    ${savedLocations.map((loc, idx) => `
                      <button type="button" class="location-chip ${loc.isDefault || idx === 0 ? 'active' : ''}" onclick="window.selectCheckoutSavedLocation('${loc.id}')" style="display: flex; align-items: center; gap: 0.3rem;">
                        <span>${loc.icon === 'work' || loc.icon === 'briefcase' ? '💼' : '🏠'}</span>
                        <span>${loc.title}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Popular Neighborhood Quick Chips -->
              <div style="margin-bottom: 0.6rem;">
                <label style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">
                  انتخاب سریع محله در تهران:
                </label>
                <div class="location-chip-group">
                  ${popularDistricts.map(d => `
                    <button type="button" class="location-chip" onclick="window.selectCheckoutDistrict('${d}')">
                      ${d}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Interactive Map Simulator Box -->
              <div class="map-simulator-box" id="checkout-map-box" onclick="window.handleCheckoutMapClick(event)" title="برای تعیین لوکیشن روی نقشه کلیک کنید">
                <div class="map-grid-pattern"></div>
                <div class="map-streets-layer"></div>
                <button type="button" class="map-btn-gps" onclick="event.stopPropagation(); window.detectCurrentGPSLocation('chk');">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path></svg>
                  <span>دریافت موقعیت GPS</span>
                </button>
                <div class="map-pin-marker" id="chk-map-pin" style="top: 50%; left: 50%;">
                  <div class="map-pin-pulse"></div>
                  <div class="map-pin-icon">
                    <span>📍</span>
                  </div>
                </div>
                <div class="map-badge-coords" id="chk-coords-badge">
                  ${defaultLoc ? `${defaultLoc.lat}° N, ${defaultLoc.lng}° E (${defaultLoc.district || 'موقعیت'})` : '35.8082° N, 51.4173° E (زعفرانیه)'}
                </div>
              </div>

              <!-- Detailed Address Input -->
              <div>
                <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">آدرس کامل پستی و تحویل:</label>
                <textarea id="chk-address" rows="2" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1.5px solid #D1D5DB; font-family: inherit; resize: vertical; font-size: 0.85rem;" required placeholder="تهران، محله، خیابان اصلی، کوچه، پلاک، طبقه، واحد...">${defaultLoc?.address || ''}</textarea>
              </div>

              <label style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.76rem; color: var(--text-secondary); cursor: pointer; margin-top: 0.55rem;">
                <input type="checkbox" id="chk-save-loc-box" checked style="accent-color: var(--accent-gold);">
                <span>ذخیره این آدرس و موقعیت در لیست آدرس‌های حساب کاربری من</span>
              </label>
            </div>

            <!-- Delivery Slot & Payment Method -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">بازه زمانی تحویل:</label>
                <select id="chk-slot" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #ccc; font-family: inherit;">
                  <option value="morning">صبح (۹:۰۰ الی ۱۳:۰۰)</option>
                  <option value="evening" selected>عصر (۱۶:۰۰ الی ۲۱:۰۰)</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">شیوه پرداخت:</label>
                <select id="chk-pay-method" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #ccc; font-family: inherit;">
                  <option value="online">درگاه بانکی شتاب (آنلاین)</option>
                  <option value="cod">کارتخوان در محل تحویل</option>
                </select>
              </div>
            </div>

            <div id="checkout-err-msg" style="display: none; color: #EF4444; font-size: 0.82rem; font-weight: 700; text-align: center;"></div>

            <button type="submit" class="btn-checkout-now" style="padding: 0.9rem; font-size: 1rem; margin-top: 0.3rem;">
              تایید نهایی و ثبت سفارش (${window.pastryStore.formatPrice(finalTotal)})
            </button>
          </form>
        </div>
      `;
      modal.style.display = 'flex';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    window.selectCheckoutSavedLocation = function(locId) {
      if (!window.pastryStore) return;
      const locs = window.pastryStore.getUserLocations();
      const loc = locs.find(l => l.id === locId);
      if (!loc) return;

      const addrInput = document.getElementById('chk-address');
      const badge = document.getElementById('chk-coords-badge');
      const pin = document.getElementById('chk-map-pin');
      const nameInput = document.getElementById('chk-name');
      const phoneInput = document.getElementById('chk-phone');

      if (addrInput) addrInput.value = loc.address;
      if (badge) badge.textContent = `${loc.lat || 35.8082}° N, ${loc.lng || 51.4173}° E (${loc.title})`;
      if (pin) {
        pin.style.left = '50%';
        pin.style.top = '50%';
      }
      if (nameInput && loc.recipientName && !nameInput.value) nameInput.value = loc.recipientName;
      if (phoneInput && loc.recipientPhone && !phoneInput.value) phoneInput.value = loc.recipientPhone;

      document.querySelectorAll('#checkout-order-form .location-chip').forEach(b => b.classList.remove('active'));
      window.showLuxuryToast('لوکیشن انتخاب شد', `آدرس «${loc.title}» روی فرم تحویل اعمال گردید.`, 'info', 2200);
    };

    window.selectCheckoutDistrict = function(district) {
      const addrInput = document.getElementById('chk-address');
      const badge = document.getElementById('chk-coords-badge');
      const pin = document.getElementById('chk-map-pin');

      const districtCoords = {
        'زعفرانیه': { lat: 35.8082, lng: 51.4173, top: 25, left: 52 },
        'نیاوران': { lat: 35.8152, lng: 51.4682, top: 22, left: 68 },
        'الهیه': { lat: 35.7925, lng: 51.4285, top: 35, left: 56 },
        'سعادت‌آباد': { lat: 35.7834, lng: 51.3711, top: 40, left: 32 },
        'شهرک غرب': { lat: 35.7612, lng: 51.3654, top: 52, left: 30 },
        'تجریش': { lat: 35.8055, lng: 51.4312, top: 28, left: 58 },
        'ولنجک': { lat: 35.8144, lng: 51.4021, top: 20, left: 45 },
        'ونک': { lat: 35.7588, lng: 51.3985, top: 55, left: 48 },
        'جردن': { lat: 35.7745, lng: 51.4182, top: 46, left: 54 },
        'پاسداران': { lat: 35.7721, lng: 51.4655, top: 48, left: 66 }
      };

      const c = districtCoords[district] || { lat: 35.8000, lng: 51.4200, top: 50, left: 50 };

      if (pin) {
        pin.style.left = c.left + '%';
        pin.style.top = c.top + '%';
      }
      if (badge) {
        badge.textContent = `${c.lat}° N, ${c.lng}° E (${district})`;
      }
      if (addrInput) {
        let current = addrInput.value.trim();
        if (!current || current.includes('تهران،')) {
          addrInput.value = `تهران، ${district}، خیابان ...، پلاک ...، واحد ...`;
        } else {
          addrInput.value = `تهران، ${district}، ` + current;
        }
        addrInput.focus();
      }
      window.showLuxuryToast('محله انتخاب شد', `محله «${district}» انتخاب شد. لطفاً پلاک و واحد را وارد نمایید.`, 'info', 2200);
    };

    window.handleCheckoutMapClick = function(e) {
      const box = document.getElementById('checkout-map-box');
      const pin = document.getElementById('chk-map-pin');
      const badge = document.getElementById('chk-coords-badge');
      const addrInput = document.getElementById('chk-address');
      if (!box || !pin) return;

      const rect = box.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const pctX = Math.round((clickX / rect.width) * 100);
      const pctY = Math.round((clickY / rect.height) * 100);

      pin.style.left = `${pctX}%`;
      pin.style.top = `${pctY}%`;

      const lat = (35.7400 + ((100 - pctY) / 100) * 0.0800).toFixed(4);
      const lng = (51.3400 + (pctX / 100) * 0.1400).toFixed(4);

      if (badge) {
        badge.textContent = `${lat}° N, ${lng}° E (لوکیشن انتخابی)`;
      }
      if (addrInput && (!addrInput.value || addrInput.value.includes('لوکیشن انتخابی'))) {
        addrInput.value = `تهران، موقعیت پین‌شده روی نقشه (${lat}, ${lng})، پلاک ...`;
      }
    };

    window.closeCheckoutModal = function() {
      modal.style.display = 'none';
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    window.submitCheckoutOrder = function(finalTotal, discount, giftCost, shippingCost) {
      const name = document.getElementById('chk-name').value.trim();
      const phone = document.getElementById('chk-phone').value.trim();
      const address = document.getElementById('chk-address').value.trim();
      const slot = document.getElementById('chk-slot').value;
      const payMethod = document.getElementById('chk-pay-method').value;
      const saveLocChecked = document.getElementById('chk-save-loc-box')?.checked;
      const errBox = document.getElementById('checkout-err-msg');

      // Security validations
      if (window.pastrySecurity) {
        if (!window.pastrySecurity.isValidIranianPhone(phone)) {
          if (errBox) {
            errBox.textContent = 'شماره تلفن همراه معتبر نمی‌باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)';
            errBox.style.display = 'block';
          }
          window.showLuxuryToast('خطای شماره همراه', 'لطفاً یک شماره تلفن معتبر ایرانی وارد فرمایید.', 'warning');
          return;
        }
      }

      if (!address || address.length < 8) {
        if (errBox) {
          errBox.textContent = 'لطفاً آدرس دقیق جهت تحویل سفارش را کامل وارد فرمایید.';
          errBox.style.display = 'block';
        }
        window.showLuxuryToast('آدرس ناقص', 'لطفاً آدرس پستی و پلاک را با جزئیات کامل درج فرمایید.', 'warning');
        return;
      }

      // If user opted to save location to profile
      if (saveLocChecked && window.pastryStore) {
        const badgeText = document.getElementById('chk-coords-badge')?.textContent || '';
        window.pastryStore.saveUserLocation({
          title: 'آدرس تحویل ' + (name || 'من'),
          address: address,
          recipientName: name,
          recipientPhone: phone,
          notes: badgeText,
          isDefault: true
        });
      }

      const orderData = {
        customerName: window.pastrySecurity ? window.pastrySecurity.sanitize(name) : name,
        customerPhone: phone,
        deliveryAddress: window.pastrySecurity ? window.pastrySecurity.sanitize(address) : address,
        timeSlot: slot === 'morning' ? 'صبح (۹ تا ۱۳)' : 'عصر (۱۶ تا ۲۱)',
        paymentMethod: payMethod === 'online' ? 'درگاه آنلاین شاپرک' : 'کارتخوان در محل',
        items: window.pastryStore.getCart(),
        discountAmount: discount,
        giftCost: giftCost,
        giftMessage: cartState.giftMessage || '',
        shippingCost: shippingCost,
        finalTotal: finalTotal
      };

      const newOrder = window.pastryStore.saveShopOrder(orderData);
      window.showLuxuryToast('سفارش ثبت شد', `سفارش شما با کد ${newOrder.id} ثبت گردید.`, 'success');

      // Render Celebratory Confirmation screen
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 480px; width: 94%; text-align: center; padding: 2rem 1.5rem;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem;">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.4rem;">سفارش شما با موفقیت ثبت شد!</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.2rem;">
            دسرهای دست‌ساز و تازه شما در حال آماده‌سازی توسط بهترین قنادان ما هستند.
          </p>

          <div style="background: #FAF7F2; padding: 1rem; border-radius: 14px; text-align: right; margin-bottom: 1.4rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">کد پیگیری سفارش:</span>
              <strong style="color: var(--accent-gold); font-size: 0.95rem;">${newOrder.id}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">زمان تحویل:</span>
              <span>${newOrder.timeSlot}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">مبلغ پرداخت‌شده:</span>
              <strong style="color: var(--text-primary);">${window.pastryStore.formatPrice(newOrder.finalTotal)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">تحویل به:</span>
              <span>${newOrder.customerName}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">آدرس تحویل:</span>
              <span style="max-width: 65%; text-align: left; direction: rtl; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${newOrder.deliveryAddress}</span>
            </div>
          </div>

          <button onclick="window.closeCheckoutModal(); window.closePastryCart();" class="btn-checkout-now" style="padding: 0.85rem;">
            بازگشت به فروشگاه
          </button>
        </div>
      `;

      // Reset cart UI state
      cartState.appliedCoupon = null;
      cartState.giftPackaging = false;
      cartState.giftMessage = '';
      window.renderSideCart();
    };
  }

  // --- 6. Luxury Customer Account & Location Management Modal ---
  function setupCustomerAccountModal() {
    let custModal = document.getElementById('customer-account-modal');
    if (!custModal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'customer-account-modal';
      modalEl.className = 'modal-overlay';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.style.display = 'none';
      document.body.appendChild(modalEl);
      custModal = modalEl;
    }

    let activeCustTab = 'locations';

    window.openCustomerAccountModal = function() {
      if (!window.pastryStore) return;
      const custUser = window.pastryStore.getCustomerUser();
      if (!custUser || !custUser.phone) {
        window.openAuthModal();
        return;
      }
      renderCustomerAccountContent();
      custModal.style.display = 'flex';
      custModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    window.closeCustomerAccountModal = function() {
      custModal.style.display = 'none';
      custModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    window.switchCustomerTab = function(tabName) {
      activeCustTab = tabName;
      renderCustomerAccountContent();
    };

    function renderCustomerAccountContent() {
      const custUser = window.pastryStore.getCustomerUser() || { name: 'مشتری گرامی', phone: '' };
      const locations = window.pastryStore.getUserLocations() || [];
      const orders = window.pastryStore.getCustomerOrders(custUser.phone) || [];
      const popularDistricts = ['زعفرانیه', 'نیاوران', 'الهیه', 'سعادت‌آباد', 'شهرک غرب', 'تجریش', 'ولنجک', 'ونک', 'جردن', 'پاسداران'];

      custModal.innerHTML = `
        <div class="modal-content" style="max-width: 620px; width: 95%; max-height: 90vh; overflow-y: auto;">
          <button class="modal-close-btn" onclick="window.closeCustomerAccountModal()" aria-label="بستن">✕</button>

          <!-- Customer Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.9rem; border-bottom: 1.5px solid #F3EDE0; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 46px; height: 46px; border-radius: 50%; background: rgba(184,134,11,0.12); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                👤
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0 0 2px;">
                  ${custUser.name || 'مشتری گرامی'}
                </h3>
                <div style="font-size: 0.76rem; color: var(--text-muted); font-family: monospace; direction: ltr; display: inline-block;">
                  ${custUser.phone || ''}
                </div>
              </div>
            </div>
            <button onclick="window.handleCustomerLogout()" style="background: #FEE2E2; border: 1px solid #FCA5A5; color: #DC2626; border-radius: 10px; padding: 0.4rem 0.8rem; font-size: 0.76rem; font-weight: 700; cursor: pointer; font-family: inherit;">
              خروج از حساب
            </button>
          </div>

          <!-- Account Tabs Navigation -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.6rem;">
            <button type="button" class="admin-tab-btn ${activeCustTab === 'locations' ? 'active' : ''}" onclick="window.switchCustomerTab('locations')" style="font-size: 0.84rem;">
              📍 لوکیشن‌ها و آدرس‌های من (${new Intl.NumberFormat('fa-IR').format(locations.length)})
            </button>
            <button type="button" class="admin-tab-btn ${activeCustTab === 'orders' ? 'active' : ''}" onclick="window.switchCustomerTab('orders')" style="font-size: 0.84rem;">
              📦 سفارشات من (${new Intl.NumberFormat('fa-IR').format(orders.length)})
            </button>
            <button type="button" class="admin-tab-btn ${activeCustTab === 'profile' ? 'active' : ''}" onclick="window.switchCustomerTab('profile')" style="font-size: 0.84rem;">
              👤 مشخصات من
            </button>
          </div>

          <!-- Tab Content: Locations -->
          <div id="cust-tab-locations" style="display: ${activeCustTab === 'locations' ? 'block' : 'none'};">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <span style="font-size: 0.82rem; color: var(--text-secondary); font-weight: 700;">آدرس‌های ذخیره‌شده جهت تحویل سریع:</span>
              <button type="button" onclick="window.toggleAddNewLocationForm()" class="btn-checkout-now" style="width: auto; padding: 0.4rem 0.9rem; font-size: 0.78rem;">
                ➕ افزودن لوکیشن جدید
              </button>
            </div>

            <!-- Form: Add New Location (Inline expandable) -->
            <div id="cust-add-loc-form" style="display: none; background: #FAF8F5; border: 1.5px solid #F3EDE0; border-radius: 18px; padding: 1.2rem; margin-bottom: 1.2rem; animation: fadeIn 0.3s ease;">
              <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.8rem; color: var(--accent-gold);">ثبت موقعیت و لوکیشن جدید</h4>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; margin-bottom: 0.8rem;">
                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 0.2rem;">عنوان آدرس (مثال: منزل، محل کار، ویلا):</label>
                  <input type="text" id="new-loc-title" placeholder="عنوان آدرس..." style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #ccc; font-family: inherit;">
                </div>
                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 0.2rem;">نام تحویل‌گیرنده:</label>
                  <input type="text" id="new-loc-recipient" value="${custUser.name || ''}" placeholder="نام تحویل‌گیرنده..." style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #ccc; font-family: inherit;">
                </div>
              </div>

              <!-- Quick Neighborhoods for new location -->
              <div style="margin-bottom: 0.6rem;">
                <label style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.3rem;">
                  انتخاب سریع محدوده در تهران:
                </label>
                <div class="location-chip-group">
                  ${popularDistricts.map(d => `
                    <button type="button" class="location-chip" onclick="window.selectNewLocDistrict('${d}')">
                      ${d}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Map Simulator Box for new location -->
              <div class="map-simulator-box" id="new-loc-map-box" onclick="window.handleNewLocMapClick(event)" title="برای تعیین لوکیشن کلیک فرمایید">
                <div class="map-grid-pattern"></div>
                <div class="map-streets-layer"></div>
                <button type="button" class="map-btn-gps" onclick="event.stopPropagation(); window.detectCurrentGPSLocation('newloc');">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path></svg>
                  <span>دریافت موقعیت GPS</span>
                </button>
                <div class="map-pin-marker" id="newloc-map-pin" style="top: 50%; left: 50%;">
                  <div class="map-pin-pulse"></div>
                  <div class="map-pin-icon"><span>📍</span></div>
                </div>
                <div class="map-badge-coords" id="newloc-coords-badge">
                  35.8082° N, 51.4173° E (زعفرانیه)
                </div>
              </div>

              <div style="margin-bottom: 0.8rem;">
                <label style="font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 0.2rem;">آدرس دقیق و پلاک:</label>
                <textarea id="new-loc-address" rows="2" placeholder="تهران، محله، خیابان، کوچه، پلاک، طبقه..." style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1.5px solid #ccc; font-family: inherit; font-size: 0.82rem;"></textarea>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button type="button" onclick="window.toggleAddNewLocationForm()" class="btn-dialog-cancel" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                  انصراف
                </button>
                <button type="button" onclick="window.saveNewCustomerLocation()" class="btn-checkout-now" style="width: auto; padding: 0.5rem 1.4rem; font-size: 0.8rem;">
                  ذخیره لوکیشن جدید
                </button>
              </div>
            </div>

            <!-- List of existing saved locations -->
            <div id="cust-locations-list">
              ${locations.length === 0 ? `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted); background: #FAF8F5; border-radius: 14px;">
                  هنوز آدرسی ثبت نکرده‌اید. با کلیک بر روی دکمه بالا لوکیشن تحویل خود را اضافه نمایید.
                </div>
              ` : locations.map(loc => `
                <div class="saved-loc-card" style="display: flex; flex-direction: column; gap: 0.4rem; padding: 1rem 1.2rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <span style="font-size: 1.1rem;">${loc.icon === 'work' || loc.icon === 'briefcase' ? '💼' : '🏠'}</span>
                      <strong style="font-size: 0.95rem; color: var(--text-primary);">${loc.title}</strong>
                      ${loc.isDefault ? `
                        <span style="background: #FEF3C7; color: #92400E; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 6px;">پیش‌فرض</span>
                      ` : ''}
                    </div>
                    <div style="display: flex; gap: 0.4rem;">
                      ${!loc.isDefault ? `
                        <button type="button" onclick="window.setCustDefaultLoc('${loc.id}')" style="background: none; border: 1px solid #D1D5DB; border-radius: 6px; padding: 3px 8px; font-size: 0.72rem; cursor: pointer; font-family: inherit;">
                          انتخاب پیش‌فرض
                        </button>
                      ` : ''}
                      <button type="button" onclick="window.deleteCustLoc('${loc.id}', '${loc.title}')" style="background: none; border: 1px solid #FCA5A5; color: #EF4444; border-radius: 6px; padding: 3px 8px; font-size: 0.72rem; cursor: pointer; font-family: inherit;">
                        حذف
                      </button>
                    </div>
                  </div>

                  <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                    ${loc.address}
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; color: var(--text-muted); margin-top: 0.2rem;">
                    <span>تحویل به: ${loc.recipientName || custUser.name || 'مشتری'} (${loc.recipientPhone || custUser.phone})</span>
                    <span style="direction: ltr; font-family: monospace; background: rgba(0,0,0,0.04); padding: 1px 6px; border-radius: 4px;">${loc.lat || '35.8082'}, ${loc.lng || '51.4173'}</span>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>

          <!-- Tab Content: Orders -->
          <div id="cust-tab-orders" style="display: ${activeCustTab === 'orders' ? 'block' : 'none'};">
            ${orders.length === 0 ? `
              <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: #FAF8F5; border-radius: 14px;">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
                <h4 style="font-weight: 800; color: var(--text-primary); margin-bottom: 0.3rem;">هنوز سفارشی ثبت نکرده‌اید</h4>
                <p style="font-size: 0.82rem; margin-bottom: 1.2rem;">شیرینی‌ها و دسرهای روز ما را در بخش منو مشاهده نمایید.</p>
                <a href="products.html" onclick="window.closeCustomerAccountModal()" class="btn-checkout-now" style="display: inline-block; width: auto; padding: 0.6rem 1.6rem; text-decoration: none; font-size: 0.85rem;">
                  مشاهده منوی محصولات
                </a>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${orders.map(o => `
                  <div style="background: #FAF8F5; border: 1px solid #EFE9DE; border-radius: 16px; padding: 1rem 1.2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <div>
                        <span style="font-size: 0.78rem; color: var(--text-muted);">کد سفارش:</span>
                        <strong style="color: var(--accent-gold); font-size: 0.95rem; margin-right: 4px;">${o.id}</strong>
                      </div>
                      <span style="background: #ECFDF5; color: #065F46; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 6px;">
                        ${o.status || 'در حال آماده‌سازی و ارسال'}
                      </span>
                    </div>

                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                      <div>زمان ثبت: ${o.persianDate || 'امروز'} | بازه تحویل: ${o.timeSlot || 'عصر'}</div>
                      <div style="margin-top: 2px;">آدرس تحویل: ${o.deliveryAddress || 'آدرس پیش‌فرض'}</div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E5E7EB; padding-top: 0.5rem; font-size: 0.85rem;">
                      <span>مبلغ کل: <strong style="color: var(--text-primary);">${window.pastryStore.formatPrice(o.finalTotal)}</strong></span>
                      <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700;">${o.paymentMethod || 'پرداخت آنلاین'}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Tab Content: Profile -->
          <div id="cust-tab-profile" style="display: ${activeCustTab === 'profile' ? 'block' : 'none'};">
            <form onsubmit="event.preventDefault(); window.saveCustomerProfileInfo();" style="display: flex; flex-direction: column; gap: 0.85rem; background: #FAF8F5; border-radius: 16px; padding: 1.2rem; border: 1px solid #EFE9DE;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 0.25rem;">نام و نام خانوادگی:</label>
                <input type="text" id="cust-prof-name" value="${custUser.name || ''}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #ccc; font-family: inherit;" required>
              </div>
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 0.25rem;">شماره همراه:</label>
                <input type="tel" value="${custUser.phone || ''}" readonly style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #ddd; background: #eee; font-family: inherit; direction: ltr; color: #666;">
                <small style="font-size: 0.72rem; color: #888;">شماره همراه جهت ورود به سیستم و پیامک‌های اطلاع‌رسانی است.</small>
              </div>
              <button type="submit" class="btn-checkout-now" style="width: auto; padding: 0.75rem 2rem; margin-top: 0.4rem; align-self: flex-start;">
                ذخیره اطلاعات حساب
              </button>
            </form>
          </div>

        </div>
      `;
    }

    window.toggleAddNewLocationForm = function() {
      const f = document.getElementById('cust-add-loc-form');
      if (f) {
        f.style.display = f.style.display === 'none' ? 'block' : 'none';
        if (f.style.display === 'block') {
          f.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    window.selectNewLocDistrict = function(district) {
      const addrInput = document.getElementById('new-loc-address');
      const badge = document.getElementById('newloc-coords-badge');
      const pin = document.getElementById('newloc-map-pin');

      const districtCoords = {
        'زعفرانیه': { lat: 35.8082, lng: 51.4173, top: 25, left: 52 },
        'نیاوران': { lat: 35.8152, lng: 51.4682, top: 22, left: 68 },
        'الهیه': { lat: 35.7925, lng: 51.4285, top: 35, left: 56 },
        'سعادت‌آباد': { lat: 35.7834, lng: 51.3711, top: 40, left: 32 },
        'شهرک غرب': { lat: 35.7612, lng: 51.3654, top: 52, left: 30 },
        'تجریش': { lat: 35.8055, lng: 51.4312, top: 28, left: 58 },
        'ولنجک': { lat: 35.8144, lng: 51.4021, top: 20, left: 45 },
        'ونک': { lat: 35.7588, lng: 51.3985, top: 55, left: 48 },
        'جردن': { lat: 35.7745, lng: 51.4182, top: 46, left: 54 },
        'پاسداران': { lat: 35.7721, lng: 51.4655, top: 48, left: 66 }
      };

      const c = districtCoords[district] || { lat: 35.8000, lng: 51.4200, top: 50, left: 50 };

      if (pin) {
        pin.style.left = c.left + '%';
        pin.style.top = c.top + '%';
      }
      if (badge) {
        badge.textContent = `${c.lat}° N, ${c.lng}° E (${district})`;
      }
      if (addrInput) {
        addrInput.value = `تهران، ${district}، خیابان ...، پلاک ...، واحد ...`;
        addrInput.focus();
      }
    };

    window.handleNewLocMapClick = function(e) {
      const box = document.getElementById('new-loc-map-box');
      const pin = document.getElementById('newloc-map-pin');
      const badge = document.getElementById('newloc-coords-badge');
      const addrInput = document.getElementById('new-loc-address');
      if (!box || !pin) return;

      const rect = box.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const pctX = Math.round((clickX / rect.width) * 100);
      const pctY = Math.round((clickY / rect.height) * 100);

      pin.style.left = `${pctX}%`;
      pin.style.top = `${pctY}%`;

      const lat = (35.7400 + ((100 - pctY) / 100) * 0.0800).toFixed(4);
      const lng = (51.3400 + (pctX / 100) * 0.1400).toFixed(4);

      if (badge) {
        badge.textContent = `${lat}° N, ${lng}° E (لوکیشن انتخابی)`;
      }
      if (addrInput && (!addrInput.value || addrInput.value.includes('لوکیشن انتخابی'))) {
        addrInput.value = `تهران، موقعیت پین‌شده روی نقشه (${lat}, ${lng})، پلاک ...`;
      }
    };

    window.saveNewCustomerLocation = function() {
      const title = (document.getElementById('new-loc-title')?.value || '').trim();
      const recipient = (document.getElementById('new-loc-recipient')?.value || '').trim();
      const address = (document.getElementById('new-loc-address')?.value || '').trim();
      const badge = document.getElementById('newloc-coords-badge')?.textContent || '';

      if (!title) {
        window.showLuxuryToast('عنوان الزامی است', 'لطفاً عنوانی برای آدرس مانند منزل یا شرکت بنویسید.', 'warning');
        return;
      }
      if (!address || address.length < 8) {
        window.showLuxuryToast('آدرس ناقص است', 'لطفاً آدرس پستی را به طور کامل درج نمایید.', 'warning');
        return;
      }

      window.pastryStore.saveUserLocation({
        title,
        recipientName: recipient,
        address,
        notes: badge,
        isDefault: false
      });

      window.showLuxuryToast('لوکیشن افزوده شد', `لوکیشن «${title}» با موفقیت به حساب شما اضافه شد.`, 'success');
      renderCustomerAccountContent();
    };

    window.setCustDefaultLoc = function(id) {
      if (window.pastryStore) {
        window.pastryStore.setDefaultUserLocation(id);
        window.showLuxuryToast('آدرس پیش‌فرض تغییر کرد', 'این آدرس به عنوان مقصد پیش‌فرض سفارش‌ها انتخاب شد.', 'success');
        renderCustomerAccountContent();
      }
    };

    window.deleteCustLoc = function(id, title) {
      window.showLuxuryConfirm({
        title: 'حذف لوکیشن',
        message: `آیا از حذف آدرس «${title || 'انتخابی'}» از لیست خود اطمینان دارید؟`,
        confirmText: 'بله، حذف شود',
        cancelText: 'انصراف',
        isDanger: true,
        onConfirm: () => {
          if (window.pastryStore) {
            window.pastryStore.deleteUserLocation(id);
            window.showLuxuryToast('لوکیشن حذف شد', 'آدرس موردنظر با موفقیت حذف گردید.', 'info');
            renderCustomerAccountContent();
          }
        }
      });
    };

    window.saveCustomerProfileInfo = function() {
      const name = (document.getElementById('cust-prof-name')?.value || '').trim();
      if (!name) {
        window.showLuxuryToast('نام الزامی است', 'لطفاً نام و نام خانوادگی خود را وارد فرمایید.', 'warning');
        return;
      }
      const cur = window.pastryStore.getCustomerUser() || {};
      window.pastryStore.saveCustomerUser({ ...cur, name });
      updateHeaderUserStatus();
      window.showLuxuryToast('اطلاعات ذخیره شد', 'مشخصات حساب کاربری با موفقیت به‌روزرسانی شد.', 'success');
      renderCustomerAccountContent();
    };

    window.handleCustomerLogout = function() {
      window.showLuxuryConfirm({
        title: 'خروج از حساب کاربری',
        message: 'آیا مایلید از حساب کاربری خود خارج شوید؟',
        confirmText: 'بله، خروج',
        cancelText: 'انصراف',
        isDanger: false,
        onConfirm: () => {
          window.pastryStore.logoutCustomer();
          updateHeaderUserStatus();
          window.closeCustomerAccountModal();
          window.showLuxuryToast('خروج موفق', 'از حساب کاربری خارج شدید.', 'info');
        }
      });
    };
  }

  // --- 7. Unified Customer Login + Invisible Staff Easter Egg ---
  function setupUnifiedAuthModal() {
    let authModal = document.getElementById('unified-auth-modal');
    if (!authModal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'unified-auth-modal';
      modalEl.className = 'modal-overlay';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.innerHTML = `
        <div class="modal-content" style="max-width: 420px; width: 92%;">
          <button class="modal-close-btn" id="unified-auth-close" aria-label="بستن">✕</button>

          <div style="text-align: center; margin-bottom: 1.2rem;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(184, 134, 11, 0.1); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.8rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 class="modal-title" style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.3rem;">ورود / ثبت نام</h3>
            <p class="modal-subtitle" style="font-size: 0.82rem; color: var(--text-muted);">
              جهت پیگیری سفارشات و خرید آسان مشخصات خود را وارد فرمایید.
            </p>
          </div>

          <!-- Customer Form (Single Clean Entry) -->
          <form id="unified-customer-form" onsubmit="event.preventDefault(); window.handleCustomerAuthSubmit();">
            <div class="form-field" style="margin-bottom: 1rem;">
              <label class="form-label" for="auth-phone-input" style="font-size: 0.84rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">شماره همراه:</label>
              <input type="text" id="auth-phone-input" class="form-input" placeholder="۰۹۱۲۳۴۵۶۷۸۹" oninput="window.checkEasterEggTrigger(this.value)" style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1.5px solid #ccc; font-family: inherit; direction: ltr;" required>
            </div>

            <!-- Secret Staff Access Box (Smoothly expands when secret keyword is entered) -->
            <div id="staff-easter-egg-box" style="display: none; background: #FFFBEB; border: 1.5px solid #FCD34D; border-radius: 12px; padding: 0.9rem; margin-bottom: 1rem; animation: fadeIn 0.3s ease;">
              <div style="display: flex; align-items: center; gap: 0.4rem; color: #B45309; font-size: 0.82rem; font-weight: 800; margin-bottom: 0.6rem;">
                <span>🔐</span>
                <span>دسترسی پرسنل و مدیریت فعال شد</span>
              </div>
              <div style="margin-bottom: 0.6rem;">
                <label style="font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 0.2rem; color: #78350F;">نام کاربری پرسنل:</label>
                <input type="text" id="easter-username-input" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid #D97706; font-family: inherit; direction: ltr;" placeholder="نام کاربری...">
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 0.2rem; color: #78350F;">رمز عبور:</label>
                <input type="password" id="easter-password-input" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid #D97706; font-family: inherit; direction: ltr;" placeholder="رمز عبور...">
              </div>
            </div>

            <div id="auth-feedback-msg" style="display: none; font-size: 0.8rem; margin-bottom: 0.8rem; font-weight: 700; text-align: center;"></div>

            <button type="submit" id="auth-main-submit-btn" class="btn-checkout-now" style="width: 100%; padding: 0.85rem;">
              دریافت کد تایید ورود
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(modalEl);
      authModal = modalEl;
    }

    const openBtns = document.querySelectorAll('.open-auth-modal, #auth-btn, .btn-auth-nav');
    const closeBtn = document.getElementById('unified-auth-close');

    function openAuthModal() {
      if (authModal) authModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const eggBox = document.getElementById('staff-easter-egg-box');
      if (eggBox) eggBox.style.display = 'none';
      const btn = document.getElementById('auth-main-submit-btn');
      if (btn) btn.textContent = 'دریافت کد تایید ورود';
      const msg = document.getElementById('auth-feedback-msg');
      if (msg) msg.style.display = 'none';
    }

    function closeAuthModal() {
      if (authModal) authModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    openBtns.forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      const curUser = window.pastryStore ? window.pastryStore.getCurrentUser() : null;
      if (curUser && (curUser.role === 'admin' || curUser.role === 'ceo')) {
        window.location.href = 'admin.html';
        return;
      }
      const custUser = window.pastryStore ? window.pastryStore.getCustomerUser() : null;
      if (custUser && custUser.phone) {
        window.openCustomerAccountModal();
        return;
      }
      openAuthModal();
    }));

    if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    // Secret keyword detector on typing in customer phone field
    window.checkEasterEggTrigger = function(val) {
      const eggBox = document.getElementById('staff-easter-egg-box');
      const userInput = document.getElementById('easter-username-input');
      const passInput = document.getElementById('easter-password-input');
      const submitBtn = document.getElementById('auth-main-submit-btn');
      if (!window.pastryStore || !eggBox) return;

      if (window.pastryStore.isEasterEggWord(val)) {
        eggBox.style.display = 'block';
        if (submitBtn) submitBtn.textContent = 'ورود به پنل مدیریت';
        if (userInput && !userInput.value) {
          userInput.focus();
        } else if (passInput && !passInput.value) {
          passInput.focus();
        }
      } else {
        if (!eggBox.matches(':hover') && !passInput?.value) {
          eggBox.style.display = 'none';
          if (submitBtn) submitBtn.textContent = 'دریافت کد تایید ورود';
        }
      }
    };

    // Form Submit Handler
    window.handleCustomerAuthSubmit = function() {
      const phoneInput = document.getElementById('auth-phone-input');
      const eggBox = document.getElementById('staff-easter-egg-box');
      const userInput = document.getElementById('easter-username-input');
      const passInput = document.getElementById('easter-password-input');
      const msgBox = document.getElementById('auth-feedback-msg');

      const val = (phoneInput?.value || '').trim();

      // If Easter Egg box is active or secret word entered: Staff authentication
      if (eggBox && eggBox.style.display !== 'none' || (window.pastryStore && window.pastryStore.isEasterEggWord(val))) {
        const username = (userInput?.value || val).trim();
        const password = (passInput?.value || '').trim();

        if (!password) {
          if (msgBox) {
            msgBox.textContent = 'لطفاً رمز عبور پرسنل را وارد فرمایید.';
            msgBox.style.color = '#EF4444';
            msgBox.style.display = 'block';
          }
          passInput?.focus();
          return;
        }

        const res = window.pastryStore.authenticateAdmin(username, password);
        if (res.success) {
          closeAuthModal();
          window.location.href = 'admin.html';
        } else {
          if (msgBox) {
            msgBox.textContent = res.error || 'اطلاعات ورود نامعتبر است.';
            msgBox.style.color = '#EF4444';
            msgBox.style.display = 'block';
          }
          window.showLuxuryToast('خطای ورود', res.error || 'اطلاعات ورود پرسنل صحیح نمی‌باشد.', 'error');
        }
        return;
      }

      // Ordinary Customer Mobile Phone Flow
      if (window.pastrySecurity) {
        if (!window.pastrySecurity.isValidIranianPhone(val)) {
          if (msgBox) {
            msgBox.textContent = 'شماره همراه معتبر نمی‌باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)';
            msgBox.style.color = '#EF4444';
            msgBox.style.display = 'block';
          }
          window.showLuxuryToast('شماره نامعتبر', 'لطفاً شماره تلفن همراه ۱۱ رقمی معتبر وارد فرمایید.', 'warning');
          return;
        }
      }

      window.pastryStore.saveCustomerUser({ phone: val, name: 'مشتری گرامی' });
      closeAuthModal();
      updateHeaderUserStatus();
      window.showLuxuryToast('خوش آمدید', 'ورود شما به باشگاه مشتریان با موفقیت انجام شد.', 'success');
      window.openCustomerAccountModal();
    };

    updateHeaderUserStatus();
  }

  function updateHeaderUserStatus() {
    if (!window.pastryStore) return;
    const curUser = window.pastryStore.getCurrentUser();
    const custUser = window.pastryStore.getCustomerUser();
    const authBtns = document.querySelectorAll('.btn-auth-nav span, #auth-btn span');
    authBtns.forEach(span => {
      if (curUser && curUser.role === 'ceo') {
        span.textContent = curUser.name || 'مدیرعامل';
      } else if (curUser && curUser.role === 'admin') {
        span.textContent = curUser.name || 'مدیریت';
      } else if (custUser && custUser.phone) {
        span.textContent = custUser.name || 'حساب من';
      } else {
        span.textContent = 'ورود / ثبت نام';
      }
    });
    // Inject Dynamic SEO Meta tags
    applyDynamicSEO();
  }

  function applyDynamicSEO() {
    if (!window.pastryStore || typeof window.pastryStore.getSiteSEO !== 'function') return;
    const seo = window.pastryStore.getSiteSEO();
    if (!seo) return;

    // 1. Meta Title (apply to homepage or append brand)
    if (seo.metaTitle) {
      const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
      if (isHome) {
        document.title = seo.metaTitle;
      }
    }

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    if (seo.metaDescription) {
      metaDesc.content = seo.metaDescription;
    }

    // 3. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords && seo.metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    if (metaKeywords && seo.metaKeywords) {
      metaKeywords.content = seo.metaKeywords;
    }

    // 4. Open Graph (OG) tags
    const ogData = [
      { property: 'og:title', content: seo.metaTitle },
      { property: 'og:description', content: seo.metaDescription },
      { property: 'og:url', content: seo.canonicalUrl || window.location.href },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: seo.ogImage || 'images/branch_1.jpg' }
    ];
    ogData.forEach(t => {
      let el = document.querySelector(`meta[property="${t.property}"]`);
      if (!el && t.content) {
        el = document.createElement('meta');
        el.setAttribute('property', t.property);
        document.head.appendChild(el);
      }
      if (el && t.content) el.content = t.content;
    });

    // 5. Schema.org JSON-LD (LocalBusiness / Bakery)
    if (seo.enableSchema) {
      let schemaScript = document.getElementById('pastry-schema-jsonld');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'pastry-schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Bakery",
        "name": seo.brandName || "قنادی و دسرسازی فاخر",
        "description": seo.metaDescription,
        "url": seo.canonicalUrl || window.location.href,
        "image": seo.ogImage || "images/branch_1.jpg",
        "priceRange": "$$",
        "servesCuisine": "Artisanal Pastry, Viennoiserie, French & Persian Traditional Sweets",
        "hasMenu": "products.html"
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavAndCart);
  } else {
    initNavAndCart();
  }
})();
