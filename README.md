# 📝 FormForge

**Your form backend in 30 seconds.**

FormForge is a form backend as a service. Stop writing backend code for simple forms — get a submission endpoint instantly and focus on building great products.

![Screenshot](screenshot.png)

## Features

- ⚡ **Instant Setup** — Create an endpoint and start collecting immediately
- 📧 **Email Notifications** — Get notified when someone submits
- 🎨 **Works Anywhere** — Pure HTML forms, React, Vue, or any framework
- 🔒 **Spam Protection** — Built-in protection against bots
- 🔄 **Custom Redirects** — Send users anywhere after submission (Pro)
- 💳 **Stripe Integration** — Subscription billing with Stripe Checkout

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payments:** Stripe
- **Deployment:** Vercel

## Getting Started

```bash
# Clone the repository
git clone https://github.com/tahseen137/formforge.git
cd formforge

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxx           # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_xxx      # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_xxx         # Webhook signing secret

# Client-side Stripe key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_xxx           # Pro plan ($19/mo) price ID
STRIPE_BUSINESS_PRICE_ID=price_xxx      # Business plan ($49/mo) price ID
```

### Setting up Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from [Developers → API keys](https://dashboard.stripe.com/apikeys)
3. Create products and prices:
   - **Pro Plan**: $19/month, recurring
   - **Business Plan**: $49/month, recurring
4. Set up webhooks:
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
5. Configure the Customer Portal in Stripe Dashboard

## Pricing Tiers

| Feature | Free | Pro ($19/mo) | Business ($49/mo) |
|---------|------|--------------|-------------------|
| Form Endpoints | 3 | Unlimited | Unlimited |
| Submissions/mo | 100 | 10,000 | Unlimited |
| Templates | Basic | All | All |
| Custom Branding | ❌ | ✅ | ✅ |
| File Uploads | ❌ | ✅ | ✅ |
| Conditional Logic | ❌ | ✅ | ✅ |
| Email Notifications | Basic | Advanced | Advanced |
| API Access | ❌ | ❌ | ✅ |
| Webhooks | ❌ | ❌ | ✅ |
| Team Collaboration | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ (24/7) |

## Usage

Point your form to your FormForge endpoint:

```html
<form action="https://formforge-olive.vercel.app/api/submit/YOUR_ID" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/endpoints` | GET, POST | List/create form endpoints |
| `/api/endpoints/[id]` | DELETE | Delete a form endpoint |
| `/api/submit/[formId]` | POST | Submit form data |
| `/api/submissions/[formId]` | GET | Get form submissions |
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |
| `/api/portal` | GET, POST | Stripe customer portal |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | User dashboard |
| `/pricing` | Pricing page with Stripe Checkout |
| `/checkout/success` | Successful payment page |
| `/checkout/cancel` | Cancelled payment page |

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/formforge)

Don't forget to add your environment variables in Vercel's project settings!

## Live Demo

🔗 [formforge-olive.vercel.app](https://formforge-olive.vercel.app)

## License

MIT
