import eventValue from '../../../shared/value-objects/event.vo';
import { ILedgerAccount } from '../types/index.types';

export enum ELedgerAccountEvents {
  Created = 'domain:ledger:account:created',
  Updated = 'domain:ledger:account:updated',
  Archived = 'domain:ledger:account:archived',
  Unarchived = 'domain:ledger:account:unarchived',
}

const makeAccountCreatedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: ELedgerAccountEvents.Created,
    data: account,
  });
};

const makeAccountUpdatedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: ELedgerAccountEvents.Updated,
    data: account,
  });
};

const makeAccountArchivedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: ELedgerAccountEvents.Archived,
    data: account,
  });
};

const makeAccountUnarchivedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: ELedgerAccountEvents.Unarchived,
    data: account,
  });
};

const ledgerAccountEvents = Object.freeze({
  created: makeAccountCreatedEvent,
  updated: makeAccountUpdatedEvent,
  archived: makeAccountArchivedEvent,
  unarchived: makeAccountUnarchivedEvent,
});

export default ledgerAccountEvents;
