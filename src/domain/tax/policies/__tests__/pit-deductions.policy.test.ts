import { AppError } from '../../../../shared/value-objects/error';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { ITransactionItem } from '../../../transaction/types/transaction.types';
import taxKeyValue from '../../value-objects/tax-keys.vo';
import { ITransactionItemWithPITUserInput } from '../../types/pit.types';
import policy from '../pit-deductions.policy';

describe('Nigeria Tax Act (NTA) 2025 Deductions Policy', () => {
  const currency = {
    code: 'NGN',
    minorUnit: 2n,
    symbol: '₦',
    name: 'Naira',
  };

  const createItem = (
    taxKey: string,
    amountValue: number,
    userInput?: any
  ): ITransactionItemWithPITUserInput => {
    return {
      category: {
        taxKey,
      },
      functionalCurrencyAmount: moneyValue.make(amountValue, currency, false),
      ...(userInput ? { userInput } : {}),
    } as unknown as ITransactionItemWithPITUserInput;
  };

  describe('fullyDeductible', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => policy.fullyDeductible([])).toThrow(AppError);
      expect(() => policy.fullyDeductible([])).toThrow(
        'Provide at least one transaction item'
      );
    });

    it('should filter only applicable items and sum their total properly', () => {
      const pensionItem = createItem(
        taxKeyValue.payment.pensionContribution,
        1000
      );
      const nhfItem = createItem(taxKeyValue.payment.nhfContribution, 1500);
      const nhisItem = createItem(taxKeyValue.expense.nhisContribution, 2000);
      const lifeInsuranceItem = createItem(
        taxKeyValue.expense.lifeInsurance,
        2500
      );
      const healthInsuranceItem = createItem(
        taxKeyValue.expense.healthInsurance,
        3000
      );
      const nonDeductibleItem = createItem('expense:other', 5000);

      const items = [
        pensionItem,
        nhfItem,
        nhisItem,
        lifeInsuranceItem,
        healthInsuranceItem,
        nonDeductibleItem,
      ];

      const result = policy.fullyDeductible(items);

      expect(result.transactionItems).toHaveLength(5);
      expect(result.transactionItems).not.toContain(nonDeductibleItem);

      // Expected total: 1000 + 1500 + 2000 + 2500 + 3000 = 10000
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(10000, currency, false)
      );
    });

    it('should return zero deductible amount and empty array if no applicable items exist', () => {
      const nonDeductibleItem = createItem('expense:other', 5000);
      const items = [nonDeductibleItem];

      const result = policy.fullyDeductible(items);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(0, currency, false)
      );
    });
  });

  describe('rentPolicy', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => policy.rentPolicy([])).toThrow(AppError);
    });

    it('should sum rent items properly when under 500k NG', () => {
      const rentItem1 = createItem(taxKeyValue.expense.rent, 100000);
      const rentItem2 = createItem(taxKeyValue.expense.rent, 350000);
      const nonDeductibleItem = createItem('expense:other', 100000);

      const items = [rentItem1, rentItem2, nonDeductibleItem];

      const result = policy.rentPolicy(items);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.transactionItems).not.toContain(nonDeductibleItem);

      // Expected total: 100k + 350k = 450k
      // 20% of 450k = 90k
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(90000, currency, false)
      );
    });

    it('should cap rent deduction at 500k NGN even if 20% of rent items exceed 500k', () => {
      const rentItem1 = createItem(taxKeyValue.expense.rent, 2000000);
      const rentItem2 = createItem(taxKeyValue.expense.rent, 1000000); // sum: 3,000,000

      const result = policy.rentPolicy([rentItem1, rentItem2]);

      expect(result.transactionItems).toHaveLength(2);
      // 20% of 3m is 600k, capped at 500k
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(500000, currency, false)
      );
    });

    it('should handle zero rent correctly', () => {
      const nonDeductibleItem = createItem('expense:other', 100000);
      const result = policy.rentPolicy([nonDeductibleItem]);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(0, currency, false)
      );
    });
  });

  describe('interestOnOwnerOccupiedHomePolicy', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => policy.interestOnOwnerOccupiedHomePolicy([])).toThrow(
        AppError
      );
    });

    it('should include all interest items by default', () => {
      const interestItem1 = createItem(
        taxKeyValue.expense.interestOnOwnerOccupiedHouseLoan,
        150000
      );
      const interestItem2 = createItem(
        taxKeyValue.expense.interestOnOwnerOccupiedHouseLoan,
        200000
      );
      const nonDeductibleItem = createItem('expense:other', 100000);

      const items = [interestItem1, interestItem2, nonDeductibleItem];

      const result = policy.interestOnOwnerOccupiedHomePolicy(items);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.transactionItems).toContain(interestItem1);
      expect(result.transactionItems).toContain(interestItem2);

      // Expected total: 150k + 200k = 350k
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(350000, currency, false)
      );
    });

    it('should exclude items explicitly marked as not owner-occupied', () => {
      const includeItem = createItem(
        taxKeyValue.expense.interestOnOwnerOccupiedHouseLoan,
        150000
      );
      const excludeItem = createItem(
        taxKeyValue.expense.interestOnOwnerOccupiedHouseLoan,
        200000,
        { ownerOccupiedHome: false }
      );

      const items = [includeItem, excludeItem];

      const result = policy.interestOnOwnerOccupiedHomePolicy(items);

      expect(result.transactionItems).toHaveLength(1);
      expect(result.transactionItems).toContain(includeItem);
      expect(result.transactionItems).not.toContain(excludeItem);

      expect(result.deductibleAmount).toEqual(
        moneyValue.make(150000, currency, false)
      );
    });

    it('should include items explicitly marked as owner-occupied or where userInput is missing', () => {
      const explicitYesItem = createItem(
        taxKeyValue.expense.interestOnOwnerOccupiedHouseLoan,
        150000,
        { ownerOccupiedHome: true }
      );
      const missingPropItem = createItem(
        taxKeyValue.expense.interestOnOwnerOccupiedHouseLoan,
        100000,
        {}
      );

      const items = [explicitYesItem, missingPropItem];

      const result = policy.interestOnOwnerOccupiedHomePolicy(items);

      expect(result.transactionItems).toHaveLength(2);

      expect(result.deductibleAmount).toEqual(
        moneyValue.make(250000, currency, false)
      );
    });
  });

  describe('getApplicable (Internal)', () => {
    it('should throw an error if no tax keys are provided', () => {
      const item = createItem(taxKeyValue.expense.rent, 100);
      expect(() => policy.getApplicable([], [item])).toThrow(AppError);
      expect(() => policy.getApplicable([], [item])).toThrow(
        'Provide at least one tax key'
      );
    });

    it('should filter items based on applicable tax keys', () => {
      const item1 = createItem(taxKeyValue.payment.pensionContribution, 1000);
      const item2 = createItem(taxKeyValue.expense.rent, 2000);
      const item3 = createItem('expense:other', 3000);

      const items = [item1, item2, item3];
      const keys = [
        taxKeyValue.payment.pensionContribution,
        taxKeyValue.expense.rent,
      ];

      const result = policy.getApplicable(keys, items);

      expect(result).toHaveLength(2);
      expect(result).toContain(item1);
      expect(result).toContain(item2);
      expect(result).not.toContain(item3);
    });
  });
});
