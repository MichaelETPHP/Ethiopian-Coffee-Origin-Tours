# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Files to Deploy
- [ ] `api/admin/bookings/[id].js` - Individual booking operations
- [ ] `api/admin/bookings/[id]/send-email.js` - Manual email sending
- [ ] `api/debug.js` - Debug endpoint
- [ ] Updated `vercel.json` configuration
- [ ] Updated `package.json` with Vite in dependencies
- [ ] `.npmrc` file for dependency installation

### 2. Environment Variables (Vercel Dashboard)
- [ ] `DATABASE_URL` - Your Supabase connection string
- [ ] `JWT_SECRET` - Strong random string for JWT tokens
- [ ] `FRONTEND_URL` - https://ehiopiancoffeeorgintrip.com

### 3. Build Verification
- [ ] Local build works: `npm run build`
- [ ] Admin files copied to `dist/admin/`
- [ ] No build errors

## 🔄 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add individual booking endpoints and email functionality"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to your Vercel dashboard
2. Your project should auto-deploy from GitHub
3. Check the deployment logs for any errors

### Step 3: Verify Deployment
After deployment, test these endpoints:

#### Test Debug Endpoint:
```
https://ehiopiancoffeeorgintrip.com/api/debug
```

#### Test Individual Booking:
```javascript
// Get booking details
fetch('https://ehiopiancoffeeorgintrip.com/api/admin/bookings/6', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})

// Update booking
fetch('https://ehiopiancoffeeorgintrip.com/api/admin/bookings/6', {
  method: 'PATCH',
  headers: { 
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'confirmed' })
})
```

#### Test Email Endpoint:
```javascript
fetch('https://ehiopiancoffeeorgintrip.com/api/admin/bookings/6/send-email', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ emailType: 'payment-confirmation' })
})
```

## 🐛 Troubleshooting

### If 405 errors persist:
1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `/api/admin/bookings/[id]` and `/api/admin/bookings/[id]/send-email`
   - Check if they appear in the functions list

2. **Verify File Structure**:
   ```
   api/
   ├── admin/
   │   ├── bookings/
   │   │   ├── [id].js
   │   │   └── [id]/
   │   │       └── send-email.js
   │   ├── bookings.js
   │   └── login.js
   └── debug.js
   ```

3. **Check Vercel Build Logs**:
   - Look for any errors during the build process
   - Ensure all files are being uploaded

### If deployment fails:
1. **Check Environment Variables** in Vercel dashboard
2. **Verify DATABASE_URL** is correct
3. **Check JWT_SECRET** is set
4. **Redeploy** if needed

## ✅ Success Indicators

After successful deployment:
- [ ] Admin login works
- [ ] Can view individual booking details
- [ ] Can update booking status
- [ ] Can send manual emails
- [ ] No 405 errors in browser console
- [ ] All admin panel features work

## 📞 Support

If issues persist:
1. Check Vercel function logs
2. Test the debug endpoint
3. Verify environment variables
4. Check database connectivity 