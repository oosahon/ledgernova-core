import eventValue from '../../../shared/value-objects/event.vo';
import { ILedgerAccount } from '../types/ledger-account.types';

export enum EAccountEvents {
  Created = 'domain:account:created',
  Updated = 'domain:account:updated',
  Archived = 'domain:account:archived',
  Unarchived = 'domain:account:unarchived',
}

const makeAccountCreatedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: EAccountEvents.Created,
    data: account,
  });
};

const makeAccountUpdatedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: EAccountEvents.Updated,
    data: account,
  });
};

const makeAccountArchivedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: EAccountEvents.Archived,
    data: account,
  });
};

const makeAccountUnarchivedEvent = (account: ILedgerAccount) => {
  return eventValue.make<ILedgerAccount>({
    type: EAccountEvents.Unarchived,
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
