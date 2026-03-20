import stringUtils from '../../../../shared/utils/string';
import { AppError } from '../../../../shared/value-objects/error';
import {
  ETransactionStatus,
  ETransactionType,
  ITransaction,
  UTransactionStatus,
  UTransactionType,
} from '../../types/transaction.types';

// ========= START: TRANSACTION ITEM VALIDATORS ==============

// ========= END: TRANSACTION ITEM VALIDATORS ==============

// ========= START: TRANSACTION VALIDATORS ==============

function doesNotRequireItem(type: UTransactionType) {
  return (
    [ETransactionType.Transfer, ETransactionType.Journal] as string[]
  ).includes(type);
}

function validateItems(type: UTransactionType, itemsLength: number) {
  if (doesNotRequireItem(type) && itemsLength > 0) {
    throw new AppError(`${type} transactions do not require items`, {
      cause: { type, itemsLength },
    });
  }
}

/**
 * Validates if the transaction type is valid.
 */
function validateType(type: UTransactionType) {
  const isInvalid = !Object.values(ETransactionType).includes(type);

  if (isInvalid) {
    throw new AppError('Invalid transaction type', { cause: type });
  }
}

/**
 * Validates if the created by is a string.
 */
function validateCreatedBy(createdBy: string) {
  if (typeof createdBy !== 'string') {
    throw new AppError('Invalid created by', { cause: createdBy });
  }
}

/**
 * Validates if the account id is a string.
 */
function validateAccountId(accountId: string) {
  if (typeof accountId !== 'string') {
    throw new AppError('Invalid account id', { cause: accountId });
  }
}

/**
 * Validates if the exchange rate is a number.
 */
function validateExchangeRate(exchangeRate: number) {
  const isValid =
    typeof exchangeRate === 'number' &&
    exchangeRate > 0 &&
    !Number.isNaN(exchangeRate);

  if (!isValid) {
    throw new AppError('Invalid exchange rate', { cause: exchangeRate });
  }
}

/**
 * Validates recipient account id
 */
function validateRecipientAccountId(
  type: UTransactionType,
  id: ITransaction['recipientAccountId']
) {
  const isTransfer = type === ETransactionType.Transfer;

  if (!isTransfer) {
    if (id) {
      throw new AppError(
        'Recipient account id is not required for this transaction type',
        {
          cause: id,
        }
      );
    }
    return;
  }

  if (typeof id !== 'string' || !id.length) {
    throw new AppError('Invalid recipient account id', { cause: id });
  }
}

/**
 * Validates if the transaction status is valid.
 */
function isValidStatus(status: UTransactionStatus): boolean {
  return Object.values(ETransactionStatus).includes(status);
}

/**
 * Validates if the transaction status is valid.
 */
function validateTransactionStatus(status: UTransactionStatus) {
  const isValid = isValidStatus(status);

  if (!isValid) {
    throw new AppError('Invalid transaction status', { cause: status });
  }

  const isPermittedState = (
    [ETransactionStatus.Pending, ETransactionStatus.Posted] as string[]
  ).includes(status);

  if (!isPermittedState) {
    throw new AppError('Invalid transaction status', { cause: status });
  }
}

function sanitizeNote(note: string | null) {
  if (!note) {
    return null;
  }

  return stringUtils.sanitizeAndValidate(note, {
    min: 0,
    max: 255,
  });
}

// ========= END: TRANSACTION VALIDATORS ==============

function makeReference(): string {
  return `ref-${Date.now()}`;
}

function validateReference(reference: string) {
  if (typeof reference !== 'string' || !reference.startsWith('ref-')) {
    throw new AppError('Invalid transaction reference', { cause: reference });
  }
}

const transactionHelpers = Object.freeze({
  validateType,
  doesNotRequireItem,
  validateItems,
  validateCreatedBy,
  sanitizeNote,
  validateAccountId,
  validateExchangeRate,
  validateRecipientAccountId,
  validateTransactionStatus,
  makeReference,
  validateReference,
});

export default transactionHelpers;
