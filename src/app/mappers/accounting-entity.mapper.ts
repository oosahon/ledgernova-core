import { InferSelectModel } from 'drizzle-orm';
import { IAccountingEntity } from '../../domain/accounting/types/accounting.types';
import { accountingEntitiesInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';
import userMapper, { IUserModel } from './user.mapper';
import currencyMapper, { ICurrencyModel } from './currency.mapper';

export interface IAccountingEntityModel extends InferSelectModel<
  typeof accountingEntitiesInCore
> {}

interface IAccountingEntitySelectModel extends IAccountingEntityModel {
  owner: IUserModel;
  functionalCurrency: ICurrencyModel;
}

const accountingEntityMapper = {
  toRepo(entity: IAccountingEntity): IAccountingEntityModel {
    return {
      id: entity.id,
      ownerId: entity.owner.id,
      functionalCurrencyCode: entity.functionalCurrency.code,
      type: entity.type,
      ...toCommonRepoDates(entity),
    };
  },

  toDomain(payload: IAccountingEntitySelectModel): IAccountingEntity {
    return Object.freeze({
      id: payload.id,
      owner: userMapper.toDomain(payload.owner),
      functionalCurrency: currencyMapper.toDomain(payload.functionalCurrency),
      type: payload.type,
      ...fromCommonRepoDates(payload),
    });
  },
};

export default accountingEntityMapper;
