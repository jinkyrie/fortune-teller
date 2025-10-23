# Fortune Teller Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Cloudinary (get from https://cloudinary.com)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Payment (iyzico/PayTR)
   IYZICO_API_KEY="your-iyzico-key"
   IYZICO_SECRET_KEY="your-iyzico-secret"

   # Email (get from https://resend.com)
   RESEND_API_KEY="your-resend-key"

   # Admin
   ADMIN_EMAIL="admin@yourdomain.com"
   DAILY_ORDER_LIMIT=10
   JWT_SECRET="your-secret-key-here"
   ```

3. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Visit the application:**
   - Main site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## Features Implemented

✅ **Landing Page** - Beautiful hero section with celestial gradient
✅ **Order Form** - Complete form with photo upload and validation
✅ **Admin Dashboard** - Order management with status updates
✅ **Status Page** - User order tracking
✅ **API Routes** - Full backend with database integration
✅ **Payment Integration** - Ready for iyzico/PayTR
✅ **Email Notifications** - Resend integration
✅ **Photo Upload** - Cloudinary integration
✅ **Daily Limits** - Order limit system
✅ **Legal Pages** - Privacy, Terms, KVKK
✅ **Responsive Design** - Mobile-first approach
✅ **Luxury Theme** - Dark mystic aesthetic with gold accents

## Next Steps

1. **Configure external services:**
   - Set up Cloudinary account for photo storage
   - Configure iyzico or PayTR for payments
   - Set up Resend for email notifications

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Customize:**
   - Update branding and content
   - Configure payment amounts
   - Set up domain and SSL

## File Structure

```
fortune-teller/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── order/page.tsx        # Order form
│   │   ├── admin/page.tsx         # Admin dashboard
│   │   ├── status/[id]/page.tsx   # Order status
│   │   ├── legal/                 # Legal pages
│   │   └── api/                   # API routes
│   ├── components/ui/             # shadcn/ui components
│   ├── lib/                       # Utilities
│   └── types/                     # TypeScript types
├── prisma/
│   └── schema.prisma              # Database schema
└── public/                        # Static assets
```

## Support

For questions or issues, refer to the main INSTRUCTIONS.md file or check the individual component documentation.

