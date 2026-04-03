import { TEntityWithEvents } from '../../../../shared/types/event.types';
import revenueAccountEvents from '../../events/revenue-account.events';
import {
  ERevenueAccountBehavior,
  ERevenueSubType,
  IUnrealizedGainAccount,
} from '../../types/revenue-account.types';
import { TUnrealizedGainLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(
  predecessorCode: TUnrealizedGainLedgerCode
): TUnrealizedGainLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TUnrealizedGainLedgerCode>(
    '406',
    predecessorCode
  );
}

function make(
  payload: Pick<
    IUnrealizedGainAccount,
    'name' | 'createdBy' | 'accountingEntityId' | 'currency'
  >,
  predecessorCode: TUnrealizedGainLedgerCode
): TEntityWithEvents<IUnrealizedGainAccount, IUnrealizedGainAccount> {
  const account = ledgerAccountEntity.make<IUnrealizedGainAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Revenue,
    normalBalance: ledgerAccountEntity.getNormalBalance(ELedgerType.Revenue),
    subType: ERevenueSubType.UnrealizedGains,
    behavior: ERevenueAccountBehavior.UnrealizedGains,
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });

  const event = revenueAccountEvents.unrealizedGainsCreated(account);
  return [account, [event]];
}

const unrealizedGainsLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default unrealizedGainsLedgerEntity;
