import { ETransactionType } from '../../../transaction/types/transaction.types';
import taxKeyValue from '../tax-keys.vo';

describe('taxKeyValue', () => {
  describe('make', () => {
    it('should return system default when no createdBy is provided (receipt)', () => {
      expect(taxKeyValue.make(ETransactionType.Receipt)).toBe('receipt:other');
      expect(taxKeyValue.make(ETransactionType.Receipt, null)).toBe(
        'receipt:other'
      );
    });

    it('should return formatted key when createdBy is provided (receipt)', () => {
      expect(
        taxKeyValue.make(
          ETransactionType.Receipt,
          '987fcdeb-51a2-43d7-9012-3456789abcde'
        )
      ).toBe('receipt:other::987fcdeb-51a2-43d7-9012-3456789abcde');
    });

    it('should return system default when no createdBy is provided (expense)', () => {
      expect(taxKeyValue.make(ETransactionType.Expense)).toBe('expense:other');
      expect(taxKeyValue.make(ETransactionType.Expense, null)).toBe(
        'expense:other'
      );
    });

    it('should return formatted key when createdBy is provided (expense)', () => {
      expect(
        taxKeyValue.make(
          ETransactionType.Expense,
          '987fcdeb-51a2-43d7-9012-3456789abcde'
        )
      ).toBe('expense:other::987fcdeb-51a2-43d7-9012-3456789abcde');
    });

    it('should return system default when no createdBy is provided (payment)', () => {
      expect(taxKeyValue.make(ETransactionType.Payment)).toBe('payment:other');
      expect(taxKeyValue.make(ETransactionType.Payment, null)).toBe(
        'payment:other'
      );
    });

    it('should return formatted key when createdBy is provided (payment)', () => {
      expect(
        taxKeyValue.make(
          ETransactionType.Payment,
          '987fcdeb-51a2-43d7-9012-3456789abcde'
        )
      ).toBe('payment:other::987fcdeb-51a2-43d7-9012-3456789abcde');
    });

    it('should return base when no createdBy is provided (sale)', () => {
      expect(taxKeyValue.make(ETransactionType.Sale)).toBe('sale:other');
    });
  });

  describe('isValid', () => {
    it('should validate ETransactionType.Receipt', () => {
      expect(
        taxKeyValue.isValid('receipt:salary', ETransactionType.Receipt)
      ).toBe(true);
      expect(
        taxKeyValue.isValid('receipt:other', ETransactionType.Receipt)
      ).toBe(true);
      expect(taxKeyValue.isValid('invalid:key', ETransactionType.Receipt)).toBe(
        false
      );
      expect(
        taxKeyValue.isValid(
          'receipt:salary::987fcdeb-51a2-43d7-9012-3456789abcde',
          ETransactionType.Receipt
        )
      ).toBe(true);
    });

    it('should validate ETransactionType.Expense', () => {
      expect(
        taxKeyValue.isValid('expense:rent', ETransactionType.Expense)
      ).toBe(true);
      expect(
        taxKeyValue.isValid('expense:other', ETransactionType.Expense)
      ).toBe(true);
      expect(taxKeyValue.isValid('invalid:key', ETransactionType.Expense)).toBe(
        false
      );
      expect(
        taxKeyValue.isValid(
          'expense:rent::987fcdeb-51a2-43d7-9012-3456789abcde',
          ETransactionType.Expense
        )
      ).toBe(true);
    });

    it('should validate ETransactionType.Sale', () => {
      expect(taxKeyValue.isValid('sale:sales', ETransactionType.Sale)).toBe(
        true
      );
      expect(
        taxKeyValue.isValid(
          'sale:sales::987fcdeb-51a2-43d7-9012-3456789abcde',
          ETransactionType.Sale
        )
      ).toBe(true);
      expect(taxKeyValue.isValid('receipt:salary', ETransactionType.Sale)).toBe(
        false
      );
    });

    it('should validate ETransactionType.Payment', () => {
      expect(
        taxKeyValue.isValid('payment:other', ETransactionType.Payment)
      ).toBe(true);
      expect(
        taxKeyValue.isValid(
          'payment:other::987fcdeb-51a2-43d7-9012-3456789abcde',
          ETransactionType.Payment
        )
      ).toBe(true);
      expect(
        taxKeyValue.isValid('expense:rent', ETransactionType.Payment)
      ).toBe(false);
    });

    it('should invalidate unknown or undefined category types', () => {
      expect(taxKeyValue.isValid('receipt:other', 'unknown' as any)).toBe(
        false
      );
    });
  });

  describe('getBaseTaxKey', () => {
    it('should return the base tax key by stripping the user ID', () => {
      expect(taxKeyValue.getBaseTaxKey('expense:rent::123')).toBe(
        'expense:rent'
      );
      expect(taxKeyValue.getBaseTaxKey('receipt:salary')).toBe(
        'receipt:salary'
      );
    });
  });
});
