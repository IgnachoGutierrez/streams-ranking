import express from 'express';

import { getAccessToken, handleAuthorizationCode, login, me } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', handleAuthorizationCode);
router.get('/me', me);
router.get('/token', getAccessToken);

export default router;