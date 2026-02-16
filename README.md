# 📝 FormForge

**Modern form backend infrastructure for developers who move fast.**

![FormForge Banner](https://formforge-olive.vercel.app/og-image.png)

FormForge is a form backend as a service that lets you build and ship forms in minutes, not hours. Point your HTML form to our API, and we'll handle submissions, notifications, spam protection, and storage.

## 🚀 Live Demo

**[formforge-olive.vercel.app](https://formforge-olive.vercel.app)** - Try it now!

## ✨ Features

### Core
- ⚡ **Instant Setup** - Create an endpoint and start collecting submissions in 30 seconds
- 📧 **Email Notifications** - Get notified when someone submits your form
- 🎨 **Framework Agnostic** - Works with HTML, React, Vue, Svelte, or any frontend
- 🔒 **Spam Protection** - Built-in honeypot and rate limiting
- 📊 **Dashboard** - View and manage all your submissions in one place
- 💾 **Data Export** - Export submissions as JSON

### Pro Features ($19/mo)
- 🔄 **Custom Redirects** - Send users anywhere after submission
- 🎨 **Custom Branding** - Remove "Powered by FormForge" footer
- 📁 **File Uploads** - Accept file attachments up to 10MB
- 📈 **Analytics** - Track conversion rates and submission trends
- ✉️ **Custom Email Templates** - Brand your notification emails

### Business Features ($49/mo)
- 🔌 **Webhooks** - POST submissions to your own endpoints
- 🔑 **API Access** - Full REST API with authentication
- 👥 **Team Collaboration** - Invite team members to manage forms
- 🏷️ **White-label** - Use your own domain
- ⚡ **Priority Support** - 24-hour response time

## 🎯 Quick Start

### 1. Create a form endpoint

```bash
curl -X POST https://formforge-olive.vercel.app/api/endpoints \
  -H "Content-Type: application/json" \
  -d '{"name": "Contact Form", "email": "you@example.com"}'
```

### 2. Use it in your HTML

```html
<form action="https://formforge-olive.vercel.app/api/submit/YOUR_ID" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message" required></textarea>
  
  <!-- Optional: Redirect after submission -->
  <input type="hidden" name="_redirect" value="https://example.com/thanks" />
  
  <button type="submit">Send</button>
</form>
```

### 3. Receive submissions

✅ View in dashboard: `https://formforge-olive.vercel.app/dashboard`  
✅ Get email notifications  
✅ Export as JSON

## 📚 Usage Examples

### React

```jsx
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const response = await fetch('https://formforge-olive.vercel.app/api/submit/YOUR_ID', {
      method: 'POST',
      body: data,
    });

    if (response.ok) {
      setStatus('Message sent!');
      form.reset();
    } else {
      setStatus('Failed to send');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </form>
  );
}
```

### Vue

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" name="name" placeholder="Name" required />
    <input v-model="form.email" name="email" type="email" placeholder="Email" required />
    <textarea v-model="form.message" name="message" placeholder="Message" required />
    <button type="submit">Send</button>
    <p v-if="status">{{ status }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({ name: '', email: '', message: '' });
const status = ref('');

async function handleSubmit() {
  const formData = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch('https://formforge-olive.vercel.app/api/submit/YOUR_ID', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    status.value = 'Message sent!';
    form.value = { name: '', email: '', message: '' };
  } else {
    status.value = 'Failed to send';
  }
}
</script>
```

### Fetch API (Vanilla JS)

```javascript
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch('https://formforge-olive.vercel.app/api/submit/YOUR_ID', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      alert('Message sent successfully!');
      e.target.reset();
    } else {
      alert('Failed to send message');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error');
  }
});
```

## 💳 Pricing

| Plan | Price | Forms | Submissions | Features |
|------|-------|-------|-------------|----------|
| **Free** | $0/mo | 3 | 100/mo | Basic features, email notifications |
| **Pro** | $19/mo | Unlimited | 10,000/mo | Custom branding, file uploads, redirects |
| **Business** | $49/mo | Unlimited | Unlimited | API access, webhooks, team collaboration |

[View detailed pricing →](https://formforge-olive.vercel.app/pricing)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payments:** Stripe
- **Storage:** In-memory (⚠️ See Development Notes)
- **Deployment:** Vercel

## 📦 Self-Hosting

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or pnpm
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/tahseen137/formforge.git
cd formforge

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_BUSINESS_PRICE_ID=price_xxx

# Optional: Email notifications (recommended)
RESEND_API_KEY=re_xxx
EMAIL_FROM=FormForge <notifications@yourdomain.com>

# Optional: Rate limiting (recommended for production)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

### Setting Up Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from [API Keys](https://dashboard.stripe.com/apikeys)
3. Create two products in [Products](https://dashboard.stripe.com/products):
   - **Pro Plan**: $19/month recurring
   - **Business Plan**: $49/month recurring
4. Set up a webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
5. Configure [Customer Portal](https://dashboard.stripe.com/settings/billing/portal)

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Visit `http://localhost:3000`

### Deployment

#### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/formforge)

1. Click the button above
2. Add your environment variables
3. Deploy!

#### Other Platforms

FormForge can be deployed to any platform that supports Next.js:
- Railway
- Fly.io
- AWS Amplify
- Cloudflare Pages
- Netlify

## 📖 API Reference

### Endpoints

#### `POST /api/endpoints`
Create a new form endpoint.

**Request:**
```json
{
  "name": "Contact Form",
  "email": "you@example.com"
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "name": "Contact Form",
  "email": "you@example.com",
  "createdAt": 1708123456789,
  "submissionCount": 0
}
```

#### `GET /api/endpoints`
Get all form endpoints.

**Response:**
```json
[
  {
    "id": "abc123xyz",
    "name": "Contact Form",
    "email": "you@example.com",
    "createdAt": 1708123456789,
    "submissionCount": 5
  }
]
```

#### `DELETE /api/endpoints/:id`
Delete a form endpoint.

**Response:** `204 No Content`

#### `POST /api/submit/:formId`
Submit data to a form.

**Content-Type:** `application/x-www-form-urlencoded`, `application/json`, or `multipart/form-data`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!",
  "_redirect": "https://example.com/thanks"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "sub_xyz123"
}
```

**Special Fields:**
- `_redirect` - URL to redirect to after submission
- Fields starting with `_` are not stored

#### `GET /api/submissions/:formId`
Get all submissions for a form.

**Response:**
```json
[
  {
    "id": "sub_xyz123",
    "formId": "abc123xyz",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello!"
    },
    "timestamp": 1708123456789
  }
]
```

## 🔒 Security

### Spam Protection
- Honeypot fields (add `<input type="text" name="_gotcha" style="display:none" />`)
- Rate limiting (10 submissions per minute per IP)
- Content filtering for common spam patterns

### Data Protection
- All API routes use HTTPS
- Sensitive data is never logged
- Form submissions are stored securely
- No third-party tracking scripts

## 🐛 Troubleshooting

### Email notifications not working
- Check that `RESEND_API_KEY` is set
- Verify your domain is configured in Resend
- Check spam folder

### Stripe webhooks failing
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure your webhook endpoint is publicly accessible
- Check Stripe dashboard for error logs

### Form submissions not saving
- ⚠️ **Known Issue:** Current version uses in-memory storage
- Data is lost on server restart/redeploy
- Solution: Implement persistent storage (see Contributing)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Priority Features Needed
1. **Persistent Storage** - Replace in-memory storage with database (Postgres, Vercel KV)
2. **Authentication** - Add user accounts (Clerk, NextAuth)
3. **Email Service** - Implement real email notifications (Resend, SendGrid)
4. **File Uploads** - Add file attachment support
5. **Webhooks** - POST submissions to user-defined URLs
6. **Integrations** - Slack, Discord, Google Sheets

### Development Setup

```bash
git clone https://github.com/tahseen137/formforge.git
cd formforge
npm install
npm run dev
```

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Stripe](https://stripe.com/) - Payments
- [Vercel](https://vercel.com/) - Hosting

## 📧 Support

- **Documentation:** [docs.formforge.app](https://formforge-olive.vercel.app)
- **Email:** support@formforge.app
- **GitHub Issues:** [github.com/tahseen137/formforge/issues](https://github.com/tahseen137/formforge/issues)

---

**⚡ Built with Next.js and Tailwind CSS** | **Made with ❤️ for developers**
