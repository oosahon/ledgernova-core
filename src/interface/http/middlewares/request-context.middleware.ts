import { RequestHandler } from 'express';
import IRequestContext from '../../../app/contracts/storage/request-context.contract';
import generateUUID from '../../../shared/utils/uuid-generator';
import {
  EAccountingEntityType,
  UAccountingEntityType,
} from '../../../domain/accounting/types/accounting.types';
import { ErrorForbidden } from '../../../shared/value-objects/error';
import accountingHelpers from '../../../domain/accounting/helpers/accounting.helpers';
import getHttpHeaderValue from '../helpers/get-http-header-value';

/**
 * DOMAIN: global
 *
 * This middleware is used to initialize the request context
 */
export default function requestContextMiddleware(
  requestContext: IRequestContext
): RequestHandler {
  return (req, res, next) => {
    const correlationId = getHttpHeaderValue('x-correlation-id', req.headers);
    const idempotencyKey = getHttpHeaderValue('x-idempotency-key', req.headers);
    const accountingEntityType = getHttpHeaderValue(
      'x-accounting-entity-type',
      req.headers
    );

    const { user = {} } = res.locals;

    requestContext.init(
      {
        user,
        correlationId: correlationId || generateUUID(),
        idempotencyKey: idempotencyKey || '',
        accountingEntityType: accountingEntityType as UAccountingEntityType,
      },
      next
    );
  };
}
