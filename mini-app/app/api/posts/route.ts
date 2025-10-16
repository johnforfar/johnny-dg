import { NextResponse } from 'next/server';
import path from 'path';
import { getPostsList } from '@/lib/datagraph';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const baseDir = path.join(process.cwd());
    console.log('Posts API: baseDir =', baseDir);
    console.log('Posts API: AGE_PRIVATE_KEY available =', !!process.env.AGE_PRIVATE_KEY);
    const posts = await getPostsList(baseDir);
    console.log('Posts API: loaded', posts.length, 'posts');
    return NextResponse.json(posts);
  } catch (e: unknown) {
    console.error('Posts API error:', e);
    return NextResponse.json({ error: 'Failed to load posts', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
