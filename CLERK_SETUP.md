# Clerk Authentication Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Database
DATABASE_URL="file:./dev.db"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Payment Providers
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key
PAYTR_MERCHANT_ID=your_paytr_merchant_id
PAYTR_MERCHANT_KEY=your_paytr_merchant_key
PAYTR_MERCHANT_SALT=your_paytr_merchant_salt

# App Settings
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PAYMENT_AMOUNT=50.00
PAYMENT_CURRENCY=TRY
DAILY_ORDER_LIMIT=10

# Cleanup Service
CRON_SECRET=your_secret_key_for_cron_authentication
```

## Clerk Setup Steps

1. **Create Clerk Account**: Go to [clerk.com](https://clerk.com) and create an account
2. **Create Application**: Create a new application in your Clerk dashboard
3. **Get API Keys**: Copy the publishable key and secret key from your Clerk dashboard
4. **Set Admin Email**: Update the `ADMIN_EMAIL` constant in `src/app/api/webhooks/clerk/route.ts` to your admin email
5. **Configure Webhook**: 
   - In Clerk dashboard, go to Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Select events: `user.created`
   - Copy the webhook secret to your environment variables

## Role Assignment

- **Admin Role**: Users with the email specified in `ADMIN_EMAIL` will automatically get admin role
- **User Role**: All other users will automatically get user role
- **Automatic Assignment**: Roles are assigned via Clerk webhook when users sign up

## Security Features

- **Middleware Protection**: Routes are protected at the middleware level
- **API Protection**: All admin API routes require admin authentication
- **Client-side Rendering**: Admin-only UI elements are conditionally rendered
- **Server-side Validation**: All role checks are done server-side for security

## Usage

### Server-side Protection
```typescript
import { requireAdmin, requireAuth } from '@/lib/auth';

// Require admin role
export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    // Admin-only logic here
  } catch (error) {
    return new Response("Forbidden", { status: 403 });
  }
}

// Require authentication
export async function POST(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    // Authenticated user logic here
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

### Client-side Protection
```typescript
import { AdminOnly, useIsAdmin } from '@/components/admin-only';

// Conditional rendering
<AdminOnly>
  <AdminPanel />
</AdminOnly>

// Hook usage
const isAdmin = useIsAdmin();
```

## Migration from NextAuth

The following changes were made to migrate from NextAuth to Clerk:

1. **Removed NextAuth dependencies** and added Clerk
2. **Updated authentication providers** in `src/components/providers.tsx`
3. **Replaced session hooks** with Clerk hooks (`useUser`, `useClerk`)
4. **Updated API routes** to use new auth helpers
5. **Added middleware protection** for admin routes
6. **Created webhook handler** for automatic role assignment
7. **Updated all pages** to use Clerk authentication

## Testing

1. **Sign up with admin email** - should get admin role
2. **Sign up with regular email** - should get user role
3. **Try accessing admin routes** without admin role - should be redirected
4. **Test API endpoints** - should require proper authentication
