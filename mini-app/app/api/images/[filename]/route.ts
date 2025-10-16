import { NextResponse } from 'next/server';
import path from 'path';
import { getDecryptedImage } from '@/lib/datagraph';

export const dynamic = 'force-dynamic';
export async function GET(_: Request, ctx: { params: Promise<{ filename: string }> }) {
  try {
    const baseDir = path.join(process.cwd());
    const { filename } = await ctx.params;
    const img = await getDecryptedImage(baseDir, filename);
    if (!img) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return new NextResponse(img.data, {
      headers: {
        'Content-Type': img.contentType,
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
