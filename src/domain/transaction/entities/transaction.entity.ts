import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import { AppError } from '../../../shared/value-objects/error';
import {
  ETransactionStatus,
  ETransactionType,
  ITransaction,
  UTransactionStatus,
  UTransactionType,
} from '../types/transaction.types';

function isValidTransactionType(type: UTransactionType) {
  return Object.values(ETransactionType).includes(type);
}

function validateType(type: UTransactionType) {
  if (!isValidTransactionType(type)) {
    throw new AppError('Invalid transaction type', {
      cause: type,
    });
  }
}

function validateCategoryId(
  transactionType: UTransactionType,
  category: string | null
) {
  const doesNotRequireCategory = [
    ETransactionType.Transfer,
    ETransactionType.Journal,
  ];

  if (doesNotRequireCategory.includes(transactionType)) {
    return;
  }

  if (!category) {
    throw new AppError('Invalid category', {
      cause: category,
    });
  }
}

function validateAccount(accountId: string) {
  if (!accountId || typeof accountId !== 'string') {
    throw new AppError('Invalid account id', {
      cause: accountId,
    });
  }
}

function validateRecipientAccount(
  transactionType: UTransactionType,
  recipientAccountId?: string | null
) {
  const isTransfer = transactionType === ETransactionType.Transfer;

  if (!isTransfer) {
    return;
  }

  if (!recipientAccountId || typeof recipientAccountId !== 'string') {
    throw new AppError('Invalid recipient account id', {
      cause: recipientAccountId,
    });
  }
}

function sanitizeNote(note: string | null) {
  if (!note || typeof note !== 'string') {
    return null;
  }

  const trimmed = note.trim();

  if (trimmed.length > 250) {
    throw new AppError('Note cannot be more than 250 characters', {
      cause: note,
    });
  }

  return trimmed;
}

function validateStatus(status: UTransactionStatus) {
  if (!Object.values(ETransactionStatus).includes(status)) {
    throw new AppError('Invalid transaction status', {
      cause: status,
    });
  }
}

function make(payload: TCreationOmits<ITransaction>): ITransaction {
  validateType(payload.type);
  validateCategoryId(payload.type, payload.categoryId);
  validateAccount(payload.accountId);
  validateRecipientAccount(payload.type, payload.recipientAccountId);
  validateStatus(payload.status);
  const note = sanitizeNote(payload.note);

  const timestamps = new Date();

  return Object.freeze({
    id: generateUUID(),
    createdBy: payload.createdBy,
    type: payload.type,
    accountId: payload.accountId,
    amount: payload.amount,
    currencyCode: payload.currencyCode,
    categoryId: payload.categoryId,
    attachmentIds: payload.attachmentIds,
    date: payload.date,
    recipientAccountId: payload.recipientAccountId,
    exchangeRate: payload.exchangeRate,
    status: payload.status,
    note,
    createdAt: timestamps,
    updatedAt: timestamps,
    deletedAt: null,
  });
}

const transactionEntity = Object.freeze({
  make,
});

export default transactionEntity;
