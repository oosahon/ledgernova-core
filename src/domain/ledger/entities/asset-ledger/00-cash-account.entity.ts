import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import stringUtils from '../../../../shared/utils/string';
import {
  EAssetAccountBehavior,
  EAssetSubType,
  IBankAccount,
  IBankAccountMeta,
  IPettyCashAccount,
  IPettyCashAccountMeta,
} from '../../types/asset-ledger.types';
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
) {
  stringUtils.validateUUID(payload.controlAccountId);

  const meta: IPettyCashAccountMeta = Object.freeze({
    lastReconciliationDate: null,
  });

  const account = ledgerAccountEntity.make<IPettyCashAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    meta,
    code: getCode(predecessorCode),
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

  return account;
}

function validateBankAccountMeta(meta: IBankAccountMeta) {
  const {
    bankName,
    accountNumber,
    accountName,
    sortCode,
    swiftCode,
    iban,
    routingNumber,
    branchCode,
  } = meta;

  stringUtils.sanitizeAndValidate(bankName, {
    min: 2,
    max: 100,
  });

  stringUtils.sanitizeAndValidate(accountNumber, {
    min: 6,
    max: 34,
  });

  stringUtils.sanitizeAndValidate(accountName, {
    min: 2,
    max: 100,
  });

  if (sortCode) {
    stringUtils.sanitizeAndValidate(sortCode, {
      min: 6,
      max: 6,
    });
  }

  if (swiftCode) {
    stringUtils.sanitizeAndValidate(swiftCode, {
      min: 8,
      max: 11,
    });
  }

  if (iban) {
    stringUtils.sanitizeAndValidate(iban, {
      min: 15,
      max: 34,
    });
  }

  if (routingNumber) {
    stringUtils.sanitizeAndValidate(routingNumber, {
      min: 9,
      max: 9,
    });
  }

  if (branchCode) {
    stringUtils.sanitizeAndValidate(branchCode, {
      min: 1,
      max: 10,
    });
  }
}

function makeBankAccountMeta(meta: IBankAccountMeta) {
  validateBankAccountMeta(meta);

  return Object.freeze<IBankAccountMeta>({
    bankName: meta.bankName,
    accountNumber: meta.accountNumber,
    accountName: meta.accountName,
    sortCode: meta.sortCode,
    swiftCode: meta.swiftCode,
    iban: meta.iban,
    routingNumber: meta.routingNumber,
    branchCode: meta.branchCode,
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
) {
  stringUtils.validateUUID(payload.controlAccountId);

  const account = ledgerAccountEntity.make<IBankAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
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

  return account;
}

const cashAndCashEquivalentAssetLedgerEntity = Object.freeze({
  makeBankAccount,
  makeBankAccountMeta,
  makePettyCashAccount,
  getCode,
  validateBankAccountMeta,
});

export default cashAndCashEquivalentAssetLedgerEntity;
