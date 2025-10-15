import { NextResponse } from 'next/server';
import { aiHealth } from '@/lib/ollama';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(await aiHealth()); }
