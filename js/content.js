
/**
 * DevLog — content.js
 * Seed content, MongoDB integration, images, homepage and details page.
 */

'use strict';

const API_BASE_URL = 'http://localhost:5000/api';

// ══════════════════════════════════════════════════════════════════════════════
// LOCAL SEED CONTENT
// ══════════════════════════════════════════════════════════════════════════════

const SEED_CONTENT = [
  {
    id: 'c_001',
    title: 'Getting Started With Modern JavaScript',
    category: 'Technology',
    description: 'Master modern JavaScript, including ES6+ syntax, async/await, modules, and practical web development.',
    content: `
      <p>JavaScript has evolved dramatically over the past decade. Modern JavaScript is expressive, powerful, and essential for building web applications.</p>
      <h2>Arrow Functions and Destructuring</h2>
      <p>Arrow functions provide concise syntax and lexically bind this. Destructuring makes objects and arrays easier to work with.</p>
      <h2>Promises and Async/Await</h2>
      <p>Promises and async/await help developers write readable asynchronous code.</p>
      <h2>Modules</h2>
      <p>ES modules allow code to be split into reusable files and make applications easier to maintain.</p>
      <h3>Key Takeaways</h3>
      <ul>
        <li>Use const and let instead of var.</li>
        <li>Prefer arrow functions for callbacks where appropriate.</li>
        <li>Use async/await for asynchronous operations.</li>
        <li>Organize code into reusable modules.</li>
      </ul>
    `,
    tags: ['javascript', 'es6', 'web development', 'programming'],
    image: 'assets/images/article-javascript.jpg',
    author: 'Alex Morgan',
    authorInitials: 'AM',
    date: '2026-09-15',
    status: 'published',
    views: 1840,
    userId: 'u_demo1'
  },
  {
    id: 'c_002',
    title: 'Cybersecurity Fundamentals for Developers',
    category: 'Security',
    description: 'Understand common security threats, encryption, secure coding, and ways to protect web applications.',
    content: `
      <p>Security is essential in modern software development. Developers must build security awareness into their workflows.</p>
      <h2>Common Threats</h2>
      <p>Common threats include SQL injection, cross-site scripting (XSS), CSRF, and man-in-the-middle attacks.</p>
      <h2>Input Validation</h2>
      <p>Never trust user input. Validate data on the server and safely handle user-provided content.</p>
      <h2>HTTPS and Encryption</h2>
      <p>Use HTTPS and appropriate security controls to protect data in transit.</p>
      <h3>Security Checklist</h3>
      <ul>
        <li>Validate user input.</li>
        <li>Use parameterized database queries.</li>
        <li>Store passwords securely.</li>
        <li>Keep dependencies updated.</li>
        <li>Never expose secrets in source code.</li>
      </ul>
    `,
    tags: ['security', 'cybersecurity', 'web security'],
    image: 'assets/images/article-cybersecurity.jpg',
    author: 'Alex Morgan',
    authorInitials: 'AM',
    date: '2026-09-22',
    status: 'published',
    views: 2310,
    userId: 'u_demo1'
  },
  {
    id: 'c_003',
    title: 'The Future of Artificial Intelligence',
    category: 'Artificial Intelligence',
    description: 'Explore AI capabilities, emerging technologies, ethical considerations, and the future of work.',
    content: `
      <p>Artificial intelligence is transforming industries at an unprecedented pace.</p>
      <h2>Where We Are Today</h2>
      <p>Large language models, computer vision systems, and reinforcement learning are enabling new applications.</p>
      <h2>Emerging Capabilities</h2>
      <p>Multimodal AI systems can process text, images, audio, and video.</p>
      <h2>Ethical Considerations</h2>
      <p>Responsible AI development requires rigorous testing, transparency, and clear governance.</p>
    `,
    tags: ['AI', 'machine learning', 'future tech', 'ethics'],
    image: 'assets/images/article-ai.jpg',
    author: 'Alex Morgan',
    authorInitials: 'AM',
    date: '2026-09-28',
    status: 'published',
    views: 3420,
    userId: 'u_demo1'
  },
  {
    id: 'c_004',
    title: 'Modern Web Development Roadmap 2026',
    category: 'Web Development',
    description: 'A roadmap covering HTML, CSS, JavaScript, Git, frontend frameworks, backend development, databases, and deployment.',
    content: `
      <p>A clear learning roadmap makes web development more manageable.</p>
      <h2>HTML and CSS</h2>
      <p>HTML structures content, while CSS controls presentation and responsive layouts.</p>
      <h2>JavaScript</h2>
      <p>Learn variables, functions, objects, arrays, DOM manipulation, and asynchronous programming.</p>
      <h2>Recommended Learning Path</h2>
      <ol>
        <li>HTML5 and CSS3</li>
        <li>JavaScript</li>
        <li>Git and GitHub</li>
        <li>Frontend frameworks</li>
        <li>Node.js and Express</li>
        <li>Databases</li>
        <li>Deployment</li>
      </ol>
    `,
    tags: ['web development', 'roadmap', 'frontend', 'backend', 'career'],
    image: 'assets/images/article-webdev.jpg',
    author: 'Alex Morgan',
    authorInitials: 'AM',
    date: '2026-10-01',
    status: 'published',
    views: 4150,
    userId: 'u_demo1'
  },
  {
    id: 'c_005',
    title: 'Cloud Architecture: Building Scalable Systems',
    category: 'Cloud Computing',
    description: 'Learn about cloud architecture, microservices, serverless computing, containers, and scalable systems.',
    content: `
      <p>Cloud computing has changed how software systems are built and operated.</p>
      <h2>Core Principles</h2>
      <p>Successful cloud architectures consider elasticity, fault tolerance, loose coupling, and managed services.</p>
      <h2>Microservices and Monoliths</h2>
      <p>A monolith can simplify early development, while microservices can help when independently deployable services are needed.</p>
      <h2>Serverless Computing</h2>
      <p>Serverless platforms let developers run code without managing the underlying servers directly.</p>
    `,
    tags: ['cloud', 'AWS', 'architecture', 'scalability'],
    image: 'assets/images/article-cloud.jpg',
    author: 'Alex Morgan',
    authorInitials: 'AM',
    date: '2026-10-02',
    status: 'published',
    views: 1920,
    userId: 'u_demo1'
  },
  {
    id: 'c_006',
    title: 'Building a Design System From Scratch',
    category: 'Design',
    description: 'Learn how design systems create consistent, scalable user interfaces through tokens and reusable components.',
    content: `
      <p>A design system creates a shared language between designers and developers.</p>
      <h2>Design Tokens</h2>
      <p>Tokens define reusable values for colors, spacing, typography, shadows, and border radii.</p>
      <h2>Component Architecture</h2>
      <p>Well-designed components are reusable, accessible, composable, and documented.</p>
    `,
    tags: ['design system', 'UI', 'UX', 'components', 'CSS'],
    image: 'assets/images/article-design-system.svg',
    author: 'Alex Morgan',
    authorInitials: 'AM',
    date: '2026-10-03',
    status: 'draft',
    views: 0,
    userId: 'u_demo1'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// IMAGE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

const DEVLOG_IMAGES = [
  'assets/images/article-javascript.jpg',
  'assets/images/article-cybersecurity.jpg',
  'assets/images/article-ai.jpg',
  'assets/images/article-webdev.jpg',
  'assets/images/article-cloud.jpg',
  'assets/images/article-design-system.svg',
  'assets/images/article-javascript-backend.jpg',
  'assets/images/article-backend-api.jpg',
  'assets/images/article-fullstack-dev.jpg'
];

const BROKEN_IMAGES = new Set([
  'assets/images/article-js.jpg'
]);

const REMOVED_ARTICLE_IDS = new Set(['c_007']);

const REMOVED_ARTICLE_TITLES = new Set([
  'full stack architecture in 2026: bridging frontend state and backend services'
]);

function isRemovedArticle(article) {
  return (
    REMOVED_ARTICLE_IDS.has(String(article.id || '')) ||
    REMOVED_ARTICLE_TITLES.has(
      String(article.title || '').trim().toLowerCase()
    )
  );
}

function createUniqueImage(title, usedImages = new Set()) {
  const name = String(title || '').toLowerCase();

  const mappings = [
    {
      match: () => name.includes('modern javascript'),
      image: 'assets/images/article-javascript.jpg'
    },
    {
      match: () => name.includes('cybersecurity'),
      image: 'assets/images/article-cybersecurity.jpg'
    },
    {
      match: () => name.includes('artificial intelligence'),
      image: 'assets/images/article-ai.jpg'
    },
    {
      match: () => name.includes('web development roadmap'),
      image: 'assets/images/article-webdev.jpg'
    },
    {
      match: () => name.includes('cloud architecture'),
      image: 'assets/images/article-cloud.jpg'
    },
    {
      match: () => name.includes('design system'),
      image: 'assets/images/article-design-system.svg'
    },
    {
      match: () =>
        name.includes('getting started') && name.includes('javascript'),
      image: 'assets/images/article-javascript-backend.jpg'
    },
    {
      match: () =>
        name.includes('first blog from backend') ||
        name.includes('my first blog'),
      image: 'assets/images/article-backend-api.jpg'
    },
    {
      match: () =>
        name.includes('full') &&
        name.includes('stack') &&
        name.includes('developer') &&
        !name.includes('architecture'),
      image: 'assets/images/article-fullstack-dev.jpg'
    }
  ];

  const mapping = mappings.find(
    item => item.match() && !usedImages.has(item.image)
  );

  if (mapping) return mapping.image;

  return DEVLOG_IMAGES.find(
    image => !usedImages.has(image)
  ) || null;
}

// ══════════════════════════════════════════════════════════════════════════════
// MONGODB → DEVLOG FORMAT
// ══════════════════════════════════════════════════════════════════════════════

function normalizeBlog(blog) {
  const authorName =
    typeof blog.author === 'object'
      ? blog.author?.name || 'DevLog Author'
      : blog.author || 'DevLog Author';

  const authorEmail =
    typeof blog.author === 'object'
      ? blog.author?.email || ''
      : '';

  const authorInitials = authorName
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const plainText = String(blog.content || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id: blog._id || blog.id,
    title: blog.title || 'Untitled Article',
    category: blog.category || 'General',
    description:
      blog.description ||
      plainText.slice(0, 180) ||
      'Read this article on DevLog.',
    content: blog.content || '',
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    image:
      typeof blog.image === 'string' && blog.image.trim()
        ? blog.image.trim()
        : '',
    author: authorName,
    authorInitials: authorInitials || 'DL',
    authorEmail,
    date: blog.createdAt || blog.date || new Date().toISOString(),
    status: blog.status || 'published',
    views: Number(blog.views || 0),
    userId:
      typeof blog.author === 'object'
        ? blog.author?._id
        : blog.author
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// BACKEND
// ══════════════════════════════════════════════════════════════════════════════

async function fetchBlogsFromBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.blogs)) {
      throw new Error('Invalid blog response: expected data.blogs array.');
    }

    return data.blogs.map(normalizeBlog);
  } catch (error) {
    console.error('Failed to fetch DevLog articles:', error);
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE
// ══════════════════════════════════════════════════════════════════════════════

function getAllLocalContent() {
  const stored = Storage.getContent();

  if (!Array.isArray(stored) || stored.length === 0) {
    const cleanSeed = SEED_CONTENT.filter(
      article => !isRemovedArticle(article)
    );

    Storage.setContent(cleanSeed);
    return [...cleanSeed];
  }

  let cleaned = stored.filter(
    article => !isRemovedArticle(article)
  );

  const usedImages = new Set(
    cleaned
      .filter(article =>
        typeof article.image === 'string' &&
        article.image.trim() &&
        !BROKEN_IMAGES.has(article.image)
      )
      .map(article => article.image)
  );

  cleaned = cleaned.map(article => {
    const image =
      typeof article.image === 'string'
        ? article.image.trim()
        : '';

    // Keep uploaded Base64 data, external URLs, and valid local images.
    if (image && !BROKEN_IMAGES.has(image)) {
      return { ...article, image };
    }

    const fallbackImage = createUniqueImage(
      article.title,
      usedImages
    );

    if (fallbackImage) usedImages.add(fallbackImage);

    return {
      ...article,
      image: fallbackImage || ''
    };
  });

  Storage.setContent(cleaned);
  return cleaned;
}

function seedContent() {
  const existing = Storage.getContent();

  if (!Array.isArray(existing) || existing.length === 0) {
    Storage.setContent(
      SEED_CONTENT.filter(article => !isRemovedArticle(article))
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MERGE LOCAL + MONGODB
// ══════════════════════════════════════════════════════════════════════════════

let backendContent = null;

async function refreshBackendContent() {
  const backendBlogs = await fetchBlogsFromBackend();

  if (backendBlogs === null) {
    console.warn('Backend unavailable. Keeping local DevLog content.');
    backendContent = getAllLocalContent();
    return backendContent;
  }

  const localArticles = getAllLocalContent()
    .filter(article => !isRemovedArticle(article));

  const validBackendBlogs = backendBlogs
    .filter(article => !isRemovedArticle(article));

  const combined = [...localArticles];

  validBackendBlogs.forEach(backendArticle => {
    const existingIndex = combined.findIndex(localArticle => {
      if (
        localArticle.id &&
        backendArticle.id &&
        String(localArticle.id) === String(backendArticle.id)
      ) {
        return true;
      }

      return (
        String(localArticle.title || '').trim().toLowerCase() ===
        String(backendArticle.title || '').trim().toLowerCase()
      );
    });

    if (existingIndex >= 0) {
      const oldArticle = combined[existingIndex];

      combined[existingIndex] = {
        ...oldArticle,
        ...backendArticle,
        // Do not replace an existing image with an empty backend value.
        image: backendArticle.image || oldArticle.image || ''
      };
    } else {
      combined.push(backendArticle);
    }
  });

  const usedImages = new Set();

  const finalArticles = combined.map(article => {
    let image =
      typeof article.image === 'string'
        ? article.image.trim()
        : '';

    if (image && BROKEN_IMAGES.has(image)) {
      image = '';
    }

    if (image) {
      usedImages.add(image);
      return { ...article, image };
    }

    const fallbackImage = createUniqueImage(
      article.title,
      usedImages
    );

    if (fallbackImage) usedImages.add(fallbackImage);

    return {
      ...article,
      image: fallbackImage || ''
    };
  });

  backendContent = finalArticles;
  Storage.setContent(finalArticles);

  console.log(`DevLog: ${finalArticles.length} articles loaded`);

  return finalArticles;
}

// ══════════════════════════════════════════════════════════════════════════════
// CONTENT DATABASE
// ══════════════════════════════════════════════════════════════════════════════

function getAllContent() {
  return Array.isArray(backendContent)
    ? backendContent
    : getAllLocalContent();
}

function getPublished() {
  return getAllContent().filter(
    article => article.status === 'published'
  );
}

function getById(id) {
  return getAllContent().find(
    article => String(article.id) === String(id)
  ) || null;
}

function saveContent(item) {
  const all = getAllContent();

  const index = all.findIndex(
    article => String(article.id) === String(item.id)
  );

  if (index >= 0) {
    all[index] = item;
  } else {
    all.unshift(item);
  }

  backendContent = all;
  Storage.setContent(all);
}

function deleteContent(id) {
  const all = getAllContent().filter(
    article => String(article.id) !== String(id)
  );

  backendContent = all;
  Storage.setContent(all);
}

window.ContentDB = {
  getAllContent,
  getPublished,
  getById,
  saveContent,
  deleteContent,
  seedContent,
  refreshBackendContent
};

// ══════════════════════════════════════════════════════════════════════════════
// CARD RENDERER
// ══════════════════════════════════════════════════════════════════════════════

function renderCard(item) {
  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    : '';

  return `
    <article
      class="article-card fade-up"
      data-id="${item.id}"
      tabindex="0"
      role="button"
      aria-label="Read article: ${item.title}"
    >
      <div class="card-image">
        ${item.image
      ? `<img
                src="${item.image}"
                alt="${item.title}"
                loading="lazy"
                onerror="this.style.display='none'"
              >`
      : `<div class="devlog-image-placeholder">✨</div>`
    }

        <span class="card-category">${item.category || 'General'}</span>
      </div>

      <div class="card-body">
        <h3 class="card-title">${item.title || 'Untitled article'}</h3>
        <p class="card-desc">${item.description || ''}</p>

        <div class="card-footer">
          <div class="card-author">
            <div class="card-avatar" aria-hidden="true">
              ${item.authorInitials || 'DL'}
            </div>

            <div>
              <div style="font-weight:600;color:var(--text-secondary)">
                ${item.author || 'DevLog Author'}
              </div>
              <div>${dateStr}</div>
            </div>
          </div>

          <a
            href="details.html?id=${encodeURIComponent(item.id)}"
            class="card-read-more"
            aria-label="Read more about ${item.title}"
          >
            Read more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

// ══════════════════════════════════════════════════════════════════════════════
// HOMEPAGE
// ══════════════════════════════════════════════════════════════════════════════

async function initHomepageContent() {
  const grid = document.getElementById('contentGrid');
  const searchIn = document.getElementById('searchInput');
  const categoryEl = document.getElementById('categoryFilter');
  const sortEl = document.getElementById('sortFilter');
  const countEl = document.getElementById('resultCount');

  if (!grid) return;

  seedContent();

  grid.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1;">
      <div class="empty-icon">⏳</div>
      <h3>Loading articles...</h3>
      <p>Fetching the latest articles from DevLog.</p>
    </div>
  `;

  await refreshBackendContent();

  function render() {
    const q = searchIn ? searchIn.value.toLowerCase().trim() : '';
    const cat = categoryEl ? categoryEl.value : 'all';
    const sort = sortEl ? sortEl.value : 'newest';

    let filtered = getPublished().filter(item => {
      const title = String(item.title || '').toLowerCase();
      const description = String(item.description || '').toLowerCase();
      const tags = Array.isArray(item.tags)
        ? item.tags.join(' ').toLowerCase()
        : '';

      const matchQuery =
        !q ||
        title.includes(q) ||
        description.includes(q) ||
        tags.includes(q);

      const matchCategory = cat === 'all' || item.category === cat;

      return matchQuery && matchCategory;
    });

    filtered.sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }

      if (sort === 'oldest') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }

      if (sort === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }

      if (sort === 'az') {
        return String(a.title || '').localeCompare(String(b.title || ''));
      }

      return 0;
    });

    if (countEl) {
      countEl.textContent =
        `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`;
    }

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-icon">🔍</div>
          <h3>No articles found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join('');

    if (typeof window.initScrollAnimations === 'function') {
      window.initScrollAnimations();
    }

    grid.querySelectorAll('.article-card').forEach(card => {
      const go = () => {
        window.location.href =
          `details.html?id=${encodeURIComponent(card.dataset.id)}`;
      };

      card.addEventListener('click', event => {
        if (event.target.closest('a')) return;
        go();
      });

      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          go();
        }
      });
    });
  }

  if (categoryEl) {
    const currentValue = categoryEl.value;

    categoryEl.querySelectorAll('option:not([value="all"])')
      .forEach(option => option.remove());

    [...new Set(getPublished().map(article => article.category))]
      .filter(Boolean)
      .sort()
      .forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryEl.appendChild(option);
      });

    if ([...categoryEl.options].some(option => option.value === currentValue)) {
      categoryEl.value = currentValue;
    }
  }

  searchIn?.addEventListener('input', render);
  categoryEl?.addEventListener('change', render);
  sortEl?.addEventListener('change', render);

  render();
}

