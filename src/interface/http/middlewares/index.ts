import appContext from '../../../app/context';
import logger from '../../../infra/observability/logger';
import reporter from '../../../infra/observability/reporter';

import isOptionalAuthenticatedUserMiddleware from './is-optional-authenticated-user.middleware';
import requestContextMiddleware from './request-context.middleware';

const middlewares = {
  isOptionalAuthenticatedUser: isOptionalAuthenticatedUserMiddleware(
    logger,
    reporter
  ),

  requestContext: requestContextMiddleware(appContext.request),
};

export default middlewares;
