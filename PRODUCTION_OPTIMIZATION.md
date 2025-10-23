# Production Build Optimization

## Overview
This configuration creates a smaller, more efficient production build for Netlify deployment.

## Key Optimizations

### 1. **Standalone Output**
- Uses Next.js `standalone` output mode
- Reduces bundle size by excluding unnecessary files
- Only includes essential runtime files

### 2. **Build Optimizations**
- SWC minification enabled
- Compression enabled
- Source maps disabled in production
- Optimized image formats (WebP, AVIF)

### 3. **File Exclusions**
- Development scripts excluded
- Documentation files excluded
- Test files excluded
- IDE files excluded

## Build Process

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build:prod
```

### Netlify Deployment
The build command is automatically set to `npm run build:prod` in `netlify.toml`

## File Structure After Build

```
.next/
├── standalone/          # Minimal runtime
├── static/            # Static assets
└── server/            # Server-side code
```

## Size Reduction Benefits

1. **Smaller Bundle**: Removes development dependencies
2. **Faster Deploy**: Less files to upload
3. **Better Performance**: Optimized assets
4. **Reduced Costs**: Smaller bandwidth usage

## Environment Variables Required

Make sure these are set in Netlify:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Troubleshooting

If build fails:
1. Check environment variables are set
2. Verify DATABASE_URL format
3. Check Node.js version (22.21.0)
4. Review build logs for specific errors
