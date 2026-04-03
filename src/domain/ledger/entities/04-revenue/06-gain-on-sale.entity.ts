import { TEntityWithEvents } from '../../../../shared/types/event.types';
import revenueAccountEvents from '../../events/revenue-account.events';
import {
  ERevenueAccountBehavior,
  ERevenueSubType,
  IGainOnSaleAccount,
} from '../../types/revenue-account.types';
import { TGainOnSaleLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(
  predecessorCode: TGainOnSaleLedgerCode
): TGainOnSaleLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TGainOnSaleLedgerCode>(
    '406',
    predecessorCode
  );
}

function make(
  payload: Pick<
    IGainOnSaleAccount,
    'name' | 'createdBy' | 'accountingEntityId' | 'currency'
  >,
  predecessorCode: TGainOnSaleLedgerCode
): TEntityWithEvents<IGainOnSaleAccount, IGainOnSaleAccount> {
  const account = ledgerAccountEntity.make<IGainOnSaleAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Revenue,
    subType: ERevenueSubType.GainOnSale,
    behavior: ERevenueAccountBehavior.GainOnSale,
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });

  const event = revenueAccountEvents.gainOnSaleCreated(account);
  return [account, [event]];
}

const gainOnSaleLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default gainOnSaleLedgerEntity;
