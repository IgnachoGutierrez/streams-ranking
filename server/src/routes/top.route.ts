import express from 'express';

import { topArtists, topSongs } from '../controllers/top.controller.js';
import { parseTopItemsQuery } from '../middleware/parseTopItemsQuery.js';

const router = express.Router();

router.use(parseTopItemsQuery);

router.get('/artists', topArtists);
router.get('/songs', topSongs);

export default router;
