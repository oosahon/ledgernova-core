import IRepoParams from '../../../shared/types/repo-params.types';
import { ECategoryType, ICategory } from '../types/category.types';

export default interface ICategoryRepo {
  save(category: ICategory, params: IRepoParams): Promise<void>;

  update(category: ICategory, params: IRepoParams): Promise<void>;

  findById(categoryId: string, params: IRepoParams): Promise<ICategory | null>;

  findByTaxKey(taxKey: string, params: IRepoParams): Promise<ICategory | null>;

  findByName(
    name: string,
    type: ECategoryType,
    userId: string,
    params: IRepoParams
  ): Promise<ICategory | null>;

  delete(
    categoryId: string,
    userId: string,
    params: IRepoParams
  ): Promise<void>;

  findAll(
    type: ECategoryType[],
    params: IRepoParams,
    query?: { userId?: string; ids?: string[] }
  ): Promise<ICategory[]>;
}
