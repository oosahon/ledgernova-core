import { AppError } from '../../../../../shared/value-objects/error';
import moneyValue from '../../../../../shared/value-objects/money.vo';
import { ITransactionItem } from '../../../../transaction/types/transaction.types';
import taxKeyValue from '../../../value-objects/tax-keys.vo';
import policy from '../deductions.policy';

describe('Nigeria Tax Act (NTA) 2025 Deductions Policy', () => {
  const currency = {
    code: 'NGN',
    minorUnit: 2n,
    symbol: '₦',
    name: 'Naira',
  };

  const createItem = (
    taxKey: string,
    amountValue: number
  ): ITransactionItem => {
    return {
      category: {
        taxKey,
      },
      functionalCurrencyAmount: moneyValue.make(amountValue, currency, false),
    } as unknown as ITransactionItem; // Cast to unknown then to type to satisfy strict typing cleanly
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
        taxKeyValue.asset.pensionContribution,
        1000
      );
      const nhfItem = createItem(taxKeyValue.asset.nhfContribution, 1500);
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
      expect(result.deductibleAmount).toEqual(
        moneyValue.make(450000, currency, false)
      );
    });

    it('should cap rent deduction at 500k NGN even if rent items exceed 500k', () => {
      const rentItem1 = createItem(taxKeyValue.expense.rent, 300000);
      const rentItem2 = createItem(taxKeyValue.expense.rent, 250000); // sum: 550,000

      const result = policy.rentPolicy([rentItem1, rentItem2]);

      expect(result.transactionItems).toHaveLength(2);
      // It should still return all the rent items contributing, but cap the deductible amount
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

  describe('getApplicable (Internal)', () => {
    it('should throw an error if no tax keys are provided', () => {
      const item = createItem(taxKeyValue.expense.rent, 100);
      expect(() => policy.getApplicable([], [item])).toThrow(AppError);
      expect(() => policy.getApplicable([], [item])).toThrow(
        'Provide at least one tax key'
      );
    });
  });
});
