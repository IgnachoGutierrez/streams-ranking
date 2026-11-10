import { type NextFunction, type Request, type Response } from 'express';

import { ACCESS_TOKEN_COOKIE } from '../config/cookie.js';

// Rejects with 401 when there is no access token cookie; otherwise exposes it
// to later handlers as res.locals.accessToken.
export function requireAccessToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies[ACCESS_TOKEN_COOKIE];

    if (!token) {
        res.status(401).json({ error: 'not_authenticated' });
        return;
    }

    res.locals.accessToken = token;
    next();
}
