import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import numberUtils from '../../../shared/utils/number';
import stringUtils from '../../../shared/utils/string';
import generateUUID from '../../../shared/utils/uuid-generator';
import taxKeyValue from '../../tax/value-objects/tax-keys.vo';
import { ITransactionItem, UTransactionType } from '../types/transaction.types';
import transactionItemEvents from './events/transaction-item.events';
import helpers from './helpers/transaction-item.helpers';

interface IMakePayload extends TCreationOmits<
  ITransactionItem,
  'name' | 'transactionId'
> {
  name?: string;
}

/**
 * Create a transaction line item.
 *  - It is the economic event of the transaction.
 *  - It holds holds the category and amount, necessary for tax computation and reporting
 *  - If no item was provided, the transaction header itself will be treated as the item
 *    and the category name will be the name of the item.
 *      - system generated items are always flagged as isSystemGenerated = true
 *  - DO NOT MISTAKE TRANSACTION ITEMS FOR CATEGORIES
 */
function make(
  transactionId: string,
  transactionType: UTransactionType,
  transactionDate: Date,
  payload: IMakePayload
): TEntityWithEvents<ITransactionItem, ITransactionItem> {
  const safeQuantity = numberUtils.toNonNegativeNumber(payload.quantity);

  helpers.validatePriceAndUnitPrice(
    payload.amount,
    safeQuantity,
    payload.unitPrice
  );
  stringUtils.validateUUID(transactionId);
  stringUtils.validateUUID(payload.category.id);
  taxKeyValue.validate(payload.category.taxKey, transactionType);

  const item = Object.freeze({
    id: generateUUID(),
    name: helpers.getName(payload.category, payload.name),
    amount: payload.amount,
    functionalCurrencyAmount: payload.functionalCurrencyAmount,
    quantity: safeQuantity,
    unitPrice: payload.unitPrice,
    transactionId,
    category: payload.category,
    isSystemGenerated: !payload.name,
    createdAt: transactionDate,
    updatedAt: transactionDate,
    deletedAt: null,
  });

  const event = transactionItemEvents.created(item);
  return [item, [event]];
}

const transactionItemEntity = Object.freeze({
  make,
  ...helpers,
});

export default transactionItemEntity;
