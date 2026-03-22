
import express from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
router.use(protect);

router.get('/me', authController.getMe);
// For testing protected logic
router.get('/protected-test', (req, res) => {
  res.status(200).json({ status: 'success', message: 'You are authenticated!' });
});

export default router;
