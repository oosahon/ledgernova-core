import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import deepFreeze from '../../../shared/utils/deep-freeze';
import generateUUID from '../../../shared/utils/uuid-generator';
import { ITransaction, ITransactionItem } from '../types/transaction.types';
import transactionItemEntity from './transaction-item.entity';
import helpers from './helpers/transaction.helpers';
import dateUtils from '../../../shared/utils/date';
import moneyValue from '../../../shared/value-objects/money.vo';
import transactionEvents from './events/transaction.events';
import { TEntityWithEvents } from '../../../shared/types/event.types';

interface IMakeItemPayload extends TCreationOmits<
  ITransactionItem,
  'name' | 'transactionId'
> {
  name?: string;
}

/**
 * Creates a transaction with at least one transaction item.
 *  - No transaction item is created for transfer transaction.
 *  - Transactions are created without attachments initially.
 *    To add an attachment, call the makeTransactionAttachments() function
 */
function make(
  payload: TCreationOmits<ITransaction>,
  itemsPayload: IMakeItemPayload[]
): TEntityWithEvents<ITransaction, ITransaction | ITransactionItem> {
  helpers.validateItems(payload.type, itemsPayload.length);
  helpers.validateType(payload.type);
  helpers.validateCreatedBy(payload.createdBy);
  helpers.validateAccountId(payload.accountId);
  helpers.validateTransactionStatus(payload.status);
  moneyValue.validate(payload.amount);
  moneyValue.validate(payload.functionalCurrencyAmount);
  dateUtils.validateDateIsNotInTheFuture(payload.date);
  helpers.validateRecipientAccountId(payload.type, payload.recipientAccountId);
  helpers.validateExchangeRate(payload.exchangeRate);

  const timestamp = new Date();

  const transactionWithoutItems: ITransaction = {
    id: generateUUID(),
    status: payload.status,
    createdBy: payload.createdBy,
    type: payload.type,
    accountId: payload.accountId,
    amount: payload.amount,
    attachmentIds: [],
    date: payload.date,
    functionalCurrencyAmount: payload.functionalCurrencyAmount,
    recipientAccountId: payload.recipientAccountId,
    exchangeRate: payload.exchangeRate,
    note: helpers.sanitizeNote(payload.note),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    items: null,
  };

  const trxEvents = transactionEvents.created(transactionWithoutItems);

  // =========== transactions that do not require items (eg transfer transactions) ===========
  const doesNotRequireItem = helpers.doesNotRequireItem(payload.type);
  if (doesNotRequireItem) {
    const entity = deepFreeze<ITransaction>(transactionWithoutItems);
    return [entity, [trxEvents]];
  }

  // =========== transactions that require items (eg sales, purchases) ===========
  const itemsWithEvents = itemsPayload.map((item) =>
    transactionItemEntity.make(
      transactionWithoutItems.id,
      transactionWithoutItems.type,
      transactionWithoutItems.createdAt,
      item
    )
  );

  const transactionItems = itemsWithEvents.map(([item]) => item);

  transactionItemEntity.validateItemsAmount(transactionItems, {
    amount: transactionWithoutItems.amount,
    functionalCurrencyAmount: transactionWithoutItems.functionalCurrencyAmount,
  });

  const transactionItemEvents = itemsWithEvents.flatMap(
    ([_, events]) => events
  );

  const transaction = deepFreeze<ITransaction>({
    ...transactionWithoutItems,
    items: transactionItems,
  });

  return [transaction, [trxEvents, ...transactionItemEvents]];
}

const transactionEntity = Object.freeze({
  make,
  ...helpers,
});

export default transactionEntity;
