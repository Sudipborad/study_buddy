# Study Buddy - MongoDB Migration

This document outlines the migration from Firebase to MongoDB for the Study Buddy application.

## Changes Made

### Backend Changes

- ✅ Replaced Firebase Functions with Express.js server
- ✅ Replaced Firestore with MongoDB using Mongoose ODM
- ✅ Implemented JWT-based authentication (replacing Firebase Auth)
- ✅ Created REST API endpoints for all operations
- ✅ Added proper error handling and validation
- ✅ Updated Docker configuration

### Frontend Changes

- ✅ Created new API client to replace Firebase SDK calls
- ✅ Updated authentication context to use JWT tokens
- ✅ Modified auth form to include name field for registration
- ✅ Updated material management to use REST API

## Setup Instructions

### Option 1: Local Development

1. **Install MongoDB locally:**

   ```bash
   # On Windows (using Chocolatey)
   choco install mongodb

   # Or download from https://www.mongodb.com/try/download/community
   ```

2. **Set up backend environment:**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env file with your configuration
   npm install
   ```

3. **Start MongoDB:**

   ```bash
   mongod
   ```

4. **Run backend in development:**

   ```bash
   cd backend
   npm run dev
   ```

5. **Update frontend environment:**
   Create `frontend/.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

6. **Run frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account:**

   - Go to https://www.mongodb.com/atlas
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address

2. **Update backend .env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/study_buddy
   ```

### Option 3: Docker Development

1. **Start with Docker Compose:**

   ```bash
   # For development
   docker-compose -f docker-compose.dev.yml up

   # For production
   docker-compose up
   ```

## Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/study_buddy
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/study_buddy

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=8080
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# AI (if using)
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Materials

- `GET /api/materials` - Get user's materials
- `POST /api/materials` - Create new material
- `GET /api/materials/:id` - Get specific material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Users

- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

## Data Migration

If you have existing Firebase data, you'll need to export it and import to MongoDB. The new data structure is:

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Materials Collection

```javascript
{
  _id: ObjectId,
  title: String,
  summary: String,
  flashcards: [
    {
      front: String,
      back: String
    }
  ],
  userId: ObjectId,
  sourceDocument: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

1. **Register a new account** at http://localhost:3000
2. **Login** with your credentials
3. **Upload a document** and create study materials
4. **Verify** that flashcards and summaries are created
5. **Check MongoDB** to see the data is stored correctly

## Troubleshooting

### Common Issues

1. **Connection refused to MongoDB:**

   - Make sure MongoDB is running
   - Check the connection string in .env

2. **JWT token errors:**

   - Make sure JWT_SECRET is set in backend .env
   - Check that token is being sent in Authorization header

3. **CORS errors:**

   - Verify FRONTEND_URL is set correctly in backend
   - Check that frontend is calling the correct API URL

4. **Build errors:**
   - Run `npm install` in both frontend and backend
   - Make sure all dependencies are installed

## Files to Remove (Optional)

The following Firebase-related files can be removed if you're fully migrating:

- `backend/firebase.json`
- `backend/firestore.rules`
- `backend/firestore.indexes.json`
- `backend/.firebaserc`
- `frontend/src/lib/firebase/config.ts` (if not needed for other features)

## Security Notes

- Change default JWT_SECRET in production
- Use strong MongoDB passwords
- Enable MongoDB authentication in production
- Use HTTPS in production
- Implement rate limiting for API endpoints
