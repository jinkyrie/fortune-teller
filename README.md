# KahveYolu - Mystical Coffee Readings

A premium mystical coffee reading experience designed for women seeking guidance. Features payment integration, photo uploads, and admin dashboard built with Next.js 14, TypeScript, and modern web technologies.

## ✨ Features

- 🎨 **Luxury Mystic Theme** - Deep blues, purples, and golds with celestial gradients
- 📱 **Mobile-First Design** - Responsive and optimized for all devices
- 💳 **Payment Integration** - Ready for iyzico/PayTR
- 📸 **Photo Upload** - Cloudinary integration for coffee cup photos
- 📧 **Email Notifications** - Automated emails via Resend
- 🔐 **Admin Dashboard** - Order management system
- 📊 **Daily Limits** - Configurable order limits
- ⚡ **Fast Performance** - Optimized for speed and SEO

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   Copy `.env.example` to `.env.local` and fill in your API keys.

3. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   
   **Or use the optimized startup script:**
   ```bash
   # PowerShell
   .\start-kahveyolu.ps1
   
   # Batch file
   start-kahveyolu.bat
   ```

5. **Visit the application:**
   - **Frontend & Backend:** http://localhost:3000
   - **Admin Panel:** http://localhost:3000/admin
   - **API Endpoints:** http://localhost:3000/api/*

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** TailwindCSS + shadcn/ui + Framer Motion
- **Database:** Prisma + SQLite (local) or PostgreSQL (Supabase)
- **Payments:** iyzico or PayTR
- **File Uploads:** Cloudinary
- **Email:** Resend
- **Hosting:** Vercel

## 📁 Project Structure

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

## 🎨 Design System

- **Colors:** Deep blues (#0A0B1A), purples (#2D1B69), and golds (#D4AF37)
- **Typography:** Cormorant Garamond (headings) + Inter (body)
- **UI:** Glassmorphism with subtle gradients and glow effects
- **Animations:** Smooth transitions with Framer Motion

## 📋 Setup Checklist

- [ ] Configure Cloudinary for photo uploads
- [ ] Set up iyzico or PayTR for payments
- [ ] Configure Resend for email notifications
- [ ] Update branding and content
- [ ] Deploy to Vercel

## 📖 Documentation

- [Setup Guide](setup.md) - Detailed setup instructions
- [Instructions](INSTRUCTIONS.md) - Complete project documentation

## 🤝 Contributing

This is a complete, production-ready application. Feel free to customize and extend it for your needs.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
