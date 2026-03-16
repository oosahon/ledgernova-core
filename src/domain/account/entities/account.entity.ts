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
import helpers from './helpers/account.helpers';

interface IGetBalanceParams {
  type: ULedgerAccountType;
  totalDebit: IMoney;
  totalCredit: IMoney;
}

function make(payload: TCreationOmits<IAccount>): IAccount {
  currencyValue.validateCode(payload.currencyCode);
  helpers.validateType(payload.type);

  const timestamp = new Date();

  return Object.freeze({
    id: generateUUID(),
    userId: payload.userId,
    name: helpers.sanitizeName(payload.name),
    type: payload.type,
    subType: helpers.sanitizeSubType(payload.subType),
    currencyCode: payload.currencyCode,
    status: EAccountStatus.Active,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });
}

function getBalance({ type, totalDebit, totalCredit }: IGetBalanceParams) {
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
    name: payload.name ? helpers.sanitizeName(payload.name) : account.name,
    subType: payload.subType
      ? helpers.sanitizeSubType(payload.subType)
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
  ...helpers,
});

export default accountEntity;
