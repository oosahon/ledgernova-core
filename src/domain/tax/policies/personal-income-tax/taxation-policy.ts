/**
 * ================ DOMAIN: individual ====================
 *  ⚠️ WARNING ⚠️
 * This policy covers personal income tax advisory under the Nigeria Tax Act (NTA) 2025.
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 *
 * As much as the sole trader's tax is similar to the individual's,
 * this policy only covers that of the individuals for simplicity's sake.
 *
 * Changes to this code must comply with the Nigeria Tax Act (NTA) 2025.
 *
 //TODO: Add support for aggregation. Eg an individual may have recorded
 *         the sale of one vehicle in three separate transactions.
 *         If not properly aggregated, the tax calculation will be incorrect.
 *
 */

import { AppError } from '../../../../shared/value-objects/error';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { ITransactionItem } from '../../../transaction/types/transaction.types';
import {
  IPersonalIncomeTaxationPolicy,
  ITransactionItemWithPromptResponse,
} from '../../types/personal-income-tax.types';
import taxKeyValue from '../../value-objects/tax-keys.vo';
import {
  SYSTEM_PERSONAL_TAX_KEYS,
  SYSTEM_PERSONAL_TAX_KEYS_COMBINED,
} from './categorizations';

function validateItemsLength(items: ITransactionItem[]) {
  if (!items.length) {
    throw new AppError('Provide at least one transaction item', {
      cause: items,
    });
  }
}

function getZeroAmount(items: ITransactionItemWithPromptResponse[]) {
  return moneyValue.makeZeroAmount(items[0].functionalCurrencyAmount.currency);
}

/**
 * Filters transaction items to get the ones that are applicable to the tax policy
 */
function getApplicable(
  taxKeys: string[],
  items: ITransactionItemWithPromptResponse[]
) {
  return items.filter((item) =>
    taxKeys.includes(taxKeyValue.getBaseTaxKey(item.category.taxKey))
  );
}

