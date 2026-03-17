import eventValue from '../../../shared/value-objects/event.vo';
import { IAccount } from '../types/account.types';

export enum EAccountEvents {
  Created = 'domain:account:created',
  Updated = 'domain:account:updated',
  Archived = 'domain:account:archived',
  Unarchived = 'domain:account:unarchived',
}

const makeAccountCreatedEvent = (account: IAccount) => {
  return eventValue.make<IAccount>({
    type: EAccountEvents.Created,
    data: account,
  });
};

const makeAccountUpdatedEvent = (account: IAccount) => {
  return eventValue.make<IAccount>({
    type: EAccountEvents.Updated,
    data: account,
  });
};

const makeAccountArchivedEvent = (account: IAccount) => {
  return eventValue.make<IAccount>({
    type: EAccountEvents.Archived,
    data: account,
  });
};

const makeAccountUnarchivedEvent = (account: IAccount) => {
  return eventValue.make<IAccount>({
    type: EAccountEvents.Unarchived,
    data: account,
  });
};

const accountEvents = Object.freeze({
  created: makeAccountCreatedEvent,
  updated: makeAccountUpdatedEvent,
  archived: makeAccountArchivedEvent,
  unarchived: makeAccountUnarchivedEvent,
});

export default accountEvents;
