import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import numberUtils from '../../../shared/utils/number';
import stringUtils from '../../../shared/utils/string';
import generateUUID from '../../../shared/utils/uuid-generator';
import accountEntity from '../../account/entities/account.entity';
import taxKeyValue from '../../tax/value-objects/tax-keys.vo';
import { ITransactionItem } from '../types/transaction.types';
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
  transactionDate: Date,
  payload: IMakePayload
): ITransactionItem {
  const safeQuantity = numberUtils.toNonNegativeNumber(payload.quantity);

  helpers.validatePriceAndUnitPrice(
    payload.price,
    safeQuantity,
    payload.unitPrice
  );
  stringUtils.validateUUID(transactionId);
  stringUtils.validateUUID(payload.category.id);
  taxKeyValue.validate(
    payload.category.taxKey,
    payload.category.ledgerAccountType
  );
  accountEntity.validateType(payload.category.ledgerAccountType);

  return Object.freeze({
    id: generateUUID(),
    name: helpers.getName(payload.category, payload.name),
    price: payload.price,
    quantity: safeQuantity,
    unitPrice: payload.unitPrice,
    transactionId,
    category: payload.category,
    isSystemGenerated: !payload.name,
    createdAt: transactionDate,
    updatedAt: transactionDate,
    deletedAt: null,
  });
}

const transactionItemEntity = Object.freeze({
  make,
  ...helpers,
});

export default transactionItemEntity;
