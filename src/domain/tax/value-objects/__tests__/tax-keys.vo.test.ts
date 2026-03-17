import { ELedgerAccountType } from '../../../account/types/account.types';
import taxKeyValue from '../tax-keys.vo';

describe('taxKeyValue', () => {
  describe('make', () => {
    it('should return base when no userId is provided (revenue)', () => {
      expect(taxKeyValue.make(ELedgerAccountType.Revenue)).toBe('revenue');
      expect(taxKeyValue.make(ELedgerAccountType.Revenue, null)).toBe(
        'revenue'
      );
    });

    it('should return formatted key when userId is provided (revenue)', () => {
      expect(
        taxKeyValue.make(
          ELedgerAccountType.Revenue,
          '987fcdeb-51a2-43d7-9012-3456789abcde'
        )
      ).toBe('revenue::987fcdeb-51a2-43d7-9012-3456789abcde');
    });

    it('should return base when no userId is provided (expense)', () => {
      expect(taxKeyValue.make(ELedgerAccountType.Expense)).toBe('expense');
      expect(taxKeyValue.make(ELedgerAccountType.Expense, null)).toBe(
        'expense'
      );
    });

    it('should return formatted key when userId is provided (expense)', () => {
      expect(
        taxKeyValue.make(
          ELedgerAccountType.Expense,
          '987fcdeb-51a2-43d7-9012-3456789abcde'
        )
      ).toBe('expense::987fcdeb-51a2-43d7-9012-3456789abcde');
    });
  });

  describe('isValid', () => {
    it('should validate ELedgerAccountType.Revenue', () => {
      expect(
        taxKeyValue.isValid('revenue:salary', ELedgerAccountType.Revenue)
      ).toBe(true);
      expect(
        taxKeyValue.isValid('revenue:other', ELedgerAccountType.Revenue)
      ).toBe(true);
      expect(
        taxKeyValue.isValid('invalid:key', ELedgerAccountType.Revenue)
      ).toBe(false);
      expect(
        taxKeyValue.isValid(
          'revenue:salary::987fcdeb-51a2-43d7-9012-3456789abcde',
          ELedgerAccountType.Revenue
        )
      ).toBe(true);
    });

    it('should validate ELedgerAccountType.Expense', () => {
      expect(
        taxKeyValue.isValid('expense:rent', ELedgerAccountType.Expense)
      ).toBe(true);
      expect(
        taxKeyValue.isValid('expense:other', ELedgerAccountType.Expense)
      ).toBe(true);
      expect(
        taxKeyValue.isValid('invalid:key', ELedgerAccountType.Expense)
      ).toBe(false);
      expect(
        taxKeyValue.isValid(
          'expense:rent::987fcdeb-51a2-43d7-9012-3456789abcde',
          ELedgerAccountType.Expense
        )
      ).toBe(true);
    });

    it('should validate ELedgerAccountType.Liability', () => {
      expect(
        taxKeyValue.isValid('liability', ELedgerAccountType.Liability)
      ).toBe(true);
      expect(
        taxKeyValue.isValid(
          'liability::987fcdeb-51a2-43d7-9012-3456789abcde',
          ELedgerAccountType.Liability
        )
      ).toBe(true);
      expect(
        taxKeyValue.isValid('revenue:salary', ELedgerAccountType.Liability)
      ).toBe(false);
    });

    it('should validate ELedgerAccountType.Asset', () => {
      expect(taxKeyValue.isValid('asset', ELedgerAccountType.Asset)).toBe(true);
      expect(
        taxKeyValue.isValid(
          'asset::987fcdeb-51a2-43d7-9012-3456789abcde',
          ELedgerAccountType.Asset
        )
      ).toBe(true);
      expect(
        taxKeyValue.isValid('expense:rent', ELedgerAccountType.Asset)
      ).toBe(false);
    });

    it('should validate ELedgerAccountType.Equity', () => {
      expect(taxKeyValue.isValid('equity', ELedgerAccountType.Equity)).toBe(
        true
      );
      expect(
        taxKeyValue.isValid(
          'equity::987fcdeb-51a2-43d7-9012-3456789abcde',
          ELedgerAccountType.Equity
        )
      ).toBe(true);
      expect(
        taxKeyValue.isValid('expense:rent', ELedgerAccountType.Equity)
      ).toBe(false);
    });

    it('should invalidate unknown or undefined category types', () => {
      expect(taxKeyValue.isValid('revenue:other', 'unknown' as any)).toBe(
        false
      );
    });
  });
});
