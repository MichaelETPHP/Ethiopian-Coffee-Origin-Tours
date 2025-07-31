# 🚀 Vercel Deployment Guide

This guide will help you deploy your Ethiopian Coffee Tours application to Vercel with Google Sheets integration.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Google Cloud Project**: Set up Google Sheets API (already done)
3. **Google Service Account**: JSON credentials file (already configured)

## 🔧 Environment Variables Setup

### 1. Vercel Dashboard Setup

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```bash
# Google Sheets Configuration (Optional - using JSON file)
GOOGLE_SPREADSHEET_ID=1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA

# Email Configuration (Optional)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
ADMIN_EMAIL=admin@yourdomain.com

# JWT Secret (Required)
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=production
```

### 2. Google Service Account Setup

1. Upload your service account JSON file to Vercel:
   - Go to **Settings** → **Files**
   - Upload `config/my-sheets-app-467604-93cad7db97fd.json`
   - This will be available at `/config/my-sheets-app-467604-93cad7db97fd.json`

## 🚀 Deployment Steps

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Select the repository: `Ethiopian-Coffee-Origin-Tours`

### 2. Configure Build Settings

Vercel will automatically detect the build settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your app will be available at: `https://your-project-name.vercel.app`

## 🔍 Testing the Deployment

### 1. Health Check

Test the API health endpoint:

```bash
curl https://your-project-name.vercel.app/api/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2025-07-31T05:00:00.000Z",
  "environment": "production",
  "service": "Ethiopian Coffee Tours API"
}
```

### 2. Booking Submission

Test the booking API:

```bash
curl -X POST https://your-project-name.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "age": "25",
    "country": "United States",
    "bookingType": "individual",
    "numberOfPeople": 1,
    "selectedPackage": "Yirgacheffe Coffee Tour"
  }'
```

## 🛠️ Troubleshooting

### Common Issues

1. **500 Internal Server Error**

   - Check Vercel function logs
   - Verify Google Sheets permissions
   - Ensure environment variables are set

2. **CORS Errors**

   - The API routes include CORS headers
   - Check if the domain is allowed

3. **Google Sheets Permission Denied**
   - Verify the service account has editor access
   - Check the spreadsheet ID is correct

### Debugging Steps

1. **Check Function Logs**:

   - Go to Vercel Dashboard
   - Select your project
   - Go to **Functions** tab
   - Check the logs for errors

2. **Test Locally First**:

   ```bash
   npm run dev
   # Test at http://localhost:5173
   ```

3. **Verify Google Sheets**:
   - Check the spreadsheet for new entries
   - Verify the service account email has access

## 📊 Monitoring

### Vercel Analytics

1. Go to your project dashboard
2. Check **Analytics** tab for:
   - Page views
   - Function invocations
   - Performance metrics

### Google Sheets Monitoring

1. Check the spreadsheet for new bookings
2. Monitor the **Status** column
3. Verify data integrity

## 🔄 Updates

### Redeploying

1. Push changes to your GitHub repository
2. Vercel will automatically redeploy
3. Check the deployment status in the dashboard

### Environment Variable Updates

1. Go to **Settings** → **Environment Variables**
2. Update the required variables
3. Redeploy the project

## 📝 Production Checklist

- [ ] Environment variables configured
- [ ] Google Sheets permissions verified
- [ ] Health check endpoint working
- [ ] Booking submission tested
- [ ] CORS headers configured
- [ ] Error handling implemented
- [ ] Monitoring set up

## 🆘 Support

If you encounter issues:

1. Check the Vercel function logs
2. Verify Google Sheets API setup
3. Test the API endpoints manually
4. Check environment variables
5. Review the deployment guide

## 🎉 Success!

Once deployed successfully:

1. Your app will be live at: `https://your-project-name.vercel.app`
2. Bookings will be stored in Google Sheets
3. The admin interface will be available at: `https://your-project-name.vercel.app/admin`

---

**Note**: Make sure to replace `your-project-name` with your actual Vercel project name in all URLs.
