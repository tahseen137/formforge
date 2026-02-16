import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id || id.trim().length === 0) {
    return NextResponse.json(
      { error: 'Invalid endpoint ID' },
      { status: 400 }
    );
  }

  const endpoint = storage.getEndpoint(id);
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Form endpoint not found' },
      { status: 404 }
    );
  }

  const deleted = storage.deleteEndpoint(id);
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Failed to delete endpoint' },
      { status: 500 }
    );
  }

  console.log(`🗑️ Deleted endpoint: "${endpoint.name}" (${id})`);

  return new NextResponse(null, { status: 204 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const endpoint = storage.getEndpoint(id);
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Form endpoint not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(endpoint);
}
