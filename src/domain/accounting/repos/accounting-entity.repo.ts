import IRepoOptions from '../../../shared/types/repo-options.types';
import { IAccountingEntity } from '../types/accounting.types';

export default interface IAccountingEntityRepo {
  save(domain: IAccountingEntity, options: IRepoOptions): Promise<void>;
}
