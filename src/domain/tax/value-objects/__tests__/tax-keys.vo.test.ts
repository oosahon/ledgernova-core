import { ECategoryType } from '../../../category/types/category.types';
import taxKeyValue from '../tax-keys.vo';

describe('taxKeyValue', () => {
  describe('income', () => {
    it('make: should return base when no userId is provided', () => {
      expect(taxKeyValue.income.make()).toBe('income:other');
      expect(taxKeyValue.income.make(null)).toBe('income:other');
    });

    it('make: should return formatted key when userId is provided', () => {
      expect(taxKeyValue.income.make('user-uuid')).toBe('income:other::user-uuid');
    });

    it('makeLiability: should return base when no userId is provided', () => {
      expect(taxKeyValue.income.makeLiability()).toBe('income:liability');
      expect(taxKeyValue.income.makeLiability(null)).toBe('income:liability');
    });

    it('makeLiability: should return formatted key when userId is provided', () => {
      expect(taxKeyValue.income.makeLiability('user-uuid')).toBe('income:liability::user-uuid');
    });
  });

  describe('expense', () => {
    it('make: should return base when no userId is provided', () => {
      expect(taxKeyValue.expense.make()).toBe('expense:other');
      expect(taxKeyValue.expense.make(null)).toBe('expense:other');
    });

    it('make: should return formatted key when userId is provided', () => {
      expect(taxKeyValue.expense.make('user-uuid')).toBe('expense:other::user-uuid');
    });

    it('makeLiability: should return base when no userId is provided', () => {
      expect(taxKeyValue.expense.makeLiability()).toBe('expense:liability');
      expect(taxKeyValue.expense.makeLiability(null)).toBe('expense:liability');
    });

    it('makeLiability: should return formatted key when userId is provided', () => {
      expect(taxKeyValue.expense.makeLiability('user-uuid')).toBe('expense:liability::user-uuid');
    });
  });

  describe('isValid', () => {
    it('should validate ECategoryType.Income', () => {
      expect(taxKeyValue.isValid('income:salary', ECategoryType.Income)).toBe(true);
      expect(taxKeyValue.isValid('income:other', ECategoryType.Income)).toBe(true);
      expect(taxKeyValue.isValid('invalid:key', ECategoryType.Income)).toBe(false);
    });

    it('should validate ECategoryType.Expense', () => {
      expect(taxKeyValue.isValid('expense:rent', ECategoryType.Expense)).toBe(true);
      expect(taxKeyValue.isValid('expense:other', ECategoryType.Expense)).toBe(true);
      expect(taxKeyValue.isValid('invalid:key', ECategoryType.Expense)).toBe(false);
    });

    it('should validate ECategoryType.LiabilityIncome', () => {
      expect(taxKeyValue.isValid('income:liability', ECategoryType.LiabilityIncome)).toBe(true);
      expect(taxKeyValue.isValid('income:liability::user-uuid', ECategoryType.LiabilityIncome)).toBe(true);
      expect(taxKeyValue.isValid('income:salary', ECategoryType.LiabilityIncome)).toBe(false);
    });

    it('should validate ECategoryType.LiabilityExpense', () => {
      expect(taxKeyValue.isValid('expense:liability', ECategoryType.LiabilityExpense)).toBe(true);
      expect(taxKeyValue.isValid('expense:liability::user-uuid', ECategoryType.LiabilityExpense)).toBe(true);
      expect(taxKeyValue.isValid('expense:rent', ECategoryType.LiabilityExpense)).toBe(false);
    });

    it('should invalidate unknown or undefined category types', () => {
      expect(taxKeyValue.isValid('income:other', 'unknown' as any)).toBe(false);
    });
  });
});
