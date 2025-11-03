# Audiophile — Next.js Starter (Enhanced)

This repository is the enhanced starter for the Audiophile Stage 3a project.

What's included:
- Full Next.js (app router) frontend using Tailwind CSS.
- Accessible checkout form (React Hook Form + Zod).
- Convex server functions: createOrder, getOrderByOrderId.
- API endpoints: /api/checkout to create orders (saves to Convex + sends Resend email), /api/order/[orderId] to fetch order.
- Order confirmation page that fetches and displays order details.
- Responsive HTML email template.
- Jest + React Testing Library unit tests for the checkout form.
- Vercel config and GitHub Actions workflow for CI.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex Configuration
CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Resend Email Configuration
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=onboarding@resend.dev
SUPPORT_EMAIL=support@yourdomain.com

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### Setting up Resend Email:

1. **Sign up for Resend**: Go to https://resend.com and create an account
2. **Get your API Key**:
   - Go to Resend Dashboard → API Keys
   - Create a new API key
   - Copy the key (starts with `re_`)
   - Add it to `.env.local` as `RESEND_API_KEY`

3. **Configure FROM_EMAIL**:
   - **For testing**: Use `FROM_EMAIL=onboarding@resend.dev` (works immediately, no setup needed)
   - **IMPORTANT**: You CANNOT use Gmail, Yahoo, Hotmail, or other common email providers
   - **For production**: Verify your own domain in Resend Dashboard and use `orders@yourdomain.com`
   
   **Common mistake**: Trying to use `FROM_EMAIL=yourname@gmail.com` will fail with a 403 error because Resend doesn't allow sending from unverified domains like gmail.com

4. **Verify your domain** (production only):
   - Go to Resend Dashboard → Domains
   - Add your domain
   - Add the DNS records Resend provides
   - Wait for verification (usually a few minutes)

### Setting up Convex:

1. **Install and initialize Convex**:
   ```bash
   npx convex dev
   ```
   This will:
   - Create your Convex deployment
   - Set up `CONVEX_URL` automatically
   - Generate the API files

2. **Use the generated URL**: The `CONVEX_URL` will be set automatically during `npx convex dev`

Run locally:
```
npm install
npm run dev
```

Run tests:
```
npm run test
```
