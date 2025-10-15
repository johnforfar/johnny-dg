import { NextResponse } from 'next/server';
import path from 'path';
import { getDecryptedImage } from '@/lib/datagraph';

export const dynamic = 'force-dynamic';
export async function GET(_: Request, { params }: { params: { filename: string } }) {
  try {
    const baseDir = path.join(process.cwd());
    const img = await getDecryptedImage(baseDir, params.filename);
    if (!img) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return new NextResponse(img.data, {
      headers: {
        'Content-Type': img.contentType,
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
