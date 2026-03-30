
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './common/controllers/error.controller.js';
import authRouter from './modules/auth/auth.routes.js';
import predictionRouter from './modules/prediction/prediction.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import { AppError } from './utils/appError.js';

const app = express();

// Trust proxy if we are behind a reverse proxy (like Nginx)
app.set('trust proxy', 1);

// Middleware
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again in 15 minutes.'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);  // must be before /api so admin routes aren't caught by predictionRouter's protect
app.use('/api', predictionRouter);

// Base route for testing
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend is running' });
});

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
