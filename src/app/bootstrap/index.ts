import repos from '../../infra/db/repos';
import logger from '../../infra/observability/logger';
import setupServer from '../../infra/server';
import bootstrapCurrencies from './setup-currencies';
import { setupIndividualDomainCategories } from './setup-system-categories';

async function bootstrap() {
  await bootstrapCurrencies(repos.currency, logger);
  await setupIndividualDomainCategories(repos.category, logger);
  setupServer();
}

bootstrap();
