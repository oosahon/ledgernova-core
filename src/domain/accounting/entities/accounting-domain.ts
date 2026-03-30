import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import currencyEntity from '../../currency/entities/currency.entity';
import userEntity from '../../user/entities/user.entity';
import accountingDomainEvents from '../events/accounting-domain.events';
import { IIndividualDomain } from '../types/accounting.types';

function makeIndividualDomain(
  payload: TCreationOmits<IIndividualDomain>
): TEntityWithEvents<IIndividualDomain, IIndividualDomain> {
  userEntity.validate(payload.owner);
  currencyEntity.validateCode(payload.functionalCurrency.code);

  const timestamp = new Date();

  const domain: IIndividualDomain = Object.freeze({
    id: generateUUID(),
    owner: payload.owner,
    functionalCurrency: payload.functionalCurrency,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });

  const event = accountingDomainEvents.individualDomainAccountCreated(domain);

  return [domain, [event]];
}

const accountingDomainEntity = Object.freeze({
  makeIndividual: makeIndividualDomain,
});

export default accountingDomainEntity;
