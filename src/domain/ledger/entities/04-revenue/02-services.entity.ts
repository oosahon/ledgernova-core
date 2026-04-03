import { TEntityWithEvents } from '../../../../shared/types/event.types';
import revenueAccountEvents from '../../events/revenue-account.events';
import {
  ERevenueAccountBehavior,
  ERevenueSubType,
  IServicesAccount,
} from '../../types/revenue-account.types';
import { TServicesLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(predecessorCode: TServicesLedgerCode): TServicesLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TServicesLedgerCode>(
    '402',
    predecessorCode
  );
}

function make(
  payload: Pick<
    IServicesAccount,
    'name' | 'createdBy' | 'accountingEntityId' | 'currency'
  >,
  predecessorCode: TServicesLedgerCode
): TEntityWithEvents<IServicesAccount, IServicesAccount> {
  const account = ledgerAccountEntity.make<IServicesAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Revenue,
    subType: ERevenueSubType.Services,
    behavior: ERevenueAccountBehavior.Services,
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    meta: null,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });

  const event = revenueAccountEvents.servicesCreated(account);
  return [account, [event]];
}

const servicesLedgerEntity = Object.freeze({
  make,
  getCode,
});

export default servicesLedgerEntity;
