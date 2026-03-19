import IRepoOptions from '../../../shared/types/repo-options.types';
import { ICurrency } from '../types/currency.types';

interface ICurrencyRepo {
  save(currency: ICurrency, option: IRepoOptions): Promise<ICurrency>;

  findByCode(code: string, option: IRepoOptions): Promise<ICurrency | null>;

  findAll(option: IRepoOptions): Promise<ICurrency[]>;
}

export default ICurrencyRepo;
