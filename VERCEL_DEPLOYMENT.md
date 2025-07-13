# Vercel Deployment Guide

## Prerequisites

- Vercel account
- Supabase database set up
- Domain (optional)

## Step 1: Prepare Your Project

1. **Install Vercel CLI** (optional):

   ```bash
   npm i -g vercel
   ```

2. **Ensure your project structure is correct**:
   - API routes in `/api/` directory
   - Admin page in `/public/admin/`
   - React app in `/src/`

## Step 2: Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-app.vercel.app
```

### Email Configuration:

```
SMTP_HOST=mail.ehiopiancoffeeorgintrip.com
SMTP_PORT=465
SMTP_USER=info@ehiopiancoffeeorgintrip.com
SMTP_PASS=your-smtp-password
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

### Option B: Using Vercel CLI

```bash
vercel
```

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update `FRONTEND_URL` environment variable

## Step 5: Verify Deployment

1. **Test the main site**: `https://your-app.vercel.app`
2. **Test the admin panel**: `https://your-app.vercel.app/admin`
3. **Test API endpoints**: `https://your-app.vercel.app/api/health`

## Troubleshooting

### Email Issues

- SMTP timeouts are common on Vercel
- Consider using SendGrid, Mailgun, or Resend
- Check Vercel function logs for email errors

### Database Issues

- Ensure Supabase connection string is correct
- Check if database tables exist
- Verify environment variables are set

### Admin Page Issues

- Ensure `/public/admin/` directory is included in build
- Check Vercel function logs for routing errors

## Performance Optimization

1. **Enable caching** for static assets
2. **Use CDN** for images
3. **Optimize images** before upload
4. **Monitor function execution times**

## Security Notes

1. **JWT Secret**: Use a strong, random secret
2. **Database**: Use connection pooling
3. **CORS**: Configure properly for your domain
4. **Rate Limiting**: Already implemented in API

## Support

For issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test locally first
4. Check database connectivity
