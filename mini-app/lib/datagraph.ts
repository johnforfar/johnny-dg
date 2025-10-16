import { execSync } from 'child_process';
import fs from 'fs/promises';
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

export function decryptFileToBuffer(encryptedPath: string): Buffer {
  const privateKey = process.env.AGE_PRIVATE_KEY;
  if (!privateKey) throw new Error('AGE_PRIVATE_KEY not configured');
  const cmd = `age -d -i <(echo "${privateKey}") "${encryptedPath}"`;
  const buf = execSync(cmd, { shell: '/bin/bash', encoding: 'buffer' }) as unknown as Buffer;
  return Buffer.from(buf);
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

export async function getPostsList(baseDir: string) {
  const metadataPath = path.join(baseDir, 'metadata/posts.json');
  if (!(await fse.pathExists(metadataPath))) return [] as unknown[];
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
  const posts = await Promise.all((metadata.posts || []).map(async (post: PostMetadata) => {
    let coverImage = post.coverImage;
    let tags = post.tags || [];
    let date = post.date;
    try {
      let encPath = path.join(baseDir, `data/posts/${post.slug}.mdx.age`);
      if (!(await fse.pathExists(encPath))) {
        const hashed = hmacHex(post.slug);
        encPath = path.join(baseDir, `data/posts/${hashed}.mdx.age`);
      }
      if (await fse.pathExists(encPath)) {
        const decrypted = decryptFileToBuffer(encPath).toString('utf8');
        const fm = extractFrontmatter(decrypted);
        coverImage = (typeof fm.coverImage === 'string' ? fm.coverImage : null) || coverImage;
        tags = Array.isArray(fm.tags) ? fm.tags : tags;
        date = (typeof fm.date === 'string' ? fm.date : '') || date;
      }
    } catch {}
    // strip date prefixes e.g. "2020 04 13 Title"
    let cleanTitle = post.title as string;
    const dateMatch = cleanTitle.match(/^\d{4}\s+\d{1,2}\s+\d{1,2}\s+(.+)$/);
    if (dateMatch) cleanTitle = dateMatch[1];
    return {
      slug: post.slug,
      title: cleanTitle,
      date,
      tags: Array.isArray(tags) ? tags : [],
      categories: Array.isArray(tags) ? tags : [],
      coverImage,
      thumbnailExists: !!coverImage,
    };
  }));
  return posts;
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
