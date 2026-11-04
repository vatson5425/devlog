/**
 * DevLog — fixBrokenImages.js
 * One-time migration: fixes blog documents that reference broken
 * or non-existent image paths stored in MongoDB.
 *
 * Run once with:
 *   node backend/scripts/fixBrokenImages.js
 */

'use strict';

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Blog = require('../models/Blog');

// ── Known broken image paths ──────────────────────────────────────────────────
const BROKEN_IMAGES = new Set([
  'assets/images/article-js.jpg',
  '',
]);

// ── Title → Correct image mapping ────────────────────────────────────────────
function getCorrectImage(title) {
  const name = String(title || '').toLowerCase().trim();

  if (
    name === 'getting started with javascript' ||
    (name.includes('getting started') &&
      name.includes('javascript') &&
      !name.includes('modern javascript'))
  ) {
    return 'assets/images/article-javascript-backend.jpg';
  }

  if (
    name.includes('first blog from backend') ||
    name.includes('my first blog')
  ) {
    return 'assets/images/article-backend-api.jpg';
  }

  if (
    name.includes('full stack') &&
    name.includes('developer') &&
    !name.includes('architecture')
  ) {
    return 'assets/images/article-fullstack-dev.jpg';
  }

  if (
    name.includes('full stack architecture') ||
    name.includes('full-stack architecture') ||
    name.includes('bridging frontend')
  ) {
    return 'assets/images/article-fullstack-2026.jpg';
  }

  if (name.includes('getting started with modern javascript')) {
    return 'assets/images/article-javascript.jpg';
  }

  if (name.includes('cybersecurity')) {
    return 'assets/images/article-cybersecurity.jpg';
  }

  if (
    name.includes('artificial intelligence') ||
    name.includes('future of ai')
  ) {
    return 'assets/images/article-ai.jpg';
  }

  if (name.includes('web development roadmap')) {
    return 'assets/images/article-webdev.jpg';
  }

  if (name.includes('cloud architecture')) {
    return 'assets/images/article-cloud.jpg';
  }

  if (name.includes('design system')) {
    return 'assets/images/article-design-system.svg';
  }

  // Generic fallback
  return 'assets/images/article-javascript-backend.jpg';
}

// ── Main migration ────────────────────────────────────────────────────────────
async function run() {
  console.log('DevLog Image Migration — connecting to MongoDB...');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  const allBlogs = await Blog.find({}, '_id title image');
  console.log(`Found ${allBlogs.length} blog(s) in database.`);

  let fixedCount = 0;

  for (const blog of allBlogs) {
    const isBroken =
      !blog.image ||
      BROKEN_IMAGES.has(blog.image) ||
      !blog.image.startsWith('assets/images/');

    if (isBroken) {
      const correctImage = getCorrectImage(blog.title);

      console.log(
        `  [FIX] "${blog.title}"\n` +
        `        was: "${blog.image || '(empty)'}"\n` +
        `         -> : "${correctImage}"`
      );

      await Blog.updateOne(
        { _id: blog._id },
        { $set: { image: correctImage } }
      );

      fixedCount++;
    } else {
      console.log(`  [OK]  "${blog.title}" -> "${blog.image}"`);
    }
  }

  console.log(
    `\nMigration complete. Fixed ${fixedCount} / ${allBlogs.length} blog(s).`
  );

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
