import eventValue from '../../../shared/value-objects/event.vo';
import { IIndividualDomain } from '../types/accounting.types';

export enum EAccountDomainEvents {
  IndividualDomainAccountCreated = 'domain:accounting:individual-domain-account-created',
}

function makeIndividualDomainAccountCreatedEvent(params: IIndividualDomain) {
  return eventValue.make<IIndividualDomain>({
    type: EAccountDomainEvents.IndividualDomainAccountCreated,
    data: params,
  });
}

const accountingDomainEvents = Object.freeze({
  individualDomainAccountCreated: makeIndividualDomainAccountCreatedEvent,
});

export default accountingDomainEvents;
