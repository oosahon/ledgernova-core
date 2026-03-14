import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import { AppError } from '../../../shared/value-objects/error';
import { IMoney } from '../../../shared/types/money.types';
import currencyValue from '../../../shared/value-objects/currency.vo';
import moneyValue from '../../../shared/value-objects/money.vo';
import {
  EAccountStatus,
  ELedgerAccountType,
  IAccount,
  ULedgerAccountType,
} from '../types/account.types';

interface IGetBalanceParams {
  type: ULedgerAccountType;
  totalCredit: IMoney;
  totalDebit: IMoney;
}

function validateAccountType(type: ULedgerAccountType) {
  const isValid = [
    ELedgerAccountType.Asset,
    ELedgerAccountType.Liability,
    ELedgerAccountType.Equity,
    ELedgerAccountType.Revenue,
    ELedgerAccountType.Expense,
  ].includes(type);

  if (!isValid) {
    throw new AppError('Invalid account type', { cause: type });
  }
}

function sanitizeName(name: string): string {
  const isInvalid =
    typeof name !== 'string' || name.trim().length === 0 || name.length > 100;
  if (isInvalid) {
    throw new AppError('Invalid account name', { cause: name });
  }
  return name.trim();
}

function sanitizeSubType(subType?: string | null): string | null {
  if (!subType) {
    return null;
  }
  const isInvalid =
    typeof subType !== 'string' ||
    subType.trim().length === 0 ||
    subType.length > 100;
  if (isInvalid) {
    throw new AppError('Invalid account sub type', { cause: subType });
  }
  return subType.trim();
}

function make(payload: TCreationOmits<IAccount>): IAccount {
  const isValidCurrencyCode = currencyValue.isValidCode(payload.currencyCode);

  if (!isValidCurrencyCode) {
    throw new AppError('Invalid currency code', {
      cause: payload,
    });
  }
  const timestamp = new Date();

  return Object.freeze({
    id: generateUUID(),
    userId: payload.userId,
    name: sanitizeName(payload.name),
    type: payload.type,
    subType: sanitizeSubType(payload.subType),
    currencyCode: payload.currencyCode,
    status: EAccountStatus.Active,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });
}

function getBalance({ type, totalCredit, totalDebit }: IGetBalanceParams) {
  switch (type) {
    case ELedgerAccountType.Asset:
    case ELedgerAccountType.Expense:
      return moneyValue.subtract(totalDebit, totalCredit);

    case ELedgerAccountType.Liability:
    case ELedgerAccountType.Equity:
    case ELedgerAccountType.Revenue:
      return moneyValue.subtract(totalCredit, totalDebit);
  }
}

function update(
  account: IAccount,
  payload: Pick<IAccount, 'name' | 'subType' | 'currencyCode'>
): IAccount {
  if (payload.currencyCode) {
    const isValidCode = currencyValue.isValidCode(payload.currencyCode);

    if (!isValidCode) {
      throw new AppError('Invalid currency code', {
        cause: payload,
      });
    }
  }

  return Object.freeze({
    ...account,
    name: payload.name ? sanitizeName(payload.name) : account.name,
    subType: payload.subType
      ? sanitizeSubType(payload.subType)
      : account.subType,
    currencyCode: payload.currencyCode || account.currencyCode,
    updatedAt: new Date(),
  });
}

function archive(account: IAccount) {
  return Object.freeze({
    ...account,
    status: EAccountStatus.Archived,
    updatedAt: new Date(),
  });
}

function unarchive(account: IAccount) {
  return Object.freeze({
    ...account,
    status: EAccountStatus.Active,
    updatedAt: new Date(),
  });
}

const accountEntity = Object.freeze({
  make,
  getBalance,
  update,
  archive,
  unarchive,
  validateAccountType,
});

export default accountEntity;
