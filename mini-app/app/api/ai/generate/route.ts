import { NextResponse } from 'next/server';
import { generate } from '@/lib/ollama';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const body = await req.json();
  const { prompt, model, options } = body || {};
  if (!prompt) return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
  const result = await generate(prompt, model, options);
  return NextResponse.json(result);
}
