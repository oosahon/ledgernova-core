import { ICorrelationId } from './correlation-id.types';
import { TDBTransaction } from './seeder.types';

export default interface IRepoOptions extends ICorrelationId {
  tx?: TDBTransaction;
}
