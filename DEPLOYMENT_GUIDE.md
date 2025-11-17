# 🚀 StudyBuddy Deployment Guide

## Step 1: Set up MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (select M0 Sandbox - FREE)
4. Create a database user:
   - Username: `studybuddy`
   - Password: `studybuddy123` (or generate a secure one)
5. Add your IP address to Network Access (or use 0.0.0.0/0 for all IPs)
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - It should look like: `mongodb+srv://studybuddy:studybuddy123@cluster0.xxxxx.mongodb.net/study_buddy`

## Step 2: Deploy Backend (Choose One Platform)

### Option A: Deploy to Render (Recommended - More Reliable)

1. Go to [Render](https://render.com) and sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your `study_buddy` repository
4. Configure the service:
   - **Name**: `studybuddy-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Set these environment variables in Render:
   ```
   MONGODB_URI=mongodb+srv://studybuddy:studybuddy123@cluster0.xxxxx.mongodb.net/study_buddy
   JWT_SECRET=7bb080596caa0339298faa41b99d961afbc88e96f806031151e4e7a6e5e8003f
   NODE_ENV=production
   PORT=10000
   GEMINI_API_KEY=AIzaSyBH1uN_vHBEE5MrK1ErXQTWnZhE8gwjgos
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
6. Deploy - Render will give you a URL like: `https://studybuddy-backend.onrender.com`

### Option B: Deploy to Railway (Alternative)

1. Go to [Railway](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `study_buddy` repository
4. Choose the `backend` folder as the root directory
5. Set environment variables (same as above but PORT=8080)
6. Deploy - Railway will give you a URL like: `https://your-backend-name.railway.app`

## Step 3: Deploy Frontend to Vercel (Free Hosting + Domain)

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "New Project" → Import your `study_buddy` repository
3. Set Root Directory to `frontend`
4. Set these environment variables in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://studybuddy-backend.onrender.com/api
   NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyAW_g1QRaVudyUMVa_ADlj75hUx1kfKFNQ
   GEMINI_API_KEY=AIzaSyBH1uN_vHBEE5MrK1ErXQTWnZhE8gwjgos
   ```
   (Replace with your actual backend URL from Render or Railway)
5. Deploy - Vercel will give you a URL like: `https://study-buddy-xxxxx.vercel.app`

## Step 4: Update CORS Configuration

1. Go back to your backend platform (Render or Railway) → Environment Variables
2. Update `FRONTEND_URL` with your actual Vercel URL
3. Redeploy the backend

## Step 5: Test Your Live App

Visit your Vercel URL and test:

- User registration/login
- Document upload
- Flashcard generation
- Quiz creation
- Video recommendations
- Document summarization

## 🎉 Your App is Live!

- **Frontend (with free domain)**: https://your-app-name.vercel.app
- **Backend API**: https://your-backend-name.railway.app
- **Database**: MongoDB Atlas (free tier)

## Free Resources Used:

- ✅ Vercel: Free hosting + custom domain
- ✅ Render: Free backend hosting (750 hours/month) OR Railway (500 hours/month)
- ✅ MongoDB Atlas: Free database (512MB storage)
- ✅ Domain: Free .vercel.app subdomain

## Custom Domain (Optional)

To add your own domain:

1. In Vercel dashboard → Settings → Domains
2. Add your domain and follow DNS instructions

Total cost: **$0/month** 🎉
