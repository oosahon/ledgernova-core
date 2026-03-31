import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import currencyEntity from '../../currency/entities/currency.entity';
import userEntity from '../../user/entities/user.entity';
import accountingEntityTypeEvents from '../events/accounting-entity.events';
import accountingHelpers from '../helpers/accounting.helpers';
import { IAccountingEntity } from '../types/accounting.types';

function make(
  payload: TCreationOmits<IAccountingEntity>
): TEntityWithEvents<IAccountingEntity, IAccountingEntity> {
  userEntity.validate(payload.owner);
  currencyEntity.validateCode(payload.functionalCurrency.code);
  accountingHelpers.validateEntityType(payload.type);

  const timestamp = new Date();

  const domain: IAccountingEntity = Object.freeze({
    id: generateUUID(),
    owner: payload.owner,
    type: payload.type,
    functionalCurrency: payload.functionalCurrency,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });

  const event = accountingEntityTypeEvents.created(domain);

  return [domain, [event]];
}

const accountingEntity = Object.freeze({
  make,
});

export default accountingEntity;
