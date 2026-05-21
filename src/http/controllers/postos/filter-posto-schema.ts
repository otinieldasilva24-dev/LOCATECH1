import { z } from 'zod';

export const filterPostoSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(100).optional().default(10),
  limit: z.coerce.number().min(1).max(200).optional().default(75),
});
