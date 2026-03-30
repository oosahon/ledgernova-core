import eventValue from '../../../shared/value-objects/event.vo';
import { IaccountingEntityTypeEntity } from '../types/accounting.types';

export enum EAccountDomainEvents {
  IndividualDomainAccountCreated = 'domain:accounting:individual-domain-account-created',
}

function makeIndividualCreatedEvent(params: IaccountingEntityTypeEntity) {
  return eventValue.make<IaccountingEntityTypeEntity>({
    type: EAccountDomainEvents.IndividualDomainAccountCreated,
    data: params,
  });
}

const accountingEntityTypeEvents = Object.freeze({
  individualCreated: makeIndividualCreatedEvent,
});

export default accountingEntityTypeEvents;
