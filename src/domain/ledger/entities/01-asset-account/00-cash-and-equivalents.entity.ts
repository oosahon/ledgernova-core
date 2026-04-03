import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../../shared/types/event.types';
import stringUtils from '../../../../shared/utils/string';
import assetAccountEvents from '../../events/asset-account.events';
import {
  EAssetAccountBehavior,
  EAssetSubType,
  IBankAccount,
  IBankAccountMeta,
  IPettyCashAccount,
  IPettyCashAccountMeta,
} from '../../types/asset-account.types';
import { TCashLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(predecessorCode: TCashLedgerCode): TCashLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TCashLedgerCode>(
    '100',
    predecessorCode
  );
}

/**
 * Creates a new petty cash sub ledger.
 * @param payload petty cash creation payload
 * @param predecessorCode the ledger code of the most recent Cash and Cash Equivalent sub ledger.
 * @returns [IPettyCashAccount, IPettyCashCreationEvent]
 */
function makePettyCashAccount(
  payload: TCreationOmits<IPettyCashAccount>,
  predecessorCode: TCashLedgerCode
): TEntityWithEvents<IPettyCashAccount, IPettyCashAccount> {
  stringUtils.validateUUID(payload.controlAccountId);

  const meta: IPettyCashAccountMeta = Object.freeze({
    lastReconciliationDate: null,
  });

  const account = ledgerAccountEntity.make<IPettyCashAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    meta,
    code: getCode(predecessorCode),
    normalBalance: ledgerAccountEntity.getNormalBalance(ELedgerType.Asset),
    type: ELedgerType.Asset,
    subType: EAssetSubType.CashAndCashEquivalent,
    behavior: EAssetAccountBehavior.PettyCash,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctPermitted,
    createdBy: payload.createdBy,
  });

  const event = assetAccountEvents.pettyCashCreated(account);
  return [account, [event]];
}

function makeBankAccountMeta(meta: IBankAccountMeta) {
  const bankName = stringUtils.sanitizeAndValidate(meta.bankName, {
    min: 2,
    max: 100,
  });

  const accountNumber = stringUtils.sanitizeAndValidate(meta.accountNumber, {
    min: 6,
    max: 34,
  });

  const accountName = stringUtils.sanitizeAndValidate(meta.accountName, {
    min: 2,
    max: 100,
  });

  let sortCode: string | null = null;
  if (meta.sortCode) {
    sortCode = stringUtils.sanitizeAndValidate(meta.sortCode, {
      min: 6,
      max: 6,
    });
  }

  let swiftCode: string | null = null;
  if (meta.swiftCode) {
    swiftCode = stringUtils.sanitizeAndValidate(meta.swiftCode, {
      min: 8,
      max: 11,
    });
  }

  let iban: string | null = null;
  if (meta.iban) {
    iban = stringUtils.sanitizeAndValidate(meta.iban, {
      min: 15,
      max: 34,
    });
  }

  let routingNumber: string | null = null;
  if (meta.routingNumber) {
    routingNumber = stringUtils.sanitizeAndValidate(meta.routingNumber, {
      min: 9,
      max: 9,
    });
  }

  let branchCode: string | null = null;
  if (meta.branchCode) {
    branchCode = stringUtils.sanitizeAndValidate(meta.branchCode, {
      min: 1,
      max: 10,
    });
  }

  return Object.freeze<IBankAccountMeta>({
    bankName,
    accountNumber,
    accountName,
    sortCode,
    swiftCode,
    iban,
    routingNumber,
    branchCode,
    lastReconciliationDate: null,
  });
}

/**
 * Creates a new bank account.
 * @param payload bank account creation payload
 * @param predecessorCode the ledger code of the most recent Cash and Cash Equivalent sub ledger.
 * @returns bank account
 */
function makeBankAccount(
  payload: TCreationOmits<IBankAccount>,
  predecessorCode: TCashLedgerCode
): TEntityWithEvents<IBankAccount, IBankAccount> {
  stringUtils.validateUUID(payload.controlAccountId);

  const account = ledgerAccountEntity.make<IBankAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    normalBalance: ledgerAccountEntity.getNormalBalance(ELedgerType.Asset),
    type: ELedgerType.Asset,
    subType: EAssetSubType.CashAndCashEquivalent,
    behavior: EAssetAccountBehavior.Bank,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    meta: makeBankAccountMeta(payload.meta),
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctPermitted,
    createdBy: payload.createdBy,
  });

  const event = assetAccountEvents.bankAccountCreated(account);
  return [account, [event]];
}

const cashAndEquivalentAssetLedgerEntity = Object.freeze({
  makeBankAccount,
  makeBankAccountMeta,
  makePettyCashAccount,
  getCode,
});

export default cashAndEquivalentAssetLedgerEntity;
