# Vercel Deployment Guide

This guide explains how to deploy your Ethiopian Coffee Tours application to Vercel with Google Sheets integration.

## Prerequisites

1. ✅ Google Sheets API is working locally
2. ✅ Service account credentials are set up
3. ✅ Google Cloud Console project is configured

## Deployment Steps

### 1. Set Up Environment Variables

Run this command to get your credentials for Vercel:

```bash
npm run setup:vercel
```

This will output the JSON credentials that you need to copy.

### 2. Configure Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add a new environment variable:
   - **Name**: `GOOGLE_SHEETS_CREDENTIALS`
   - **Value**: (paste the JSON from step 1)
   - **Environment**: Production, Preview, Development
5. Click **Save**

### 3. Deploy to Vercel

```bash
# Deploy to Vercel
vercel --prod
```

Or push to your Git repository if you have automatic deployments set up.

### 4. Test the Deployment

1. Go to your deployed Vercel URL
2. Fill out the booking form
3. Submit the booking
4. Check the Vercel function logs for any errors

## Troubleshooting

### Common Issues

#### 1. "FUNCTION_INVOCATION_FAILED" Error

**Cause**: The serverless function is failing to execute

**Solutions**:

- Check that `GOOGLE_SHEETS_CREDENTIALS` environment variable is set
- Verify the JSON format is correct
- Check Vercel function logs for detailed error messages

#### 2. "No key or keyFile set" Error

**Cause**: Credentials are not properly configured

**Solutions**:

- Ensure the environment variable is set correctly
- Verify the JSON contains all required fields
- Check that the service account has proper permissions

#### 3. "Access Denied" Error

**Cause**: Service account doesn't have access to the spreadsheet

**Solutions**:

- Share the spreadsheet with: `sheet-access@my-sheets-app-467604.iam.gserviceaccount.com`
- Give "Editor" permissions
- Ensure Google Sheets API is enabled

### Checking Vercel Logs

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Functions** tab
4. Click on the function that's failing
5. Check the **Logs** tab for error details

### Environment Variable Format

The `GOOGLE_SHEETS_CREDENTIALS` environment variable should contain the entire JSON from your service account key file:

```json
{
  "type": "service_account",
  "project_id": "my-sheets-app-467604",
  "private_key_id": "764e3b37e3b1c9c103a3ae9b6cf7f974a2afded5",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sheet-access@my-sheets-app-467604.iam.gserviceaccount.com",
  "client_id": "110699163900318273769",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheet-access%40my-sheets-app-467604.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

## File Structure

```
├── api/
│   └── sheets-booking.js          # Production API endpoint
├── src/
│   └── lib/
│       └── api-utils.ts           # Frontend API utilities
├── dev-server.js                  # Development server
├── vercel.json                    # Vercel configuration
└── my-sheets-app-467604-764e3b37e3b1.json  # Local credentials
```

## Development vs Production

- **Development**: Uses `dev-server.js` with local credentials file
- **Production**: Uses `api/sheets-booking.js` with environment variables

## Security Notes

1. **Never commit credentials** to your Git repository
2. **Use environment variables** for sensitive data in production
3. **Keep credentials secure** and rotate them regularly
4. **Monitor API usage** in Google Cloud Console

## Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Test Google Sheets API locally first
4. Ensure all prerequisites are met

## Expected Behavior

After successful deployment:

1. ✅ Booking form submits without errors
2. ✅ Data is written to Google Sheets
3. ✅ Success message is displayed to user
4. ✅ No console errors in browser
5. ✅ Vercel function logs show successful execution
