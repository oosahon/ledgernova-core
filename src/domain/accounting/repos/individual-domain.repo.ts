import IRepoOptions from '../../../shared/types/repo-options.types';
import { IIndividualDomain } from '../types/accounting.types';

export default interface IIndividualDomainRepo {
  save(domain: IIndividualDomain, options: IRepoOptions): Promise<void>;
}
