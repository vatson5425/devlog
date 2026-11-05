import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let valid = true;
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
    }

    if (!valid) return;

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || 'Invalid email or password.');
        showToast(data.message || 'Invalid email or password.', 'error', 4000);
        setSubmitting(false);
        return;
      }

      const userData = data.user;
      const initials = (userData.name || 'User')
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const sessionUser = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        bio: userData.bio || '',
        initials: initials || 'DL',
        joined: new Date().toISOString().slice(0, 10)
      };

      login(data.token, sessionUser);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      showToast('Unable to connect to the server. Make sure the backend is running.', 'error', 4000);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Minimal navbar */}
      <nav className="navbar" id="navbar" aria-label="Main navigation">
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" aria-label="DevLog home">
              <div className="nav-logo-icon" aria-hidden="true">✦</div>
              <span className="nav-logo-text">DevLog</span>
            </Link>
            <div className="nav-right">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Don't have an account?</span>
              <Link to="/register" className="btn btn-primary btn-sm">Create Account</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="auth-layout">
        {/* Left decorative panel */}
        <aside className="auth-side" aria-hidden="true">
          <div className="auth-side-content">
            <div className="section-tag" style={{ marginBottom: '24px' }}>Welcome Back</div>
            <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>
              Continue Your <span className="text-accent">Creative Journey</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
              Sign in to access your dashboard, continue drafts, publish articles, and engage with your readers.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✍️</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Write & Publish</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Share your ideas with the world</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📊</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Track Analytics</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>See how your content performs</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🌟</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Grow Your Audience</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Connect with readers who care</div>
                </div>
              </div>
            </div>

            <blockquote className="auth-side-quote" style={{ marginTop: '48px' }}>
              "DevLog has completely transformed how I share my technical writing. The editor is a joy to use and my articles now reach thousands of readers."
              <cite>— Sarah Chen, Software Engineer</cite>
            </blockquote>
          </div>
        </aside>

        {/* Right login form */}
        <main className="auth-main">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h1>Sign in to DevLog</h1>
              <p>Enter your credentials to access your account.</p>
            </div>

            {/* Demo hint */}
            <div style={{ background: 'var(--accent-glow2)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '24px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-light)' }}>Demo credentials:</strong><br />
              Email: <code style={{ color: 'var(--text-primary)' }}>demo@devlog.dev</code> &nbsp;|&nbsp;
              Password: <code style={{ color: 'var(--text-primary)' }}>Demo1234!</code>
            </div>

            <form id="loginForm" noValidate onSubmit={handleSubmit} aria-label="Login form">
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="loginEmail">
                  Email address <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="loginEmail"
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
                  <span className="form-error visible" id="loginEmailError" role="alert">
                    {emailError}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <label className="form-label" htmlFor="loginPassword" style={{ marginBottom: 0 }}>
                    Password <span className="required" aria-hidden="true">*</span>
                  </label>
                  <a href="#" style={{ fontSize: '0.78rem', color: 'var(--accent-light)' }}>Forgot password?</a>
                </div>
                <div className="input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="loginPassword"
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                {passwordError && (
                  <span className="form-error visible" id="loginPassError" role="alert">
                    {passwordError}
                  </span>
                )}
              </div>

              {/* Remember me */}
              <div className="form-group">
                <label className="form-check">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="form-check-label">Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                id="loginSubmit"
                disabled={submitting}
              >
                {submitting ? 'Signing In…' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>New to DevLog? <Link to="/register">Create a free account →</Link></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

