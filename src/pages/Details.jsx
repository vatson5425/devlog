import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL } from '../utils/api';
import { SEED_CONTENT, normalizeBlog } from '../utils/seedContent';
import { Storage } from '../utils/storage';

export default function Details() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const { showToast } = useToast();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allArticles, setAllArticles] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load article
  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);

      // Check local cache first
      const cached = Storage.getContent();
      let combined = Array.isArray(cached) && cached.length > 0 ? [...cached] : [...SEED_CONTENT];

      try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.blogs)) {
            const normalized = data.blogs.map(normalizeBlog);
            combined = [...normalized, ...SEED_CONTENT];
          }
        }
      } catch (e) {
        console.warn('Backend unavailable, using cached seeds:', e);
      }

      setAllArticles(combined);

      // Match article by id
      const found = combined.find((a) => String(a.id) === String(articleId));
      if (found) {
        setArticle(found);
      } else if (combined.length > 0) {
        setArticle(combined[0]);
      }
      setLoading(false);
    }

    fetchArticle();
  }, [articleId]);

  // Related articles
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return allArticles
      .filter((a) => String(a.id) !== String(article.id))
      .slice(0, 3);
  }, [article, allArticles]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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

  const handleShareTwitter = () => {
    const text = encodeURIComponent(article?.title || 'Check out this article on DevLog');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener');
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        showToast('Link copied to clipboard!', 'success', 2500);
      })
      .catch(() => {
        showToast('Could not copy link.', 'error', 2500);
      });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="details-page">
      {/* Reading Progress Indicator */}
      <div
        id="readingProgress"
        aria-hidden="true"
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
          zIndex: 9999,
          width: `${readingProgress}%`,
          transition: 'width 0.1s ease-out'
        }}
      />

      <Navbar />

      {/* Back bar */}
      <div className="details-back-bar" role="navigation" aria-label="Article navigation" style={{
        background: 'rgba(8,12,20,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 0',
        position: 'sticky',
        top: '64px',
        zIndex: 90
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" id="backBtn" onClick={handleBack}>
            ← Back
          </button>
          <Link to="/#content" className="btn btn-outline-accent btn-sm">
            Browse All Articles
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Loading article…</p>
        </div>
      ) : !article ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
          <h2>Article not found</h2>
          <p style={{ marginTop: '10px' }}>The requested article could not be located.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            Back to Home
          </Link>
        </div>
      ) : (
        <main id="articleMain">
          {/* Hero Image with overlay */}
          <div className="details-hero" id="detailsHero" style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src={article.image || 'assets/images/article-javascript.jpg'}
              alt={article.title}
              id="detailsHeroImg"
              loading="eager"
              onError={(e) => {
                e.target.src = 'assets/images/article-javascript.jpg';
              }}
            />
            <div className="details-hero-overlay" aria-hidden="true"></div>
            <div className="container">
              <div className="details-hero-content" id="detailsHeroContent">
                <span className="card-category-badge" style={{ display: 'inline-block', marginBottom: '14px' }}>
                  {article.category}
                </span>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '20px' }}>
                  {article.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="card-avatar" style={{ width: '38px', height: '38px', fontSize: '14px' }}>
                      {article.authorInitials || 'DL'}
                    </div>
                    <span style={{ fontWeight: 600 }}>{article.author}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formatDate(article.date)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{getReadingTime(article.content)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span style={{ color: 'var(--text-secondary)' }}>👁 {(article.views || 0).toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
            <div className="details-layout">
              {/* ── ARTICLE BODY ────────────────────────────── */}
              <article aria-label="Article content">
                <div
                  className="article-body"
                  id="articleBody"
                  dangerouslySetInnerHTML={{
                    __html: article.content?.includes('<p>')
                      ? article.content
                      : article.content
                          ?.split('\n\n')
                          .map((p) => `<p>${p.trim()}</p>`)
                          .join('') || '<p>No content available.</p>'
                  }}
                />

                {/* Tags */}
                {Array.isArray(article.tags) && article.tags.length > 0 && (
                  <div className="article-tags" id="articleTags" aria-label="Article tags" style={{ marginTop: '30px' }}>
                    {article.tags.map((t) => (
                      <span key={t} className="tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share / Actions */}
                <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} role="group" aria-label="Share article">
                    <button className="btn btn-secondary btn-sm" id="shareTwitter" aria-label="Share on X" onClick={handleShareTwitter}>
                      Share on 𝕏
                    </button>
                    <button className="btn btn-secondary btn-sm" id="shareLinkedin" aria-label="Share on LinkedIn" onClick={handleShareLinkedIn}>
                      Share on LinkedIn
                    </button>
                    <button className="btn btn-secondary btn-sm" id="copyLinkBtn" aria-label="Copy article link" onClick={handleCopyLink}>
                      🔗 Copy Link
                    </button>
                  </div>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Start Writing →
                  </Link>
                </div>
              </article>

              {/* ── SIDEBAR ─────────────────────────────────── */}
              <aside aria-label="Article sidebar">
                {/* About the author */}
                <div className="sidebar-widget" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    About the Author
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div className="card-avatar" style={{ width: '44px', height: '44px', fontSize: '16px' }} aria-hidden="true">
                      {article.authorInitials || 'DL'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{article.author}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DevLog Creator</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    A passionate writer and developer sharing insights on technology, design, and the future of software.
                  </p>
                </div>

                {/* Article stats */}
                <div className="sidebar-widget" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Article Stats
                  </h4>
                  <div className="progress-bar-wrap" style={{ marginBottom: '14px' }}>
                    <div className="progress-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                      <span>Views</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{(article.views || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="progress-bar-wrap" style={{ marginBottom: '14px' }}>
                    <div className="progress-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                      <span>Reading Time</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{getReadingTime(article.content)}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Published: {formatDate(article.date)}
                  </div>
                </div>

                {/* Related articles */}
                <div className="sidebar-widget" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Related Articles
                  </h4>
                  <div id="relatedArticles">
                    {relatedArticles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No related articles yet.
                      </div>
                    ) : (
                      relatedArticles.map((rel) => (
                        <div
                          key={rel.id}
                          style={{ marginBottom: '14px', cursor: 'pointer' }}
                          onClick={() => {
                            navigate(`/details?id=${rel.id}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '4px' }}>
                            {rel.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {formatDate(rel.date)} · {rel.category}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div
                  className="sidebar-widget"
                  style={{
                    textAlign: 'center',
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '22px'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '10px' }} aria-hidden="true">✦</div>
                  <h4 style={{ color: 'var(--accent-light)', textTransform: 'none', fontSize: '1rem', marginBottom: '8px' }}>
                    Start Writing Today
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Share your ideas with thousands of readers on DevLog.
                  </p>
                  <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Get Started Free
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}

