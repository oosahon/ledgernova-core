import revenueAccountHelpers from '../revenue-account.helpers';
import {
  ERevenueAccountType,
  ERevenueAccountSubType,
  EOperatingRevenueSubType,
  EOtherRevenueSubType,
} from '../../../types/revenue-account.types';
import { AppError } from '../../../../../shared/value-objects/error';

describe('revenueAccountHelpers', () => {
  describe('validateLedgerType', () => {
    it('should pass for valid revenue account types', () => {
      Object.values(ERevenueAccountType).forEach((type) => {
        expect(() =>
          revenueAccountHelpers.validateLedgerType(type)
        ).not.toThrow();
      });
    });

    it('should throw AppError for invalid revenue account type', () => {
      expect(() =>
        revenueAccountHelpers.validateLedgerType('invalid_type')
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerSubType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        revenueAccountHelpers.validateLedgerSubType('invalid_type', 'any')
      ).toThrow(AppError);
    });

    it('should pass if subType is Other regardless of valid accountType', () => {
      expect(() =>
        revenueAccountHelpers.validateLedgerSubType(
          ERevenueAccountType.Operating,
          ERevenueAccountSubType.Other
        )
      ).not.toThrow();
    });

    it('should validate Operating Revenue subtypes', () => {
      expect(() =>
        revenueAccountHelpers.validateLedgerSubType(
          ERevenueAccountType.Operating,
          EOperatingRevenueSubType.ProductSales
        )
      ).not.toThrow();
      expect(() =>
        revenueAccountHelpers.validateLedgerSubType(
          ERevenueAccountType.Operating,
          'invalid_operating_sub'
        )
      ).toThrow(AppError);
    });

    it('should validate Other Revenue subtypes', () => {
      expect(() =>
        revenueAccountHelpers.validateLedgerSubType(
          ERevenueAccountType.Other,
          EOtherRevenueSubType.InterestIncome
        )
      ).not.toThrow();
      expect(() =>
        revenueAccountHelpers.validateLedgerSubType(
          ERevenueAccountType.Other,
          'invalid_other_sub'
        )
      ).toThrow(AppError);
    });
  });
});
