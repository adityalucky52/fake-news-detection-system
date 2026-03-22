
import express from 'express';
import * as adminController from './admin.controller.js';
import { protect, restrictTo } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// Public: Admin login (validates against .env credentials)
router.post('/login', adminController.adminLogin);

// All other admin routes require authentication AND admin role
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id/predictions', adminController.getUserPredictions);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.get('/predictions', adminController.getAllPredictions);

export default router;