/**
 * This policy applies to transactions that are taxable
 *  - All income generation transactions not explicitly exempted
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function genericTaxable(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeTaxationPolicy {
  validateItemsLength(items);

  const excludedKeys = Object.values(SYSTEM_PERSONAL_TAX_KEYS_COMBINED);

  const applicableItems = items.filter(
    (item) => !excludedKeys.includes(item.category.taxKey)
  );

  const zeroAmount = getZeroAmount(items);

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    taxableAmount: totalAmount,
    taxCredits: zeroAmount,
    withholdingTax: zeroAmount,
  });
}

/**
 * This policy applies to transactions that are fully exempt
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function fullyExempt(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeTaxationPolicy {
  validateItemsLength(items);
  const zeroAmount = getZeroAmount(items);
  const applicableTaxKeys = [
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.taxRefund,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.gift,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.lifeInsurance,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.pensionPRA,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.retirementBenefit,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.deathGratuity,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.compensationLossOfEmployment,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.saleOfOwnerOccupiedHome,
  ];

  const applicableItems = getApplicable(applicableTaxKeys, items);

  const totalExemptAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );
  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    taxableAmount: moneyValue.subtract(totalAmount, totalExemptAmount),
    taxCredits: zeroAmount,
    withholdingTax: zeroAmount,
  });
}

/**
 * This policy applies to transactions that are partly exempt
 *  - Exemption of ₦5,000,000 on the sale of personal effects
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function personalEffectSale(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeTaxationPolicy {
  validateItemsLength(items);
  const zeroAmount = getZeroAmount(items);
  const applicableItems = getApplicable(
    [SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfPersonalEffects],
    items
  );

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  const cap = moneyValue.make(5_000_000, totalAmount.currency, false);

  const isGreaterThanCap = moneyValue.isGreaterThan(totalAmount, cap);

  const taxableAmount = isGreaterThanCap
    ? moneyValue.subtract(totalAmount, cap)
    : zeroAmount;

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    taxableAmount,
    taxCredits: zeroAmount,
    withholdingTax: zeroAmount,
  });
}

/**
 * This policy applies to the sale of an individual's PRIVATE vehicles
 * 💡 Because it's not explicitly stated which two vehicles will be exempted,
 *    we have taken the liberty to pick the two most expensive vehicles.
 * 🚨 If a new directive is released, this policy will need to be updated.
 * ⚠️ TODO: Add support for aggregation. Eg an individual may have recorded
 *         the sale of one vehicle in three separate transactions.
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function personalVehicleSale(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeTaxationPolicy {
  validateItemsLength(items);
  const zeroAmount = getZeroAmount(items);
  const applicableItems = getApplicable(
    [SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles],
    items
  );

  if (!applicableItems.length) {
    return Object.freeze({
      transactionItems: [],
      totalAmount: zeroAmount,
      taxableAmount: zeroAmount,
      taxCredits: zeroAmount,
      withholdingTax: zeroAmount,
    });
  }

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  if (applicableItems.length < 3) {
    return Object.freeze({
      transactionItems: applicableItems,
      totalAmount,
      taxableAmount: zeroAmount,
      taxCredits: zeroAmount,
      withholdingTax: zeroAmount,
    });
  }

  const [firstMostExpensive, secondMostExpensive] = moneyValue.sortDescending(
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  const sumOfTwoMostExpensive = moneyValue.add(
    firstMostExpensive,
    secondMostExpensive
  );

  const taxableAmount = moneyValue.subtract(totalAmount, sumOfTwoMostExpensive);

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    taxableAmount,
    taxCredits: zeroAmount,
    withholdingTax: zeroAmount,
  });
}

/**
 * This policy applies to transactions that are subject to WHT
 *  - WHT is final tax: 10%
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function finalWithholdingTaxAPolicy(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeTaxationPolicy {
  validateItemsLength(items);
  const zeroAmount = getZeroAmount(items);
  const applicableItems = getApplicable(
    [
      SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.royalties,
      SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.dividends,
      SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.interest,
    ],
    items
  );

  if (!applicableItems.length) {
    return Object.freeze({
      transactionItems: [],
      totalAmount: zeroAmount,
      taxableAmount: zeroAmount,
      taxCredits: zeroAmount,
      withholdingTax: zeroAmount,
    });
  }

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  // We are leaving out the remainder for safe measures
  // it's rather inconsequential; matter 0.3 kobo at most
  const { value: beforeWithholdingTax, remainder: _ } = moneyValue.divide(
    totalAmount,
    {
      numerator: 90, // using 90 for precision purposes
      denominator: 100,
    }
  );

  const withholdingTax = moneyValue.multiply(beforeWithholdingTax, {
    numerator: 10,
    denominator: 100,
  });

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    taxableAmount: zeroAmount,
    taxCredits: zeroAmount,
    withholdingTax,
  });
}

/**
 * This policy applies to transactions that are subject to WHT
 *  - WHT is not final tax: 10%
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function nonFinalWithholdingTaxAPolicy(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeTaxationPolicy {
  validateItemsLength(items);
  const zeroAmount = getZeroAmount(items);
  const applicableItems = getApplicable(
    [SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.rentalToOrganization],
    items
  );

  if (!applicableItems.length) {
    return Object.freeze({
      transactionItems: [],
      totalAmount: zeroAmount,
      taxableAmount: zeroAmount,
      taxCredits: zeroAmount,
      withholdingTax: zeroAmount,
    });
  }

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  // We are leaving out the remainder for safe measures
  // it's rather inconsequential; matter 0.3 kobo at most
  const { value: beforeWithholdingTax, remainder: _ } = moneyValue.divide(
    totalAmount,
    {
      numerator: 90, // using 90 for precision purposes
      denominator: 100,
    }
  );

  const taxCredits = moneyValue.multiply(beforeWithholdingTax, {
    numerator: 10,
    denominator: 100,
  });

  const withholdingTax = moneyValue.multiply(beforeWithholdingTax, {
    numerator: 10,
    denominator: 100,
  });

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    taxableAmount: beforeWithholdingTax,
    taxCredits,
    withholdingTax,
  });
}

const personalIncomeTaxationPolicy = Object.freeze({
  genericTaxable,
  fullyExempt,
  personalEffectSale,
  personalVehicleSale,
  finalWithholdingTaxAPolicy,
  nonFinalWithholdingTaxAPolicy,
});

export default personalIncomeTaxationPolicy;
