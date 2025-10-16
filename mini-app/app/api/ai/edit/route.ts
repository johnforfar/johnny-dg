import { NextResponse } from 'next/server';
import { generate } from '@/lib/ollama';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as { title?: string; content?: string; instruction?: string; model?: string } | null;
    if (!body || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    const system = `You are an expert technical copy editor for MDX blog posts. Improve clarity, excitement, and SEO. Preserve YAML frontmatter if present and valid markdown/MDX syntax. Do not wrap output in code fences. Keep links and media intact. Return only the edited MDX content.`;
    const instruction = body.instruction || `Rewrite the content to be more engaging and SEO-friendly while keeping the technical accuracy. Optimize headings and add a concise introduction. Title: "${body.title || ''}"`;

    const prompt = `${system}\n\n---\nTITLE: ${body.title || ''}\n---\n\nCONTENT:\n${body.content}`;

    const res = await generate(prompt, body.model);
    if (!res.success) return NextResponse.json({ error: 'generation failed' }, { status: 500 });
    const suggestion = res.response || '';
    return NextResponse.json({ suggestion });
  } catch (e: any) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}


