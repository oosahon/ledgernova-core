import { IUser } from '../../domain/user/types/user.types';
import { ICorrelationId } from './correlation-id.types';
import { IIdempotencyKey } from './idempotency-key.types';

export interface IStore extends ICorrelationId, IIdempotencyKey {
  user: IUser | null;
}
