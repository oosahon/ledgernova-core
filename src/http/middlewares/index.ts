import logger from '../../infra/observability/logger';
import reporter from '../../infra/observability/reporter';
import services from '../../infra/services';
import isOptionalAuthenticatedUserMiddleware from './is-optional-authenticated-user.middleware';
import storageMiddleware from './storage.middleware';

const middlewares = {
  isOptionalAuthenticatedUser: isOptionalAuthenticatedUserMiddleware(
    logger,
    reporter
  ),

  storage: storageMiddleware(services.storage),
};

export default middlewares;
