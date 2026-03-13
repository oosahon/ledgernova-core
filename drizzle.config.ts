import { defineConfig } from 'drizzle-kit';
import { POSTGRES_URL } from './src/infra/config/vars';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/infra/db/drizzle',
  dbCredentials: {
    url: POSTGRES_URL,
  },
  schemaFilter: ['core', 'audit', 'public'],
});
