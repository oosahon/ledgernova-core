/**
 *  ⚠️ WARNING ⚠️
 * This policy covers personal income tax deductions under the Nigeria Tax Act (NTA) 2025.
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 *
 * Changes to this code must comply with the Nigeria Tax Act (NTA) 2025.
 */
import { AppError } from '../../../../shared/value-objects/error';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { ITransactionItemWithPromptResponse } from '../../types/personal-income-tax.types';
import { IPersonalIncomeDeductionPolicy } from '../../types/personal-income-tax.types';
import taxKeyValue from '../../value-objects/tax-keys.vo';
import { SYSTEM_PERSONAL_TAX_KEYS } from './categorizations';

/**
 * Filters transaction items to get the ones that are applicable to the tax policy
 */
function getApplicable(
  taxKeys: string[],
  items: ITransactionItemWithPromptResponse[]
) {
  if (!taxKeys.length) {
    throw new AppError('Provide at least one tax key', {
      cause: taxKeys,
    });
  }

  return items.filter((item) =>
    taxKeys.includes(taxKeyValue.getBaseTaxKey(item.category.taxKey))
  );
}

function getZeroAmount(items: ITransactionItemWithPromptResponse[]) {
  return moneyValue.makeZeroAmount(items[0].functionalCurrencyAmount.currency);
}

function validateTrxItemsLength(items: ITransactionItemWithPromptResponse[]) {
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
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeDeductionPolicy {
  validateTrxItemsLength(items);
  const zeroAmount = getZeroAmount(items);

  const applicableTaxKeys = [
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.pensionContribution,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.nhfContribution,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.nhisContribution,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.annuityPremium,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.healthInsurance,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.lifeInsurance,
  ];

  const applicableItems = getApplicable(applicableTaxKeys, items);

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  const deductibleAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    deductibleAmount,
  });
}

/**
 * ========= Rent =========
 * This policy covers rent expenses.
 *  - Rent expenses are deductible: 20% of rent amount, up to N500,000 per annum
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function rentPolicy(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeDeductionPolicy {
  validateTrxItemsLength(items);
  const zeroAmount = getZeroAmount(items);

  const applicableTaxKeys = [SYSTEM_PERSONAL_TAX_KEYS.deductiblePartly.rent];
  const applicableItems = getApplicable(applicableTaxKeys, items);

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...applicableItems.map((item) => item.functionalCurrencyAmount)
  );

  const twentyPercent = moneyValue.multiply(totalAmount, {
    numerator: 20,
    denominator: 100,
  });

  const cap = moneyValue.make(500_000, totalAmount.currency, false);

  const deductibleAmount = moneyValue.min(cap, twentyPercent);

  return Object.freeze({
    transactionItems: applicableItems,
    totalAmount,
    deductibleAmount,
  });
}

/**
 * ========= Interest On Owner Occupied Home =========
 * This policy covers interest on owner-occupied home expenses.
 *  - by default, all interest on owner-occupied home expenses are deductible
 *  - if the user explicitly states that the home is not owner-occupied,
 *     then the interest on owner-occupied home expenses are not deductible
 * See public/Nigeria-Tax-Act-2025.pdf for more information.
 */
function interestOnOwnerOccupiedHomePolicy(
  items: ITransactionItemWithPromptResponse[]
): IPersonalIncomeDeductionPolicy {
  validateTrxItemsLength(items);
  const zeroAmount = getZeroAmount(items);

  const applicableTaxKeys = [
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.interestOnOwnerOccupiedHouseLoan,
  ];
  const applicableItems = getApplicable(applicableTaxKeys, items);

  // We prompt the user to answer if the house is owner-occupied
  // if the user explicitly states that the house is not owner-occupied,
  // then the interest on owner-occupied home expenses are not deductible
  const itemsWithoutExplicitNo = applicableItems.filter(
    (item) => item.individualTaxPromptResponse?.ownerOccupiedHome !== false
  );

  const totalAmount = moneyValue.add(
    zeroAmount,
    ...itemsWithoutExplicitNo.map((item) => item.functionalCurrencyAmount)
  );

  return Object.freeze({
    transactionItems: itemsWithoutExplicitNo,
    totalAmount,
    deductibleAmount: totalAmount,
  });
}

const personalIncomeTaxDeductionPolicy = Object.freeze({
  fullyDeductible,
  rentPolicy,
  getApplicable,
  interestOnOwnerOccupiedHomePolicy,
});

export default personalIncomeTaxDeductionPolicy;
