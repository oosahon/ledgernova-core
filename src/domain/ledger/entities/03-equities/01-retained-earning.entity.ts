import { TEntityWithEvents } from '../../../../shared/types/event.types';
import equityAccountEvents from '../../events/equity-account.events';
import {
  EEquityAccountBehavior,
  EEquitySubType,
  IRetainedEarningsAccount,
} from '../../types/equity-account.types';
import { TRetainedEarningsLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(
  predecessorCode: TRetainedEarningsLedgerCode
): TRetainedEarningsLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TRetainedEarningsLedgerCode>(
    '301',
    predecessorCode
  );
}

function make(
  payload: Pick<
    IRetainedEarningsAccount,
    'name' | 'createdBy' | 'accountingEntityId' | 'currency'
  >,
  predecessorCode: TRetainedEarningsLedgerCode
): TEntityWithEvents<IRetainedEarningsAccount, IRetainedEarningsAccount> {
  const account = ledgerAccountEntity.make<IRetainedEarningsAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Equity,
    subType: EEquitySubType.RetainedEarnings,
    behavior: EEquityAccountBehavior.RetainedEarnings,
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });

  const event = equityAccountEvents.retainedEarningsCreated(account);
  return [account, [event]];
}

const retainedEarningLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default retainedEarningLedgerEntity;
