import { defineConfig } from 'drizzle-kit';
import { POSTGRES_URL } from './src/infra/config/vars';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infra/db/schema/index.ts',
  dbCredentials: {
    url: POSTGRES_URL,
  },
});
