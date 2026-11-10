import { type Request, type Response } from 'express';

import { type TopSongsResponse } from '../schemas/top.schema.js';
import { getTopArtists, getTopSongs } from '../services/top.service.js';

type Song = TopSongsResponse['items'][number];

function mapSongToResultsPageItem(song: Song) {
    return {
        id: song.id,
        title: song.name,
        subtitle: song.artists[0].name,
        image: song.album.images?.[0]?.url ?? null,
    };
}

export async function topArtists(req: Request, res: Response) {
    const { accessToken, query } = res.locals;
    
    const topArtists = await getTopArtists(accessToken, query);
    
    res.json(topArtists);
}

export async function topSongs(req: Request, res: Response) {
    const { accessToken, query } = res.locals;

    const topSongs = await getTopSongs(accessToken, query);

    res.json({
        items: topSongs.items.map(mapSongToResultsPageItem),
        total: topSongs.total,
        limit: topSongs.limit,
        offset: topSongs.offset,
    });
}
