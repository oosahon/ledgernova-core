import eventValue from '../../../shared/value-objects/event.vo';
import { IGeneralLedgerAccount } from '../types/index.types';

export enum EGeneralLedgerAccountEvents {
  Created = 'domain:ledger:general:created',
  Updated = 'domain:ledger:general:updated',
  Archived = 'domain:ledger:general:archived',
  Unarchived = 'domain:ledger:general:unarchived',
}

const makeAccountCreatedEvent = (account: IGeneralLedgerAccount) => {
  return eventValue.make<IGeneralLedgerAccount>({
    type: EGeneralLedgerAccountEvents.Created,
    data: account,
  });
};

const makeAccountUpdatedEvent = (account: IGeneralLedgerAccount) => {
  return eventValue.make<IGeneralLedgerAccount>({
    type: EGeneralLedgerAccountEvents.Updated,
    data: account,
  });
};

const makeAccountArchivedEvent = (account: IGeneralLedgerAccount) => {
  return eventValue.make<IGeneralLedgerAccount>({
    type: EGeneralLedgerAccountEvents.Archived,
    data: account,
  });
};

const makeAccountUnarchivedEvent = (account: IGeneralLedgerAccount) => {
  return eventValue.make<IGeneralLedgerAccount>({
    type: EGeneralLedgerAccountEvents.Unarchived,
    data: account,
  });
};

const generalLedgerAccountEvents = Object.freeze({
  created: makeAccountCreatedEvent,
  updated: makeAccountUpdatedEvent,
  archived: makeAccountArchivedEvent,
  unarchived: makeAccountUnarchivedEvent,
});

export default generalLedgerAccountEvents;
