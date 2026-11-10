import { type Request, type Response } from 'express';

import { getTopArtists, getTopSongs } from '../services/top.service.js';

export async function topArtists(req: Request, res: Response) {
    const { accessToken, query } = res.locals;
    
    const topArtists = await getTopArtists(accessToken, query);
    
    res.json(topArtists);
}

export async function topSongs(req: Request, res: Response) {
    const { accessToken, query } = res.locals;

    const topSongs = await getTopSongs(accessToken, query);

    res.json(topSongs);
}
