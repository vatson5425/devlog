import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';
import { normalizeBlog } from '../utils/seedContent';

export default function Create() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const { user, token, logout } = useAuth();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('published');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState('');

  // Errors & Loading
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);

  const fileInputRef = useRef(null);

  // Auth Guard
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // Load article if in edit mode
  useEffect(() => {
    if (!editId || !token) return;

    async function loadEditArticle() {
      setLoadingArticle(true);
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/my`, {
          headers: getAuthHeaders()
        });

        if (res.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          const target = data.blogs?.map(normalizeBlog).find((b) => String(b.id) === String(editId));

          if (target) {
            setTitle(target.title || '');
            setDescription(target.description || '');
            setContent(target.content || '');
            setCategory(target.category || '');
            setStatus(target.status || 'published');
            setTags(Array.isArray(target.tags) ? target.tags : []);
            if (target.image) setImage(target.image);
          } else {
            showToast('Article not found or you are not authorized to edit it.', 'error');
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to load edit article:', err);
        showToast('Unable to load article.', 'error');
      } finally {
        setLoadingArticle(false);
      }
    }

    loadEditArticle();
  }, [editId, token]);

  // Tag Handlers
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val) && tags.length < 8) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  // Image Upload Handlers
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image file size must be less than 4MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Save / Publish
  const handleSave = async (targetStatus) => {
    setTitleError('');
    setDescError('');
    setCategoryError('');

    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    }

    if (!description.trim()) {
      setDescError('Short description is required.');
      valid = false;
    }

    if (!category) {
      setCategoryError('Please select a category.');
      valid = false;
    }

    if (!content.trim()) {
      showToast('Please enter article content.', 'error');
      valid = false;
    }

    if (!valid) return;

    setSaving(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      category,
      status: targetStatus || status,
      tags,
      image: image || null
    };

    const url = editId ? `${API_BASE_URL}/blogs/${editId}` : `${API_BASE_URL}/blogs`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.message || 'Failed to save article.', 'error');
        setSaving(false);
        return;
      }

      showToast(
        editId
          ? 'Article updated successfully!'
          : targetStatus === 'draft'
          ? 'Draft saved successfully!'
          : 'Article published successfully!',
        'success'
      );

      navigate('/dashboard');
    } catch (err) {
      console.error('Save article error:', err);
      showToast('Unable to connect to the server.', 'error');
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const userName = user?.name || 'DevLog Creator';
  const userInitials = user?.initials || 'DL';
  const userEmail = user?.email || '';

  return (
    <div id="createPage">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        id="sidebarOverlay"
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar" aria-label="Dashboard navigation">
        <div className="sidebar-header">
          <Link to="/" className="nav-logo" aria-label="DevLog home">
            <div className="nav-logo-icon" aria-hidden="true">✦</div>
            <span className="nav-logo-text">DevLog</span>
          </Link>
          <button className="sidebar-close" id="sidebarClose" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <div className="sidebar-label">Main</div>
          <Link to="/dashboard" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">📊</span> Dashboard
          </Link>
          <Link to="/#content" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">🔍</span> Explore
          </Link>
          <div className="sidebar-label">Content</div>
          <Link to="/create" className="sidebar-link active" aria-current="page">
            <span className="link-icon" aria-hidden="true">✍️</span> Create Article
          </Link>
          <Link to="/dashboard" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">📄</span> My Articles
          </Link>
          <div className="sidebar-label">Account</div>
          <Link to="/dashboard" className="sidebar-link">
            <span className="link-icon" aria-hidden="true">👤</span> Profile
          </Link>
          <button
            className="sidebar-link nav-logout"
            style={{ color: 'var(--danger)', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            <span className="link-icon" aria-hidden="true">🚪</span> Log Out
          </button>
        </nav>
        <div className="sidebar-footer">
          <div style={{ padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="dash-user-avatar user-initials" aria-hidden="true">
              {userInitials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {userEmail}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <div className="dashboard-content">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button className="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <nav aria-label="Breadcrumb">
              <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li><Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link></li>
                <li aria-hidden="true">/</li>
                <li style={{ color: 'var(--text-primary)' }} id="createHeading">
                  {editId ? 'Edit Article' : 'Create Article'}
                </li>
              </ol>
            </nav>
          </div>
          <div className="dash-topbar-right">
            <Link to="/dashboard" className="btn btn-secondary btn-sm">
              ← Back to Dashboard
            </Link>
            <div className="dash-user-avatar user-initials" aria-hidden="true">
              {userInitials}
            </div>
          </div>
        </header>

        <main style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }} id="pageTitle">
              {editId ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Write, preview, and publish your article to DevLog readers.
            </p>
          </div>

          {loadingArticle ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Loading article details…
            </div>
          ) : (
            <form id="createForm" noValidate onSubmit={(e) => e.preventDefault()}>
              <div className="create-layout">
                {/* ── MAIN COLUMN ───────────────────────────────── */}
                <div className="create-main-col">
                  {/* Title & Desc */}
                  <div className="create-panel">
                    <h3>Article Details</h3>
                    <div className="form-group">
                      <label className="form-label" htmlFor="artTitle">
                        Title <span className="required" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        id="artTitle"
                        className={`form-input ${titleError ? 'error' : ''}`}
                        placeholder="Write a compelling title…"
                        maxLength="120"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (titleError) setTitleError('');
                        }}
                        required
                      />
                      {titleError && (
                        <span className="form-error visible" id="titleError" role="alert">
                          {titleError}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="artDesc">
                        Short Description <span className="required" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="artDesc"
                        className={`form-input ${descError ? 'error' : ''}`}
                        rows="3"
                        style={{ resize: 'vertical' }}
                        placeholder="A brief summary that readers see in article cards (max 200 characters)…"
                        maxLength="200"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (descError) setDescError('');
                        }}
                        required
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {descError ? (
                          <span className="form-error visible" id="descError" role="alert">
                            {descError}
                          </span>
                        ) : <span />}
                        <span className="char-counter" id="descCharCount" aria-live="polite">
                          {description.length}/200
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="create-panel">
                    <h3>Article Content</h3>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="artContent">Main content</label>
                      <textarea
                        id="artContent"
                        className="content-editor"
                        placeholder="Write your article here…

Use double line breaks to separate paragraphs.

You can write detailed technical content, tutorials, guides, opinions — anything you want your readers to discover.

Your content will be beautifully formatted when published."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      <span className="form-hint" id="contentHint">
                        Separate paragraphs with a blank line. HTML tags are supported for headings and lists.
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="create-panel">
                    <h3>Tags</h3>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="tagsField">Add up to 8 tags</label>
                      <div className="tags-input-wrap" id="tagsWrap" role="group" aria-label="Article tags">
                        {tags.map((tag, idx) => (
                          <span key={idx} className="tag-item">
                            #{tag}
                            <button
                              type="button"
                              className="remove-tag"
                              onClick={() => handleRemoveTag(idx)}
                              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '6px' }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {tags.length < 8 && (
                          <input
                            type="text"
                            className="tags-input-field"
                            id="tagsField"
                            placeholder={tags.length === 0 ? "Type a tag and press Enter…" : "Add more…"}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                          />
                        )}
                      </div>
                      <span className="form-hint">Press Enter or comma after each tag.</span>
                    </div>
                  </div>
                </div>

                {/* ── SIDEBAR COLUMN ─────────────────────────────── */}
                <div className="create-sidebar-col">
                  {/* Publish Settings */}
                  <div className="create-panel">
                    <h3>Publish Settings</h3>
                    <div className="form-group">
                      <label className="form-label" htmlFor="artCategory">
                        Category <span className="required" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="artCategory"
                        className={`form-input form-select ${categoryError ? 'error' : ''}`}
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (categoryError) setCategoryError('');
                        }}
                        required
                      >
                        <option value="">Select a category…</option>
                        <option value="Technology">Technology</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Security">Security</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Design">Design</option>
                        <option value="Career">Career</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="Opinion">Opinion</option>
                      </select>
                      {categoryError && (
                        <span className="form-error visible" id="categoryError" role="alert">
                          {categoryError}
                        </span>
                      )}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="artStatus">Status</label>
                      <select
                        id="artStatus"
                        className="form-input form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="create-panel">
                    <h3>Cover Image</h3>
                    {!image ? (
                      <div
                        id="imageUploadArea"
                        className="image-upload-area"
                        role="button"
                        tabIndex="0"
                        aria-label="Upload cover image"
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        <input
                          type="file"
                          id="imageInput"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                        />
                        <div className="upload-icon" aria-hidden="true">🖼️</div>
                        <p className="upload-text">Click to upload image</p>
                        <p className="upload-sub">PNG, JPG, WebP — max 4MB</p>
                      </div>
                    ) : (
                      <div id="imagePreview" className="image-preview">
                        <img id="previewImg" src={image} alt="Cover preview" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
                        <div className="image-preview-actions" style={{ marginTop: '10px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            id="removeImgBtn"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => setImage('')}
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="create-panel">
                    <h3>Actions</h3>
                    <div className="create-actions" style={{ flexDirection: 'column', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="publishBtn"
                        style={{ justifyContent: 'center' }}
                        disabled={saving}
                        onClick={() => handleSave('published')}
                      >
                        {saving ? 'Saving…' : '🚀 Publish Article'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        id="saveDraftBtn"
                        style={{ justifyContent: 'center' }}
                        disabled={saving}
                        onClick={() => handleSave('draft')}
                      >
                        {saving ? 'Saving…' : '💾 Save as Draft'}
                      </button>
                      <Link
                        to="/dashboard"
                        className="btn btn-secondary"
                        style={{ justifyContent: 'center', textAlign: 'center' }}
                      >
                        ← Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

