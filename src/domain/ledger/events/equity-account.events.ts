import eventValue from '../../../shared/value-objects/event.vo';
import {
  ICapitalAccount,
  IRetainedEarningsAccount,
  IRevaluationReserveAccount,
  IOpeningBalanceEquityAccount,
} from '../types/equity-account.types';

export const EEquityLedgerEvent = {
  CapitalCreated: 'domain:ledger:equity:account:capital:created',
  RetainedEarningsCreated:
    'domain:ledger:equity:account:retained-earnings:created',
  RevaluationReserveCreated:
    'domain:ledger:equity:account:revaluation-reserve:created',
  OpeningBalanceEquityCreated:
    'domain:ledger:equity:account:opening-balance-equity:created',
} as const;

function makeCapitalCreatedEvent(payload: ICapitalAccount) {
  return eventValue.make<ICapitalAccount>({
    type: EEquityLedgerEvent.CapitalCreated,
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
  capitalCreated: makeCapitalCreatedEvent,
  retainedEarningsCreated: makeRetainedEarningsCreatedEvent,
  revaluationReserveCreated: makeRevaluationReserveCreatedEvent,
  openingBalanceEquityCreated: makeOpeningBalanceEquityCreatedEvent,
});

export default equityAccountEvents;
