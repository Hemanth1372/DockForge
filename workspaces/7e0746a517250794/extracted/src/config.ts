import * as dotenv from 'dotenv';
import { z } from 'zod/v4';

export const Config = z.object({
  port: z.coerce.number().int().positive(),
  databaseUrl: z.string(),
});
export type Config = z.infer<typeof Config>;

function readFromEnv(name: string, prefix?: string): string | undefined {
  return process.env[`${prefix ?? ''}${name}`];
}

export const getConfig = (prefix?: string): Config => {
  dotenv.config();
  return Config.parse({
    port: readFromEnv('PORT', prefix),
    databaseUrl: readFromEnv('DATABASE_URL', prefix),
  });
};
