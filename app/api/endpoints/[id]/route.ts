import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dbStorage } from '@/lib/db-storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Get the form by endpoint_id to get the actual UUID
    const form = await dbStorage.getEndpoint(id);
    
    if (!form) {
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }

    if (form.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbStorage.deleteEndpoint(user.id, form.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete endpoint:', error);
    return NextResponse.json({ error: 'Failed to delete endpoint' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const form = await dbStorage.getEndpoint(id);
    
    if (!form) {
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }

    if (form.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const transformed = {
      id: form.endpoint_id,
      name: form.name,
      email: form.email,
      createdAt: new Date(form.created_at).getTime(),
      submissionCount: form.submission_count,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Failed to get endpoint:', error);
    return NextResponse.json({ error: 'Failed to get endpoint' }, { status: 500 });
  }
}
