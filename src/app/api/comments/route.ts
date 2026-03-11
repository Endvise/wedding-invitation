import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Service role client for server-side operations
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Simple hash function for password
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// GET - Fetch comments
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ comments: [] });
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ comments: data || [] });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST - Create comment
export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
  }
  
  try {
    const { name, message, password } = await request.json();

    if (!name || !message || !password) {
      return NextResponse.json(
        { error: '이름, 메시지, 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const passwordHash = simpleHash(password);

    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert([{
        name: name.slice(0, 100),
        message: message.slice(0, 1000),
        password_hash: passwordHash,
        visible: true
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comment: data });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
