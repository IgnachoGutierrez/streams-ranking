import express from 'express';

import { topArtists, topSongs } from '../controllers/top.controller.js';
import { parseTopItemsQuery } from '../middleware/parseTopItemsQuery.js';
import { requireAccessToken } from '../middleware/requireAccessToken.js';
import { topErrorHandler } from '../middleware/topErrorHandler.js';

const router = express.Router();

router.use(requireAccessToken, parseTopItemsQuery);

router.get('/artists', topArtists);
router.get('/songs', topSongs);

router.use(topErrorHandler);

export default router;
