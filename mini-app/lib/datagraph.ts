import { execSync } from 'child_process';
import fs from 'fs/promises';
import { writeFileSync, unlinkSync } from 'fs';
import fse from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

function hmacHex(input: string): string {
  const key = (process.env.AGE_PRIVATE_KEY || '').trim();
  if (!key) throw new Error('AGE_PRIVATE_KEY not configured');
  return crypto.createHmac('sha256', key).update(input).digest('hex');
}

export type Frontmatter = Record<string, unknown>;

export type PostMetadata = {
  slug: string;
  title?: string;
  date?: string;
  tags?: string[];
  categories?: string[];
  coverImage?: string | null;
  summary?: string;
};

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  coverImage: string | null;
  thumbnailExists: boolean;
};

const POSTS_CACHE_TTL_MS = Number.parseInt(process.env.POSTS_CACHE_TTL_MS || '', 10) || 60_000;

type PostsCache = {
  timestamp: number;
  data: PostSummary[];
};

let postsCache: PostsCache | null = null;

function slugify(input: string): string {
  const normalized = input
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  if (normalized) return normalized;
  return crypto.randomBytes(16).toString('hex');
}

function cleanTitle(input: string): string {
  const dateMatch = input.match(/^\d{4}\s+\d{1,2}\s+\d{1,2}\s+(.+)$/);
  return dateMatch ? dateMatch[1] : input;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === 'string' ? v : null))
    .filter((v): v is string => typeof v === 'string' && v.length > 0);
}

export function decryptFileToBuffer(encryptedPath: string): Buffer {
  const privateKey = process.env.AGE_PRIVATE_KEY;
  if (!privateKey) throw new Error('AGE_PRIVATE_KEY not configured');
  
  console.log('Decrypting file:', encryptedPath);
  console.log('AGE_PRIVATE_KEY available:', !!privateKey);
  
  // Write key to temp file to avoid shell process substitution issues
  const tempKeyPath = path.join('/tmp', `age-key-${crypto.randomBytes(4).toString('hex')}`);
  
  try {
    writeFileSync(tempKeyPath, privateKey, { mode: 0o600 });

    const cmd = `age -d -i "${tempKeyPath}" "${encryptedPath}"`;
    console.log('Running command:', `age -d -i [TEMP_KEY] "${encryptedPath}"`);
    
    const buf = execSync(cmd, { encoding: 'buffer', shell: '/run/current-system/sw/bin/sh' }) as unknown as Buffer;
    console.log('Decryption successful, buffer size:', buf.length);
    return Buffer.from(buf);
  } catch (error) {
    console.error('Decryption failed:', error);
    console.error('File path:', encryptedPath);
    console.error('AGE_PRIVATE_KEY length:', privateKey.length);
    throw error;
  } finally {
    // Cleanup
    try {
        unlinkSync(tempKeyPath);
    } catch {}
  }
}

export function extractFrontmatter(content: string): Frontmatter {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm: Frontmatter = {};
  const lines = m[1].split('\n');
  for (const line of lines) {
    const mm = line.match(/^(\w+):\s*(.+)$/);
    if (!mm) continue;
    const key = mm[1];
    let value = mm[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value); } catch {}
    }
    fm[key] = value;
  }
  return fm;
}

export async function getPostsList(baseDir: string, options?: { forceRefresh?: boolean }) {
  if (!options?.forceRefresh && postsCache && Date.now() - postsCache.timestamp < POSTS_CACHE_TTL_MS) {
    return postsCache.data;
  }

  const postsDir = path.join(baseDir, 'data/posts');
  if (!(await fse.pathExists(postsDir))) {
    postsCache = { timestamp: Date.now(), data: [] };
    return postsCache.data;
  }

  const files = await fs.readdir(postsDir);
  const ageFiles = files.filter((f) => f.endsWith('.mdx.age') && !f.startsWith('._'));

  const posts: PostSummary[] = [];
  for (const filename of ageFiles) {
    const encPath = path.join(postsDir, filename);

    try {
      const decrypted = decryptFileToBuffer(encPath).toString('utf8');
      const fm = extractFrontmatter(decrypted);

      const rawTitle = typeof fm.title === 'string' && fm.title.trim().length > 0 ? fm.title.trim() : 'Untitled';
      let slug = filename.replace(/\.mdx\.age$/, '');
      const isHashed = /^[a-f0-9]{64}$/.test(slug);

      if (isHashed) {
        if (typeof fm.slug === 'string' && fm.slug.trim().length > 0) {
          slug = fm.slug.trim();
        } else {
          slug = slugify(rawTitle);
        }
      }

      const date = typeof fm.date === 'string' ? fm.date : '';
      const coverImage = typeof fm.coverImage === 'string' ? fm.coverImage : null;
      const tags = toStringArray(fm.tags);
      const categories = toStringArray(fm.categories);

      posts.push({
        slug,
        title: cleanTitle(rawTitle),
        date,
        tags,
        categories: categories.length > 0 ? categories : tags,
        coverImage,
        thumbnailExists: !!coverImage,
      });
    } catch (error) {
      console.error(`Failed to process ${filename}:`, error);
    }
  }

  posts.sort((a, b) => {
    const dateA = a.date ? Date.parse(a.date) : 0;
    const dateB = b.date ? Date.parse(b.date) : 0;
    if (dateA === dateB) return a.title.localeCompare(b.title);
    return dateB - dateA;
  });

  postsCache = {
    timestamp: Date.now(),
    data: posts,
  };

  return postsCache.data;
}

export async function getPost(baseDir: string, slug: string) {
  let encPath = path.join(baseDir, `data/posts/${slug}.mdx.age`);
  if (!(await fse.pathExists(encPath))) {
    const hashed = hmacHex(slug);
    encPath = path.join(baseDir, `data/posts/${hashed}.mdx.age`);
    if (!(await fse.pathExists(encPath))) return null;
  }
  const decrypted = decryptFileToBuffer(encPath).toString('utf8');
  const fm = extractFrontmatter(decrypted);
  const content = decrypted.replace(/^---\n[\s\S]*?\n---\n/, '');
  return {
    slug,
    title: fm.title || 'Untitled',
    date: fm.date || '',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    categories: Array.isArray(fm.categories) ? fm.categories : [],
    coverImage: fm.coverImage || null,
    summary: fm.summary || '',
    content,
    metadata: {
      title: fm.title || 'Untitled',
      date: fm.date || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      categories: Array.isArray(fm.categories) ? fm.categories : [],
      coverImage: fm.coverImage || null,
      summary: fm.summary || ''
    }
  };
}

export async function getDecryptedImage(baseDir: string, filename: string): Promise<{ data: Buffer; contentType: string } | null> {
  let encPath = path.join(baseDir, `data/images/${filename}.age`);
  if (!(await fse.pathExists(encPath))) {
    const hashed = hmacHex(path.basename(filename));
    encPath = path.join(baseDir, `data/images/${hashed}.age`);
    if (!(await fse.pathExists(encPath))) return null;
  }
  const data = decryptFileToBuffer(encPath);
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string,string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml'
  };
  return { data, contentType: types[ext] || 'application/octet-stream' };
}
