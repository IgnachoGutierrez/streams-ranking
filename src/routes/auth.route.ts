import express from 'express';

import { handleAuthorizationCode, login } from '../controllers/auth.controller';

const router = express.Router();

router.get('/login', login);
router.get('/callback', handleAuthorizationCode);

export default router;