import { z } from "zod";

export const TopItemsQuerySchema = z.object({
  time_range: z.enum(['short_term', 'medium_term', 'long_term']).default('medium_term'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});