# FormForge Setup Guide

This guide will walk you through setting up FormForge with Supabase (database + auth) and Resend (email notifications).

## Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Resend account ([sign up here](https://resend.com))
- (Optional) A Stripe account for payments

---

## Step 1: Clone and Install

```bash
git clone https://github.com/tahseen137/formforge.git
cd formforge
npm install --legacy-peer-deps
```

---

## Step 2: Set Up Supabase

### 2.1 Create a New Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Fill in:
   - **Name:** FormForge
   - **Database Password:** (save this somewhere safe)
   - **Region:** Choose closest to you
4. Click **Create new project** (takes ~2 minutes)

### 2.2 Run Database Migration

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the entire contents of `supabase-schema.sql` (in the root of this repo)
4. Paste into the SQL editor
5. Click **Run** (bottom right)

✅ You should see "Success. No rows returned" — this means the schema was created!

### 2.3 Get Your API Keys

1. Go to **Project Settings** > **API** (left sidebar)
2. Copy these values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 3: Set Up Resend (Email)

### 3.1 Create an Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email

### 3.2 Create an API Key

1. Go to **API Keys** (left sidebar)
2. Click **Create API Key**
3. Name: `FormForge`
4. Permission: **Full Access**
5. Click **Add**
6. Copy the API key → This is your `RESEND_API_KEY`

⚠️ **Save it now!** You won't be able to see it again.

### 3.3 Add Your Domain (Optional but Recommended)

To send emails from your own domain (e.g., `notifications@yourdomain.com`):

1. Go to **Domains** (left sidebar)
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS setup instructions (add TXT, MX, and CNAME records)
5. Wait for verification (usually 5-30 minutes)

If you don't add a domain, emails will be sent from `onboarding@resend.dev` (works for testing).

---

## Step 4: Configure Environment Variables

### 4.1 Create `.env.local`

```bash
cp .env.example .env.local
```

### 4.2 Fill in the Values

Open `.env.local` and add your keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=FormForge <notifications@yourdomain.com>

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_BUSINESS_PRICE_ID=price_xxx
```

**Notes:**
- For `EMAIL_FROM`, use your verified domain or `onboarding@resend.dev` for testing
- Stripe keys are optional for now (only needed for paid subscriptions)

---

## Step 5: Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## Step 6: Create Your First User

### 6.1 Sign Up

1. Go to `http://localhost:3000/signup` (you'll need to create this page)
2. Or use Supabase Auth UI

### 6.2 Manual User Creation (for testing)

1. Go to your Supabase project
2. Click **Authentication** > **Users** (left sidebar)
3. Click **Add user** > **Create new user**
4. Fill in email and password
5. Click **Create user**

The `on_auth_user_created` trigger will automatically create a profile in the `public.users` table.

---

## Step 7: Test Form Submission

### 7.1 Create a Form Endpoint

```bash
curl -X POST http://localhost:3000/api/endpoints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Form",
    "email": "your@email.com"
  }'
```

**Response:**
```json
{
  "id": "abc123",
  "endpoint_id": "xyz789",
  "name": "Contact Form",
  "email": "your@email.com",
  ...
}
```

Save the `endpoint_id` (e.g., `xyz789`).

### 7.2 Submit a Test Form

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<body>
  <form action="http://localhost:3000/api/submit/xyz789" method="POST">
    <input name="name" placeholder="Name" required />
    <input name="email" type="email" placeholder="Email" required />
    <textarea name="message" placeholder="Message" required></textarea>
    <button type="submit">Send</button>
  </form>
</body>
</html>
```

Replace `xyz789` with your actual `endpoint_id`.

Open the file in a browser, fill out the form, and submit!

### 7.3 Check Results

1. **Email:** You should receive an email at the address you specified
2. **Database:** Go to Supabase > **Table Editor** > `submissions` to see the data
3. **Console:** Check your terminal for submission logs

---

## Step 8: Deploy to Vercel

### 8.1 Push to GitHub

```bash
git add .
git commit -m "Add database and email integration"
git push origin main
```

### 8.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Add environment variables (copy from `.env.local`)
5. Click **Deploy**

### 8.3 Set Up Webhook Endpoint (for Stripe, optional)

After deploying:

1. Go to Stripe Dashboard > **Developers** > **Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add it to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

---

## Troubleshooting

### Email not sending

**Check:**
1. Is `RESEND_API_KEY` set correctly?
2. Is `EMAIL_FROM` using a verified domain or `onboarding@resend.dev`?
3. Check Resend dashboard > **Logs** for errors
4. Check browser console and server logs

**Common issue:**
```
Error: Invalid API key
```
Solution: Make sure you copied the API key correctly (starts with `re_`)

---

### Database connection error

**Check:**
1. Is `NEXT_PUBLIC_SUPABASE_URL` correct? (should start with `https://` and end with `.supabase.co`)
2. Is `NEXT_PUBLIC_SUPABASE_ANON_KEY` correct?
3. Did you run the `supabase-schema.sql` migration?

**Test connection:**
```bash
curl https://your-project.supabase.co/rest/v1/
```

Should return:
```json
{"message":"The server is running."}
```

---

### "Failed to store submission"

**Possible causes:**
1. Database schema not created (run `supabase-schema.sql` again)
2. Row-level security blocking inserts (check RLS policies)
3. Invalid endpoint ID

**Debug:**
```bash
# Check if forms table exists
Go to Supabase > SQL Editor:
SELECT * FROM forms LIMIT 5;
```

---

### Rate limiting too strict

Edit `lib/rate-limit.ts` or adjust the rate limit in `app/api/submit/[formId]/route.ts`:

```typescript
const rateLimit = rateLimiter.check(rateLimitKey, 20, 60000); // 20 per minute instead of 10
```

---

## Next Steps

### Create Auth Pages

You'll need to create:
- `/app/login/page.tsx` — Login page
- `/app/signup/page.tsx` — Signup page
- `/app/auth/callback/route.ts` — OAuth callback handler

Example signup page:

```tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email to confirm your account!');
      router.push('/login');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  );
}
```

### Update Dashboard to Use Database

Replace `storage` with `dbStorage` in:
- `app/api/endpoints/route.ts`
- `app/api/endpoints/[id]/route.ts`
- `app/api/submissions/[formId]/route.ts`
- `app/dashboard/page.tsx`

Example:

```typescript
import { dbStorage } from '@/lib/db-storage';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const endpoints = await dbStorage.getAllEndpoints(user.id);
  return NextResponse.json(endpoints);
}
```

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Stripe Docs](https://stripe.com/docs)

---

## Support

If you run into issues:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Join our Discord (link in README)

Happy coding! 🚀
