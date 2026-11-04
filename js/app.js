/**
 * DevLog — app.js
 * Core application utilities: navbar, animations, toasts, modals
 */

'use strict';

// ── Toast Notifications ──────────────────────────────────────────────────────
const ToastManager = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = 4000) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Dismiss notification">✕</button>
    `;
    const c = getContainer();
    c.appendChild(toast);

    const remove = () => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 400);
    };
    toast.querySelector('.toast-close').addEventListener('click', remove);
    if (duration > 0) setTimeout(remove, duration);
    return toast;
  }

  return { show };
})();

window.Toast = ToastManager;

// ── Modal Manager ─────────────────────────────────────────────────────────────
const ModalManager = (() => {
  function open(overlayEl) {
    overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstFocusable = overlayEl.querySelector('button, input, select, textarea, a[href]');
    if (firstFocusable) firstFocusable.focus();
  }
  function close(overlayEl) {
    overlayEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) close(e.target);
    if (e.target.classList.contains('modal-close')) close(e.target.closest('.modal-overlay'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal-overlay.open');
      if (open) close(open);
    }
  });
  return { open, close };
})();

window.Modal = ModalManager;

// ── Navbar ────────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll shadow
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  navbar.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPath) link.classList.add('active');
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }
}

// ── Scroll Animations ─────────────────────────────────────────────────────────
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), +delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 70;
    obs.observe(el);
  });
}

// ── Auth Guard ────────────────────────────────────────────────────────────────
function requireAuth(redirectTo = 'login.html') {
  const user = Storage.getUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

function redirectIfAuth(redirectTo = 'dashboard.html') {
  const user = Storage.getUser();
  if (user) window.location.href = redirectTo;
}

window.requireAuth = requireAuth;
window.redirectIfAuth = redirectIfAuth;

// ── Storage Helper ────────────────────────────────────────────────────────────
const Storage = {
  get(key) {
    try {
      const val = localStorage.getItem(`DevLog_${key}`);
      if (val !== null) return JSON.parse(val);
      return JSON.parse(localStorage.getItem(`BlogCraft_${key}`));
    } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(`DevLog_${key}`, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(`DevLog_${key}`);
    localStorage.removeItem(`BlogCraft_${key}`);
  },

  getUser()   { return this.get('user'); },
  setUser(u)  { this.set('user', u); },
  clearUser() { this.remove('user'); },

  getContent() { return this.get('content') || []; },
  setContent(c) { this.set('content', c); },
};

window.Storage = Storage;

// ── Update Navbar Auth State ──────────────────────────────────────────────────
function updateNavAuth() {
  const user = Storage.getUser();
  const loginBtns  = document.querySelectorAll('.nav-login');
  const signupBtns = document.querySelectorAll('.nav-signup');
  const dashBtns   = document.querySelectorAll('.nav-dashboard');
  const logoutBtns = document.querySelectorAll('.nav-logout');

  if (user) {
    loginBtns.forEach(b  => b.style.display = 'none');
    signupBtns.forEach(b => b.style.display = 'none');
    dashBtns.forEach(b   => b.style.display = '');
    logoutBtns.forEach(b => b.style.display = '');
  } else {
    loginBtns.forEach(b  => b.style.display = '');
    signupBtns.forEach(b => b.style.display = '');
    dashBtns.forEach(b   => b.style.display = 'none');
    logoutBtns.forEach(b => b.style.display = 'none');
  }

  logoutBtns.forEach(b => {
    b.addEventListener('click', () => {
      Storage.clearUser();
      Toast.show('Logged out successfully.', 'info');
      setTimeout(() => window.location.href = 'index.html', 1000);
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  updateNavAuth();
});
