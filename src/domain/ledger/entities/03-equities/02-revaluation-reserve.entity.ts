import { TEntityWithEvents } from '../../../../shared/types/event.types';
import equityAccountEvents from '../../events/equity-account.events';
import {
  EEquityAccountBehavior,
  EEquitySubType,
  IRevaluationReserveAccount,
} from '../../types/equity-account.types';
import { TReservesLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(predecessorCode: TReservesLedgerCode): TReservesLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TReservesLedgerCode>(
    '302',
    predecessorCode
  );
}

function make(
  payload: Pick<
    IRevaluationReserveAccount,
    'name' | 'createdBy' | 'accountingEntityId' | 'currency'
  >,
  predecessorCode: TReservesLedgerCode
): TEntityWithEvents<IRevaluationReserveAccount, IRevaluationReserveAccount> {
  const account = ledgerAccountEntity.make<IRevaluationReserveAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    normalBalance: ledgerAccountEntity.getNormalBalance(ELedgerType.Equity),
    type: ELedgerType.Equity,
    subType: EEquitySubType.Reserve,
    behavior: EEquityAccountBehavior.RevaluationReserve,
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });

  const event = equityAccountEvents.revaluationReserveCreated(account);
  return [account, [event]];
}

const revaluationReserveLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default revaluationReserveLedgerEntity;
