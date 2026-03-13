// src/schemas/filter-posto-schema.ts
import { z } from 'zod';

export const filterPostoSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});