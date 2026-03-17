import IRepoOptions from '../../../shared/types/repo-options.types';
import { ICategory, UCategoryType } from '../types/category.types';

export default interface ICategoryRepo {
  save(category: ICategory, params: IRepoOptions): Promise<void>;

  update(category: ICategory, params: IRepoOptions): Promise<void>;

  findById(categoryId: string, params: IRepoOptions): Promise<ICategory | null>;

  findByTaxKey(taxKey: string, params: IRepoOptions): Promise<ICategory | null>;

  findByName(
    name: string,
    type: UCategoryType,
    userId: string,
    params: IRepoOptions
  ): Promise<ICategory | null>;

  delete(
    categoryId: string,
    userId: string,
    params: IRepoOptions
  ): Promise<void>;

  findAll(
    type: UCategoryType[],
    params: IRepoOptions,
    query?: { userId?: string; ids?: string[] }
  ): Promise<ICategory[]>;
}
