import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL } from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Password strength calculation
  const getPasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setTermsError(false);

    let valid = true;

    if (!name.trim()) {
      setNameError('Full name is required.');
      valid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError('Password must contain uppercase, lowercase, and a number.');
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password.');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      valid = false;
    }

    if (!terms) {
      setTermsError(true);
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.message || 'Registration failed.');
        showToast(data.message || 'Registration failed.', 'error', 4000);
        setSubmitting(false);
        return;
      }

      showToast(`Account created! Welcome to DevLog, ${name}!`, 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err);
      showToast('Unable to connect to the server. Make sure the backend is running.', 'error', 4000);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <nav className="navbar" id="navbar" aria-label="Main navigation">
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" aria-label="DevLog home">
              <div className="nav-logo-icon" aria-hidden="true">✦</div>
              <span className="nav-logo-text">DevLog</span>
            </Link>
            <div className="nav-right">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Already have an account?</span>
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="auth-layout">
        <aside className="auth-side" aria-hidden="true">
          <div className="auth-side-content">
            <div className="section-tag" style={{ marginBottom: '24px' }}>Join DevLog</div>
            <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>
              Your Voice <span className="text-accent">Deserves an Audience</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
              Join thousands of writers and developers who share their knowledge and ideas on DevLog every day.
            </p>

            <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--accent-light)', fontSize: '18px', marginTop: '1px' }}>✦</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Free forever</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>No credit card required. Full features at no cost.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--accent-light)', fontSize: '18px', marginTop: '1px' }}>✦</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Own your content</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Your writing stays yours — always portable and exportable.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--accent-light)', fontSize: '18px', marginTop: '1px' }}>✦</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Built-in discoverability</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Readers find your content through search and categories.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--accent-light)', fontSize: '18px', marginTop: '1px' }}>✦</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Real-time analytics</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>See who reads your articles and how they engage.</div>
                </div>
              </div>
            </div>

            <blockquote className="auth-side-quote" style={{ marginTop: '40px' }}>
              "I published my first article on DevLog three months ago. Today it has over 8,000 readers. I never thought it would be this easy to build an audience."
              <cite>— Marcus Rivera, Cloud Architect</cite>
            </blockquote>
          </div>
        </aside>

        <main className="auth-main">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h1>Create your account</h1>
              <p>Start publishing in under a minute — completely free.</p>
            </div>

            <form id="registerForm" noValidate onSubmit={handleSubmit} aria-label="Registration form">
              {/* Full name */}
              <div className="form-group">
                <label className="form-label" htmlFor="regName">
                  Full name <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="regName"
                  className={`form-input ${nameError ? 'error' : ''}`}
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  required
                />
                {nameError && (
                  <span className="form-error visible" id="regNameError" role="alert">
                    {nameError}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">
                  Email address <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="regEmail"
                  className={`form-input ${emailError ? 'error' : ''}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  required
                />
                {emailError && (
                  <span className="form-error visible" id="regEmailError" role="alert">
                    {emailError}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">
                  Password <span className="required" aria-hidden="true">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="regPassword"
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="input-action toggle-pw"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {password && (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '2px',
                            background: i <= strengthScore ? strengthColors[strengthScore] : 'var(--border)',
                            transition: 'background 0.3s'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: strengthColors[strengthScore], marginTop: '2px', display: 'block' }}>
                      {strengthLabels[strengthScore]}
                    </span>
                  </div>
                )}
                {passwordError && (
                  <span className="form-error visible" id="regPassError" role="alert">
                    {passwordError}
                  </span>
                )}
                <span className="form-hint">Min. 8 characters with uppercase, lowercase, and a number.</span>
              </div>

              {/* Confirm password */}
              <div className="form-group">
                <label className="form-label" htmlFor="regConfirm">
                  Confirm password <span className="required" aria-hidden="true">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="regConfirm"
                    className={`form-input ${confirmError ? 'error' : ''}`}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmError) setConfirmError('');
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="input-action toggle-pw"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>
                {confirmError && (
                  <span className="form-error visible" id="regConfirmError" role="alert">
                    {confirmError}
                  </span>
                )}
              </div>

              {/* Terms */}
              <div className="form-group">
                <label className="form-check">
                  <input
                    type="checkbox"
                    id="regTerms"
                    checked={terms}
                    onChange={(e) => {
                      setTerms(e.target.checked);
                      if (termsError) setTermsError(false);
                    }}
                    required
                  />
                  <span className="form-check-label">
                    I agree to the <a href="#" style={{ color: 'var(--accent-light)' }}>Terms of Service</a>{' '}
                    and <a href="#" style={{ color: 'var(--accent-light)' }}>Privacy Policy</a>
                  </span>
                </label>
                {termsError && (
                  <span className="form-error visible" id="regTermsError" role="alert">
                    You must accept the terms to continue.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                id="registerSubmit"
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Create Free Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already a member? <Link to="/login">Sign in →</Link></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
