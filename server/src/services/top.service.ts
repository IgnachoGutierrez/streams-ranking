import {
    TopArtistsSchema,
    TopSongsSchema,
    type TopArtistsResponse,
    type TopItemsQuery,
    type TopSongsResponse,
} from '../schemas/top.schema.js';

export class SpotifyApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

// Spotify answered successfully but the body isn't the shape we expect.
export class SpotifyResponseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

function parseResponse<T>(schema: { 
        safeParse(data: unknown): { 
            success: true; 
            data: T 
        } | { 
            success: false; 
            error: Error 
        } 
    }, 
    data: unknown, 
    type: string): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        throw new SpotifyResponseError(`Unexpected Spotify top ${type} response`, { cause: result.error });
    }

    return result.data;
}

async function fetchTopItems(
    type: 'artists' | 'tracks',
    accessToken: string,
    query: TopItemsQuery,
): Promise<unknown> {
    const params = new URLSearchParams({
        time_range: query.time_range,
        limit: String(query.limit),
        offset: String(query.offset),
    });

    const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new SpotifyApiError(response.status, `Spotify top ${type} request failed with ${response.status}`);
    }

    return response.json();
}

export async function getTopArtists(accessToken: string, query: TopItemsQuery): Promise<TopArtistsResponse> {
    const topArtistsData = await fetchTopItems('artists', accessToken, query);
    return parseResponse(TopArtistsSchema, topArtistsData, 'artists');
}

export async function getTopSongs(accessToken: string, query: TopItemsQuery): Promise<TopSongsResponse> {
    const topSongsData = await fetchTopItems('tracks', accessToken, query);
    return parseResponse(TopSongsSchema, topSongsData, 'songs');
}
