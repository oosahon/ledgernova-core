import { AppError } from '../../../../shared/value-objects/error';
import { ELedgerType, ULedgerType } from '../../../ledger/types/index.types';
import {
  EAccountingEntityType,
  UAccountingEntityType,
} from '../../types/accounting.types';
import accountingHelpers from '../accounting.helpers';

describe('Accounting Helpers', () => {
  describe('isValidEntityType()', () => {
    it('should return true for valid accounting domains', () => {
      expect(
        accountingHelpers.isValidEntityType(EAccountingEntityType.Company)
      ).toBe(true);
      expect(
        accountingHelpers.isValidEntityType(EAccountingEntityType.SoleTrader)
      ).toBe(true);
      expect(
        accountingHelpers.isValidEntityType(EAccountingEntityType.Individual)
      ).toBe(true);
    });

    it('should return false for invalid accounting domains', () => {
      expect(
        accountingHelpers.isValidEntityType(
          'invalid_domain' as UAccountingEntityType
        )
      ).toBe(false);
      expect(
        accountingHelpers.isValidEntityType('' as UAccountingEntityType)
      ).toBe(false);
    });
  });

  describe('validateEntityType()', () => {
    it('should not throw an error for valid domains', () => {
      expect(() =>
        accountingHelpers.validateEntityType(EAccountingEntityType.Company)
      ).not.toThrow();
    });

    it('should throw an AppError for invalid domains', () => {
      expect(() =>
        accountingHelpers.validateEntityType(
          'invalid_domain' as UAccountingEntityType
        )
      ).toThrow(AppError);
      expect(() =>
        accountingHelpers.validateEntityType(
          'invalid_domain' as UAccountingEntityType
        )
      ).toThrow('Invalid accounting domain');
    });
  });

  describe('isValidLedgerCode()', () => {
    it('should return true for predefined valid 5-digit ledger codes matching the root prefix', () => {
      // Asset starts with 1
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '11000')
      ).toBe(true);
      // Liability starts with 2
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Liability, '21000')
      ).toBe(true);
      // Equity starts with 3
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Equity, '31000')
      ).toBe(true);
      // Revenue starts with 4
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Revenue, '41000')
      ).toBe(true);
      // Expense starts with 5
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Expense, '51000')
      ).toBe(true);
    });

    it('should return true for dynamically generated 5-digit codes matching the root prefix', () => {
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '19999')
      ).toBe(true);
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '11234')
      ).toBe(true);
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Expense, '59001')
      ).toBe(true);
    });

    it('should return false if the ledger code is not exactly 5 digits', () => {
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '1100')
      ).toBe(false); // Too short
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '110000')
      ).toBe(false); // Too long
    });

    it('should return false if the ledger code contains non-numeric characters', () => {
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '11A00')
      ).toBe(false);
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '11 00')
      ).toBe(false);
    });

    it('should return false if the ledger code starts with an incorrect prefix for the type', () => {
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Asset, '21000')
      ).toBe(false); // Liability code for Asset
      expect(
        accountingHelpers.isValidLedgerCode(ELedgerType.Liability, '11000')
      ).toBe(false); // Asset code for Liability
    });

    it('should return false for an invalid ledger type', () => {
      expect(
        accountingHelpers.isValidLedgerCode(
          'InvalidType' as ULedgerType,
          '11000'
        )
      ).toBe(false);
    });
  });

  describe('validateLedgerCode()', () => {
    it('should not throw an error for valid ledger codes', () => {
      expect(() =>
        accountingHelpers.validateLedgerCode(ELedgerType.Asset, '11000')
      ).not.toThrow();
    });

    it('should throw an AppError for invalid ledger codes', () => {
      expect(() =>
        accountingHelpers.validateLedgerCode(ELedgerType.Asset, '21000')
      ).toThrow(AppError);
      expect(() =>
        accountingHelpers.validateLedgerCode(ELedgerType.Asset, '21000')
      ).toThrow('Invalid ledger code');
    });
  });
});
