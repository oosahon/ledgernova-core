import { TEntityWithEvents } from '../../../../shared/types/event.types';
import equityAccountEvents from '../../events/equity-account.events';
import {
  EEquityAccountBehavior,
  EEquitySubType,
  IOpeningBalanceEquityAccount,
} from '../../types/equity-account.types';
import { TOpeningBalanceEquityLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(
  predecessorCode: TOpeningBalanceEquityLedgerCode
): TOpeningBalanceEquityLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TOpeningBalanceEquityLedgerCode>(
    '399',
    predecessorCode
  );
}

function make(
  payload: Pick<
    IOpeningBalanceEquityAccount,
    | 'name'
    | 'createdBy'
    | 'accountingEntityId'
    | 'currency'
    | 'isControlAccount'
    | 'controlAccountId'
  >,
  predecessorCode: TOpeningBalanceEquityLedgerCode
): TEntityWithEvents<
  IOpeningBalanceEquityAccount,
  IOpeningBalanceEquityAccount
> {
  const account = ledgerAccountEntity.make<IOpeningBalanceEquityAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Equity,
    subType: EEquitySubType.Default,
    behavior: EEquityAccountBehavior.OpeningBalanceEquity,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });

  const event = equityAccountEvents.openingBalanceEquityCreated(account);
  return [account, [event]];
}

const openingBalanceEquityLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default openingBalanceEquityLedgerEntity;
