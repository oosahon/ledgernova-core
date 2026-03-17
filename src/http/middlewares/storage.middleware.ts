import { RequestHandler } from 'express';
import IStorage from '../../app/contracts/storage/store.contract';
import generateUUID from '../../shared/utils/uuid-generator';

export default function storageMiddleware(storage: IStorage): RequestHandler {
  return (_req, res, next) => {
    const { user = {}, correlationId = generateUUID() } = res.locals;

    storage.init({ user, correlationId, idempotencyKey: '' }, next);
  };
}
