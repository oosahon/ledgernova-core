import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import currencyEntity from '../../currency/entities/currency.entity';
import userEntity from '../../user/entities/user.entity';
import accountingEntityTypeEvents from '../events/accounting-domain.events';
import accountingHelpers from '../helpers/accounting.helpers';
import { IaccountingEntityTypeEntity } from '../types/accounting.types';

function makeIndividual(
  payload: TCreationOmits<IaccountingEntityTypeEntity>
): TEntityWithEvents<IaccountingEntityTypeEntity, IaccountingEntityTypeEntity> {
  userEntity.validate(payload.owner);
  currencyEntity.validateCode(payload.functionalCurrency.code);
  accountingHelpers.validateEntityType(payload.type);

  const timestamp = new Date();

  const domain: IaccountingEntityTypeEntity = Object.freeze({
    id: generateUUID(),
    owner: payload.owner,
    type: payload.type,
    functionalCurrency: payload.functionalCurrency,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });

  const event = accountingEntityTypeEvents.individualCreated(domain);

  return [domain, [event]];
}

const accountingEntity = Object.freeze({
  makeIndividual,
});

export default accountingEntity;
