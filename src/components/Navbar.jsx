import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleHashLink = (e, hash) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + hash);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header>
      <nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        id="navbar"
        aria-label="Main navigation"
      >
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" aria-label="DevLog home">
              <div className="nav-logo-icon" aria-hidden="true">
                ✦
              </div>
              <span className="nav-logo-text">DevLog</span>
            </Link>

            <div className="nav-center" role="navigation">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
              <a
                href="#features"
                onClick={(e) => handleHashLink(e, '#features')}
                className="nav-link"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => handleHashLink(e, '#about')}
                className="nav-link"
              >
                About
              </a>
              <a
                href="#content"
                onClick={(e) => handleHashLink(e, '#content')}
                className="nav-link"
              >
                Explore
              </a>
            </div>

            <div className="nav-right">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary btn-sm nav-dashboard">
                    Dashboard
                  </Link>
                  <button
                    className="btn btn-secondary btn-sm nav-logout"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-sm nav-login">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm nav-signup">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <button
              className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
              id="hamburger"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobileMenu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
          id="mobileMenu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Link
            to="/"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={(e) => handleHashLink(e, '#features')}
            className="nav-link"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={(e) => handleHashLink(e, '#about')}
            className="nav-link"
          >
            About
          </a>
          <a
            href="#content"
            onClick={(e) => handleHashLink(e, '#content')}
            className="nav-link"
          >
            Explore
          </a>
          <div className="mobile-menu-actions">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-primary nav-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="btn btn-secondary nav-logout"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary nav-login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary nav-signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
