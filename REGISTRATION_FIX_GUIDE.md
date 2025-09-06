# Registration Server Error Fix Guide

## Current Issue
Registration is failing with "Server error. Please try again later." because the MongoDB connection is not working in production.

## Root Cause
The `MONGODB_URI` environment variable in Vercel is not properly configured, causing the registration API to fail when trying to connect to the database.

## Immediate Fix Required

### Step 1: Update Vercel Environment Variables
Go to your Vercel dashboard and update the environment variables:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Update or Add these variables:**

```bash
MONGODB_URI=mongodb+srv://karkidsanjay:g8433O4649@genzplug.8hzeonl.mongodb.net/genzplug?retryWrites=true&w=majority&appName=genzplug
NEXTAUTH_URL=https://genzplug.com
NEXTAUTH_SECRET=genzplug-production-secret-key-2024-secure-random-string
NEXT_PUBLIC_APP_URL=https://genzplug.com
NEXT_PUBLIC_SOCKET_URL=https://genzplug-socket.railway.app
NEXT_PUBLIC_SOCKET_SERVER_URL=https://genzplug-socket.railway.app
NODE_ENV=production
```

### Step 2: Redeploy Vercel
After updating environment variables:
1. **Trigger a new deployment** in Vercel
2. **Wait for deployment to complete**
3. **Test registration again**

### Step 3: Test Registration
After deployment, test registration:

```bash
# Test registration endpoint
curl -X POST https://genzplug.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {
    "name": "Test User",
    "email": "test@example.com",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Alternative: Quick Test Without Database

If you want to test the app without database functionality, you can temporarily disable database-dependent features:

### Option 1: Use Demo Account
The app already has a demo account built-in:
- **Email**: `demo@genzplug.com`
- **Password**: `demo123`

### Option 2: Mock Registration
Temporarily modify the registration API to return success without database:

```javascript
// In src/app/api/auth/register/route.ts
export async function POST(request: NextRequest) {
  try {
    // Temporary: Skip database connection for testing
    console.log('Registration attempt (database disabled)');
    
    const body = await request.json();
    const { name, email, password } = body;
    
    // Return success without database
    return NextResponse.json({
      message: 'User registered successfully (demo mode)',
      user: {
        name,
        email,
        _id: 'demo-user-id',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    }, { status: 500 });
  }
}
```

## Testing Steps

### 1. Test API Health
```bash
curl https://genzplug.com/api/health
```

### 2. Test Registration Endpoint
```bash
curl -X POST https://genzplug.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### 3. Test Demo Login
Try logging in with:
- **Email**: `demo@genzplug.com`
- **Password**: `demo123`

## Expected Results After Fix

- ✅ **Registration works** without server errors
- ✅ **Users can create accounts** successfully
- ✅ **Database connection established**
- ✅ **Authentication works** properly

## Troubleshooting

### If MongoDB URI is Invalid:
1. **Check MongoDB Atlas** connection string
2. **Verify database user** has proper permissions
3. **Ensure IP whitelist** includes Vercel's IPs
4. **Test connection** from MongoDB Atlas dashboard

### If Environment Variables Not Working:
1. **Check Vercel dashboard** for typos
2. **Ensure variables are set** for Production environment
3. **Redeploy** after making changes
4. **Check deployment logs** for errors

## Next Steps

1. **Update Vercel environment variables**
2. **Redeploy the application**
3. **Test registration functionality**
4. **Verify database connection**

The registration error should be resolved once the MongoDB connection is properly configured in Vercel.
