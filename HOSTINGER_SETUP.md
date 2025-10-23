# Hostinger Automated Cleanup Setup

This guide shows how to set up automated image cleanup on Hostinger hosting.

## 🚀 Deployment Steps

### 1. Deploy to Hostinger
- Upload your Next.js app to Hostinger
- Set up environment variables in Hostinger panel
- Deploy the application

### 2. Set Environment Variables
Add these to your Hostinger environment:
```env
# Existing variables...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# New cleanup variables
CRON_SECRET=your-secret-key-here
```

### 3. Automated Cleanup Options

## Option A: External Cron Service (Recommended)

### Using Cron-job.org (Free)
1. Go to [cron-job.org](https://cron-job.org)
2. Create account and add new cron job
3. Set URL: `https://yourdomain.com/api/cron/cleanup`
4. Set frequency: `0 2 * * *` (daily at 2 AM)
5. Add header: `Authorization: Bearer your-secret-key-here`
6. Save and activate

### Using EasyCron (Free tier available)
1. Go to [easycron.com](https://easycron.com)
2. Create account and add new cron job
3. Set URL: `https://yourdomain.com/api/cron/cleanup`
4. Set frequency: Daily at 2 AM
5. Add header: `Authorization: Bearer your-secret-key-here`
6. Save and activate

## Option B: Hostinger Cron Jobs (If Available)

If Hostinger supports cron jobs:
1. Go to Hostinger control panel
2. Find "Cron Jobs" section
3. Add new cron job:
   - Command: `curl -H "Authorization: Bearer your-secret-key-here" https://yourdomain.com/api/cron/cleanup`
   - Schedule: `0 2 * * *` (daily at 2 AM)
4. Save

## Option C: GitHub Actions (Free)

Create `.github/workflows/cleanup.yml`:
```yaml
name: Image Cleanup
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Run Cleanup
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://yourdomain.com/api/cron/cleanup
```

## 🔧 Testing the Setup

### Test the cleanup endpoint:
```bash
curl -H "Authorization: Bearer your-secret-key-here" \
  https://yourdomain.com/api/cron/cleanup
```

### Check cleanup status:
```bash
curl https://yourdomain.com/api/cleanup
```

## 📊 Monitoring

### Check logs in Hostinger:
- Look for cleanup logs in your application logs
- Monitor Cloudinary dashboard for storage usage
- Check cron service logs

### Manual cleanup (if needed):
```bash
curl -X POST \
  -H "Authorization: Bearer your-secret-key-here" \
  https://yourdomain.com/api/cron/cleanup
```

## 🛡️ Security

- **CRON_SECRET**: Use a strong, random secret key
- **HTTPS Only**: Always use HTTPS for cron calls
- **Rate Limiting**: The endpoint includes basic rate limiting
- **Authorization**: All cron calls require proper authorization

## 💡 Benefits

✅ **Fully Automated**: Runs daily without manual intervention
✅ **Cost Effective**: Uses free external cron services
✅ **Reliable**: Multiple backup options available
✅ **Secure**: Protected with authorization headers
✅ **Monitoring**: Easy to check status and logs

## 🚨 Troubleshooting

### Common Issues:
1. **404 Error**: Check if the endpoint URL is correct
2. **401 Unauthorized**: Verify CRON_SECRET matches
3. **500 Error**: Check Cloudinary configuration
4. **No cleanup**: Verify cron job is actually running

### Debug Steps:
1. Test endpoint manually with curl
2. Check application logs in Hostinger
3. Verify environment variables are set
4. Test Cloudinary connection separately
