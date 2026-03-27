import equityAccountHelpers from '../equity-account.helper';
import {
  EEquityAccountType,
  EEquityAccountSubType,
  EEquityOwnerSubType,
} from '../../../types/equity-account.types';
import { AppError } from '../../../../../shared/value-objects/error';

describe('equityAccountHelpers', () => {
  describe('validateLedgerType', () => {
    it('should pass for valid equity account types', () => {
      Object.values(EEquityAccountType).forEach((type) => {
        expect(() =>
          equityAccountHelpers.validateLedgerType(type)
        ).not.toThrow();
      });
    });

    it('should throw AppError for invalid equity account type', () => {
      expect(() =>
        equityAccountHelpers.validateLedgerType('invalid_type')
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerSubType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        equityAccountHelpers.validateLedgerSubType('invalid_type', 'any')
      ).toThrow(AppError);
    });

    it('should pass if subType is Other regardless of valid accountType', () => {
      expect(() =>
        equityAccountHelpers.validateLedgerSubType(
          EEquityAccountType.RetainedEarnings,
          EEquityAccountSubType.Other
        )
      ).not.toThrow();
    });

    it('should validate OwnerInvestment subtypes', () => {
      expect(() =>
        equityAccountHelpers.validateLedgerSubType(
          EEquityAccountType.OwnerInvestment,
          EEquityOwnerSubType.CommonStock
        )
      ).not.toThrow();
      expect(() =>
        equityAccountHelpers.validateLedgerSubType(
          EEquityAccountType.OwnerInvestment,
          'invalid_owner_sub'
        )
      ).toThrow(AppError);
    });

    it('should validate Other account types against EEquityAccountSubType', () => {
      expect(() =>
        equityAccountHelpers.validateLedgerSubType(
          EEquityAccountType.RetainedEarnings,
          EEquityOwnerSubType.PreferredStock
        )
      ).not.toThrow();
      expect(() =>
        equityAccountHelpers.validateLedgerSubType(
          EEquityAccountType.RetainedEarnings,
          'invalid_equity_sub'
        )
      ).toThrow(AppError);
    });
  });
});
