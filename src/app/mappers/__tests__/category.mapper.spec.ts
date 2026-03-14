import categoryMapper from '../category.mapper';
import { ECategoryType } from '../../../domain/category/types/category.types';

describe('Category Mapper', () => {
  const commonDomainDates = {
    createdAt: new Date('2026-03-14T10:00:00.000Z'),
    updatedAt: new Date('2026-03-14T11:00:00.000Z'),
    deletedAt: null,
  };

  const commonRepoDates = {
    createdAt: '2026-03-14T10:00:00.000Z',
    updatedAt: '2026-03-14T11:00:00.000Z',
    deletedAt: null,
  };

  describe('toRepo', () => {
    it('should map a domain category to a repo model', () => {
      const domainCategory = {
        id: 'category-id',
        name: 'Test Category',
        description: 'Test Description',
        type: ECategoryType.Expense,
        userId: 'user-id',
        parentId: 'parent-id',
        taxKey: 'tax-key',
        isDefaultRoot: false,
        isActive: true,
        ...commonDomainDates,
      };

      const expectedRepoModel = {
        id: 'category-id',
        name: 'Test Category',
        description: 'Test Description',
        type: ECategoryType.Expense,
        userId: 'user-id',
        parentId: 'parent-id',
        taxKey: 'tax-key',
        isDefaultRoot: false,
        isActive: true,
        ...commonRepoDates,
      };

      expect(categoryMapper.toRepo(domainCategory as any)).toEqual(
        expectedRepoModel
      );
    });

    it('should handle missing optional fields when mapping to repo model', () => {
      const domainCategory = {
        id: 'category-id',
        name: 'Test Category',
        description: null,
        type: ECategoryType.Income,
        isDefaultRoot: true,
        isActive: true,
        ...commonDomainDates,
      };

      const expectedRepoModel = {
        id: 'category-id',
        name: 'Test Category',
        description: null,
        type: ECategoryType.Income,
        userId: null,
        parentId: null,
        taxKey: null,
        isDefaultRoot: true,
        isActive: true,
        ...commonRepoDates,
      };

      expect(categoryMapper.toRepo(domainCategory as any)).toEqual(
        expectedRepoModel
      );
    });
  });

  describe('toDomainExpense', () => {
    it('should map a repo model to a domain expense category', () => {
      const repoModel = {
        id: 'category-id',
        name: 'Expense Category',
        description: 'Expense Description',
        type: ECategoryType.Expense,
        userId: 'user-id',
        parentId: null,
        taxKey: 'tax-key',
        isDefaultRoot: false,
        isActive: true,
        ...commonRepoDates,
      };

      const expectedDomainCategory = {
        id: 'category-id',
        name: 'Expense Category',
        description: 'Expense Description',
        type: ECategoryType.Expense,
        userId: 'user-id',
        parentId: null,
        taxKey: 'tax-key',
        isDefaultRoot: false,
        isActive: true,
        ...commonDomainDates,
      };

      expect(categoryMapper.toDomainExpense(repoModel as any)).toEqual(
        expectedDomainCategory
      );
    });

    it('should overwrite type to Expense even if repo model has Income type', () => {
      const repoModel = {
        id: 'category-id',
        name: 'Test Category',
        description: null,
        type: ECategoryType.Income,
        userId: null,
        parentId: null,
        taxKey: null,
        isDefaultRoot: false,
        isActive: true,
        ...commonRepoDates,
      };

      const result = categoryMapper.toDomainExpense(repoModel as any);
      expect(result.type).toBe(ECategoryType.Expense);
    });
  });

  describe('toDomainIncome', () => {
    it('should map a repo model to a domain income category', () => {
      const repoModel = {
        id: 'category-id',
        name: 'Income Category',
        description: 'Income Description',
        type: ECategoryType.Income,
        userId: 'user-id',
        parentId: 'parent-id',
        taxKey: 'tax-key',
        isDefaultRoot: true,
        isActive: true,
        ...commonRepoDates,
      };

      const expectedDomainCategory = {
        id: 'category-id',
        name: 'Income Category',
        description: 'Income Description',
        type: ECategoryType.Income,
        userId: 'user-id',
        parentId: 'parent-id',
        taxKey: 'tax-key',
        isDefaultRoot: true,
        isActive: true,
        ...commonDomainDates,
      };

      expect(categoryMapper.toDomainIncome(repoModel as any)).toEqual(
        expectedDomainCategory
      );
    });

    it('should overwrite type to Income even if repo model has Expense type', () => {
      const repoModel = {
        id: 'category-id',
        name: 'Test Category',
        description: null,
        type: ECategoryType.Expense,
        userId: null,
        parentId: null,
        taxKey: null,
        isDefaultRoot: false,
        isActive: true,
        ...commonRepoDates,
      };

      const result = categoryMapper.toDomainIncome(repoModel as any);
      expect(result.type).toBe(ECategoryType.Income);
    });
  });
});
