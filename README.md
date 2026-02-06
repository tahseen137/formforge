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

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/formforge.git
cd formforge

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

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

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/formforge)

## Live Demo

🔗 [formforge-olive.vercel.app](https://formforge-olive.vercel.app)

## License

MIT
