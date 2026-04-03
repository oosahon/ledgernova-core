import eventValue from '../../../shared/value-objects/event.vo';
import {
  IAssetSuspenseAccount,
  IBankAccount,
  IPettyCashAccount,
} from '../types/asset-account.types';

export const EAssetLedgerEvent = {
  SuspenseCreated: 'domain:ledger:asset:account:suspense:created',
  PettyCashCreated: 'domain:ledger:asset:account:petty-cash:created',
  BankAccountCreated: 'domain:ledger:asset:account:bank:created',
} as const;

function makeSuspenseAccountCreatedEvent(payload: IAssetSuspenseAccount) {
  return eventValue.make<IAssetSuspenseAccount>({
    type: EAssetLedgerEvent.SuspenseCreated,
    data: payload,
  });
}

function makePettyCashAccountCreatedEvent(payload: IPettyCashAccount) {
  return eventValue.make<IPettyCashAccount>({
    type: EAssetLedgerEvent.PettyCashCreated,
    data: payload,
  });
}

function makeBankAccountCreatedEvent(payload: IBankAccount) {
  return eventValue.make<IBankAccount>({
    type: EAssetLedgerEvent.BankAccountCreated,
    data: payload,
  });
}

const assetAccountEvents = Object.freeze({
  suspenseCreated: makeSuspenseAccountCreatedEvent,
  pettyCashCreated: makePettyCashAccountCreatedEvent,
  bankAccountCreated: makeBankAccountCreatedEvent,
});

export default assetAccountEvents;
