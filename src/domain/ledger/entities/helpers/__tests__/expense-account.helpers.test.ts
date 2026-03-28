import expenseAccountHelpers from '../expense-account.helpers';
import {
  EExpenseAccountType,
  EExpenseAccountSubType,
  ECostOfGoodsSoldSubType,
  EOperatingExpenseSubType,
  EOtherExpenseSubType,
} from '../../../types/expense-account.types';
import { AppError } from '../../../../../shared/value-objects/error';

describe('expenseAccountHelpers', () => {
  describe('validateLedgerType', () => {
    it('should pass for valid expense account types', () => {
      Object.values(EExpenseAccountType).forEach((type) => {
        expect(() =>
          expenseAccountHelpers.validateLedgerType(type)
        ).not.toThrow();
      });
    });

    it('should throw AppError for invalid expense account type', () => {
      expect(() =>
        expenseAccountHelpers.validateLedgerType('invalid_type')
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerSubType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType('invalid_type', 'any')
      ).toThrow(AppError);
    });

    it('should pass if subType is Other regardless of valid accountType', () => {
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.Operating,
          EExpenseAccountSubType.Other
        )
      ).not.toThrow();
    });

    it('should validate CostOfGoodsSold subtypes', () => {
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.CostOfGoodsSold,
          ECostOfGoodsSoldSubType.DirectMaterials
        )
      ).not.toThrow();
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.CostOfGoodsSold,
          'invalid_cogs_sub'
        )
      ).toThrow(AppError);
    });

    it('should validate Operating Expense subtypes', () => {
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.Operating,
          EOperatingExpenseSubType.Payroll
        )
      ).not.toThrow();
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.Operating,
          'invalid_operating_sub'
        )
      ).toThrow(AppError);
    });

    it('should validate Other Expense subtypes', () => {
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.Other,
          EOtherExpenseSubType.InterestExpense
        )
      ).not.toThrow();
      expect(() =>
        expenseAccountHelpers.validateLedgerSubType(
          EExpenseAccountType.Other,
          'invalid_other_expense_sub'
        )
      ).toThrow(AppError);
    });
  });
});
