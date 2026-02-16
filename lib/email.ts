import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface FormSubmissionEmailData {
  formName: string;
  submissionData: Record<string, string | number | boolean>;
  submittedAt: string;
  submissionId: string;
}

export async function sendFormNotification(
  to: string,
  data: FormSubmissionEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    const emailFrom = process.env.EMAIL_FROM || 'FormForge <notifications@formforge.app>';

    // Format submission data for email
    const dataRows = Object.entries(data.submissionData)
      .filter(([key]) => !key.startsWith('_')) // Exclude internal fields
      .map(
        ([key, value]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">
            ${escapeHtml(key)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
            ${escapeHtml(String(value))}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Form Submission - ${escapeHtml(data.formName)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
        📬 New Form Submission
      </h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">
        ${escapeHtml(data.formName)}
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px;">
        You received a new submission on <strong>${new Date(data.submittedAt).toLocaleString('en-US', {
          dateStyle: 'long',
          timeStyle: 'short',
        })}</strong>
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <tbody>
          ${dataRows}
        </tbody>
      </table>

      <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #6b7280; font-size: 13px;">
          <strong>Submission ID:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace;">${
            data.submissionId
          }</code>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        This email was sent by <strong>FormForge</strong>
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        <a href="https://formforge.app" style="color: #667eea; text-decoration: none;">Visit Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const { data: emailData, error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject: `New submission: ${data.formName}`,
      html,
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: emailData?.id,
    };
  } catch (error: any) {
    console.error('Error sending email notification:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error',
    };
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
