# 🚀 Vercel Deployment Fix Guide

## ❌ **Problem: 500 Error on `/api/bookings`**

The error occurs because the API files were trying to import the database from `../server/index.js`, which doesn't exist in Vercel's serverless environment.

## ✅ **Solution Applied:**

### **1. Created Vercel-Compatible Database Configuration**

- **File:** `lib/db-vercel.js`
- **Purpose:** PostgreSQL connection for Vercel serverless functions
- **Features:** Connection pooling, error handling, admin user creation

### **2. Updated All API Files**

- **`api/bookings.js`** ✅ Updated
- **`api/admin/bookings.js`** ✅ Updated
- **`api/admin/login.js`** ✅ Updated
- **`api/bookings/[id].js`** ✅ Updated
- **`api/admin/bookings/[id].js`** ✅ Updated
- **`api/admin/bookings/[id]/send-email.js`** ✅ Updated

### **3. Fixed Database Parameter Placeholders**

- **Before:** `?` (SQLite style)
- **After:** `$1, $2, $3...` (PostgreSQL style)

### **4. Removed Duplicate Files**

- **Deleted:** `api/bookings/[id]/send-email.js` (duplicate email config)

## 🔧 **Environment Variables Required:**

### **Add these to your Vercel project settings:**

```bash
# Database (PostgreSQL - Supabase recommended)
DATABASE_URL=postgresql://postgres.fztchjilybqettzahibs:tour_booking_system@aws-0-eu-north-1.pooler.supabase.com:6543/postgres

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
SMTP_HOST=mail.ehiopiancoffeeorgintrip.com
SMTP_PORT=465
SMTP_USER=hello@ehiopiancoffeeorgintrip.com
SMTP_PASS=j7YEMnZDS0h$1p5C

# Frontend URL
FRONTEND_URL=https://ehiopiancoffeeorgintrip.com/
```

## 📋 **Deployment Checklist:**

### **1. Environment Variables**

- [ ] Add `DATABASE_URL` (PostgreSQL connection string)
- [ ] Add `JWT_SECRET` (random secure string)
- [ ] Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- [ ] Add `FRONTEND_URL`

### **2. Database Setup**

- [ ] Create PostgreSQL database (Supabase recommended)
- [ ] Tables will be created automatically on first API call
- [ ] Default admin user: `admin` / `admin123`

### **3. Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🧪 **Testing After Deployment:**

### **1. Test API Endpoints:**

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Create booking
curl -X POST https://your-domain.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "age": 25,
    "email": "test@example.com",
    "phone": "+1234567890",
    "country": "Test Country",
    "bookingType": "individual",
    "selectedPackage": "Test Package"
  }'
```

### **2. Test Admin Panel:**

- [ ] Visit: `https://your-domain.vercel.app/admin`
- [ ] Login: `admin` / `admin123`
- [ ] Check if bookings list loads
- [ ] Test delete functionality

## 🔍 **Troubleshooting:**

### **If still getting 500 errors:**

1. **Check Vercel Function Logs:**

   - Go to Vercel Dashboard
   - Select your project
   - Go to Functions tab
   - Check the logs for specific errors

2. **Common Issues:**

   - **Database connection:** Check `DATABASE_URL` format
   - **Email configuration:** Verify SMTP credentials
   - **JWT secret:** Ensure `JWT_SECRET` is set

3. **Test Database Connection:**
   ```bash
   # Test the health endpoint
   curl https://your-domain.vercel.app/api/health
   ```

## 📧 **Email Configuration Notes:**

### **For Vercel (Recommended):**

Consider using a dedicated email service:

- **SendGrid:** More reliable for serverless
- **Mailgun:** Good for transactional emails
- **Resend:** Modern email API

### **Current SMTP Setup:**

- **Host:** `mail.ehiopiancoffeeorgintrip.com`
- **Port:** `465` (SSL)
- **User:** `hello@ehiopiancoffeeorgintrip.com`
- **Pass:** `j7YEMnZDS0h$1p5C`

## 🎯 **Expected Results:**

After applying these fixes:

- ✅ `/api/bookings` should return 201 for successful bookings
- ✅ Admin panel should load bookings list
- ✅ Delete functionality should work
- ✅ Email notifications should send
- ✅ No more 500 errors

## 🚀 **Next Steps:**

1. **Deploy the updated code**
2. **Set environment variables in Vercel**
3. **Test the booking form**
4. **Test the admin panel**
5. **Monitor function logs for any issues**

---

**Need help?** Check the Vercel function logs for specific error messages and let me know what you see!
