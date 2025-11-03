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

Set environment variables in `.env.local` (or Vercel):
```
CONVEX_URL=<your_convex_url>
RESEND_API_KEY=<your_resend_api_key>
FROM_EMAIL=orders@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
NEXT_PUBLIC_URL=http://localhost:3000
```

Run locally:
```
npm install
npm run dev
```

Run tests:
```
npm run test
```
