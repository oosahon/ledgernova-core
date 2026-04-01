import repos from '../../infra/db/repos';
import logger from '../../infra/observability/logger';
import setupServer from '../../infra/server';
import bootstrapCurrencies from './setup-currencies';

async function bootstrap() {
  await bootstrapCurrencies(repos.currency, logger);
  setupServer();
}

bootstrap();
