# 📝 FormForge

**Your form backend in 30 seconds—no coding required**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/formforge)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://formforge-olive.vercel.app)

---

## 📖 About

**FormForge** is a **form backend as a service** that eliminates the need for custom server code. Simply point your HTML form to a FormForge endpoint and start collecting submissions instantly. Perfect for landing pages, contact forms, feedback widgets, and any use case where you need to collect data without building a backend.

Stop writing backend code for simple forms. Get a submission endpoint instantly and focus on building great products.

**Live Demo:** [formforge-olive.vercel.app](https://formforge-olive.vercel.app)

---

## ✨ Features

### Core Features
- ⚡ **Instant Setup** — Generate submission endpoints in seconds
- 📧 **Email Notifications** — Get notified when someone submits
- 📊 **Submission Dashboard** — View and manage all form submissions
- 🎨 **Framework Agnostic** — Works with pure HTML, React, Vue, Svelte, or any framework
- 🔒 **Spam Protection** — Built-in bot protection and validation

### Pro Features (Coming Soon)
- 🔄 **Custom Redirects** — Send users anywhere after submission
- 📈 **Unlimited Submissions** — No monthly caps
- 🔐 **Advanced Security** — reCAPTCHA integration and rate limiting
- 📥 **Export to CSV** — Download submissions for analysis
- 🎯 **Webhooks** — Trigger custom workflows on submission

### Technical Features
- 🌐 **REST API** — Simple POST endpoint for submissions
- 💳 **Stripe Integration** — Built-in payment processing for Pro tier
- 📱 **Responsive Dashboard** — Mobile-friendly UI
- 🚀 **Edge-Optimized** — Fast response times worldwide

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Payments** | Stripe |
| **Deployment** | Vercel |
| **Storage** | Edge-compatible (in-memory/KV) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- (Optional) Stripe account for Pro features

### Installation

```bash
# Clone the repository
git clone https://github.com/tahseen137/formforge.git
cd formforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe (for Pro tier payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Email notifications (SendGrid, Resend, etc.)
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@formforge.app

# Optional: Storage (Upstash Redis, Vercel KV, etc.)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (see above)
   - Deploy!

3. **Configure Stripe Webhooks** (for Pro tier)
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/formforge)

### Alternative Deployment Options
- **Netlify:** Supports Next.js with Edge Functions
- **Railway:** Full support for Next.js applications
- **DigitalOcean App Platform:** Deploy from GitHub directly

---

## 🎯 Usage

### Quick Start

1. **Create an Endpoint**
   - Visit your FormForge dashboard
   - Click "Create New Form"
   - Copy your unique form ID

2. **Point Your Form**
   ```html
   <form action="https://formforge-olive.vercel.app/api/submit/YOUR_FORM_ID" method="POST">
     <input type="text" name="name" placeholder="Your name" required />
     <input type="email" name="email" placeholder="Your email" required />
     <textarea name="message" placeholder="Your message"></textarea>
     <button type="submit">Send</button>
   </form>
   ```

3. **Receive Submissions**
   - View submissions in the dashboard
   - Receive email notifications (if configured)

### Framework Examples

#### Pure HTML
```html
<form action="https://formforge-olive.vercel.app/api/submit/abc123" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>
```

#### React / Next.js
```jsx
export default function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const response = await fetch('https://formforge-olive.vercel.app/api/submit/abc123', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      setStatus('Success! Thank you for your submission.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <button type="submit">Submit</button>
      {status && <p>{status}</p>}
    </form>
  );
}
```

#### Vue
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <button type="submit">Submit</button>
    <p v-if="status">{{ status }}</p>
  </form>
</template>

<script>
export default {
  data() {
    return { status: '' };
  },
  methods: {
    async handleSubmit(e) {
      const formData = new FormData(e.target);
      const response = await fetch('https://formforge-olive.vercel.app/api/submit/abc123', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        this.status = 'Success!';
      }
    }
  }
}
</script>
```

---

## 🔌 API Reference

### Public Endpoints

#### `POST /api/submit/[formId]`
Submit form data to a specific endpoint.

**Content-Type:** `application/x-www-form-urlencoded` or `multipart/form-data`

**Request:**
```bash
curl -X POST https://formforge-olive.vercel.app/api/submit/abc123 \
  -d "name=John Doe" \
  -d "email=john@example.com" \
  -d "message=Hello world"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Submission received",
  "submissionId": "sub_123456"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid form ID or missing required fields"
}
```

### Protected Endpoints

#### `GET /api/endpoints`
List all form endpoints for the authenticated user.

#### `POST /api/endpoints`
Create a new form endpoint.

**Request Body:**
```json
{
  "name": "Contact Form",
  "notificationEmail": "you@example.com",
  "redirectUrl": "https://yoursite.com/thank-you" // Pro only
}
```

#### `GET /api/submissions/[formId]`
Fetch all submissions for a specific form.

**Response:**
```json
{
  "submissions": [
    {
      "id": "sub_123",
      "formId": "abc123",
      "data": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-02-06T12:00:00Z"
    }
  ]
}
```

---

## 💳 Pricing

### Free Tier
- ✅ 100 submissions/month
- ✅ Email notifications
- ✅ Basic spam protection
- ✅ Dashboard access

### Pro Tier - $8/month
- ✅ **Unlimited submissions**
- ✅ Email notifications
- ✅ Advanced spam protection (reCAPTCHA)
- ✅ Custom redirects after submission
- ✅ CSV exports
- ✅ Webhooks
- ✅ Priority support

---

## 🎨 Customization

### Custom Success Pages
Configure where users are redirected after submission (Pro tier):

```javascript
// In dashboard settings
{
  "redirectUrl": "https://yoursite.com/thank-you"
}
```

### Email Templates
Customize notification emails by modifying `/lib/email.ts` (self-hosted only).

### Spam Protection
Enable additional security:
- Rate limiting (default: 5 submissions/hour per IP)
- Honeypot fields
- reCAPTCHA integration (Pro)

---

## 📊 Use Cases

- 📧 **Contact Forms** — Customer inquiries and support requests
- 🎯 **Landing Pages** — Lead capture and waitlists
- 📝 **Feedback Widgets** — User feedback and bug reports
- 📋 **Surveys** — Quick polls and questionnaires
- 🎟️ **Event Registration** — RSVP and signup forms
- 💼 **Job Applications** — Resume submissions

---

## 🔒 Security

- ✅ CORS protection (configurable origins)
- ✅ Rate limiting per IP address
- ✅ Input validation and sanitization
- ✅ Honeypot spam detection
- ✅ reCAPTCHA integration (Pro)
- ✅ Secure webhook signatures (Stripe)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Payments powered by [Stripe](https://stripe.com)
- Deployed on [Vercel](https://vercel.com)

---

## 📧 Support

For questions or support, please open an issue on GitHub or visit our [documentation](https://formforge-olive.vercel.app/docs).

**Made with ❤️ for developers who value their time**
