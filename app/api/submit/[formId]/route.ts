import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  
  // Check if endpoint exists
  const endpoint = storage.getEndpoint(formId);
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Form endpoint not found' },
      { status: 404 }
    );
  }

  // Parse form data
  const contentType = request.headers.get('content-type') || '';
  let formData: Record<string, string | number | boolean> = {};

  if (contentType.includes('application/json')) {
    formData = await request.json();
  } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const data = await request.formData();
    data.forEach((value, key) => {
      formData[key] = value.toString();
    });
  } else {
    // Try to parse as form data anyway
    try {
      const data = await request.formData();
      data.forEach((value, key) => {
        formData[key] = value.toString();
      });
    } catch {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }
  }

  // Store submission
  const submission = storage.addSubmission(formId, formData);

  if (!submission) {
    return NextResponse.json(
      { error: 'Failed to store submission' },
      { status: 500 }
    );
  }

  // Log submission (in production, this would send email)
  console.log(`New submission for ${endpoint.name}:`, formData);
  console.log(`Email would be sent to: ${endpoint.email}`);

  // Check if there's a redirect URL in the form data
  const redirectUrl = formData._redirect || formData.redirect;
  
  if (redirectUrl && typeof redirectUrl === 'string') {
    return NextResponse.redirect(redirectUrl);
  }

  // Return JSON response
  return NextResponse.json({
    success: true,
    message: 'Form submitted successfully',
    submissionId: submission.id,
  });
}

// Also support GET for testing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const endpoint = storage.getEndpoint(formId);
  
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Form endpoint not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'This is a form submission endpoint. Use POST to submit data.',
    endpoint: {
      name: endpoint.name,
      id: endpoint.id,
    },
  });
}
