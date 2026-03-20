import { UAccountingDomain } from '../../domain/accounting/types/accounting.types';
import { IUser } from '../../domain/user/types/user.types';
import { ICorrelationId } from './correlation-id.types';
import { IIdempotencyKey } from './idempotency-key.types';

export default interface IRequestContextData
  extends ICorrelationId, IIdempotencyKey {
  user: IUser | null;
  accountingDomain: UAccountingDomain;
}
