import categoryMapper from '../category.mapper';
import { ICategory } from '../../../domain/category/types/category.types';
import { EAccountingEntityType } from '../../../domain/accounting/types/accounting.types';
import { ETransactionType } from '../../../domain/transaction/types/transaction.types';

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
      const domainCategory: ICategory = {
        id: 'category-id',
        name: 'Test Category',
        description: 'Test Description',
        type: ETransactionType.Expense,
        createdBy: 'user-id',
        parentId: 'parent-id',
        taxKey: 'tax-key',
        status: 'active' as const,
        accountingEntityType: EAccountingEntityType.Individual,
        ...commonDomainDates,
      };

      const expectedRepoModel = {
        id: 'category-id',
        name: 'Test Category',
        description: 'Test Description',
        type: ETransactionType.Expense,
        createdBy: 'user-id',
        parentId: 'parent-id',
        taxKey: 'tax-key',
        status: 'active' as const,
        accountingEntityType: EAccountingEntityType.Individual,
        ...commonRepoDates,
      };

      expect(categoryMapper.toRepo(domainCategory)).toEqual(
        expectedRepoModel as any
      );
    });

    it('should handle missing optional fields when mapping to repo model', () => {
      const domainCategory: ICategory = {
        id: 'category-id',
        name: 'Test Category',
        description: 'sas',
        type: ETransactionType.Receipt,
        status: 'active' as const,
        parentId: null,
        taxKey: 'sxa',
        createdBy: null,
        accountingEntityType: EAccountingEntityType.Individual,
        ...commonDomainDates,
      };

      const { type, ...domainCategoryOmittedType } = domainCategory;

      const expectedRepoModel = {
        ...domainCategoryOmittedType,
        type: ETransactionType.Receipt,
        ...commonRepoDates,
      };

      expect(categoryMapper.toRepo(domainCategory)).toEqual(
        expectedRepoModel as any
      );
    });
  });

  describe('toDomain', () => {
    it('should map a repo model to a domain expense category', () => {
      const repoModel = {
        id: 'category-id',
        name: 'Expense Category',
        description: 'Expense Description',
        type: ETransactionType.Expense,
        createdBy: 'user-id',
        parentId: null,
        taxKey: 'tax-key',
        status: 'active' as const,
        accountingEntityType: EAccountingEntityType.Individual,
        ...commonRepoDates,
      };

      const expectedDomainCategory: ICategory = {
        id: 'category-id',
        name: 'Expense Category',
        description: 'Expense Description',
        type: ETransactionType.Expense,
        createdBy: 'user-id',
        parentId: null,
        taxKey: 'tax-key',
        status: 'active' as const,
        accountingEntityType: EAccountingEntityType.Individual,
        ...commonDomainDates,
      };

      expect(categoryMapper.toDomain(repoModel as any)).toEqual(
        expectedDomainCategory
      );
    });
  });
});