// ══════════════════════════════════════════════════════════════════════════════
// DETAILS PAGE
// ══════════════════════════════════════════════════════════════════════════════

async function initDetailsPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const mainEl = document.getElementById('articleMain');

  if (!mainEl) return;

  seedContent();
  await refreshBackendContent();

  const article = getById(id);

  if (!article) {
    mainEl.innerHTML = `
      <div class="empty-state" style="padding:100px 0;">
        <div class="empty-icon">📭</div>
        <h2>Article not found</h2>
        <p><a href="index.html">← Back to Home</a></p>
      </div>
    `;
    return;
  }

  article.views = (article.views || 0) + 1;
  saveContent(article);

  const heroImg = document.getElementById('detailsHeroImg');

  if (heroImg) {
    const safeImage =
      article.image && !BROKEN_IMAGES.has(article.image)
        ? article.image
        : '';

    if (safeImage) {
      heroImg.src = safeImage;
      heroImg.alt = article.title || 'Article cover';
      heroImg.style.display = '';

      heroImg.onerror = function () {
        this.style.display = 'none';

        const hero = document.getElementById('detailsHero');
        if (hero) {
          hero.style.background =
            'linear-gradient(135deg,#0d1117,#171d31,#252d52)';
        }
      };
    } else {
      heroImg.style.display = 'none';
    }
  }

  const heroContent = document.getElementById('detailsHeroContent');

  if (heroContent) {
    const dateStr = article.date
      ? new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      : '';

    heroContent.innerHTML = `
      <span class="article-category-badge">${article.category || 'General'}</span>

      <h1 class="article-title" style="font-size:clamp(1.6rem,4vw,2.6rem)">
        ${article.title || 'Untitled article'}
      </h1>

      <div class="article-meta">
        <div class="meta-author">
          <div class="card-avatar" style="width:32px;height:32px;font-size:12px">
            ${article.authorInitials || 'DL'}
          </div>
          <span>${article.author || 'DevLog Author'}</span>
        </div>
        <span>📅 ${dateStr}</span>
        <span>👁 ${(article.views || 0).toLocaleString()} views</span>
      </div>
    `;
  }

  const bodyEl = document.getElementById('articleBody');

  if (bodyEl) {
    bodyEl.innerHTML =
      article.content || `<p>${article.description || ''}</p>`;
  }

  const tagsEl = document.getElementById('articleTags');

  if (tagsEl) {
    tagsEl.innerHTML = Array.isArray(article.tags)
      ? article.tags.map(tag =>
        `<span class="badge badge-tech">#${tag}</span>`
      ).join('')
      : '';
  }

  const relatedEl = document.getElementById('relatedArticles');

  if (relatedEl) {
    const published = getPublished();

    const related = published
      .filter(item =>
        String(item.id) !== String(article.id) &&
        item.category === article.category
      )
      .slice(0, 3);

    const others = published
      .filter(item =>
        String(item.id) !== String(article.id) &&
        !related.some(
          relatedItem => String(relatedItem.id) === String(item.id)
        )
      )
      .slice(0, Math.max(0, 3 - related.length));

    relatedEl.innerHTML = [...related, ...others].map(item => `
      <div
        class="related-card"
        role="button"
        tabindex="0"
        data-id="${item.id}"
        aria-label="${item.title || 'Related article'}"
      >
        ${item.image
        ? `<img
                src="${item.image}"
                alt="${item.title || 'Article cover'}"
                loading="lazy"
                onerror="this.style.display='none'"
              >`
        : ''
      }

        <div class="related-card-info">
          <div class="related-card-cat">${item.category || 'General'}</div>
          <div class="related-card-title">${item.title || 'Untitled article'}</div>
        </div>
      </div>
    `).join('');

    relatedEl.querySelectorAll('.related-card').forEach(card => {
      const openArticle = () => {
        location.href =
          `details.html?id=${encodeURIComponent(card.dataset.id)}`;
      };

      card.addEventListener('click', openArticle);

      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openArticle();
        }
      });
    });
  }

  document.title = `${article.title || 'Article'} — DevLog`;
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT AND INITIALIZE
// ══════════════════════════════════════════════════════════════════════════════

window.ContentDB.renderCard = renderCard;

document.addEventListener('DOMContentLoaded', () => {
  seedContent();
  initHomepageContent();
  initDetailsPage();
});
