import { NextResponse } from 'next/server';
import { listModels } from '@/lib/ollama';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(await listModels()); }
