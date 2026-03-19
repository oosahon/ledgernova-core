import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import { AppError } from '../../../shared/value-objects/error';
import { IMoney } from '../../../shared/types/money.types';
import currencyEntity from '../../currency/entities/currency.entity';
import moneyValue from '../../../shared/value-objects/money.vo';
import {
  EAccountStatus,
  ELedgerAccountType,
  ILedgerAccount,
  ULedgerAccountType,
} from '../types/ledger-account.types';
import helpers from './helpers/ledger-account.helpers';
import ledgerAccountEvents from '../events/ledger-account.events';
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
  payload: TCreationOmits<ILedgerAccount>
): TEntityWithEvents<ILedgerAccount, ILedgerAccount> {
  currencyEntity.validateCode(payload.currencyCode);
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

  const event = ledgerAccountEvents.created(account);
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
  account: ILedgerAccount,
  payload: Pick<ILedgerAccount, 'name' | 'subType' | 'currencyCode'>
): TEntityWithEvents<ILedgerAccount, ILedgerAccount> {
  if (payload.currencyCode) {
    const isValidCode = currencyEntity.isValidCode(payload.currencyCode);

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

  const event = ledgerAccountEvents.updated(account);
  return [updatedAccount, [event]];
}

/**
 * Archives an account idempotently.
 */
function archive(
  account: ILedgerAccount
): TEntityWithEvents<ILedgerAccount, ILedgerAccount> {
  if (account.status === EAccountStatus.Archived) {
    return [account, []];
  }

  const archivedAccount = Object.freeze({
    ...account,
    status: EAccountStatus.Archived,
    updatedAt: new Date(),
  });

  const event = ledgerAccountEvents.archived(archivedAccount);
  return [archivedAccount, [event]];
}

/**
 * Unarchives an account idempotently.
 */
function unarchive(
  account: ILedgerAccount
): TEntityWithEvents<ILedgerAccount, ILedgerAccount> {
  if (account.status === EAccountStatus.Active) {
    return [account, []];
  }

  const unarchivedAccount = Object.freeze({
    ...account,
    status: EAccountStatus.Active,
    updatedAt: new Date(),
  });

  const event = ledgerAccountEvents.unarchived(unarchivedAccount);
  return [unarchivedAccount, [event]];
}

const ledgerAccountEntity = Object.freeze({
  make,
  getBalance,
  update,
  archive,
  unarchive,
  ...helpers,
});

export default ledgerAccountEntity;
