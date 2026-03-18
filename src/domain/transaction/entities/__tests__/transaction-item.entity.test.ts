import transactionItemEntity from '../transaction-item.entity';
import { ECategoryFlowType } from '../../../category/types/category.types';
import { ELedgerAccountType } from '../../../account/types/account.types';
import moneyValue from '../../../../shared/value-objects/money.vo';
import categoryEntity from '../../../category/entities/category.entity';
import { AppError } from '../../../../shared/value-objects/error';
import { EAccountingDomain } from '../../../accounting/types/accounting.types';

describe('Transaction Item Entity', () => {
  const currency = {
    code: 'USD',
    minorUnit: 2n,
    symbol: '$',
    name: 'US Dollar',
  };
  const [baseCategory] = categoryEntity.make({
    accountingDomain: EAccountingDomain.Personal,
    name: 'Sales',
    ledgerAccountType: ELedgerAccountType.Revenue,
    flowType: ECategoryFlowType.In,
    userId: null,
    parentId: null,
    description: 'Sales category',
    taxKey: 'revenue:sales',
  });

  const validCategory = {
    ...baseCategory,
    taxKey: 'revenue:sales',
  };

  const transactionId = '550e8400-e29b-41d4-a716-446655440000';
  const transactionDate = new Date('2024-01-01');

  describe('make', () => {
    it('should create a valid transaction item with a provided name', () => {
      const payload = {
        name: 'Custom Item Name',
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      const [item, [event]] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        payload
      );

      expect(item.id).toBeDefined();
      expect(item.name).toBe('Custom Item Name');
      expect(item.amount).toEqual(payload.amount);
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toEqual(payload.unitPrice);
      expect(item.transactionId).toBe(transactionId);
      expect(item.category).toEqual(validCategory);
      expect(item.isSystemGenerated).toBe(false);
      expect(item.createdAt).toBe(transactionDate);
      expect(item.updatedAt).toBe(transactionDate);
      expect(item.deletedAt).toBeNull();

      expect(event.event.type).toBe('domain:transaction_item:created');
      expect(event.event.data).toEqual(item);
      expect(event.event.occurredAt).toBeDefined();
    });

    it('should create a valid transaction item without a provided name (system generated)', () => {
      const payload = {
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      const [item, [event]] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        payload
      );

      expect(item.name).toBe(validCategory.name); // Defaults to category name
      expect(item.isSystemGenerated).toBe(true);

      expect(event.event.type).toBe('domain:transaction_item:created');
      expect(event.event.data).toEqual(item);
    });

    it('should create a valid transaction item when unitPrice is null', () => {
      const payload = {
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 1,
        unitPrice: null,
        category: validCategory,
        isSystemGenerated: false,
      };
      const [item, [event]] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        payload
      );
      expect(item.unitPrice).toBeNull();

      expect(event.event.type).toBe('domain:transaction_item:created');
      expect(event.event.data).toEqual(item);
    });

    it('should throw an error if item name is invalid (empty string)', () => {
      const payload = {
        name: '   ',
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      expect(() =>
        transactionItemEntity.make(transactionId, transactionDate, payload)
      ).toThrow(AppError);
    });

    it('should throw an error if item name is too long', () => {
      const payload = {
        name: 'a'.repeat(101),
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      expect(() =>
        transactionItemEntity.make(transactionId, transactionDate, payload)
      ).toThrow(AppError);
    });

    it('should throw an error if item name is not a string', () => {
      const payload = {
        name: 123 as any,
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      expect(() =>
        transactionItemEntity.make(transactionId, transactionDate, payload)
      ).toThrow(AppError);
    });

    it('should throw an error if price and unit price do not match', () => {
      const payload = {
        name: 'Item',
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(60, currency, false), // 2 * 60 = 120 !== 100
        category: validCategory,
        isSystemGenerated: false,
      };

      expect(() =>
        transactionItemEntity.make(transactionId, transactionDate, payload)
      ).toThrow(AppError);
    });

    it('should throw an error if unitPrice is provided but invalid', () => {
      const payload = {
        name: 'Item',
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: 1,
        unitPrice: { invalid: 'object' } as any,
        category: validCategory,
        isSystemGenerated: false,
      };

      expect(() =>
        transactionItemEntity.make(transactionId, transactionDate, payload)
      ).toThrow(); // moneyValue.validate throws
    });

    it('should throw an error if quantity is negative', () => {
      const payload = {
        name: 'Item',
        amount: moneyValue.make(100, currency, false),
        functionalCurrencyAmount: moneyValue.make(100, currency, false),
        quantity: -2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      expect(() =>
        transactionItemEntity.make(transactionId, transactionDate, payload)
      ).toThrow(AppError);
    });
  });

  describe('isExpense / isRevenue', () => {
    it('should identify expense item', () => {
      const expenseItem = {
        ...validCategory,
        taxKey: 'expense:other',
        ledgerAccountType: ELedgerAccountType.Expense,
      };
      const [item] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        {
          name: 'Item',
          amount: moneyValue.make(100, currency, false),
          functionalCurrencyAmount: moneyValue.make(100, currency, false),
          quantity: 1,
          unitPrice: moneyValue.make(100, currency, false),
          category: expenseItem as any,
          isSystemGenerated: false,
        }
      );
      expect(transactionItemEntity.isExpense(item)).toBe(true);
      expect(transactionItemEntity.isRevenue(item)).toBe(false);
    });

    it('should identify revenue item', () => {
      const [item] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        {
          name: 'Item',
          amount: moneyValue.make(100, currency, false),
          functionalCurrencyAmount: moneyValue.make(100, currency, false),
          quantity: 1,
          unitPrice: moneyValue.make(100, currency, false),
          category: validCategory,
          isSystemGenerated: false,
        }
      );
      expect(transactionItemEntity.isRevenue(item)).toBe(true);
      expect(transactionItemEntity.isExpense(item)).toBe(false);
    });
  });

  describe('validateItemsAmount', () => {
    it('should not throw if total items amount matches transaction amount', () => {
      const [item1] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        {
          amount: moneyValue.make(100, currency, false),
          functionalCurrencyAmount: moneyValue.make(100, currency, false),
          quantity: 1,
          unitPrice: null,
          category: validCategory,
          isSystemGenerated: false,
        }
      );
      const [item2] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        {
          amount: moneyValue.make(50, currency, false),
          functionalCurrencyAmount: moneyValue.make(50, currency, false),
          quantity: 1,
          unitPrice: null,
          category: validCategory,
          isSystemGenerated: false,
        }
      );

      expect(() =>
        transactionItemEntity.validateItemsAmount([item1, item2], {
          amount: moneyValue.make(150, currency, false),
          functionalCurrencyAmount: moneyValue.make(150, currency, false),
        })
      ).not.toThrow();
    });

    it('should throw if total items amount does not match transaction amount', () => {
      const [item1] = transactionItemEntity.make(
        transactionId,
        transactionDate,
        {
          amount: moneyValue.make(100, currency, false),
          functionalCurrencyAmount: moneyValue.make(100, currency, false),
          quantity: 1,
          unitPrice: null,
          category: validCategory,
          isSystemGenerated: false,
        }
      );

      expect(() =>
        transactionItemEntity.validateItemsAmount([item1], {
          amount: moneyValue.make(150, currency, false),
          functionalCurrencyAmount: moneyValue.make(150, currency, false),
        })
      ).toThrow(AppError);
    });
  });
});
