import { ICorrelationId } from './correlation-id.types';
import { TDBTransaction } from './seeder.types';

export default interface IRepoParams extends ICorrelationId {
  tx?: TDBTransaction;
}
