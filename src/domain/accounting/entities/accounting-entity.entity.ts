import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import currencyEntity from '../../currency/entities/currency.entity';
import userEntity from '../../user/entities/user.entity';
import accountingEntityTypeEvents from '../events/accounting-entity.events';
import accountingHelpers from '../helpers/accounting.helpers';
import { IAccountingEntity } from '../types/accounting.types';

function validate(entity: TCreationOmits<IAccountingEntity>) {
  userEntity.validate(entity.owner);
  currencyEntity.validateCode(entity.functionalCurrency.code);
  accountingHelpers.validateEntityType(entity.type);
}

function make(
  payload: TCreationOmits<IAccountingEntity>
): TEntityWithEvents<IAccountingEntity, IAccountingEntity> {
  validate(payload);

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
  validate,
});

export default accountingEntity;
