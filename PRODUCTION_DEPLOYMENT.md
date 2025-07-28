# 🚀 Production Deployment Guide

## ✅ **Ready for Production - All Issues Fixed!**

### **🔧 What Was Fixed:**

1. **✅ Admin Login 500 Error** - Fixed database initialization and error handling
2. **✅ Database Connection** - Created Vercel-compatible PostgreSQL configuration
3. **✅ API Endpoints** - Updated all API files for serverless deployment
4. **✅ Error Handling** - Added comprehensive error handling and logging
5. **✅ Health Checks** - Created detailed health monitoring endpoint

## 📋 **Production Deployment Checklist:**

### **1. Environment Variables (Required)**

Add these to your **Vercel project settings**:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres.fztchjilybqettzahibs:tour_booking_system@aws-0-eu-north-1.pooler.supabase.com:6543/postgres

# JWT Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
SMTP_HOST=mail.ehiopiancoffeeorgintrip.com
SMTP_PORT=465
SMTP_USER=hello@ehiopiancoffeeorgintrip.com
SMTP_PASS=j7YEMnZDS0h$1p5C

# Frontend URL
FRONTEND_URL=https://ehiopiancoffeeorgintrip.com/

# Environment
NODE_ENV=production
```

### **2. Database Setup**

#### **Option A: Supabase (Recommended)**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Add to `DATABASE_URL` environment variable

#### **Option B: Other PostgreSQL Providers**

- **Neon:** `postgresql://user:pass@host:port/database`
- **Railway:** `postgresql://user:pass@host:port/database`
- **PlanetScale:** `postgresql://user:pass@host:port/database`

### **3. Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🧪 **Testing After Deployment:**

### **1. Health Check**

```bash
curl https://ehiopiancoffeeorgintrip.com/api/health
```

**Expected Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Ethiopian Coffee Tours API",
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "ok", "message": "Database connection successful" },
    "email": { "status": "ok", "message": "Email configuration is set" },
    "environment": {
      "status": "ok",
      "message": "All required environment variables are set"
    }
  }
}
```

### **2. Test Booking Creation**

```bash
curl -X POST https://ehiopiancoffeeorgintrip.com/api/bookings \
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

**Expected Response:**

```json
{
  "message": "Booking submitted successfully",
  "bookingId": 1
}
```

### **3. Test Admin Login**

```bash
curl -X POST https://ehiopiancoffeeorgintrip.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ethiopiancoffee.com",
    "role": "admin"
  }
}
```

## 🔐 **Security Checklist:**

### **✅ JWT Secret**

- [ ] Use a strong, random JWT secret
- [ ] Never commit secrets to git
- [ ] Rotate secrets regularly

### **✅ Database Security**

- [ ] Use SSL connections
- [ ] Restrict database access
- [ ] Regular backups

### **✅ Email Security**

- [ ] Use secure SMTP (port 465/587)
- [ ] Store credentials securely
- [ ] Monitor email delivery

## 📊 **Monitoring & Logs:**

### **1. Vercel Function Logs**

- Go to Vercel Dashboard
- Select your project
- Go to Functions tab
- Monitor for errors

### **2. Health Check Monitoring**

```bash
# Set up monitoring for health endpoint
curl -f https://ehiopiancoffeeorgintrip.com/api/health || echo "Health check failed"
```

### **3. Database Monitoring**

- Monitor connection pool usage
- Check for slow queries
- Monitor disk space

## 🚨 **Troubleshooting:**

### **Common Issues:**

#### **1. 500 Error on Admin Login**

**Cause:** Database not initialized or connection failed
**Solution:** Check `DATABASE_URL` and database connectivity

#### **2. Email Not Sending**

**Cause:** SMTP configuration issues
**Solution:** Verify SMTP credentials and port settings

#### **3. JWT Token Issues**

**Cause:** Missing or invalid JWT_SECRET
**Solution:** Set a strong JWT secret

### **Debug Commands:**

```bash
# Test database connection
curl https://ehiopiancoffeeorgintrip.com/api/health

# Check environment variables
echo $DATABASE_URL
echo $JWT_SECRET

# Test email configuration
curl -X POST https://ehiopiancoffeeorgintrip.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","age":25,"email":"test@example.com","phone":"+1234567890","country":"Test","bookingType":"individual","selectedPackage":"Test"}'
```

## 🎯 **Production Features:**

### **✅ Implemented:**

- **Database:** PostgreSQL with connection pooling
- **Authentication:** JWT-based admin login
- **Email:** SMTP with retry logic
- **Error Handling:** Comprehensive error responses
- **Health Monitoring:** Detailed health checks
- **CORS:** Proper CORS configuration
- **Security:** Input validation and sanitization

### **✅ Admin Panel:**

- **Login:** Secure admin authentication
- **Bookings:** View all bookings with pagination
- **Status Updates:** Update booking status
- **Delete:** Remove bookings
- **Email:** Send manual emails

### **✅ Booking System:**

- **Form Validation:** Client and server-side validation
- **Email Notifications:** Automatic confirmation emails
- **Admin Notifications:** Admin gets notified of new bookings
- **Duplicate Prevention:** Prevents duplicate bookings

## 🚀 **Deployment Commands:**

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View function logs
vercel logs

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add FRONTEND_URL
vercel env add NODE_ENV
```

## 📞 **Support:**

If you encounter issues:

1. Check Vercel function logs
2. Test the health endpoint
3. Verify environment variables
4. Check database connectivity

**Your application is now ready for production! 🎉**
