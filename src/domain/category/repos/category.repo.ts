import IRepoOptions from '../../../shared/types/repo-options.types';
import { ULedgerAccountType } from '../../account/types/account.types';
import { ICategory, UCategoryFlowType } from '../types/category.types';

export default interface ICategoryRepo {
  save(category: ICategory, params: IRepoOptions): Promise<void>;

  update(category: ICategory, params: IRepoOptions): Promise<void>;

  findById(categoryId: string, params: IRepoOptions): Promise<ICategory | null>;

  findByTaxKey(taxKey: string, params: IRepoOptions): Promise<ICategory | null>;

  findByName(
    name: string,
    type: ULedgerAccountType,
    userId: string,
    params: IRepoOptions
  ): Promise<ICategory | null>;

  delete(
    categoryId: string,
    userId: string,
    params: IRepoOptions
  ): Promise<void>;

  findAllByFlowType(
    flowType: UCategoryFlowType,
    params: IRepoOptions,
    userId?: string
  ): Promise<ICategory[]>;
}
