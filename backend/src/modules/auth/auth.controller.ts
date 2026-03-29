
import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../../utils/appError.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../database/prisma.js';
import { type User, Role } from '../../generated/prisma/client.js';

// ─── Helper: Sign JWT ─────────────────────────────────────────────────────────
const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as jwt.SignOptions['expiresIn'],
  });

// ─── Helper: Strip password from user ────────────────────────────────────────
const sanitizeUser = (user: User) => {
  const { password: _pw, ...rest } = user;
  return rest;
};

// ─── Helper: Send response with JWT ─────────────────────────────────────────
const createSendToken = (
  user: User,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.status(statusCode).json({
    status: 'success',
    access_token: token,
    data: { user: sanitizeUser(user) },
  });
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.username || req.body.name;
    const { email, password } = req.body;

    if (!email || !password || !name) {
      return next(new AppError('Please provide name, email and password', 400));
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return next(new AppError('Email already in use. Please login.', 409));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: Role.user },
    });

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email || req.body.username;
    const { password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Fetch user including password
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/logout ────────────────────────────────────────────────────
export const logout = (_req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
export const getMe = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { user: sanitizeUser(req.user!) },
  });
};
