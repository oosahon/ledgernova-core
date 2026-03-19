import { AppError } from '../../../shared/value-objects/error';
import moneyValue from '../../../shared/value-objects/money.vo';
import { ITransactionItem } from '../../transaction/types/transaction.types';
import taxKeyValue from '../value-objects/tax-keys.vo';

function getApplicable(taxKeys: string[], items: ITransactionItem[]) {
  if (!taxKeys.length) {
    throw new AppError('Provide at least one tax key', {
      cause: taxKeys,
    });
  }

  return items.filter((item) =>
    taxKeys.includes(taxKeyValue.getBaseTaxKey(item.category.taxKey))
  );
}

function validateTrxItemsLength(items: ITransactionItem[]) {
  if (!items.length) {
    throw new AppError('Provide at least one transaction item', {
      cause: items,
    });
  }
}

function getZeroAmount(items: ITransactionItem[]) {
  return moneyValue.makeZeroAmount(items[0].functionalCurrencyAmount.currency);
}

function fullExemptionPolicy(items: ITransactionItem[]) {
  validateTrxItemsLength(items);

  const applicableTaxKeys = [
    taxKeyValue.payment.pensionContribution,
    taxKeyValue.payment.nhfContribution,
    taxKeyValue.payment.annuityPremium,

    taxKeyValue.receipt.taxRefund,
  ];

  const applicableItems = getApplicable(applicableTaxKeys, items);
}
