import { InferSelectModel } from 'drizzle-orm';
import { IAccountingEntity } from '../../domain/accounting/types/accounting.types';
import { accountingEntitiesInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';
import currencyMapper, { ICurrencyModel } from './currency.mapper';
import { TEntityId } from '../../shared/types/uuid';

export interface IAccountingEntityModel extends InferSelectModel<
  typeof accountingEntitiesInCore
> {}

interface IAccountingEntitySelectModel extends IAccountingEntityModel {
  functionalCurrency: ICurrencyModel;
}

const accountingEntityMapper = {
  toRepo(entity: IAccountingEntity): IAccountingEntityModel {
    return {
      id: entity.id,
      ownerId: entity.ownerId,
      functionalCurrencyCode: entity.functionalCurrency.code,
      type: entity.type,
      fiscalYearEndMonth: entity.fiscalYearEnd.month,
      fiscalYearEndDay: entity.fiscalYearEnd.day,
      ...toCommonRepoDates(entity),
    };
  },

  toDomain(payload: IAccountingEntitySelectModel): IAccountingEntity {
    return Object.freeze({
      id: payload.id as TEntityId,
      ownerId: payload.ownerId as TEntityId,
      functionalCurrency: currencyMapper.toDomain(payload.functionalCurrency),
      type: payload.type,
      fiscalYearEnd: Object.freeze({
        month: payload.fiscalYearEndMonth,
        day: payload.fiscalYearEndDay,
      }),
      ...fromCommonRepoDates(payload),
    });
  },
};

export default accountingEntityMapper;
