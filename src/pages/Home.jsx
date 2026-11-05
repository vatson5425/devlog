import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../utils/api';
import { SEED_CONTENT, normalizeBlog } from '../utils/seedContent';
import { Storage } from '../utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Fade-up scroll observer
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-up');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), +delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((el, i) => {
      if (!el.dataset.delay) el.dataset.delay = i * 60;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  // Fetch blogs from backend + fallback to local/seed
  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.blogs) && data.blogs.length > 0) {
            const normalized = data.blogs.map(normalizeBlog);
            // Also combine with seeds if few
            const existingIds = new Set(normalized.map(b => String(b.id)));
            const extraSeeds = SEED_CONTENT.filter(s => !existingIds.has(String(s.id)));
            const combined = [...normalized, ...extraSeeds];
            setBlogs(combined);
            Storage.setContent(combined);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, using seed articles:', err);
      }

      // Local fallback
      const cached = Storage.getContent();
      if (Array.isArray(cached) && cached.length > 0) {
        setBlogs(cached);
      } else {
        setBlogs(SEED_CONTENT);
        Storage.setContent(SEED_CONTENT);
      }
      setLoading(false);
    }

    loadArticles();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  // Filter and sort
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        b =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q)) ||
          (b.category && b.category.toLowerCase().includes(q)) ||
          (Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().includes(q))) ||
          (b.author && b.author.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(b => b.category === selectedCategory);
    }

    // Sort
    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    } else if (sortOrder === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortOrder === 'az') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [blogs, searchTerm, selectedCategory, sortOrder]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getReadingTime = (content) => {
    const words = String(content || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="hero" aria-labelledby="heroHeading">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-text fade-up">
                <div className="hero-badge" aria-label="New platform launched">
                  <span className="hero-badge-dot" aria-hidden="true"></span>
                  Now in Public Beta
                </div>
                <h1 id="heroHeading">
                  Write. Discover.<br />
                  <span className="highlight">Inspire.</span>
                </h1>
                <p className="hero-desc">
                  DevLog is a modern publishing platform for creators, developers, and thinkers. Share ideas that spark conversations and reach audiences who care.
                </p>
                <div className="hero-cta">
                  <Link to="/register" className="btn btn-primary btn-lg" id="heroCta1">
                    Start Writing Free
                  </Link>
                  <a href="#content" className="btn btn-secondary btn-lg" id="heroCta2">
                    Explore Articles
                  </a>
                </div>

                <div className="hero-stats" aria-label="Platform statistics">
                  <div className="hero-stat">
                    <div className="hero-stat-value">12K+</div>
                    <div className="hero-stat-label">Active Writers</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">85K+</div>
                    <div className="hero-stat-label">Articles Published</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">2.4M</div>
                    <div className="hero-stat-label">Monthly Readers</div>
                  </div>
                </div>
              </div>

              <div className="hero-visual fade-up" data-delay="150" aria-hidden="true">
                <div className="hero-img-wrap">
                  <img
                    src="assets/images/hero-dashboard.jpg"
                    alt="DevLog dashboard preview showing content analytics"
                    width="640"
                    height="360"
                    loading="eager"
                  />
                </div>
                <div className="hero-img-glow"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section className="features-section" id="features" aria-labelledby="featuresHeading">
          <div className="container">
            <div className="section-header fade-up">
              <div className="section-tag">Platform Features</div>
              <h2 id="featuresHeading">Everything You Need to Create</h2>
              <p>A complete toolkit for modern content creators — built with simplicity, power, and performance in mind.</p>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-up">
                <div className="feature-icon" aria-hidden="true">✍️</div>
                <h3>Powerful Editor</h3>
                <p>A distraction-free writing environment with formatting tools, image uploads, and real-time character counting — designed to keep you in flow.</p>
              </div>
              <div className="feature-card fade-up" data-delay="80">
                <div className="feature-icon" aria-hidden="true">🔍</div>
                <h3>Smart Discovery</h3>
                <p>Readers find your content through intelligent search, category filters, and personalized recommendations that surface relevant articles.</p>
              </div>
              <div className="feature-card fade-up" data-delay="160">
                <div className="feature-icon" aria-hidden="true">📊</div>
                <h3>Analytics Dashboard</h3>
                <p>Track your content performance with a clean dashboard showing views, engagement, publication status, and growth over time.</p>
              </div>
              <div className="feature-card fade-up" data-delay="80">
                <div className="feature-icon" aria-hidden="true">🏷️</div>
                <h3>Tag & Organize</h3>
                <p>Categorize your writing with tags and categories. Keep your content portfolio structured and easy for readers to navigate and discover.</p>
              </div>
              <div className="feature-card fade-up" data-delay="160">
                <div className="feature-icon" aria-hidden="true">📱</div>
                <h3>Fully Responsive</h3>
                <p>DevLog is beautiful on every screen. Your content looks professional whether readers are on a desktop, tablet, or mobile device.</p>
              </div>
              <div className="feature-card fade-up" data-delay="240">
                <div className="feature-icon" aria-hidden="true">🚀</div>
                <h3>Publish Instantly</h3>
                <p>Go from draft to published in seconds. Save your work as a draft, preview it, then publish when you're ready — with zero friction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENT / EXPLORE ─────────────────────────────────────── */}
        <section className="content-section" id="content" aria-labelledby="exploreHeading">
          <div className="container">
            <div className="section-header fade-up">
              <div className="section-tag">Latest Articles</div>
              <h2 id="exploreHeading">Explore Our Collection</h2>
              <p>Curated articles from our community of developers, designers, and technology professionals.</p>
            </div>

            {/* Search + Filter Bar */}
            <div className="search-filter-bar fade-up" role="search" aria-label="Article search and filter">
              <div className="search-wrap">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  type="search"
                  id="searchInput"
                  className="search-input"
                  placeholder="Search articles, topics, tags…"
                  aria-label="Search articles"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <select
                id="categoryFilter"
                className="filter-select"
                aria-label="Filter by category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                id="sortFilter"
                className="filter-select"
                aria-label="Sort articles"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="az">A → Z</option>
              </select>
              <span id="resultCount" className="text-muted" style={{ fontSize: '0.84rem', whiteSpace: 'nowrap' }} aria-live="polite">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
              </span>
            </div>

            {/* Cards Grid */}
            <div className="cards-grid" id="contentGrid" aria-label="Article cards">
              {loading ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                  <p>Loading articles…</p>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                  <p>No articles match your search criteria.</p>
                </div>
              ) : (
                filteredBlogs.map((article) => (
                  <article
                    key={article.id}
                    className="card fade-up"
                    tabIndex="0"
                    role="article"
                    onClick={() => navigate(`/details?id=${article.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navigate(`/details?id=${article.id}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-thumb-wrap">
                      <img
                        src={article.image || 'assets/images/article-javascript.jpg'}
                        alt={article.title}
                        className="card-thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'assets/images/article-javascript.jpg';
                        }}
                      />
                      <span className="card-category-badge">{article.category}</span>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{article.title}</h3>
                      <p className="card-excerpt">{article.description}</p>
                      {Array.isArray(article.tags) && article.tags.length > 0 && (
                        <div className="card-tags">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="card-footer">
                        <div className="card-author">
                          <div className="card-avatar" aria-hidden="true">
                            {article.authorInitials || 'DL'}
                          </div>
                          <span className="card-author-name">{article.author}</span>
                        </div>
                        <div className="card-meta">
                          <span>{formatDate(article.date)}</span>
                          <span>·</span>
                          <span>{getReadingTime(article.content)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section className="about-section" id="about" aria-labelledby="aboutHeading">
          <div className="container">
            <div className="about-grid">
              <div className="about-text fade-up">
                <div className="section-tag about-tag">About DevLog</div>
                <h2 id="aboutHeading">Built for the Next Generation of Creators</h2>
                <p>
                  DevLog was built out of a simple belief: every thoughtful voice deserves a beautiful, professional platform to be heard. We built the tools we wished existed — and made them available to everyone.
                </p>
                <p>
                  Whether you're a developer sharing technical insights, a designer exploring visual ideas, or a thinker working through complex topics — DevLog is your platform.
                </p>
                <ul className="about-benefits" aria-label="Platform benefits">
                  <li className="about-benefit">
                    <span className="benefit-icon" aria-hidden="true">✦</span>
                    No paywalls for your readers — your content reaches everyone.
                  </li>
                  <li className="about-benefit">
                    <span className="benefit-icon" aria-hidden="true">✦</span>
                    Your writing, your analytics, your audience — full ownership.
                  </li>
                  <li className="about-benefit">
                    <span className="benefit-icon" aria-hidden="true">✦</span>
                    A clean, distraction-free editor that respects your creative process.
                  </li>
                  <li className="about-benefit">
                    <span className="benefit-icon" aria-hidden="true">✦</span>
                    Built-in discoverability so new readers can always find your work.
                  </li>
                </ul>
                <Link to="/register" className="btn btn-primary" id="aboutCta">
                  Join DevLog Today
                </Link>
              </div>

              <div className="about-visual fade-up" data-delay="120" aria-label="Platform statistics">
                <div className="about-stats-grid">
                  <div className="about-stat-card">
                    <div className="about-stat-num">12K+</div>
                    <div className="about-stat-label">Active Writers</div>
                  </div>
                  <div className="about-stat-card">
                    <div className="about-stat-num">85K+</div>
                    <div className="about-stat-label">Articles</div>
                  </div>
                  <div className="about-stat-card">
                    <div className="about-stat-num">2.4M</div>
                    <div className="about-stat-label">Monthly Readers</div>
                  </div>
                  <div className="about-stat-card">
                    <div className="about-stat-num">98%</div>
                    <div className="about-stat-label">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="cta-section" aria-labelledby="ctaHeading">
          <div className="container">
            <div className="cta-box fade-up">
              <h2 id="ctaHeading">Ready to Share Your Ideas?</h2>
              <p>Join thousands of creators who publish on DevLog. It's free to start — no credit card required.</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg" id="ctaBtn1">
                  Start Writing Free
                </Link>
                <a href="#content" className="btn btn-secondary btn-lg" id="ctaBtn2">
                  Browse Articles
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
