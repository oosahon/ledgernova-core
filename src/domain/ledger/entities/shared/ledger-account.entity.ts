import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import stringUtils from '../../../../shared/utils/string';
import generateUUID from '../../../../shared/utils/uuid-generator';
import { AppError } from '../../../../shared/value-objects/error';
import currencyEntity from '../../../currency/entities/currency.entity';
import {
  ELedgerAccountStatus,
  ELedgerType,
  ILedgerAccount,
  ULedgerAccountStatus,
  ULedgerType,
  UContraAccountRule,
  EContraAccountRule,
  UAdjunctAccountRule,
  EAdjunctAccountRule,
  ENormalBalance,
  UNormalBalance,
} from '../../types/ledger.types';

function getNormalBalance(type: ULedgerType): UNormalBalance {
  switch (type) {
    case ELedgerType.Asset:
    case ELedgerType.Expense:
      return ENormalBalance.Debit;

    case ELedgerType.Liability:
    case ELedgerType.Equity:
    case ELedgerType.Revenue:
      return ENormalBalance.Credit;
    default:
      throw new AppError('Invalid ledger type', { cause: type });
  }
}

function validateCode(code: string) {
  if (!/^[1-5][0-9]{5}$/.test(code)) {
    throw new AppError('Invalid ledger code', { cause: code });
  }
}

function validateType(type: ULedgerType) {
  if (!Object.values(ELedgerType).includes(type)) {
    throw new AppError('Invalid ledger type', { cause: type });
  }
}

function validateStatus(status: ULedgerAccountStatus) {
  if (!Object.values(ELedgerAccountStatus).includes(status)) {
    throw new AppError('Invalid ledger status', { cause: status });
  }
}

function validateContraRule(rule: UContraAccountRule) {
  if (!Object.values(EContraAccountRule).includes(rule)) {
    throw new AppError('Invalid contra account rule', { cause: rule });
  }
}

function validateAdjunctRule(rule: UAdjunctAccountRule) {
  if (!Object.values(EAdjunctAccountRule).includes(rule)) {
    throw new AppError('Invalid adjunct account rule', { cause: rule });
  }
}

function validateSubType(subType: string) {
  if (!stringUtils.isNonEmptyString(subType)) {
    throw new AppError('Invalid ledger sub-type', { cause: subType });
  }
}

function validateBehavior(behavior: string) {
  if (!stringUtils.isNonEmptyString(behavior)) {
    throw new AppError('Invalid ledger behavior', { cause: behavior });
  }
}

function getSubLedgerCode<T extends string>(
  headerCode: string,
  predecessorCode: T
): T {
  if (!/^[1-5][0-9]{2}$/.test(headerCode)) {
    throw new AppError('Invalid ledger header code', { cause: headerCode });
  }

  const code = predecessorCode.substring(3);
  const isInvalidPredecessorCode =
    !predecessorCode.startsWith(headerCode) || code.length !== 3;
  if (isInvalidPredecessorCode) {
    throw new AppError('Invalid predecessor code', { cause: predecessorCode });
  }

  if (code === '999') {
    throw new AppError('Limit reached for ledger code', {
      cause: predecessorCode,
    });
  }

  const nextCode = (Number(code) + 1).toString().padStart(3, '0');

  return `${headerCode}${nextCode}` as T;
}

function make<T extends ILedgerAccount>(
  payload: TCreationOmits<T, 'normalBalance'>
): Readonly<T> {
  validateCode(payload.code);
  stringUtils.validateUUID(payload.accountingEntityId);
  validateType(payload.type);

  if (payload.controlAccountId) {
    stringUtils.validateUUID(payload.controlAccountId);
  }

  currencyEntity.validateCode(payload.currency.code);
  validateStatus(payload.status);

  validateContraRule(payload.contraAccountRule);
  validateAdjunctRule(payload.adjunctAccountRule);
  stringUtils.validateUUID(payload.createdBy);

  validateSubType(payload.subType);
  validateBehavior(payload.behavior);

  const timestamp = new Date();

  const ledgerAccount: ILedgerAccount = {
    id: generateUUID(),
    code: payload.code,
    accountingEntityId: payload.accountingEntityId,
    type: payload.type,
    normalBalance: getNormalBalance(payload.type),
    subType: payload.subType,
    behavior: payload.behavior,
    isControlAccount: !!payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    name: stringUtils.sanitizeAndValidate(payload.name, { min: 2, max: 100 }),
    currency: payload.currency,
    status: payload.status,
    contraAccountRule: payload.contraAccountRule,
    adjunctAccountRule: payload.adjunctAccountRule,
    // Meta validation is delegated to the specific ledger account entity
    meta: payload.meta,
    createdBy: payload.createdBy,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  };

  return Object.freeze(ledgerAccount) as Readonly<T>;
}

const ledgerAccountEntity = Object.freeze({
  make,
  validateCode,
  validateType,
  validateStatus,
  validateContraRule,
  validateAdjunctRule,

  getSubLedgerCode,

  getNormalBalance,
});

export default ledgerAccountEntity;
