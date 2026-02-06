import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = storage.deleteEndpoint(id);
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
