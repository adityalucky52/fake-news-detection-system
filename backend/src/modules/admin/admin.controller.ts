import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../../utils/appError.js';
import prisma from '../../database/prisma.js';
import { Label, Role } from '../../generated/prisma/client.js';
import jwt from 'jsonwebtoken';

// ─── Helper: Sign JWT ─────────────────────────────────────────────────────────
const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as jwt.SignOptions['expiresIn'],
  });

// ─── POST /api/admin/login ────────────────────────────────────────────────────
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envEmail || !envPassword) {
      return next(new AppError('Admin credentials are not configured on the server.', 500));
    }

    if (email !== envEmail || password !== envPassword) {
      return next(new AppError('Incorrect admin email or password.', 401));
    }

    // Fetch the admin user from the database
    const adminUser = await prisma.user.findUnique({ where: { email: envEmail } });
    if (!adminUser || adminUser.role !== Role.admin) {
      return next(new AppError('Admin account not found. Please run the seed script.', 404));
    }

    const token = signToken(adminUser.id);
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    const { password: _pw, ...safeUser } = adminUser;
    res.status(200).json({ status: 'success', data: { user: safeUser } });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/users/:id/predictions ─────────────────────────────────────────────
export const getUserPredictions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return next(new AppError('User not found.', 404));

    const predictions = await prisma.prediction.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        predictions: predictions.map((p) => ({
          id: p.id,
          label: p.label,
          confidence: p.confidence,
          text_preview: p.text.substring(0, 150),
          text: p.text,
          explanation: p.explanation,
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalPredictions, fakeCount] = await Promise.all([
      prisma.user.count(),
      prisma.prediction.count(),
      prisma.prediction.count({ where: { label: Label.FAKE } }),
    ]);

    const realCount = totalPredictions - fakeCount;
    const fakePercentage =
      totalPredictions > 0
        ? parseFloat(((fakeCount / totalPredictions) * 100).toFixed(1))
        : 0;

    res.status(200).json({
      status: 'success',
      data: {
        total_users: totalUsers,
        total_predictions: totalPredictions,
        fake_count: fakeCount,
        real_count: realCount,
        fake_percentage: fakePercentage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { predictions: true } },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          prediction_count: u._count.predictions,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const currentUser = req.user!;

    if (id === currentUser.id) {
      return next(new AppError('You cannot delete your own account.', 400));
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return next(new AppError('User not found.', 404));

    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    await prisma.user.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/admin/users/:id/role ───────────────────────────────────────────
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!Object.values(Role).includes(role as Role)) {
      return next(new AppError('Role must be either "user" or "admin".', 400));
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(200).json({
      status: 'success',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/predictions ──────────────────────────────────────────────
export const getAllPredictions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const predictions = await prisma.prediction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        predictions: predictions.map((p) => ({
          id: p.id,
          label: p.label,
          confidence: p.confidence,
          text_preview: p.text.substring(0, 100),
          text: p.text,
          explanation: p.explanation,
          createdAt: p.createdAt,
          user: p.user,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};
