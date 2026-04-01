import eventValue from '../../../shared/value-objects/event.vo';
import { IAssetSuspenseAccount } from '../types/asset-ledger.types';

export const EAssetLedgerEvent = {
  SuspenseCreated: 'domain:ledger:asset:suspense:created',
  SuspenseUpdated: 'domain:ledger:asset:suspense:updated',
  SuspenseDeleted: 'domain:ledger:asset:suspense:deleted',
} as const;

function makeSuspenseAccountCreatedEvent(payload: IAssetSuspenseAccount) {
  return eventValue.make<IAssetSuspenseAccount>({
    type: EAssetLedgerEvent.SuspenseCreated,
    data: payload,
  });
}

const assetLedgerEvents = Object.freeze({
  suspenseCreated: makeSuspenseAccountCreatedEvent,
});

export default assetLedgerEvents;
