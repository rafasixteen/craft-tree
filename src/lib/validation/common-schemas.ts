import { z } from 'zod';

export const UuidSchema = z.uuid('Invalid UUID format');

export type Uuid = z.infer<typeof UuidSchema>;
