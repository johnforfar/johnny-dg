import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getPost, extractFrontmatter } from '@/lib/datagraph';

export const dynamic = 'force-dynamic';
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const baseDir = path.join(process.cwd());

    const url = new URL(req.url);
    const domain = url.searchParams.get('domain') || '';
    const isLocal = domain === 'localhost' || domain === '127.0.0.1';

    // If local, prefer plaintext override for simple editing in dev
    if (isLocal) {
      const overridePath = path.join(baseDir, `data/posts-overrides/${params.slug}.mdx`);
      const overrideExists = await fs.access(overridePath).then(() => true).catch(() => false);
      if (overrideExists) {
        const contentRaw = await fs.readFile(overridePath, 'utf8');
        const fm = extractFrontmatter(contentRaw);
        const content = contentRaw.replace(/^---\n[\s\S]*?\n---\n/, '');
        return NextResponse.json({
          slug: params.slug,
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
        });
      }
    }

    const post = await getPost(baseDir, params.slug);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const url = new URL(req.url);
    const domain = url.searchParams.get('domain') || '';
    const isLocal = domain === 'localhost' || domain === '127.0.0.1';

    // Only allow editing from local hostnames to avoid auth at this stage
    if (!isLocal) {
      return NextResponse.json({ error: 'Editing allowed only on localhost' }, { status: 403 });
    }

    const body = await req.json().catch(() => null) as { content?: string, metadata?: Record<string, any> } | null;
    if (!body || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Invalid body: { content } required' }, { status: 400 });
    }

    const baseDir = path.join(process.cwd());
    const overridesDir = path.join(baseDir, 'data/posts-overrides');
    const overridePath = path.join(overridesDir, `${params.slug}.mdx`);
    await fs.mkdir(overridesDir, { recursive: true });

    const metadata = body.metadata || {};
    const fmLines: string[] = [];
    // Minimal frontmatter preservation for local editing
    const fmKeys = ['title','date','tags','categories','coverImage','summary'] as const;
    for (const key of fmKeys) {
      const value = (metadata as any)[key];
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        fmLines.push(`${key}: ${JSON.stringify(value)}`);
      } else {
        fmLines.push(`${key}: ${String(value)}`);
      }
    }
    const fmBlock = fmLines.length > 0 ? `---\n${fmLines.join('\n')}\n---\n\n` : '';
    const fileContent = `${fmBlock}${body.content}`;

    await fs.writeFile(overridePath, fileContent, 'utf8');
    return NextResponse.json({ ok: true, slug: params.slug, path: `data/posts-overrides/${params.slug}.mdx` });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}
