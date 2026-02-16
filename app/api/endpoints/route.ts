import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dbStorage } from '@/lib/db-storage';
import { validateEmail, validateFormName } from '@/lib/validation';
import { rateLimiter, getRateLimitKey, getClientIp } from '@/lib/rate-limit';

// GET all endpoints for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const endpoints = await dbStorage.getAllEndpoints(user.id);
    
    // Transform to match frontend expectations
    const transformed = endpoints.map(e => ({
      id: e.endpoint_id,
      name: e.name,
      email: e.email,
      createdAt: new Date(e.created_at).getTime(),
      submissionCount: e.submission_count,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Failed to get endpoints:', error);
    return NextResponse.json({ error: 'Failed to get endpoints' }, { status: 500 });
  }
}

// POST create new endpoint
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting - 5 endpoint creations per hour per IP
  const clientIp = getClientIp(request);
  const rateLimitKey = getRateLimitKey(clientIp, 'create-endpoint');
  const rateLimit = rateLimiter.check(rateLimitKey, 5, 3600000); // 5 per hour

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded. You can create up to 5 endpoints per hour.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
        }
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const { name, email } = body;
  
  // Validate required fields
  if (!name || !email) {
    return NextResponse.json(
      { error: 'Missing required fields: name and email' },
      { status: 400 }
    );
  }

  // Validate form name
  const nameValidation = validateFormName(name);
  if (!nameValidation.valid) {
    return NextResponse.json(
      { error: nameValidation.error },
      { status: 400 }
    );
  }

  // Validate email
  if (!validateEmail(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  try {
    const endpoint = await dbStorage.createEndpoint(
      user.id,
      name.trim(),
      email.trim().toLowerCase()
    );

    if (!endpoint) {
      return NextResponse.json({ error: 'Failed to create endpoint' }, { status: 500 });
    }

    // Transform to match frontend expectations
    const transformed = {
      id: endpoint.endpoint_id,
      name: endpoint.name,
      email: endpoint.email,
      createdAt: new Date(endpoint.created_at).getTime(),
      submissionCount: endpoint.submission_count,
    };

    console.log(`✅ Created new endpoint: "${endpoint.name}" (${endpoint.endpoint_id}) for ${endpoint.email}`);

    return NextResponse.json(transformed, { 
      status: 201,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      }
    });
  } catch (error) {
    console.error('Failed to create endpoint:', error);
    return NextResponse.json({ error: 'Failed to create endpoint' }, { status: 500 });
  }
}
