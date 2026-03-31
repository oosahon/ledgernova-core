import eventValue from '../../../shared/value-objects/event.vo';
import { IAccountingEntity } from '../types/accounting.types';

export enum EAccountingEntity {
  AccountingEntityCreated = 'domain:accounting:entity:created',
}

function makeCreatedEvent(params: IAccountingEntity) {
  return eventValue.make<IAccountingEntity>({
    type: EAccountingEntity.AccountingEntityCreated,
    data: params,
  });
}

const accountingEntityTypeEvents = Object.freeze({
  created: makeCreatedEvent,
});

export default accountingEntityTypeEvents;
