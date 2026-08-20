import { z } from 'zod/v4';

export const Person = z.object({
  name: z.string().trim().min(1),
  age: z.number().positive().max(150),
});
export type Person = z.infer<typeof Person>;
