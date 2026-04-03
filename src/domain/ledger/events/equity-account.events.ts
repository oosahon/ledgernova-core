import eventValue from '../../../shared/value-objects/event.vo';
import {
  ICapitalAccount,
  IRetainedEarningsAccount,
  IRevaluationReserveAccount,
  IOpeningBalanceEquityAccount,
} from '../types/equity-account.types';

export const EEquityLedgerEvent = {
  OwnerCapitalCreated: 'domain:ledger:equity:account:owner-capital:created',
  RetainedEarningsCreated:
    'domain:ledger:equity:account:retained-earnings:created',
  RevaluationReserveCreated:
    'domain:ledger:equity:account:revaluation-reserve:created',
  OpeningBalanceEquityCreated:
    'domain:ledger:equity:account:opening-balance-equity:created',
} as const;

function makeOwnerCapitalCreatedEvent(payload: ICapitalAccount) {
  return eventValue.make<ICapitalAccount>({
    type: EEquityLedgerEvent.OwnerCapitalCreated,
    data: payload,
  });
}

function makeRetainedEarningsCreatedEvent(payload: IRetainedEarningsAccount) {
  return eventValue.make<IRetainedEarningsAccount>({
    type: EEquityLedgerEvent.RetainedEarningsCreated,
    data: payload,
  });
}

function makeRevaluationReserveCreatedEvent(
  payload: IRevaluationReserveAccount
) {
  return eventValue.make<IRevaluationReserveAccount>({
    type: EEquityLedgerEvent.RevaluationReserveCreated,
    data: payload,
  });
}

function makeOpeningBalanceEquityCreatedEvent(
  payload: IOpeningBalanceEquityAccount
) {
  return eventValue.make<IOpeningBalanceEquityAccount>({
    type: EEquityLedgerEvent.OpeningBalanceEquityCreated,
    data: payload,
  });
}

const equityAccountEvents = Object.freeze({
  ownerCapitalCreated: makeOwnerCapitalCreatedEvent,
  retainedEarningsCreated: makeRetainedEarningsCreatedEvent,
  revaluationReserveCreated: makeRevaluationReserveCreatedEvent,
  openingBalanceEquityCreated: makeOpeningBalanceEquityCreatedEvent,
});

export default equityAccountEvents;
