# Railway Environment Variables Configuration

## Database Variables (Auto-provided by Railway)

Railway automatically provides these when you add a PostgreSQL service:

```
DATABASE_URL=postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:5432/${{PGDATABASE}}
DATABASE_PUBLIC_URL=postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{PGDATABASE}}
```

## Required Variables to Add

In Railway dashboard, add these variables to your service:

```
# Database (use Railway's auto-provided variables)
DATABASE_URL=${{DATABASE_URL}}
DIRECT_URL=${{DATABASE_PUBLIC_URL}}

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Resend)
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-app.railway.app
```

## Railway Auto-Provided Variables (DO NOT CHANGE)

These are automatically set by Railway and should not be modified:

```
POSTGRES_DB=railway
POSTGRES_USER=postgres
POSTGRES_PASSWORD=FiTHNLyJhxAPbdBvGCllMCOVDvAhnoFP
PGHOST=${{RAILWAY_PRIVATE_DOMAIN}}
PGUSER=${{POSTGRES_USER}}
PGPASSWORD=${{POSTGRES_PASSWORD}}
PGDATABASE=${{POSTGRES_DB}}
PGPORT=5432
RAILWAY_DEPLOYMENT_DRAINING_SECONDS=60
SSL_CERT_DAYS=820
PGDATA=/var/lib/postgresql/data/pgdata
```

## Key Points

1. **DATABASE_URL**: Uses Railway's private domain (internal connection)
2. **DATABASE_PUBLIC_URL**: Uses Railway's TCP proxy (external connection)
3. **DIRECT_URL**: Set to `${{DATABASE_PUBLIC_URL}}` for Prisma migrations
4. **Never modify**: Railway's auto-provided database variables

## Verification

Run this command to verify your setup:
```bash
npm run railway:setup
```

This will check all required variables and provide guidance.
