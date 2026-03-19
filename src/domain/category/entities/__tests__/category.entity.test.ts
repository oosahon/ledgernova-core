import _ from 'lodash';
import { AppError } from '../../../../shared/value-objects/error';
import categoryEntity from '../category.entity';
import { ICategory } from '../../types/category.types';
import { ETransactionType } from '../../../transaction/types/transaction.types';
import taxKeyValue from '../../../tax/value-objects/tax-keys.vo';
import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import { EAccountingDomain } from '../../../accounting/types/accounting.types';

type TMakePayload = TCreationOmits<ICategory, 'status'>;

describe('Category Entity', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-13T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('make', () => {
    it('should create a valid system category successfully', () => {
      const payload = {
        name: 'System Category',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Receipt,
        description: 'System Description',
        parentId: null,
        userId: null,
        taxKey: '',
      };

      const [result, events] = categoryEntity.make(payload as any);

      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:created');
      expect(events[0].event.data).toEqual(result);

      expect(_.omit(result, 'id')).toEqual({
        name: 'System Category',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Receipt,
        taxKey: taxKeyValue.make(ETransactionType.Receipt, null), // 'receipt:other' since userId is null
        parentId: null,
        description: 'System Description',
        userId: null,
        status: 'active',
        createdAt: new Date('2026-03-13T00:00:00.000Z'),
        updatedAt: new Date('2026-03-13T00:00:00.000Z'),
        deletedAt: null,
      });
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should create a valid user category successfully (with parentId)', () => {
      const validParentId = '123e4567-e89b-12d3-a456-426614174000';
      const validUserId = '987fcdeb-51a2-43d7-9012-3456789abcde';
      const payload: TCreationOmits<ICategory, 'status'> = {
        name: 'User Category',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Expense,
        description: 'User Description',
        parentId: validParentId,
        userId: validUserId,
        taxKey: '',
      };

      const [result, events] = categoryEntity.make(payload as any);

      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:created');
      expect(events[0].event.data).toEqual(result);

      expect(result.userId).toBe(validUserId);
      expect(result.parentId).toBe(validParentId);
      expect(result.taxKey).toBe(
        taxKeyValue.make(ETransactionType.Expense, validUserId)
      );
    });

    it('should create a category and use the provided taxKey instead of generating it if handled (wait, make now overrides taxKey but lets test generated one)', () => {
      // The entity's make function now creates taxKey: taxKeyValue.make(payload.transactionType, payload.userId).
      // So any provided taxKey is ignored/overwritten.
      const payload = {
        name: 'Custom Tax Category',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Receipt,
        description: 'Uses taxKey explicitly',
        parentId: null,
        userId: null,
        taxKey: 'some-custom-taxkey',
      };

      const [result, events] = categoryEntity.make(payload as any);

      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:created');
      expect(events[0].event.data).toEqual(result);

      expect(result.taxKey).toBe(
        taxKeyValue.make(ETransactionType.Receipt, null)
      );
    });

    it('should throw an error if a user category does not have a parentId', () => {
      const payload = {
        name: 'Invalid User Category',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Expense,
        description: 'No parent id',
        parentId: null, // missing parent id
        userId: '987fcdeb-51a2-43d7-9012-3456789abcde',
        taxKey: '',
      } as unknown as TMakePayload;

      expect(() => categoryEntity.make(payload)).toThrow(AppError);
      expect(() => categoryEntity.make(payload)).toThrow(
        'A user id must be provided along with a parent id for sub categories.'
      );
    });

    describe('sanitizeName validations', () => {
      const basePayload = {
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Receipt,
        description: 'Desc',
        parentId: null,
        userId: null,
        taxKey: '',
      };

      it('should throw an error for empty, null, or undefined name', () => {
        expect(() =>
          categoryEntity.make({ ...basePayload, name: '' } as any)
        ).toThrow(AppError);
        expect(() =>
          categoryEntity.make({
            ...basePayload,
            name: null,
          } as unknown as TMakePayload)
        ).toThrow(AppError);
        expect(() =>
          categoryEntity.make({
            ...basePayload,
            name: undefined,
          } as unknown as TMakePayload)
        ).toThrow(AppError);
      });

      it('should throw an error if name is not a string', () => {
        expect(() =>
          categoryEntity.make({
            ...basePayload,
            name: 123,
          } as unknown as TMakePayload)
        ).toThrow(AppError);
        expect(() =>
          categoryEntity.make({
            ...basePayload,
            name: {},
          } as unknown as TMakePayload)
        ).toThrow(AppError);
      });

      it('should preserve spaces in name if not trimmed by utility', () => {
        const [result, events] = categoryEntity.make({
          ...basePayload,
          name: '    ',
        } as any);

        expect(events).toHaveLength(1);
        expect(events[0].event.type).toBe('domain:category:created');
        expect(events[0].event.data).toEqual(result);
        expect(result.name).toBe('    ');
      });

      it('should throw an error if trimmed name length is > 100', () => {
        const longName = 'A'.repeat(101);
        expect(() =>
          categoryEntity.make({ ...basePayload, name: longName } as any)
        ).toThrow(AppError);
      });

      it('should accept trimmed name length up to 100', () => {
        const longName = 'A'.repeat(100);
        const [result, events] = categoryEntity.make({
          ...basePayload,
          name: longName,
        } as any);

        expect(events).toHaveLength(1);
        expect(events[0].event.type).toBe('domain:category:created');
        expect(events[0].event.data).toEqual(result);
        expect(result.name).toBe(longName);
      });
    });
  });

  describe('update', () => {
    let existingCategory: ICategory;

    beforeEach(() => {
      [existingCategory] = categoryEntity.make({
        name: 'Original Name',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Receipt,
        description: 'Original Description',
        parentId: null,
        userId: null,
        taxKey: '',
      } as any);

      jest.advanceTimersByTime(1000);
    });

    it('should update name correctly', () => {
      const options = { name: 'Updated Name' };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Original Description');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        existingCategory.updatedAt.getTime()
      );
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should update description correctly', () => {
      const options = { description: 'Updated Description' };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);

      expect(result.name).toBe('Original Name');
      expect(result.description).toBe('Updated Description');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        existingCategory.updatedAt.getTime()
      );
    });

    it('should update both name and description correctly', () => {
      const options = {
        name: 'Updated Name',
        description: 'Updated Description',
      };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated Description');
    });

    it('should update name to string of spaces when updating with a string of only spaces', () => {
      const options = { name: '   ' };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);
      expect(result.name).toBe('   ');
    });

    it('should ignore falsy name during update and fallback to original name', () => {
      const options = { name: '' };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);
      expect(result.name).toBe('Original Name');
    });

    it('should fallback to category description if options.description is undefined', () => {
      const options = { description: undefined };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);
      expect(result.description).toBe('Original Description');
    });

    it('should update description to empty string if empty string is provided', () => {
      const options = { description: '' };
      const [result, events] = categoryEntity.update(existingCategory, options);
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);
      expect(result.description).toBe('');
    });

    it('should throw an error if description exceeds 255 characters', () => {
      const longDescription = 'A'.repeat(256);
      const options = { description: longDescription };
      expect(() => categoryEntity.update(existingCategory, options)).toThrow(
        AppError
      );
    });

    it('should keep existing values if options are empty', () => {
      const [result, events] = categoryEntity.update(existingCategory, {});
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:category:updated');
      expect(events[0].event.data).toEqual(result);
      expect(result.name).toBe('Original Name');
      expect(result.description).toBe('Original Description');
    });
  });

  describe('archive', () => {
    let activeCategory: any;

    beforeEach(() => {
      [activeCategory] = categoryEntity.make({
        accountingDomain: EAccountingDomain.Individual,
        name: 'Active Category',
        transactionType: ETransactionType.Receipt,
        description: 'Desc',
        parentId: null,
        userId: null,
        taxKey: '',
      } as any);
      jest.advanceTimersByTime(1000);
    });

    it('should archive an active category and update updatedAt', () => {
      const [result, events] = categoryEntity.archive(activeCategory);
      expect(events).toBeDefined();

      expect(result.status).toBe('archived');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        activeCategory.updatedAt.getTime()
      );
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should return the identical category if already archived without updating timestamp', () => {
      const [archivedCategory] = categoryEntity.archive(activeCategory);
      jest.advanceTimersByTime(1000);
      const [result, events] = categoryEntity.archive(archivedCategory);
      expect(events).toBeDefined();

      expect(result).toBe(archivedCategory);
      expect(result.updatedAt.getTime()).toBe(
        archivedCategory.updatedAt.getTime()
      );
    });
  });

  describe('unarchive', () => {
    let archivedCategory: any;

    beforeEach(() => {
      const [activeCategory] = categoryEntity.make({
        name: 'Category To Archive',
        accountingDomain: EAccountingDomain.Individual,
        transactionType: ETransactionType.Receipt,
        description: 'Desc',
        parentId: null,
        userId: null,
        taxKey: '',
      } as any);
      jest.advanceTimersByTime(1000);
      [archivedCategory] = categoryEntity.archive(activeCategory);
      jest.advanceTimersByTime(1000);
    });

    it('should unarchive an archived category and update updatedAt', () => {
      const [result, events] = categoryEntity.unarchive(archivedCategory);
      expect(events).toBeDefined();

      expect(result.status).toBe('active');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        archivedCategory.updatedAt.getTime()
      );
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should return the identical category if already active without updating timestamp', () => {
      const [activeCategory] = categoryEntity.unarchive(archivedCategory);
      jest.advanceTimersByTime(1000);
      const [result, events] = categoryEntity.unarchive(activeCategory);
      expect(events).toBeDefined();

      expect(result).toBe(activeCategory);
      expect(result.updatedAt.getTime()).toBe(
        activeCategory.updatedAt.getTime()
      );
    });
  });
});
