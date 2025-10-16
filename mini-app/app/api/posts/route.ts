import { NextResponse } from 'next/server';
import path from 'path';
import { getPostsList } from '@/lib/datagraph';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const baseDir = path.join(process.cwd());
    const posts = await getPostsList(baseDir);
    return NextResponse.json(posts);
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
