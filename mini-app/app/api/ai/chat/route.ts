import { NextResponse } from 'next/server';
import { chat } from '@/lib/ollama';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const body = await req.json();
  const { messages, model, options } = body || {};
  if (!messages || !Array.isArray(messages)) return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 });
  const result = await chat(messages, model, options);
  return NextResponse.json(result);
}
