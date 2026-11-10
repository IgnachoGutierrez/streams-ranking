import { type NextFunction, type Request, type Response } from 'express';

import logger from '../logger.js';
import { SpotifyApiError, SpotifyResponseError } from '../services/top.service.js';

// Maps Spotify failures to client-facing responses. Anything else is passed on
// to the global error handler.
export function topErrorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
    if (error instanceof SpotifyApiError) {
        logger.warn({ status: error.status }, error.message);

        // 401: token expired/revoked. 403: token lacks the user-top-read scope
        // (user logged in before it was requested) and must log in again.
        if (error.status === 401 || error.status === 403) {
            res.status(error.status).json({ error: 'spotify_unauthorized' });
            return;
        }
        if (error.status === 429) {
            res.status(429).json({ error: 'spotify_rate_limited' });
            return;
        }

        res.status(502).json({ error: 'top_items_failed' });
        return;
    }

    if (error instanceof SpotifyResponseError) {
        logger.error(error);
        res.status(502).json({ error: 'top_items_failed' });
        return;
    }

    next(error);
}
