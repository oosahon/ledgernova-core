import { InferSelectModel } from 'drizzle-orm';
import { IUser, IUserWithPassword } from '../../domain/user/types/user.types';
import { usersInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';

export interface IUserModel extends InferSelectModel<typeof usersInCore> {}

const userMapper = {
  toRepo(user: IUserWithPassword): IUserModel {
    return Object.freeze({
      ...user,
      ...toCommonRepoDates(user),
      password: user.password ?? null,
    });
  },

  toDomain({ password, ...user }: IUserModel): IUser {
    return Object.freeze({
      ...user,
      ...fromCommonRepoDates(user),
    });
  },
};

export default userMapper;
