import { NextRequest, NextResponse } from 'next/server';
import { dbStorage } from '@/lib/db-storage';
import { sendFormNotification } from '@/lib/email';
import {
  validateFormData,
  sanitizeFormData,
  isSpam,
  validateRedirectUrl,
} from '@/lib/validation';
import { rateLimiter, getRateLimitKey, getClientIp } from '@/lib/rate-limit';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;

  // Check if endpoint exists
  const endpoint = await dbStorage.getEndpoint(formId);
  if (!endpoint) {
    return NextResponse.json({ error: 'Form endpoint not found' }, { status: 404 });
  }

  // Rate limiting - 10 submissions per minute per IP
  const clientIp = getClientIp(request);
  const rateLimitKey = getRateLimitKey(clientIp, `submit:${formId}`);
  const rateLimit = rateLimiter.check(rateLimitKey, 10, 60000); // 10 per minute

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetAt),
        },
      }
    );
  }

  // Parse form data
  const contentType = request.headers.get('content-type') || '';
  let formData: Record<string, string | number | boolean> = {};

  try {
    if (contentType.includes('application/json')) {
      formData = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
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
          {
            error:
              'Invalid content type. Use application/json or application/x-www-form-urlencoded',
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Error parsing form data:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate form data
  const validation = validateFormData(formData);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Check for spam
  const spamCheck = isSpam(formData);
  if (spamCheck.isSpam) {
    console.log(`Spam detected for form ${formId}:`, spamCheck.reason);

    // Store spam submission for analysis
    const userAgent = request.headers.get('user-agent') || undefined;
    await dbStorage.addSubmission(
      formId,
      sanitizeFormData(formData),
      clientIp,
      userAgent,
      true,
      spamCheck.reason
    );

    // Return success to avoid revealing spam detection
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    });
  }

  // Sanitize and extract redirect URL before storing
  const redirectUrl = formData._redirect || formData.redirect;
  const sanitizedData = sanitizeFormData(formData);

  // Store submission
  const userAgent = request.headers.get('user-agent') || undefined;
  const submission = await dbStorage.addSubmission(
    formId,
    sanitizedData,
    clientIp,
    userAgent,
    false
  );

  if (!submission) {
    return NextResponse.json({ error: 'Failed to store submission' }, { status: 500 });
  }

  // Log submission
  console.log(`✅ New submission for "${endpoint.name}" (${formId}):`, {
    fields: Object.keys(sanitizedData),
    timestamp: new Date(submission.created_at).toISOString(),
    ip: clientIp,
  });

  // Send email notification
  try {
    const emailResult = await sendFormNotification(endpoint.email, {
      formName: endpoint.name,
      submissionData: sanitizedData,
      submittedAt: submission.created_at,
      submissionId: submission.id,
    });

    // Log email status
    await dbStorage.logEmail(
      submission.id,
      endpoint.email,
      `New submission: ${endpoint.name}`,
      emailResult.success ? 'sent' : 'failed',
      emailResult.error
    );

    if (emailResult.success) {
      console.log(`📧 Email sent to: ${endpoint.email} (ID: ${emailResult.messageId})`);
    } else {
      console.warn(`📧 Email failed: ${emailResult.error}`);
    }
  } catch (emailError) {
    console.error('Error sending email notification:', emailError);
    // Don't fail the request if email fails
  }

  // Handle redirect
  if (redirectUrl && typeof redirectUrl === 'string') {
    if (validateRedirectUrl(redirectUrl)) {
      // For HTML form submissions, redirect
      if (
        contentType.includes('application/x-www-form-urlencoded') ||
        contentType.includes('multipart/form-data')
      ) {
        return NextResponse.redirect(redirectUrl, 303);
      }
      // For AJAX/JSON submissions, return the URL
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully',
        submissionId: submission.id,
        redirect: redirectUrl,
      });
    } else {
      console.warn(`Invalid redirect URL blocked: ${redirectUrl}`);
    }
  }

  // Return JSON response
  return NextResponse.json(
    {
      success: true,
      message: 'Form submitted successfully',
      submissionId: submission.id,
    },
    {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.resetAt),
      },
    }
  );
}

// GET endpoint for testing/info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const endpoint = await dbStorage.getEndpoint(formId);

  if (!endpoint) {
    return NextResponse.json({ error: 'Form endpoint not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'This is a form submission endpoint. Use POST to submit data.',
    endpoint: {
      name: endpoint.name,
      id: endpoint.endpoint_id,
      createdAt: new Date(endpoint.created_at).toISOString(),
      submissionCount: endpoint.submission_count,
    },
    usage: {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded or application/json',
      rateLimit: '10 requests per minute per IP',
      specialFields: {
        _redirect: 'URL to redirect to after submission',
        _gotcha: 'Honeypot field (leave empty)',
      },
    },
  });
}
