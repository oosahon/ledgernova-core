import { TDBTransaction } from '../../../shared/types/seeder.types';

export default interface IDbService {
  runInTransaction(fn: (tx: TDBTransaction) => Promise<void>): Promise<void>;
}
