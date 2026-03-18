import { IMoney } from '../../../../shared/types/money.types';
import numberUtils from '../../../../shared/utils/number';
import { AppError } from '../../../../shared/value-objects/error';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { ICategory } from '../../../category/types/category.types';
import { ITransaction, ITransactionItem } from '../../types/transaction.types';

/**
 * Returns a sanitized name of an item or uses the category name if no name is provided.
 */
function getName(category: ICategory, name?: string) {
  if (!name) {
    return category.name;
  }
  if (typeof name !== 'string') {
    throw new AppError('Invalid item name', { cause: name });
  }
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 100) {
    throw new AppError('Invalid item name', { cause: name });
  }
  return trimmed;
}

function validatePriceAndUnitPrice(
  price: IMoney,
  quantity: number,
  unitPrice: IMoney | null
) {
  if (!unitPrice) {
    return moneyValue.validate(price);
  }

  moneyValue.validate(unitPrice);

  const isValidUnitPrice = moneyValue.equals(
    price,
    moneyValue.multiply(unitPrice, numberUtils.toFactor(quantity))
  );

  if (!isValidUnitPrice) {
    throw new AppError('Price and unit price do not match', {
      cause: { price, unitPrice },
    });
  }
}

/**
 * Validates if the transaction items amount matches the transaction amount.
 */
function validateItemsAmount(
  items: ITransactionItem[],
  transaction: Pick<ITransaction, 'amount' | 'functionalCurrencyAmount'>
) {
  const { amount: trxAmount, functionalCurrencyAmount: trxFAmount } =
    transaction;

  const totalItemsAmount = moneyValue.add(...items.map((item) => item.amount));

  const isValidAmount = moneyValue.equals(totalItemsAmount, trxAmount);
  if (!isValidAmount) {
    throw new AppError('Total items amount does not match transaction amount', {
      cause: { totalItemsAmount, transactionAmount: trxAmount },
    });
  }

  const totalItemsFunctionalCurrencyAmount = moneyValue.add(
    ...items.map((item) => item.functionalCurrencyAmount)
  );

  const isValidFunctionalAmount = moneyValue.equals(
    totalItemsFunctionalCurrencyAmount,
    trxFAmount
  );

  if (!isValidFunctionalAmount) {
    throw new AppError(
      'Total items functional currency amount does not match transaction functional currency amount',
      {
        cause: {
          totalItemsFunctionalCurrencyAmount,
          transactionFunctionalCurrencyAmount: trxFAmount,
        },
      }
    );
  }
}

const transactionItemHelpers = Object.freeze({
  getName,
  validatePriceAndUnitPrice,
  validateItemsAmount,
});

export default transactionItemHelpers;
