import _ from 'lodash';
import { AppError } from '../../../../shared/value-objects/error';
import categoryEntity from '../category.entity';
import { ECategoryType, ICategory } from '../../types/category.types';
import taxKey from '../../../tax/value-objects/tax-keys.vo';
import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import taxKeyValue from '../../../tax/value-objects/tax-keys.vo';

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
        name: '  System Category  ',
        type: ECategoryType.Income,
        description: 'System Description',
        parentId: null,
        userId: null,
        taxKey: taxKey.income.make(null),
      };

      const result = categoryEntity.make(payload);

      expect(_.omit(result, 'id')).toEqual({
        name: 'System Category', // trimmed
        taxKey: taxKey.income.make(null), // 'income:other' since userId is null
        type: ECategoryType.Income,
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
        type: ECategoryType.Expense,
        description: 'User Description',
        parentId: validParentId,
        userId: validUserId,
        taxKey: taxKeyValue.expense.make(),
      };

      const result = categoryEntity.make(payload);

      expect(result.userId).toBe(validUserId);
      expect(result.parentId).toBe(validParentId);
      expect(result.taxKey).toBe(payload.taxKey);
    });

    it('should create a category and use the provided taxKey instead of generating it', () => {
      const payload = {
        name: 'Custom Tax Category',
        type: ECategoryType.Income,
        description: 'Uses taxKey explicitly',
        parentId: null,
        userId: null,
        taxKey: 'custom-tax-key',
      };

      const result = categoryEntity.make(payload);

      expect(result.taxKey).toBe('custom-tax-key');
    });

    it('should throw an error if a user category does not have a parentId', () => {
      const payload = {
        name: 'Invalid User Category',
        type: ECategoryType.Expense,
        description: 'No parent id',
        parentId: null, // missing parent id
        userId: '987fcdeb-51a2-43d7-9012-3456789abcde',
        taxKey: undefined,
      } as unknown as TMakePayload;

      expect(() => categoryEntity.make(payload)).toThrow(AppError);
      expect(() => categoryEntity.make(payload)).toThrow('Invalid parent id');
    });

    describe('taxKey generation via getTaxKey', () => {
      const validParentId = '123e4567-e89b-12d3-a456-426614174000';
      const validUserId = '987fcdeb-51a2-43d7-9012-3456789abcde';
      const basePayload = {
        name: 'Test Category',
        description: 'Desc',
        parentId: validParentId,
        userId: validUserId,
        taxKey: undefined,
      } as unknown as TMakePayload;

      it('should generate income taxKey for ECategoryType.Income', () => {
        const result = categoryEntity.make({
          ...basePayload,
          type: ECategoryType.Income,
        });
        expect(result.taxKey).toBe(taxKey.income.make(validUserId));
      });

      it('should generate income taxKey for ECategoryType.LiabilityIncome', () => {
        const result = categoryEntity.make({
          ...basePayload,
          type: ECategoryType.LiabilityIncome,
        });
        expect(result.taxKey).toBe(taxKey.income.makeLiability(validUserId));
      });

      it('should generate expense taxKey for ECategoryType.Expense', () => {
        const result = categoryEntity.make({
          ...basePayload,
          type: ECategoryType.Expense,
        });
        expect(result.taxKey).toBe(taxKey.expense.make(validUserId));
      });

      it('should generate expense taxKey for ECategoryType.LiabilityExpense', () => {
        const result = categoryEntity.make({
          ...basePayload,
          type: ECategoryType.LiabilityExpense,
        });
        expect(result.taxKey).toBe(taxKey.expense.makeLiability(validUserId));
      });

      it('should throw an error for an invalid category type', () => {
        expect(() =>
          categoryEntity.make({
            ...basePayload,
            type: 'invalid_type',
          } as unknown as TMakePayload)
        ).toThrow(AppError);
        expect(() =>
          categoryEntity.make({
            ...basePayload,
            type: 'invalid_type',
          } as unknown as TMakePayload)
        ).toThrow('Invalid category type');
      });
    });

    describe('sanitizeName validations', () => {
      const basePayload = {
        type: ECategoryType.Income,
        description: 'Desc',
        parentId: null,
        userId: null,
        taxKey: taxKey.income.make(null),
      };

      it('should throw an error for empty, null, or undefined name', () => {
        expect(() => categoryEntity.make({ ...basePayload, name: '' })).toThrow(
          AppError
        );
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

      it('should trim string with only spaces and successfully create category with empty name', () => {
        const result = categoryEntity.make({ ...basePayload, name: '    ' });
        expect(result.name).toBe('');
      });

      it('should throw an error if trimmed name length is > 100', () => {
        const longName = 'A'.repeat(101);
        expect(() =>
          categoryEntity.make({ ...basePayload, name: longName })
        ).toThrow(AppError);
      });

      it('should accept trimmed name length up to 100', () => {
        const longName = 'A'.repeat(100);
        const result = categoryEntity.make({ ...basePayload, name: longName });
        expect(result.name).toBe(longName);
      });
    });
  });

  describe('update', () => {
    let existingCategory: ICategory;

    beforeEach(() => {
      existingCategory = categoryEntity.make({
        name: 'Original Name',
        type: ECategoryType.Income,
        description: 'Original Description',
        parentId: null,
        userId: null,
        taxKey: taxKey.income.make(null),
      });

      jest.advanceTimersByTime(1000);
    });

    it('should update name correctly and sanitize it', () => {
      const options = { name: '  Updated Name  ' };
      const result = categoryEntity.update(existingCategory, options);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Original Description');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        existingCategory.updatedAt.getTime()
      );
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should update description correctly', () => {
      const options = { description: 'Updated Description' };
      const result = categoryEntity.update(existingCategory, options);

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
      const result = categoryEntity.update(existingCategory, options);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated Description');
    });

    it('should update name to empty string when updating with a string of only spaces', () => {
      const options = { name: '   ' };
      const result = categoryEntity.update(existingCategory, options);
      expect(result.name).toBe('');
    });

    it('should ignore falsy name during update and fallback to original name', () => {
      const options = { name: '' };
      const result = categoryEntity.update(existingCategory, options);
      expect(result.name).toBe('Original Name');
    });

    it('should fallback to category description if options.description is undefined', () => {
      const options = { description: undefined };
      const result = categoryEntity.update(existingCategory, options);
      expect(result.description).toBe('Original Description');
    });

    it('should update description to empty string if empty string is provided', () => {
      const options = { description: '' };
      const result = categoryEntity.update(existingCategory, options);
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
      const result = categoryEntity.update(existingCategory, {});
      expect(result.name).toBe('Original Name');
      expect(result.description).toBe('Original Description');
    });
  });

  describe('archive', () => {
    let activeCategory: any;

    beforeEach(() => {
      activeCategory = categoryEntity.make({
        name: 'Active Category',
        type: ECategoryType.Income,
        description: 'Desc',
        parentId: null,
        userId: null,
        taxKey: taxKey.income.make(null),
      });
      jest.advanceTimersByTime(1000);
    });

    it('should archive an active category and update updatedAt', () => {
      const result = categoryEntity.archive(activeCategory);

      expect(result.status).toBe('archived');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        activeCategory.updatedAt.getTime()
      );
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should return the identical category if already archived without updating timestamp', () => {
      const archivedCategory = categoryEntity.archive(activeCategory);
      jest.advanceTimersByTime(1000);
      const result = categoryEntity.archive(archivedCategory);

      expect(result).toBe(archivedCategory);
      expect(result.updatedAt.getTime()).toBe(
        archivedCategory.updatedAt.getTime()
      );
    });
  });

  describe('unarchive', () => {
    let archivedCategory: any;

    beforeEach(() => {
      const activeCategory = categoryEntity.make({
        name: 'Category To Archive',
        type: ECategoryType.Income,
        description: 'Desc',
        parentId: null,
        userId: null,
        taxKey: taxKey.income.make(null),
      });
      jest.advanceTimersByTime(1000);
      archivedCategory = categoryEntity.archive(activeCategory);
      jest.advanceTimersByTime(1000);
    });

    it('should unarchive an archived category and update updatedAt', () => {
      const result = categoryEntity.unarchive(archivedCategory);

      expect(result.status).toBe('active');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        archivedCategory.updatedAt.getTime()
      );
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should return the identical category if already active without updating timestamp', () => {
      const activeCategory = categoryEntity.unarchive(archivedCategory);
      jest.advanceTimersByTime(1000);
      const result = categoryEntity.unarchive(activeCategory);

      expect(result).toBe(activeCategory);
      expect(result.updatedAt.getTime()).toBe(
        activeCategory.updatedAt.getTime()
      );
    });
  });
});
