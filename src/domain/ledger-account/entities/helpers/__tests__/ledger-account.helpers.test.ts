import ledgerAccountHelpers from '../ledger-account.helpers';
import { ELedgerType } from '../../../types/index.types';
import {
  EAssetAccountType,
  EAssetAccountSubType,
} from '../../../types/asset-account.types';
import {
  EEquityAccountType,
  EEquityAccountSubType,
} from '../../../types/equity-account.types';
import {
  EExpenseAccountType,
  EExpenseAccountSubType,
} from '../../../types/expense-account.types';
import {
  ELiabilityAccountType,
  ELiabilityAccountSubType,
} from '../../../types/liability-account.types';
import {
  ERevenueAccountType,
  ERevenueAccountSubType,
} from '../../../types/revenue-account.types';
import { AppError } from '../../../../../shared/value-objects/error';

describe('ledgerAccountHelpers', () => {
  describe('validateLedgerType', () => {
    it('should pass for valid ledger types', () => {
      Object.values(ELedgerType).forEach((type) => {
        expect(() =>
          ledgerAccountHelpers.validateLedgerType(type)
        ).not.toThrow();
      });
    });

    it('should throw AppError for invalid ledger type', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerType('invalid_type' as any)
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerAccountType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          'invalid_type' as any,
          'any'
        )
      ).toThrow(AppError);
    });

    it('should call appropriate validator and pass for valid account types', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Asset,
          EAssetAccountType.Cash
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Equity,
          EEquityAccountType.OwnerInvestment
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Expense,
          EExpenseAccountType.Operating
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Liability,
          ELiabilityAccountType.Payable
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Revenue,
          ERevenueAccountType.Operating
        )
      ).not.toThrow();
    });

    it('should call appropriate validator and throw for invalid account types', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Asset,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Equity,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Expense,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Liability,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountType(
          ELedgerType.Revenue,
          'invalid'
        )
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerAccountSubType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          'invalid_type' as any,
          'any',
          'any'
        )
      ).toThrow(AppError);
    });

    it('should call appropriate validator and pass for valid sub types', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Asset,
          EAssetAccountType.Cash,
          EAssetAccountSubType.Other
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Equity,
          EEquityAccountType.OwnerInvestment,
          EEquityAccountSubType.Other
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Expense,
          EExpenseAccountType.Operating,
          EExpenseAccountSubType.Other
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Liability,
          ELiabilityAccountType.Payable,
          ELiabilityAccountSubType.Other
        )
      ).not.toThrow();
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Revenue,
          ERevenueAccountType.Operating,
          ERevenueAccountSubType.Other
        )
      ).not.toThrow();
    });

    it('should call appropriate validator and throw for invalid sub types', () => {
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Asset,
          EAssetAccountType.Cash,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Equity,
          EEquityAccountType.OwnerInvestment,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Expense,
          EExpenseAccountType.Operating,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Liability,
          ELiabilityAccountType.Payable,
          'invalid'
        )
      ).toThrow(AppError);
      expect(() =>
        ledgerAccountHelpers.validateLedgerAccountSubType(
          ELedgerType.Revenue,
          ERevenueAccountType.Operating,
          'invalid'
        )
      ).toThrow(AppError);
    });
  });
});
