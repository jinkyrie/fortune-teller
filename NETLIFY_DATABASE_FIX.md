# Netlify Database URL Fix

## Problem
The Netlify deployment is failing because the `DATABASE_URL` environment variable doesn't have the proper PostgreSQL protocol prefix.

## Solution

### 1. Set DATABASE_URL in Netlify Dashboard

Go to your Netlify site dashboard → Site settings → Environment variables and set:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

**Important**: The URL MUST start with `postgresql://` or `postgres://`

### 2. Common Database URL Formats

#### Netlify Postgres
```
DATABASE_URL=postgresql://postgres:password@db.abcdefghijklmnop.us-east-1.rds.amazonaws.com:5432/postgres
```

#### Supabase
```
DATABASE_URL=postgresql://postgres:password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

#### Railway
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### 3. Environment Variables Required

Set these in Netlify Dashboard:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
ADMIN_EMAIL=your-admin@email.com
RESEND_API_KEY=re_...
```

### 4. Test Database Connection

After setting the environment variables, redeploy your site. The build should now succeed.

### 5. Troubleshooting

If you still get database errors:
1. Verify the DATABASE_URL format is correct
2. Check that the database is accessible from Netlify's IP ranges
3. Ensure the database credentials are correct
4. Test the connection string locally first
