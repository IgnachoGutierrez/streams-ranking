import { z } from "zod";

export const TopItemsQuerySchema = z.object({
  time_range: z.enum(['short_term', 'medium_term', 'long_term']).default('medium_term'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type TopItemsQuery = z.infer<typeof TopItemsQuerySchema>;

const ImageSchema = z.object({
  url: z.string(),
  height: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
});

// Spotify has been trimming fields like genres/popularity/followers from some
// responses, so everything beyond the identity fields is optional.
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  genres: z.array(z.string()).optional(),
  popularity: z.number().optional(),
  images: z.array(ImageSchema).optional(),
  external_urls: z.object({ spotify: z.string() }).optional(),
});

export const SongSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.object({ id: z.string(), name: z.string() })),
  album: z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(ImageSchema).optional(),
  }),
  duration_ms: z.number(),
  popularity: z.number().optional(),
  external_urls: z.object({ spotify: z.string() }).optional(),
});

const pagingSchema = <T extends z.ZodType>(item: T) => z.object({
  items: z.array(item),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export const TopArtistsSchema = pagingSchema(ArtistSchema);
export const TopSongsSchema = pagingSchema(SongSchema);

export type TopArtistsResponse = z.infer<typeof TopArtistsSchema>;
export type TopSongsResponse = z.infer<typeof TopSongsSchema>;
