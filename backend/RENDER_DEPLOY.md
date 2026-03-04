# Deploy to Render - Step by Step Guide

## Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started" and sign up with GitHub
3. Authorize Render to access your repositories

## Step 2: Create PostgreSQL Database

1. Click "New +" button (top right)
2. Select "PostgreSQL"
3. Fill in:
   - **Name:** `lost-id-database`
   - **Database:** `lost_id_db`
   - **User:** `lost_id_user` (auto-generated)
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click "Create Database"
5. Wait 2-3 minutes for database to be ready
6. **IMPORTANT:** Copy these values (you'll need them):
   - Internal Database URL
   - External Database URL
   - Host
   - Port
   - Database
   - Username
   - Password

## Step 3: Run Database Migration

Option A - Using External Connection:
```bash
# Install PostgreSQL client if you don't have it
# Then run:
psql <EXTERNAL_DATABASE_URL> -f backend/database.sql
```

Option B - Using Render Shell:
1. Go to your database on Render
2. Click "Connect" → "PSQL Command"
3. Copy the command and run locally
4. Then paste the contents of `database.sql`

## Step 4: Deploy Backend Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Lost-ID-Document-Recovery-System`
3. Configure:
   - **Name:** `lost-id-backend`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. Click "Advanced" and add Environment Variables:
   ```
   PORT=5000
   DB_HOST=<from Step 2>
   DB_PORT=5432
   DB_NAME=lost_id_db
   DB_USER=<from Step 2>
   DB_PASSWORD=<from Step 2>
   JWT_SECRET=your_super_secret_jwt_key_12345
   NODE_ENV=production
   ```

5. Click "Create Web Service"

## Step 5: Wait for Deployment
- First deployment takes 3-5 minutes
- Watch the logs for any errors
- Once you see "🚀 Server running on port 5000" - you're live!

## Step 6: Test Your API

Your API will be at: `https://lost-id-backend.onrender.com`

Test endpoints:
```bash
# Health check
curl https://lost-id-backend.onrender.com/health

# Register user
curl -X POST https://lost-id-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","phone":"0788123456","password":"password123"}'
```

## Important Notes:
- ✅ Free tier includes 750 hours/month
- ✅ PostgreSQL free tier: 90 days (then $7/month)
- ⚠️ Free services sleep after 15 min of inactivity (first request takes 30s to wake up)
- ✅ Uploads folder persists (unlike Vercel)

## Troubleshooting:
- If deployment fails, check logs in Render dashboard
- Make sure all environment variables are set correctly
- Verify database connection string is correct

## Your API is now live! 🚀
