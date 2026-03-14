import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import { AppError } from '../../../shared/value-objects/error';
import accountEntity from '../../account/entities/account.entity';
import { IJournalEntry } from '../types/journal-entry.types';
import currencyValue from '../../../shared/value-objects/currency.vo';
import {
  ETransactionDirection,
  UTransactionDirection,
} from '../../transaction/types/transaction.types';

function validateDirection(direction: UTransactionDirection) {
  const isInvalidDirection = ![
    ETransactionDirection.Debit,
    ETransactionDirection.Credit,
  ].includes(direction);

  if (isInvalidDirection) {
    throw new AppError('Invalid direction', {
      cause: direction,
    });
  }
}

function validateAmount(amount: bigint) {
  if (amount <= 0n) {
    throw new AppError('Invalid amount', {
      cause: amount,
    });
  }
  const parsedAmount = Number(amount);

  const isInvalidAmount =
    !Number.isSafeInteger(parsedAmount) || parsedAmount < 0;

  if (isInvalidAmount) {
    throw new AppError('Invalid amount', {
      cause: amount,
    });
  }
}

function validateDescription(description: string) {
  if (!description || typeof description !== 'string') {
    throw new AppError('Invalid description', {
      cause: description,
    });
  }

  const trimmed = description.trim();

  if (trimmed.length > 255) {
    throw new AppError('Description too long', {
      cause: description,
    });
  }

  return trimmed;
}

function isValidPostedAt(postedAt: Date | null) {
  if (!postedAt) {
    return true;
  }

  if (!(postedAt instanceof Date)) {
    return false;
  }

  const isInTheFuture = postedAt.getTime() > Date.now();

  return !isInTheFuture;
}

function validatePostedAt(postedAt: Date | null) {
  if (!isValidPostedAt(postedAt)) {
    throw new AppError('Posting date cannot be in the future', {
      cause: postedAt,
    });
  }
}

// Separated the direction from the payload for explicitness
function make(
  direction: UTransactionDirection,
  payload: TCreationOmits<IJournalEntry, 'direction'>
): IJournalEntry {
  validateDirection(direction);
  accountEntity.validateAccountType(payload.ledgerAccountType);
  validateAmount(payload.amount);
  validateAmount(payload.functionalAmount);
  currencyValue.validateCode(payload.currencyCode);
  validateDescription(payload.description);
  validatePostedAt(payload.postedAt);

  const timestamps = new Date();

  return Object.freeze({
    id: generateUUID(),
    direction,
    ledgerAccountType: payload.ledgerAccountType,
    accountId: payload.accountId,
    transactionId: payload.transactionId,
    amount: payload.amount,
    currencyCode: payload.currencyCode,
    functionalAmount: payload.functionalAmount,
    description: payload.description.trim(),
    postedAt: payload.postedAt,
    createdAt: timestamps,
    updatedAt: timestamps,
  });
}

const journalEntriesEntity = Object.freeze({
  make,
  validatePostedAt,
  isValidPostedAt,
});

export default journalEntriesEntity;
