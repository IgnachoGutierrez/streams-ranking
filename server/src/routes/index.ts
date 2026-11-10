import express from 'express';

import authRoutes from './auth.route.js';
import topRoutes from './top.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/top', topRoutes);

export default router;