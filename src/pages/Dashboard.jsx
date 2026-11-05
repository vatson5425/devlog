import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';
import { normalizeBlog } from '../utils/seedContent';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const { showToast } = useToast();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userBio, setUserBio] = useState('');

  // Auth Guard
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // Load user blogs
  const loadMyBlogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/my`, {
        headers: getAuthHeaders()
      });

      if (res.status === 401) {
        logout();
        showToast('Session expired. Please log in again.', 'error');
        navigate('/login');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs.map(normalizeBlog));
        }
      } else {
        showToast('Failed to load your articles.', 'error');
      }
    } catch (err) {
      console.error('Fetch my blogs error:', err);
      showToast('Unable to connect to the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBlogs();
    if (user?.bio) setUserBio(user.bio);
  }, [token]);

  // Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter(
      (b) => String(b.status || 'published').toLowerCase() === 'published'
    ).length;
    const drafts = blogs.filter(
      (b) => String(b.status || '').toLowerCase() === 'draft'
    ).length;
    const views = blogs.reduce((sum, b) => sum + Number(b.views || 0), 0);
    return { total, published, drafts, views };
  }, [blogs]);

  // Delete article handler
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${articleToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (res.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      setBlogs((prev) => prev.filter((b) => b.id !== articleToDelete.id));
      showToast('Article deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete article. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Profile save handler
  const handleSaveProfile = () => {
    updateUser({ bio: userBio });
    setProfileModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
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

  const userName = user?.name || 'DevLog Creator';
  const userInitials = user?.initials || 'DL';
  const userEmail = user?.email || '';

  return (
    <div id="dashboardPage">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        id="sidebarOverlay"
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        id="sidebar"
        aria-label="Dashboard sidebar navigation"
      >
        <div className="sidebar-header">
          <Link to="/" className="nav-logo" aria-label="DevLog home">
            <div className="nav-logo-icon" aria-hidden="true">✦</div>
            <span className="nav-logo-text">DevLog</span>
          </Link>
          <button
            className="sidebar-close"
            id="sidebarClose"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <div className="sidebar-label">Main</div>
          <Link to="/dashboard" className="sidebar-link active" aria-current="page">
            <span className="link-icon" aria-hidden="true">📊</span> Dashboard
          </Link>
          <Link to="/#content" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">🔍</span> Explore
          </Link>

          <div className="sidebar-label">Content</div>
          <Link to="/create" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">✍️</span> Create Article
          </Link>
          <Link to="/dashboard" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">📄</span> My Articles
            <span className="link-badge" id="sidebarArticleCount">{blogs.length}</span>
          </Link>

          <div className="sidebar-label">Account</div>
          <button
            type="button"
            className="sidebar-link"
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setProfileModalOpen(true)}
          >
            <span className="link-icon" aria-hidden="true">👤</span> Profile
          </button>
          <button
            type="button"
            className="sidebar-link"
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => showToast('Settings panel coming soon!', 'info')}
          >
            <span className="link-icon" aria-hidden="true">⚙️</span> Settings
          </button>
          <button
            className="sidebar-link nav-logout"
            style={{ color: 'var(--danger)', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            <span className="link-icon" aria-hidden="true">🚪</span> Log Out
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-badge">
            <div className="dash-user-avatar user-initials" aria-hidden="true">
              {userInitials}
            </div>
            <div className="info">
              <div className="name user-name">{userName}</div>
              <div className="email user-email">{userEmail}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <div className="dashboard-content">
        {/* Topbar */}
        <header className="dash-topbar" role="banner">
          <div className="dash-topbar-left">
            <button
              className="sidebar-toggle"
              id="sidebarToggle"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <p className="dash-greeting" id="dashGreeting" aria-live="polite">
              {greeting}, {userName} 👋
            </p>
          </div>
          <div className="dash-topbar-right">
            <Link to="/create" className="btn btn-primary btn-sm" id="topbarCreate">
              + New Article
            </Link>
            <div className="dash-user-info">
              <span className="user-name">{userName}</span>
              <div className="dash-user-avatar user-initials" aria-hidden="true">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="dash-main" id="dashMain">
          {/* ── STATS ─────────────────────────────────────── */}
          <section aria-labelledby="statsHeading">
            <h2 id="statsHeading" className="visually-hidden">Content Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue" aria-hidden="true">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Articles</div>
                  <div className="stat-change">All time</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green" aria-hidden="true">🟢</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.published}</div>
                  <div className="stat-label">Published</div>
                  <div className="stat-change" style={{ color: 'var(--success)' }}>Live now</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon yellow" aria-hidden="true">📂</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.drafts}</div>
                  <div className="stat-label">Drafts</div>
                  <div className="stat-change" style={{ color: 'var(--warning)' }}>In progress</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple" aria-hidden="true">👁</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.views}</div>
                  <div className="stat-label">Total Views</div>
                  <div className="stat-change" style={{ color: 'var(--accent-light)' }}>All articles</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CONTENT TABLE ─────────────────────────────── */}
          <section className="content-table-wrap" aria-labelledby="contentTableHeading" style={{ marginTop: '24px' }}>
            <div className="table-header">
              <h3 id="contentTableHeading">All Articles</h3>
              <Link to="/create" className="btn btn-primary btn-sm" id="tableCreateBtn">
                + Create New
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }} role="region" aria-label="Articles table" tabIndex="0">
              <table className="data-table" aria-label="Articles list">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody id="contentTableBody">
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Loading articles…
                      </td>
                    </tr>
                  ) : blogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>No articles yet.</span>
                        <Link to="/create" style={{ color: 'var(--accent-light)', textDecoration: 'none', marginLeft: '8px' }}>
                          Create your first article →
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    blogs.map((article) => {
                      const isDraft = String(article.status || '').toLowerCase() === 'draft';
                      return (
                        <tr key={article.id}>
                          <td className="article-title-cell" style={{ minWidth: '280px', maxWidth: '430px' }}>
                            <div className="article-title" style={{ fontWeight: 600, lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                              {article.title}
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{article.category}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${isDraft ? 'draft' : 'published'}`}>
                              {isDraft ? 'Draft' : 'Published'}
                            </span>
                          </td>
                          <td>{formatDate(article.date)}</td>
                          <td>
                            <div className="article-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                className="action-btn view-btn"
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  border: '1px solid rgba(124,124,255,.5)',
                                  background: 'transparent',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                                onClick={() => navigate(`/details?id=${article.id}`)}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="action-btn edit-btn"
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  border: '1px solid rgba(255,255,255,.15)',
                                  background: '#20283c',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                                onClick={() => navigate(`/create?id=${article.id}`)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="action-btn delete-btn"
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  border: '1px solid rgba(255,80,100,.45)',
                                  background: 'transparent',
                                  color: '#ff647c',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                                onClick={() => {
                                  setArticleToDelete(article);
                                  setDeleteModalOpen(true);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────────── */}
      <div className={`modal-overlay ${deleteModalOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <div className="modal-header">
            <h3>Delete Article</h3>
            <button className="modal-close" onClick={() => setDeleteModalOpen(false)}>✕</button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{articleToDelete?.title}"</strong>?
            <br />This action cannot be undone.
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary modal-close" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete Article'}
            </button>
          </div>
        </div>
      </div>

      {/* ── PROFILE MODAL ────────────────────────────────────────── */}
      <div className={`modal-overlay ${profileModalOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <div className="modal-header">
            <h3>Your Profile</h3>
            <button className="modal-close" onClick={() => setProfileModalOpen(false)}>✕</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div className="dash-user-avatar user-initials" style={{ width: '56px', height: '56px', fontSize: '20px' }} aria-hidden="true">
              {userInitials}
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }} className="user-name">
                {userName}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} className="user-email">
                {userEmail}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profileBio">Bio</label>
            <textarea
              id="profileBio"
              className="form-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              placeholder="Tell readers about yourself…"
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary modal-close" onClick={() => setProfileModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveProfile}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
