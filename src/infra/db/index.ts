import { drizzle } from 'drizzle-orm/node-postgres';
import { POSTGRES_URL } from '../config/vars';

export const db = drizzle(POSTGRES_URL);
