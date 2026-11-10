import { z } from 'zod';

import config from '../config/config.js';
import logger from '../logger.js';

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

// Last.fm tags are user-generated, so the most-used ones are not always genres.
const NON_GENRE_TAGS = new Set([
    'seen live',
    'favorites',
    'favourites',
    'favorite',
    'favourite',
    'albums i own',
    'under 2000 listeners',
]);

const TopTagsSchema = z.object({
    toptags: z.object({
        tag: z.array(z.object({ name: z.string(), count: z.number() })),
    }),
});

// "hip-hop" -> "Hip-Hop", "r&b" -> "R&B", "indie rock" -> "Indie Rock".
function capitalizeGenre(genre: string): string {
    return genre.replace(/(^|[\s\-/&])(\p{L})/gu, (_, separator: string, letter: string) => separator + letter.toUpperCase());
}

// Returns the artist's most-used Last.fm tag that looks like a genre, or null
// when Last.fm doesn't know the artist, has no usable tags, or the request fails.
export async function getArtistMainGenre(artistName: string): Promise<string | null> {
    if (!config.lastfmApiKey) return null;

    const params = new URLSearchParams({
        method: 'artist.gettoptags',
        artist: artistName,
        autocorrect: '1',
        api_key: config.lastfmApiKey,
        format: 'json',
    });

    try {
        const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`);
        const data: unknown = await response.json();

        // Last.fm reports errors (unknown artist, bad key, rate limit) as
        // { error, message }, sometimes with a 200 status.
        const result = TopTagsSchema.safeParse(data);
        if (!response.ok || !result.success) {
            logger.debug({ artistName, status: response.status, data }, 'Last.fm tags unavailable');
            return null;
        }

        const genre = result.data.toptags.tag
            .map((tag) => tag.name.trim().toLowerCase())
            .find((name) => name && !NON_GENRE_TAGS.has(name));

        return genre ? capitalizeGenre(genre) : null;
    } catch (error) {
        logger.warn({ artistName, err: error },'Last.fm tags request failed');
        return null;
    }
}
