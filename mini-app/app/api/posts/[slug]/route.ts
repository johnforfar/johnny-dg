import { NextResponse } from 'next/server';
import path from 'path';
import { getPost } from '@/lib/datagraph';

export const dynamic = 'force-dynamic';
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const baseDir = path.join(process.cwd());
    const post = await getPost(baseDir, params.slug);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}
