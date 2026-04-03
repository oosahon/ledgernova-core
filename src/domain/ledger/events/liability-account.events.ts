import eventValue from '../../../shared/value-objects/event.vo';
import {
  ILiabilitySuspenseAccount,
  ICreditCardAccount,
  IOverdraftAccount,
  IShortTermLoanAccount,
} from '../types/liability-account.types';

export const ELiabilityLedgerEvent = {
  SuspenseCreated: 'domain:ledger:liability:account:suspense:created',
  CreditCardCreated: 'domain:ledger:liability:account:credit-card:created',
  OverdraftCreated: 'domain:ledger:liability:account:overdraft:created',
  ShortTermLoanCreated:
    'domain:ledger:liability:account:short-term-loan:created',
} as const;

function makeSuspenseAccountCreatedEvent(payload: ILiabilitySuspenseAccount) {
  return eventValue.make<ILiabilitySuspenseAccount>({
    type: ELiabilityLedgerEvent.SuspenseCreated,
    data: payload,
  });
}

function makeCreditCardCreatedEvent(payload: ICreditCardAccount) {
  return eventValue.make<ICreditCardAccount>({
    type: ELiabilityLedgerEvent.CreditCardCreated,
    data: payload,
  });
}

function makeOverdraftCreatedEvent(payload: IOverdraftAccount) {
  return eventValue.make<IOverdraftAccount>({
    type: ELiabilityLedgerEvent.OverdraftCreated,
    data: payload,
  });
}

function makeShortTermLoanCreatedEvent(payload: IShortTermLoanAccount) {
  return eventValue.make<IShortTermLoanAccount>({
    type: ELiabilityLedgerEvent.ShortTermLoanCreated,
    data: payload,
  });
}

const liabilityAccountEvents = Object.freeze({
  suspenseCreated: makeSuspenseAccountCreatedEvent,
  creditCardCreated: makeCreditCardCreatedEvent,
  overdraftCreated: makeOverdraftCreatedEvent,
  shortTermLoanCreated: makeShortTermLoanCreatedEvent,
});

export default liabilityAccountEvents;
