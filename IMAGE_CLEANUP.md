# Image Cleanup System

This system automatically deletes images older than 2 weeks from Cloudinary to stay within free tier limits.

## How It Works

- **Trigger**: Deletes images from completed orders older than 14 days
- **Safety**: Only deletes from orders with `orderStatus: 'completed'`
- **Database**: Clears photo URLs from database after Cloudinary deletion
- **Logging**: Detailed logs of what was deleted

## Manual Cleanup

### Run via npm script:
```bash
npm run cleanup
```

### Run via PowerShell:
```powershell
.\cleanup-images.ps1
```

### Run via Batch file:
```cmd
cleanup-images.bat
```

## Automated Scheduling

### Windows Task Scheduler:
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" at desired time
4. Action: Start a program
5. Program: `powershell.exe`
6. Arguments: `-ExecutionPolicy Bypass -File "C:\path\to\cleanup-images.ps1"`

### Cron Job (Linux/Mac):
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /path/to/fortune-teller && npm run cleanup
```

## API Endpoints

### Check cleanup status:
```bash
GET /api/cleanup
```

### Run cleanup manually:
```bash
POST /api/cleanup
```

## Configuration

The cleanup system uses these environment variables:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY` 
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_BASE_URL`

## Safety Features

- ✅ Only deletes from completed orders
- ✅ Only deletes images older than 2 weeks
- ✅ Validates Cloudinary URLs before deletion
- ✅ Clears database references after successful deletion
- ✅ Detailed error logging
- ✅ Graceful error handling

## Monitoring

Check the cleanup status by visiting:
```
GET /api/cleanup
```

This will show:
- Number of old orders found
- Cutoff date being used
- Current status

## Troubleshooting

### Common Issues:
1. **Cloudinary not configured**: Check environment variables
2. **Database connection**: Ensure Prisma is properly configured
3. **Permission errors**: Check file permissions for scripts

### Logs:
- Check console output for detailed logs
- Look for error messages in the response
- Monitor Cloudinary dashboard for storage usage
