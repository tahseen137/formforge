import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { validateEmail, validateFormName } from '@/lib/validation';
import { rateLimiter, getRateLimitKey, getClientIp } from '@/lib/rate-limit';

// GET all endpoints
export async function GET() {
  const endpoints = storage.getAllEndpoints();
  return NextResponse.json(endpoints);
}

// POST create new endpoint
export async function POST(request: NextRequest) {
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

  // Check total endpoint count (prevent abuse)
  const allEndpoints = storage.getAllEndpoints();
  if (allEndpoints.length >= 1000) {
    return NextResponse.json(
      { error: 'Maximum number of endpoints reached. Please contact support.' },
      { status: 429 }
    );
  }

  // Create endpoint
  const endpoint = storage.createEndpoint(name.trim(), email.trim().toLowerCase());
  
  console.log(`✅ Created new endpoint: "${endpoint.name}" (${endpoint.id}) for ${endpoint.email}`);

  return NextResponse.json(endpoint, { 
    status: 201,
    headers: {
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': String(rateLimit.remaining),
    }
  });
}
