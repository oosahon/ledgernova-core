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
import accountEvents from '../events/account.events';
import { TEntityWithEvents } from '../../../shared/types/event.types';

interface IGetBalanceParams {
  type: ULedgerAccountType;
  totalDebit: IMoney;
  totalCredit: IMoney;
}

/**
 * Creates a new account.
 * @param payload - The account payload.
 * @returns A tuple containing the account and the created event.
 */
function make(
  payload: TCreationOmits<IAccount>
): TEntityWithEvents<IAccount, IAccount> {
  currencyValue.validateCode(payload.currencyCode);
  helpers.validateType(payload.type);

  const timestamp = new Date();

  const account = Object.freeze({
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

  const event = accountEvents.created(account);
  return [account, [event]];
}

/**
 * Gets the balance of an account.
 */
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

/**
 * Updates an account.
 * @param account - The account to update.
 * @param payload - The account payload.
 * @returns A tuple containing the updated account and the updated event.
 */
function update(
  account: IAccount,
  payload: Pick<IAccount, 'name' | 'subType' | 'currencyCode'>
): TEntityWithEvents<IAccount, IAccount> {
  if (payload.currencyCode) {
    const isValidCode = currencyValue.isValidCode(payload.currencyCode);

    if (!isValidCode) {
      throw new AppError('Invalid currency code', {
        cause: payload,
      });
    }
  }

  const updatedAccount = Object.freeze({
    ...account,
    name: payload.name ? helpers.sanitizeName(payload.name) : account.name,
    subType: payload.subType
      ? helpers.sanitizeSubType(payload.subType)
      : account.subType,
    currencyCode: payload.currencyCode || account.currencyCode,
    updatedAt: new Date(),
  });

  const event = accountEvents.updated(account);
  return [updatedAccount, [event]];
}

/**
 * Archives an account idempotently.
 */
function archive(account: IAccount): TEntityWithEvents<IAccount, IAccount> {
  if (account.status === EAccountStatus.Archived) {
    return [account, []];
  }

  const archivedAccount = Object.freeze({
    ...account,
    status: EAccountStatus.Archived,
    updatedAt: new Date(),
  });

  const event = accountEvents.archived(archivedAccount);
  return [archivedAccount, [event]];
}

/**
 * Unarchives an account idempotently.
 */
function unarchive(account: IAccount): TEntityWithEvents<IAccount, IAccount> {
  if (account.status === EAccountStatus.Active) {
    return [account, []];
  }

  const unarchivedAccount = Object.freeze({
    ...account,
    status: EAccountStatus.Active,
    updatedAt: new Date(),
  });

  const event = accountEvents.unarchived(unarchivedAccount);
  return [unarchivedAccount, [event]];
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
