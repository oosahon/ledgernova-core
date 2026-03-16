import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import deepFreeze from '../../../shared/utils/deep-freeze';
import generateUUID from '../../../shared/utils/uuid-generator';
import { AppError } from '../../../shared/value-objects/error';
import { ITransaction, ITransactionItem } from '../types/transaction.types';
import transactionItemEntity from './transaction-item.entity';
import helpers from './helpers/transaction.helpers';

interface IMakeItemPayload extends TCreationOmits<
  ITransactionItem,
  'name' | 'transactionId'
> {
  name?: string;
}

/**
 * Adds transaction items to an existing transaction.
 *  - No transaction item should be created for transfer transaction.
 */
function addItems(
  transaction: Omit<ITransaction, 'items'>,
  itemsPayload: IMakeItemPayload[]
): ITransaction {
  if (!itemsPayload || itemsPayload.length === 0) {
    throw new AppError('Transaction items are required', {
      cause: itemsPayload,
    });
  }

  const items = itemsPayload.map((item) =>
    transactionItemEntity.make(transaction.id, transaction.createdAt, item)
  );

  transactionItemEntity.validateItemsAmount(items, transaction.amount);

  return deepFreeze<ITransaction>({
    ...transaction,
    items,
  });
}

/**
 * Creates a transaction with at least one transaction item.
 *  - No transaction item is created for transfer transaction.
 *  - Transactions are created without attachments initially.
 *    To add an attachment, call the makeTransactionAttachments() function
 */
function make(
  transactionPayload: TCreationOmits<ITransaction>,
  itemsPayload: IMakeItemPayload[]
): ITransaction {
  helpers.validateMakePayload(transactionPayload, itemsPayload.length);

  const transactionId = generateUUID();
  const timestamp = new Date();

  const transactionWithoutItems: ITransaction = {
    id: transactionId,
    status: transactionPayload.status,
    createdBy: transactionPayload.createdBy,
    type: transactionPayload.type,
    accountId: transactionPayload.accountId,
    amount: transactionPayload.amount,
    attachmentIds: [],
    date: transactionPayload.date,
    recipientAccountId: transactionPayload.recipientAccountId,
    exchangeRate: transactionPayload.exchangeRate,
    note: helpers.sanitizeNote(transactionPayload.note),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    items: null,
  };

  const doesNotRequireItem = helpers.doesNotRequireItem(
    transactionPayload.type
  );

  if (doesNotRequireItem) {
    return deepFreeze<ITransaction>(transactionWithoutItems);
  }

  return addItems(transactionWithoutItems, itemsPayload);
}

const transactionEntity = Object.freeze({
  make,
  ...helpers,
});

export default transactionEntity;
