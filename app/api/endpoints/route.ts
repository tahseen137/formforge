import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

// GET all endpoints
export async function GET() {
  const endpoints = storage.getAllEndpoints();
  return NextResponse.json(endpoints);
}

// POST create new endpoint
export async function POST(request: NextRequest) {
  const { name, email } = await request.json();
  
  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required' },
      { status: 400 }
    );
  }

  const endpoint = storage.createEndpoint(name, email);
  return NextResponse.json(endpoint, { status: 201 });
}
