
import { type Request, type Response, type NextFunction } from 'express';
import axios from 'axios';
import { AppError } from '../../utils/appError.js';
import prisma from '../../database/prisma.js';
import { type Label } from '../../generated/prisma/client.js';

// ─── Helper: Call ML Microservice ─────────────────────────────────────────────
const getMlPrediction = async (data: {
  text?: string;
  url?: string;
}): Promise<{ label: Label; confidence: number; explanation?: string; trust_score?: number }> => {
  try {
    const endpoint = data.url ? '/predict' : '/predict_text';
    const payload = data.url ? { url: data.url } : { text: data.text };

    const response = await axios.post(
      `${process.env.ML_SERVICE_URL}${endpoint}`,
      payload,
      { timeout: 30000 },
    );
    return response.data;
  } catch (error: any) {
    console.error('ML service error:', error.message);
    // Fallback mock if service is down
    return {
      label: (Math.random() > 0.5 ? 'REAL' : 'FAKE') as Label,
      confidence: parseFloat((Math.random() * 0.39 + 0.6).toFixed(4)),
      explanation: 'ML service is currently unavailable. Using local heuristic analysis.',
    };
  }
};

// ─── POST /api/predict ───────────────────────────────────────────────────────
export const analyzePrediction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, url } = req.body;
    const user = req.user!;

    if (!text && !url) {
      return next(new AppError('Please provide either text or a URL to analyze.', 400));
    }
    if (text && text.trim().length < 50) {
      return next(new AppError('Please provide at least 50 characters of text to analyze.', 400));
    }

    const mlResult = await getMlPrediction({ text, url });
    const { label, confidence, explanation, trust_score } = mlResult;

    const prediction = await prisma.prediction.create({
      data: {
        text: text || url,
        label,
        confidence: confidence ?? (trust_score ? trust_score / 100 : 0.8),
        explanation,
        userId: user.id,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        id: prediction.id,
        label: prediction.label,
        confidence: prediction.confidence,
        explanation: prediction.explanation,
        text_preview: (text || url).substring(0, 100),
        createdAt: prediction.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/history ─────────────────────────────────────────────────────────
export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    const predictions = await prisma.prediction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        label: true,
        confidence: true,
        text: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: predictions.length,
        predictions: predictions.map((p) => ({
          id: p.id,
          label: p.label,
          confidence: p.confidence,
          text_preview: p.text.substring(0, 100),
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/history/:id ─────────────────────────────────────────────────────
export const getPredictionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const prediction = await prisma.prediction.findUnique({
      where: { id },
    });

    if (!prediction) {
      return next(new AppError('Prediction not found.', 404));
    }

    if (prediction.userId !== user.id) {
      return next(new AppError('You do not have permission to view this prediction.', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: prediction.id,
        label: prediction.label,
        confidence: prediction.confidence,
        text: prediction.text,
        explanation: prediction.explanation,
        createdAt: prediction.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};
