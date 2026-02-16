import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dbStorage } from '@/lib/db-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { formId } = await params;

  try {
    const submissions = await dbStorage.getSubmissionsByEndpointId(formId, user.id);

    // Transform to match frontend expectations
    const transformed = submissions.map(s => ({
      id: s.id,
      formId: s.form_id,
      data: s.data,
      timestamp: new Date(s.created_at).getTime(),
      isSpam: s.is_spam,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Failed to get submissions:', error);
    return NextResponse.json({ error: 'Failed to get submissions' }, { status: 500 });
  }
}
