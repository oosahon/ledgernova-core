import IRepoOptions from '../../../shared/types/repo-options.types';
import { IUser, IUserWithPassword } from '../types/user.types';

interface IUserRepo {
  save(user: IUserWithPassword, options: IRepoOptions): Promise<void>;

  findByEmail(email: string, options: IRepoOptions): Promise<IUser | null>;

  findById(id: string, options: IRepoOptions): Promise<IUser | null>;

  delete(id: string, options: IRepoOptions): Promise<void>;
}

export default IUserRepo;
