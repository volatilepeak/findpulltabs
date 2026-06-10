import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { count } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({ ok: true, count, timestamp: new Date().toISOString() });
}
