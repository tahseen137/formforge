# Contributing to FormForge

Thank you for your interest in contributing to FormForge! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/formforge.git
cd formforge

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

## 📋 Development Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add TypeScript types for all new code
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint

# Build to ensure no errors
npm run build
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add email notification service"
git commit -m "fix: resolve rate limiting bug"
git commit -m "docs: update API documentation"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Link to any related issues
- Screenshots/GIFs if UI changes
- List of changes made

## 🎯 Priority Areas

We're actively looking for contributions in these areas:

### 1. Persistent Storage (HIGH PRIORITY)
**Problem:** Current implementation uses in-memory storage that loses data on restart.

**Solutions needed:**
- Vercel KV implementation
- PostgreSQL (Neon/Supabase) implementation
- MongoDB implementation

**Files to modify:**
- `lib/storage.ts` - Replace with database client
- Migration strategy needed

### 2. Authentication (HIGH PRIORITY)
**Problem:** No user accounts, anyone can access all forms.

**Solutions needed:**
- Clerk integration
- NextAuth.js implementation
- Supabase Auth implementation

**Files to add/modify:**
- `middleware.ts` - Auth middleware
- `app/api/**/route.ts` - Add auth checks
- `app/sign-in/*` - Sign in pages
- `app/sign-up/*` - Sign up pages

### 3. Email Notifications (HIGH PRIORITY)
**Problem:** Email notifications are just console.log statements.

**Solutions needed:**
- Resend integration
- SendGrid integration
- AWS SES integration

**Files to modify:**
- `lib/email.ts` - Create email service
- `app/api/submit/[formId]/route.ts` - Call email service
- Add email templates

### 4. File Uploads (MEDIUM PRIORITY)
**Problem:** File uploads advertised but not implemented.

**Solutions needed:**
- Vercel Blob integration
- Uploadthing integration
- AWS S3 integration

**Requirements:**
- File size limits (10MB)
- File type validation
- Virus scanning
- Secure storage

### 5. Webhooks (MEDIUM PRIORITY)
**Problem:** Webhooks advertised but not implemented.

**Implementation needed:**
- Store webhook URLs per endpoint
- POST submission data to webhook URL
- Retry logic for failed webhooks
- Webhook signature validation

### 6. Integrations (MEDIUM PRIORITY)
Add integrations with popular services:
- Slack notifications
- Discord notifications
- Google Sheets
- Notion
- Airtable

### 7. API Access (LOW PRIORITY)
**Problem:** No API key system for programmatic access.

**Implementation needed:**
- API key generation
- API key authentication
- Rate limiting per API key
- API documentation

## 🏗️ Project Structure

```
formforge/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard pages
│   ├── pricing/           # Pricing page
│   └── api/               # API routes
│       ├── endpoints/     # Form endpoint CRUD
│       ├── submit/        # Form submission handler
│       ├── submissions/   # Get submissions
│       ├── checkout/      # Stripe checkout
│       └── webhooks/      # Stripe webhooks
├── lib/                   # Utility functions
│   ├── storage.ts        # Data storage (NEEDS REPLACEMENT)
│   ├── stripe.ts         # Stripe configuration
│   ├── validation.ts     # Input validation
│   ├── rate-limit.ts     # Rate limiting
│   └── cors.ts           # CORS handling
├── __tests__/            # Test files
└── public/               # Static assets
```

## 📝 Code Style

### TypeScript

```typescript
// ✅ Good - Explicit types
export async function createEndpoint(
  name: string,
  email: string
): Promise<FormEndpoint> {
  // ...
}

// ❌ Bad - Any types
export async function createEndpoint(name: any, email: any): Promise<any> {
  // ...
}
```

### Error Handling

```typescript
// ✅ Good - Proper error handling
try {
  const data = await request.json();
  // process data
} catch (error) {
  console.error('Failed to parse JSON:', error);
  return NextResponse.json(
    { error: 'Invalid JSON' },
    { status: 400 }
  );
}

// ❌ Bad - Silent failures
try {
  const data = await request.json();
} catch {}
```

### Validation

```typescript
// ✅ Good - Validate all inputs
const validation = validateEmail(email);
if (!validation.valid) {
  return NextResponse.json({ error: validation.error }, { status: 400 });
}

// ❌ Bad - No validation
// Assume inputs are valid
```

## 🧪 Testing

### Writing Tests

```typescript
import { validateEmail } from '../lib/validation';

describe('validateEmail', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Test Coverage

Aim for:
- All validation functions: 100%
- API routes: 80%+
- UI components: 60%+

## 📚 Documentation

When adding features:
1. Update `README.md` with usage examples
2. Add JSDoc comments to functions
3. Update API documentation
4. Add inline code comments for complex logic

## 🐛 Bug Reports

When reporting bugs, include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, Node version)
- Screenshots if applicable

## 💡 Feature Requests

When requesting features:
- Describe the feature and use case
- Explain why it's valuable
- Provide examples if possible
- Check if it's already been requested

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email security@formforge.app (or create private security advisory on GitHub)
- Provide details of the vulnerability
- Wait for a response before disclosing publicly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/tahseen137/formforge/discussions)
- Join our [Discord](https://discord.gg/formforge) (if available)
- Email: support@formforge.app

## 🙏 Thank You!

Every contribution, no matter how small, helps make FormForge better. We appreciate your time and effort!
