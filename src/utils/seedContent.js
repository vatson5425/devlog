export const SEED_CONTENT = [
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
    title: 'Complete Web Development Roadmap 2026',
    category: 'Web Development',
    description: 'A comprehensive guide to frontend, backend, databases, DevOps, and modern deployment strategies.',
    content: `
      <p>Building modern web applications requires a blend of frontend, backend, and DevOps knowledge.</p>
      <h2>Frontend Foundations</h2>
      <p>HTML, CSS, JavaScript, responsive design, and component-based architectures.</p>
      <h2>Backend Services</h2>
      <p>Node.js, Express, REST APIs, databases, authentication, and secure session management.</p>
      <h2>DevOps and Deployment</h2>
      <p>CI/CD pipelines, containerization, cloud hosting, and automated testing.</p>
    `,
    tags: ['webdev', 'frontend', 'backend', 'roadmap'],
    image: 'assets/images/article-webdev.jpg',
    author: 'Jordan Lee',
    authorInitials: 'JL',
    date: '2026-10-04',
    status: 'published',
    views: 4190,
    userId: 'u_demo2'
  },
  {
    id: 'c_005',
    title: 'Cloud Architecture Best Practices',
    category: 'Cloud Computing',
    description: 'Designing scalable, resilient, cost-effective systems with microservices, serverless, and cloud providers.',
    content: `
      <p>Cloud architecture is about designing systems that can scale reliably while controlling costs.</p>
      <h2>Resilience Patterns</h2>
      <p>Circuit breakers, retries, rate limiting, and automated failover help systems stay available.</p>
      <h2>Microservices vs Serverless</h2>
      <p>Choose the architecture pattern that best fits your workload and operational maturity.</p>
    `,
    tags: ['cloud', 'aws', 'architecture', 'devops'],
    image: 'assets/images/article-cloud.jpg',
    author: 'Jordan Lee',
    authorInitials: 'JL',
    date: '2026-10-10',
    status: 'published',
    views: 1980,
    userId: 'u_demo2'
  },
  {
    id: 'c_006',
    title: 'Building Consistent Design Systems',
    category: 'Design',
    description: 'How design tokens, component libraries, and documentation create cohesive user experiences at scale.',
    content: `
      <p>A design system is the single source of truth for design decisions and UI components across an organization.</p>
      <h2>Design Tokens</h2>
      <p>Tokens define colors, typography, spacing, and elevation in platform-agnostic values.</p>
      <h2>Component Libraries</h2>
      <p>Reusable components speed up delivery and maintain visual and functional consistency.</p>
    `,
    tags: ['design', 'ui', 'ux', 'design systems'],
    image: 'assets/images/article-design-system.svg',
    author: 'Taylor Brooks',
    authorInitials: 'TB',
    date: '2026-10-16',
    status: 'published',
    views: 2750,
    userId: 'u_demo3'
  }
];

export const DEVLOG_IMAGES = [
  'assets/images/article-javascript.jpg',
  'assets/images/article-cybersecurity.jpg',
  'assets/images/article-ai.jpg',
  'assets/images/article-webdev.jpg',
  'assets/images/article-cloud.jpg',
  'assets/images/article-design-system.svg',
  'assets/images/article-fullstack-dev.jpg',
  'assets/images/article-fullstack-2026.jpg',
  'assets/images/article-backend-api.jpg',
  'assets/images/article-backend-testing.jpg',
  'assets/images/article-javascript-backend.jpg',
  'assets/images/article-fullstack.jpg'
];

export function normalizeBlog(blog) {
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
    .toUpperCase() || 'DL';

  const plainText = String(blog.content || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  let img = typeof blog.image === 'string' && blog.image.trim() ? blog.image.trim() : '';
  if (!img) {
    const titleLower = String(blog.title || '').toLowerCase();
    if (titleLower.includes('javascript')) img = 'assets/images/article-javascript.jpg';
    else if (titleLower.includes('cybersecurity') || titleLower.includes('security')) img = 'assets/images/article-cybersecurity.jpg';
    else if (titleLower.includes('ai') || titleLower.includes('artificial')) img = 'assets/images/article-ai.jpg';
    else if (titleLower.includes('web') || titleLower.includes('frontend')) img = 'assets/images/article-webdev.jpg';
    else if (titleLower.includes('cloud')) img = 'assets/images/article-cloud.jpg';
    else if (titleLower.includes('design')) img = 'assets/images/article-design-system.svg';
    else img = 'assets/images/article-fullstack-dev.jpg';
  }

  return {
    id: blog._id || blog.id,
    title: blog.title || 'Untitled Article',
    category: blog.category || 'General',
    description:
      blog.description ||
      (plainText.length > 180 ? plainText.slice(0, 180) + '...' : plainText) ||
      'Read this article on DevLog.',
    content: blog.content || '',
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    image: img,
    author: authorName,
    authorInitials,
    authorEmail,
    date: blog.createdAt || blog.date || new Date().toISOString(),
    status: blog.status || 'published',
    views: Number(blog.views || 0),
    userId: typeof blog.author === 'object' ? blog.author?._id : blog.author
  };
}

