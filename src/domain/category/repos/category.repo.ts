import IRepoOptions from '../../../shared/types/repo-options.types';
import { UAccountingDomain } from '../../accounting/types/accounting.types';
import { UTransactionType } from '../../transaction/types/transaction.types';
import { ICategory, UCategoryType } from '../types/category.types';

interface IFindAllParams {
  accountingDomain: UAccountingDomain;
  types?: UCategoryType[];
  userId?: string;
}

export default interface ICategoryRepo {
  save(category: ICategory, options: IRepoOptions): Promise<void>;

  update(category: ICategory, options: IRepoOptions): Promise<void>;

  findById(
    categoryId: string,
    options: IRepoOptions
  ): Promise<ICategory | null>;

  findByTaxKey(
    taxKey: string,
    options: IRepoOptions
  ): Promise<ICategory | null>;

  findByName(
    name: string,
    transactionType: UTransactionType,
    userId: string,
    options: IRepoOptions
  ): Promise<ICategory | null>;

  delete(
    categoryId: string,
    userId: string,
    options: IRepoOptions
  ): Promise<void>;

  findAll(params: IFindAllParams, options: IRepoOptions): Promise<ICategory[]>;
}
