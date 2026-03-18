/**
 * This policy covers personal income tax deductions under the Nigeria Tax Act (NTA) 2025.
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */

import { AppError } from '../../../../shared/value-objects/error';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { ITransactionItem } from '../../../transaction/types/transaction.types';
import { IPersonalIncomeTaxDeductionPolicy } from '../../types/tax-policy.types';
import taxKeyValue from '../../value-objects/tax-keys.vo';

/**
 * Filters transaction items to get the ones that are applicable to the tax policy
 */
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

function getZeroAmount(items: ITransactionItem[]) {
  return moneyValue.makeZeroAmount(items[0].functionalCurrencyAmount.currency);
}

function validateTrxItemsLength(items: ITransactionItem[]) {
  if (!items.length) {
    throw new AppError('Provide at least one transaction item', {
      cause: items,
    });
  }
}

/**
 * ========= Fully Deductible =========
 * This policy applies to transactions that are fully deductible
 *  - Pension Contributions
 *  - NHF Contributions
 *  - NHIS Contributions
 *  - Life Insurance
 *  - Health Insurance
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function fullyDeductible(
  items: ITransactionItem[]
): IPersonalIncomeTaxDeductionPolicy {
  validateTrxItemsLength(items);

  const applicableTaxKeys = [
    taxKeyValue.asset.pensionContribution,
    taxKeyValue.asset.nhfContribution,

    taxKeyValue.expense.nhisContribution,
    taxKeyValue.expense.lifeInsurance,
    taxKeyValue.expense.healthInsurance,
  ];

  const deductibleItems = getApplicable(applicableTaxKeys, items);

  const deductibleAmount = moneyValue.add(
    getZeroAmount(items),
    ...deductibleItems.map((item) => item.functionalCurrencyAmount)
  );

  return Object.freeze({
    transactionItems: deductibleItems,
    deductibleAmount,
  });
}

/**
 * ========= Rent =========
 * This policy covers rent expenses.
 *  - Rent expenses are deductible up to N500,000 per annum
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function rentPolicy(
  items: ITransactionItem[]
): IPersonalIncomeTaxDeductionPolicy {
  validateTrxItemsLength(items);

  const applicableTaxKeys = [taxKeyValue.expense.rent];
  const rentItems = getApplicable(applicableTaxKeys, items);

  const totalAmount = moneyValue.add(
    getZeroAmount(items),
    ...rentItems.map((item) => item.functionalCurrencyAmount)
  );
  const cap = moneyValue.make(500_000, totalAmount.currency, false);

  const deductibleAmount = moneyValue.min(cap, totalAmount);

  return Object.freeze({
    transactionItems: rentItems,
    deductibleAmount,
  });
}

const personalIncomeTaxDeductionPolicy = Object.freeze({
  fullyDeductible,
  rentPolicy,
  getApplicable,
});

export default personalIncomeTaxDeductionPolicy;
