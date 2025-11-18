import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Import routes
import authRoutes from './routes/auth';
import materialRoutes from './routes/materials';
import userRoutes from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // Render uses port 10000, Railway uses 8080

// Connect to database
connectDB();

// Middleware
app.use(helmet());
// Configure CORS: in development reflect the requesting origin so
// requests from `http://192.168.56.1:3001` or other local hostnames work.
// In production, only allow the configured FRONTEND_URL.
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Allow non-browser requests like curl/postman
    if (!origin) return callback(null, true);

    // In development accept any browser origin (reflect it)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production only allow the configured FRONTEND_URL
    const allowed = process.env.FRONTEND_URL;
    if (allowed && origin === allowed) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'StudyBuddy Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Study Buddy Backend API`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;