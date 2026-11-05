/**
 * DevLog — auth.js
 * Login and Registration logic with backend API integration
 */

'use strict';

// ── Backend API ───────────────────────────────────────────────────────────────

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://devlog-api.onrender.com/api'; // ← update to your deployed backend URL

// ── Validation Helpers ────────────────────────────────────────────────────────

const Validate = {
  required: (v) => v && v.trim().length > 0,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  minLen: (v, n) => v && v.trim().length >= n,
  hasUpper: (v) => /[A-Z]/.test(v),
  hasLower: (v) => /[a-z]/.test(v),
  hasNum: (v) => /[0-9]/.test(v),
};

function showFieldError(inputEl, errorEl, msg) {
  if (inputEl) {
    inputEl.classList.add('error');
    inputEl.classList.remove('success');
  }

  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }
}

function showFieldSuccess(inputEl, errorEl) {
  if (inputEl) {
    inputEl.classList.remove('error');
    inputEl.classList.add('success');
  }

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function clearField(inputEl, errorEl) {
  if (inputEl) {
    inputEl.classList.remove('error', 'success');
  }

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

// ── Password Strength ─────────────────────────────────────────────────────────

function getPasswordStrength(pw) {
  let score = 0;

  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  return score;
}

function renderStrengthBar(container, score) {
  if (!container) return;

  const labels = [
    '',
    'Very Weak',
    'Weak',
    'Fair',
    'Strong',
    'Very Strong'
  ];

  const colors = [
    '',
    '#ef4444',
    '#f59e0b',
    '#eab308',
    '#22c55e',
    '#10b981'
  ];

  container.innerHTML = `
    <div style="display:flex;gap:4px;margin-top:6px;">
      ${[1, 2, 3, 4, 5]
      .map(
        i => `
            <div
              style="
                flex:1;
                height:3px;
                border-radius:2px;
                background:${i <= score ? colors[score] : 'var(--border)'};
              ">
            </div>
          `
      )
      .join('')}
    </div>

    <span
      style="
        font-size:0.72rem;
        color:${colors[score]};
        margin-top:3px;
        display:block;
      ">
      ${labels[score]}
    </span>
  `;
}

// ── Password Visibility Toggle ────────────────────────────────────────────────

function initPasswordToggles() {
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;

      if (!input) return;

      const isText = input.type === 'text';

      input.type = isText ? 'password' : 'text';

      btn.textContent = isText ? '👁' : '🔒';

      btn.setAttribute(
        'aria-label',
        isText ? 'Show password' : 'Hide password'
      );
    });
  });
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────

