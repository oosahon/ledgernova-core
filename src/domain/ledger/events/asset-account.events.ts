import eventValue from '../../../shared/value-objects/event.vo';
import {
  IAssetSuspenseAccount,
  ICashAndCashEquivalentAccount,
} from '../types/asset-account.types';

export const EAssetLedgerEvent = {
  SuspenseCreated: 'domain:ledger:asset:account:suspense:created',
  CashAndEquivalentCreated:
    'domain:ledger:asset:account:cash-and-equivalent:created',
} as const;

function makeSuspenseAccountCreatedEvent(payload: IAssetSuspenseAccount) {
  return eventValue.make<IAssetSuspenseAccount>({
    type: EAssetLedgerEvent.SuspenseCreated,
    data: payload,
  });
}

function makeCashAndEquivalentCreatedEvent(
  payload: ICashAndCashEquivalentAccount
) {
  return eventValue.make<ICashAndCashEquivalentAccount>({
    type: EAssetLedgerEvent.CashAndEquivalentCreated,
    data: payload,
  });
}

const assetAccountEvents = Object.freeze({
  suspenseCreated: makeSuspenseAccountCreatedEvent,
  cashAndEquivalentCreated: makeCashAndEquivalentCreatedEvent,
});

export default assetAccountEvents;
