import liabilityAccountHelpers from '../liability-account.helper';
import {
  ELiabilityAccountType,
  ELiabilityAccountSubType,
  EPayableAccountSubType,
  ELoanAccountSubType,
} from '../../../types/liability-account.types';
import { AppError } from '../../../../../shared/value-objects/error';

describe('liabilityAccountHelpers', () => {
  describe('validateLedgerType', () => {
    it('should pass for valid liability account types', () => {
      Object.values(ELiabilityAccountType).forEach((type) => {
        expect(() =>
          liabilityAccountHelpers.validateLedgerType(type)
        ).not.toThrow();
      });
    });

    it('should throw AppError for invalid liability account type', () => {
      expect(() =>
        liabilityAccountHelpers.validateLedgerType('invalid_type')
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerSubType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType('invalid_type', 'any')
      ).toThrow(AppError);
    });

    it('should pass if subType is Other regardless of valid accountType', () => {
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.Loan,
          ELiabilityAccountSubType.Other
        )
      ).not.toThrow();
    });

    it('should validate Payable subtypes', () => {
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.Payable,
          EPayableAccountSubType.AccountsPayable
        )
      ).not.toThrow();
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.Payable,
          'invalid_payable_sub'
        )
      ).toThrow(AppError);
    });

    it('should validate Loan subtypes', () => {
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.Loan,
          ELoanAccountSubType.Mortgage
        )
      ).not.toThrow();
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.Loan,
          'invalid_loan_sub'
        )
      ).toThrow(AppError);
    });

    it('should validate Other account types against ELiabilityAccountSubType', () => {
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.CreditCard,
          ELoanAccountSubType.ShortTerm
        )
      ).not.toThrow();
      expect(() =>
        liabilityAccountHelpers.validateLedgerSubType(
          ELiabilityAccountType.CreditCard,
          'invalid_other_sub'
        )
      ).toThrow(AppError);
    });
  });
});
