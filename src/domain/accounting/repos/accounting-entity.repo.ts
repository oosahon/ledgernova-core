import IRepoOptions from '../../../shared/types/repo-options.types';
import { IaccountingEntityTypeEntity } from '../types/accounting.types';

export default interface IAccountingEntityRepo {
  save(
    domain: IaccountingEntityTypeEntity,
    options: IRepoOptions
  ): Promise<void>;
}
