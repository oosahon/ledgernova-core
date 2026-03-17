import { drizzle } from 'drizzle-orm/node-postgres';
import { POSTGRES_URL } from '../config/vars.config';

export const db = drizzle(POSTGRES_URL);
