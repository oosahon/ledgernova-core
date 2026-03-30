import IUserRepo from '../../../domain/user/repos/user.repo';
import { IUser } from '../../../domain/user/types/user.types';

const userRepo: IUserRepo = {
  save: async (user, options) => {},

  findByEmail: async (email, options) => {
    // TODO: implement
    return {} as IUser;
  },

  findById: async (userId, options) => {
    // TODO: implement
    return {} as IUser;
  },

  delete: async (userId, options) => {},
};

export default userRepo;
