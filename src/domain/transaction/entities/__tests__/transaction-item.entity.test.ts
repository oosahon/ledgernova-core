import transactionItemEntity from '../transaction-item.entity';
import { ECategoryType } from '../../../category/types/category.types';
import moneyValue from '../../../../shared/value-objects/money.vo';
import categoryEntity from '../../../category/entities/category.entity';
import { AppError } from '../../../../shared/value-objects/error';

describe('Transaction Item Entity', () => {
  const currency = {
    code: 'USD',
    minorUnit: 2n,
    symbol: '$',
    name: 'US Dollar',
  };
  const validCategory = categoryEntity.make({
    name: 'Sales',
    type: ECategoryType.Income,
    userId: null,
    parentId: null,
    description: 'Sales category',
    taxKey: undefined as any,
  });

  const transactionId = 'txn-123';
  const transactionDate = new Date('2024-01-01');

  describe('make', () => {
    it('should create a valid transaction item with a provided name', () => {
      const payload = {
        name: 'Custom Item Name',
        price: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      const item = transactionItemEntity.make(
        transactionId,
        transactionDate,
        payload
      );

      expect(item.id).toBeDefined();
      expect(item.name).toBe('Custom Item Name');
      expect(item.price).toEqual(payload.price);
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toEqual(payload.unitPrice);
      expect(item.transactionId).toBe(transactionId);
      expect(item.category).toEqual(validCategory);
      expect(item.isSystemGenerated).toBe(false);
      expect(item.createdAt).toBe(transactionDate);
      expect(item.updatedAt).toBe(transactionDate);
      expect(item.deletedAt).toBeNull();
    });

    it('should create a valid transaction item without a provided name (system generated)', () => {
      const payload = {
        price: moneyValue.make(100, currency, false),
        quantity: 2,
        unitPrice: moneyValue.make(50, currency, false),
        category: validCategory,
        isSystemGenerated: false,
      };

      const item = transactionItemEntity.make(
        transactionId,
        transactionDate,
        payload
      );

      expect(item.name).toBe(validCategory.name); // Defaults to category name
      expect(item.isSystemGenerated).toBe(true);
    });

    it('should create a valid transaction item when unitPrice is null', () => {
      const payload = {
        price: moneyValue.make(100, currency, false),
        quantity: 1,
        unitPrice: null,
        category: validCategory,
        isSystemGenerated: false,
      };
      const item = transactionItemEntity.make(
        transactionId,
        transactionDate,
        payload
      );
      expect(item.unitPrice).toBeNull();
    });

    it('should throw an error if item name is invalid (empty string)', () => {
      const payload = {
        name: '   ',
        price: moneyValue.make(100, currency, false),
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
        price: moneyValue.make(100, currency, false),
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
        price: moneyValue.make(100, currency, false),
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
        price: moneyValue.make(100, currency, false),
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
        price: moneyValue.make(100, currency, false),
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
        price: moneyValue.make(100, currency, false),
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

  describe('validateItemsAmount', () => {
    it('should not throw if total items amount matches transaction amount', () => {
      const item1 = transactionItemEntity.make(transactionId, transactionDate, {
        price: moneyValue.make(100, currency, false),
        quantity: 1,
        unitPrice: null,
        category: validCategory,
        isSystemGenerated: false,
      });
      const item2 = transactionItemEntity.make(transactionId, transactionDate, {
        price: moneyValue.make(50, currency, false),
        quantity: 1,
        unitPrice: null,
        category: validCategory,
        isSystemGenerated: false,
      });

      expect(() =>
        transactionItemEntity.validateItemsAmount(
          [item1, item2],
          moneyValue.make(150, currency, false)
        )
      ).not.toThrow();
    });

    it('should throw if total items amount does not match transaction amount', () => {
      const item1 = transactionItemEntity.make(transactionId, transactionDate, {
        price: moneyValue.make(100, currency, false),
        quantity: 1,
        unitPrice: null,
        category: validCategory,
        isSystemGenerated: false,
      });

      expect(() =>
        transactionItemEntity.validateItemsAmount(
          [item1],
          moneyValue.make(150, currency, false)
        )
      ).toThrow(AppError);
    });
  });
});