function initLogin() {
  if (!document.getElementById('loginForm')) return;

  redirectIfAuth('dashboard.html');

  const form = document.getElementById('loginForm');
  const emailIn = document.getElementById('loginEmail');
  const passIn = document.getElementById('loginPassword');

  const emailErr = document.getElementById('loginEmailError');
  const passErr = document.getElementById('loginPassError');

  const submitBtn = document.getElementById('loginSubmit');

  initPasswordToggles();

  function validateLogin() {
    let valid = true;

    const email = emailIn.value.trim();
    const pass = passIn.value;

    // Email validation
    if (!Validate.required(email)) {
      showFieldError(
        emailIn,
        emailErr,
        'Email is required.'
      );

      valid = false;
    } else if (!Validate.email(email)) {
      showFieldError(
        emailIn,
        emailErr,
        'Enter a valid email address.'
      );

      valid = false;
    } else {
      showFieldSuccess(emailIn, emailErr);
    }

    // Password validation
    if (!Validate.required(pass)) {
      showFieldError(
        passIn,
        passErr,
        'Password is required.'
      );

      valid = false;
    } else if (!Validate.minLen(pass, 6)) {
      showFieldError(
        passIn,
        passErr,
        'Password must be at least 6 characters.'
      );

      valid = false;
    } else {
      showFieldSuccess(passIn, passErr);
    }

    return valid;
  }

  emailIn.addEventListener('blur', () => {
    const value = emailIn.value.trim();

    if (value && !Validate.email(value)) {
      showFieldError(
        emailIn,
        emailErr,
        'Enter a valid email.'
      );
    } else if (value) {
      showFieldSuccess(emailIn, emailErr);
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateLogin()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    const email = emailIn.value.trim().toLowerCase();
    const password = passIn.value;

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      // Login failed
      if (!response.ok) {
        showFieldError(
          passIn,
          passErr,
          data.message || 'Invalid email or password.'
        );

        Toast.show(
          data.message || 'Invalid email or password.',
          'error',
          5000
        );

        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';

        return;
      }

      // Login successful
      const user = data.user;

      const initials = user.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      // Store JWT token
      localStorage.setItem('devlogToken', data.token);
      localStorage.setItem('blogcraftToken', data.token);

      // Store logged-in user using existing Storage helper
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: '',
        initials: initials,
        joined: new Date().toISOString().slice(0, 10)
      };

      if (typeof Storage !== 'undefined' && Storage.setUser) {
        Storage.setUser(sessionUser);
      } else {
        localStorage.setItem('devlogUser', JSON.stringify(sessionUser));
        localStorage.setItem('blogcraftUser', JSON.stringify(sessionUser));
      }

      Toast.show(
        `Welcome back, ${user.name}!`,
        'success'
      );

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);

    } catch (error) {
      console.error('Login API error:', error);

      Toast.show(
        'Unable to connect to the server. Make sure the backend is running.',
        'error',
        5000
      );

      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

// ── REGISTER ─────────────────────────────────────────────────────────────────

function initRegister() {
  if (!document.getElementById('registerForm')) return;

  redirectIfAuth('dashboard.html');

  const form = document.getElementById('registerForm');

  const nameIn = document.getElementById('regName');
  const emailIn = document.getElementById('regEmail');
  const passIn = document.getElementById('regPassword');
  const confirmIn = document.getElementById('regConfirm');

  const termsIn = document.getElementById('regTerms');

  const nameErr = document.getElementById('regNameError');
  const emailErr = document.getElementById('regEmailError');
  const passErr = document.getElementById('regPassError');
  const confirmErr = document.getElementById('regConfirmError');
  const termsErr = document.getElementById('regTermsError');

  const strengthBar = document.getElementById('strengthBar');

  const submitBtn = document.getElementById(
    'registerSubmit'
  );

  initPasswordToggles();

  // Password strength
  passIn.addEventListener('input', () => {
    const score = getPasswordStrength(
      passIn.value
    );

    renderStrengthBar(
      strengthBar,
      score
    );
  });

  function validate() {
    let valid = true;

    const name = nameIn.value.trim();
    const email = emailIn.value.trim();
    const pass = passIn.value;
    const conf = confirmIn.value;

    // Name
    if (!Validate.minLen(name, 2)) {
      showFieldError(
        nameIn,
        nameErr,
        'Full name must be at least 2 characters.'
      );

      valid = false;
    } else {
      showFieldSuccess(
        nameIn,
        nameErr
      );
    }

    // Email
    if (!Validate.email(email)) {
      showFieldError(
        emailIn,
        emailErr,
        'Enter a valid email address.'
      );

      valid = false;
    } else {
      showFieldSuccess(
        emailIn,
        emailErr
      );
    }

    // Password
    if (!Validate.minLen(pass, 8)) {
      showFieldError(
        passIn,
        passErr,
        'Password must be at least 8 characters.'
      );

      valid = false;

    } else if (
      !Validate.hasUpper(pass) ||
      !Validate.hasLower(pass) ||
      !Validate.hasNum(pass)
    ) {
      showFieldError(
        passIn,
        passErr,
        'Include uppercase, lowercase, and a number.'
      );

      valid = false;

    } else {
      showFieldSuccess(
        passIn,
        passErr
      );
    }

    // Confirm password
    if (!conf) {
      showFieldError(
        confirmIn,
        confirmErr,
        'Please confirm your password.'
      );

      valid = false;

    } else if (pass !== conf) {
      showFieldError(
        confirmIn,
        confirmErr,
        'Passwords do not match.'
      );

      valid = false;

    } else {
      showFieldSuccess(
        confirmIn,
        confirmErr
      );
    }

    // Terms
    if (!termsIn.checked) {
      termsErr.classList.add('visible');

      valid = false;

    } else {
      termsErr.classList.remove('visible');
    }

    return valid;
  }

  // Register form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';

    const name = nameIn.value.trim();
    const email = emailIn.value.trim().toLowerCase();
    const password = passIn.value;

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      // Registration failed
      if (!response.ok) {
        showFieldError(
          emailIn,
          emailErr,
          data.message || 'Registration failed.'
        );

        Toast.show(
          data.message || 'Registration failed.',
          'error',
          5000
        );

        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Free Account';

        return;
      }

      // Registration successful
      Toast.show(
        `Account created! Welcome to DevLog, ${name}!`,
        'success'
      );

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);

    } catch (error) {
      console.error(
        'Registration API error:',
        error
      );

      Toast.show(
        'Unable to connect to the server. Make sure the backend is running.',
        'error',
        5000
      );

      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Free Account';
    }
  });
}

// ── INIT ──────────────────────────────────────────────────────────────────────

document.addEventListener(
  'DOMContentLoaded',
  () => {
    initLogin();
    initRegister();
  }
);