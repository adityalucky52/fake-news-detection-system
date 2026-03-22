
import express from 'express';
import * as predictionController from './prediction.controller.js';
import { protect } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// All prediction routes require authentication
router.use(protect);

router.post('/predict', predictionController.analyzePrediction);
router.get('/history', predictionController.getHistory);
router.get('/history/:id', predictionController.getPredictionById);

export default router;
