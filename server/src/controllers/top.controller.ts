import { type Request, type Response } from 'express';

import { getTopArtists, getTopSongs } from '../services/top.service.js';
import { ACCESS_TOKEN_COOKIE } from '../config/cookie.js';

export async function topArtists(req: Request, res: Response) {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
    const { query } = res.locals;

    if (!accessToken) {
        res.status(401).json({ error: 'not_authenticated' });
        return;
    }
    
    const topArtists = await getTopArtists(accessToken, query);
    res.json(topArtists);
}

export async function topSongs(req: Request, res: Response) {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
    const { query } = res.locals;

    if (!accessToken) {
        res.status(401).json({ error: 'not_authenticated' });
        return;
    }

    const topSongs = await getTopSongs(accessToken, query);
    res.json(topSongs);
}
