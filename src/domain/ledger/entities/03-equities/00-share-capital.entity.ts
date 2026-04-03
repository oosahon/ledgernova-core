import { TEntityWithEvents } from '../../../../shared/types/event.types';
import equityAccountEvents from '../../events/equity-account.events';
import {
  EEquityAccountBehavior,
  EEquitySubType,
  ICapitalAccount,
} from '../../types/equity-account.types';
import { TCapitalLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(predecessorCode: TCapitalLedgerCode): TCapitalLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TCapitalLedgerCode>(
    '300',
    predecessorCode
  );
}

function make(
  payload: Pick<
    ICapitalAccount,
    | 'name'
    | 'createdBy'
    | 'accountingEntityId'
    | 'currency'
    | 'isControlAccount'
    | 'controlAccountId'
  >,
  predecessorCode: TCapitalLedgerCode
): TEntityWithEvents<ICapitalAccount, ICapitalAccount> {
  const account = ledgerAccountEntity.make<ICapitalAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Equity,
    subType: EEquitySubType.Default,
    behavior: EEquityAccountBehavior.OwnerCapital,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctPermitted,
    createdBy: payload.createdBy,
  });

  const event = equityAccountEvents.ownerCapitalCreated(account);
  return [account, [event]];
}

const shareCapitalLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default shareCapitalLedgerEntity;
