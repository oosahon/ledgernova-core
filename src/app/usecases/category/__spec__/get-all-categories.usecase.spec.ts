import getAllCategoriesUseCase from '../get-all-categories.usecase';
import { MockCategoryRepo } from '../../../../infra/db/repos/__mocks__/category.repo.impl.mock';
import MockRequestContext from '../../../contracts/storage/__mocks__/request-context.mock';
import accountingRules from '../../../../domain/accounting/rules';
import { UJournalDirection } from '../../../../domain/journal-entry/types/journal-entry.types';
import { ULedgerType } from '../../../../domain/ledger-account/types/index.types';
import { EAccountingDomain } from '../../../../domain/accounting/types/accounting.types';
import { ECategoryType } from '../../../../domain/category/types/category.types';

describe('getAllCategoriesUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all categories successfully with user ID', async () => {
    const correlationId = 'test-corr-id';
    const accountingDomain = EAccountingDomain.Individual;
    const user = { id: 'user-1' };

    MockRequestContext.get.mockReturnValue({
      correlationId,
      accountingDomain,
      user,
    } as any);

    const mockCategories = [
      { id: 'cat-1', name: 'Category 1', type: 'EXPENSE_CATEGORY' },
      { id: 'cat-2', name: 'Category 2', type: 'ASSET_CATEGORY' },
    ];

    MockCategoryRepo.findAll.mockResolvedValue(mockCategories as any);

    const usecase = getAllCategoriesUseCase(
      MockCategoryRepo as any,
      MockRequestContext as any
    );

    const ledgerAccountType: ULedgerType = 'asset';
    const transactionDirection: UJournalDirection = 'debit';

    // Call the actual domain logic to get the expected types permitted
    const permittedTypes =
      accountingRules.getApplicationCategories(ledgerAccountType);

    const result = await usecase({
      ledgerType: ledgerAccountType,
      transactionDirection,
    });

    expect(MockRequestContext.get).toHaveBeenCalledTimes(1);
    expect(MockCategoryRepo.findAll).toHaveBeenCalledWith(
      {
        accountingDomain,
        types: permittedTypes[transactionDirection],
        userId: user.id,
      },
      { correlationId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should get all categories successfully without user ID when domain is organization', async () => {
    const correlationId = 'test-corr-id-2';
    const accountingDomain = EAccountingDomain.Organization;
    const user = { id: 'user-2' }; // User is present but should be ignored

    MockRequestContext.get.mockReturnValue({
      correlationId,
      accountingDomain,
      user,
    } as any);

    const mockCategories = [
      { id: 'cat-3', name: 'Category 3', type: 'ASSET_CATEGORY' },
    ];

    MockCategoryRepo.findAll.mockResolvedValue(mockCategories as any);

    const usecase = getAllCategoriesUseCase(
      MockCategoryRepo as any,
      MockRequestContext as any
    );

    const ledgerAccountType: ULedgerType = 'asset';
    const transactionDirection: UJournalDirection = 'debit';

    const permittedTypes =
      accountingRules.getApplicationCategories(ledgerAccountType);

    const result = await usecase({
      ledgerType: ledgerAccountType,
      transactionDirection,
    });

    expect(MockRequestContext.get).toHaveBeenCalledTimes(1);
    expect(MockCategoryRepo.findAll).toHaveBeenCalledWith(
      {
        accountingDomain,
        types: permittedTypes[transactionDirection],
        userId: undefined,
      },
      { correlationId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should return all ECategoryType values when no ledgerType is provided', async () => {
    const correlationId = 'test-corr-id-3';
    const accountingDomain = EAccountingDomain.Individual;
    const user = { id: 'user-3' };

    MockRequestContext.get.mockReturnValue({
      correlationId,
      accountingDomain,
      user,
    } as any);

    const mockCategories = [
      { id: 'cat-4', name: 'Category 4', type: 'ASSET_CATEGORY' },
    ];

    MockCategoryRepo.findAll.mockResolvedValue(mockCategories as any);

    const usecase = getAllCategoriesUseCase(
      MockCategoryRepo as any,
      MockRequestContext as any
    );

    const result = await usecase({});

    expect(MockCategoryRepo.findAll).toHaveBeenCalledWith(
      {
        accountingDomain,
        types: Object.values(ECategoryType),
        userId: user.id,
      },
      { correlationId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should get all categories successfully specifying undefined userId if user is not present for individual domain', async () => {
    const correlationId = 'test-corr-id-5';
    const accountingDomain = EAccountingDomain.Individual;

    MockRequestContext.get.mockReturnValue({
      correlationId,
      accountingDomain,
      user: undefined,
    } as any);

    const mockCategories = [
      { id: 'cat-6', name: 'Category 6', type: 'EXPENSE_CATEGORY' },
    ];

    MockCategoryRepo.findAll.mockResolvedValue(mockCategories as any);

    const usecase = getAllCategoriesUseCase(
      MockCategoryRepo as any,
      MockRequestContext as any
    );

    const result = await usecase({});

    expect(MockCategoryRepo.findAll).toHaveBeenCalledWith(
      {
        accountingDomain,
        types: Object.values(ECategoryType),
        userId: undefined,
      },
      { correlationId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should return combined debit and credit categories when no transactionDirection is provided', async () => {
    const correlationId = 'test-corr-id-4';
    const accountingDomain = EAccountingDomain.SoleTrader;
    const user = { id: 'user-4' };

    MockRequestContext.get.mockReturnValue({
      correlationId,
      accountingDomain,
      user,
    } as any);

    const mockCategories = [
      { id: 'cat-5', name: 'Category 5', type: 'INCOME_CATEGORY' },
    ];

    MockCategoryRepo.findAll.mockResolvedValue(mockCategories as any);

    const usecase = getAllCategoriesUseCase(
      MockCategoryRepo as any,
      MockRequestContext as any
    );

    const ledgerAccountType: ULedgerType = 'revenue';

    const categories =
      accountingRules.getApplicationCategories(ledgerAccountType);
    const expectedTypes = [
      ...new Set([...categories.debit, ...categories.credit]),
    ];

    const result = await usecase({ ledgerType: ledgerAccountType });

    expect(MockCategoryRepo.findAll).toHaveBeenCalledWith(
      {
        accountingDomain,
        types: expectedTypes,
        userId: user.id,
      },
      { correlationId }
    );
    expect(result).toEqual(mockCategories);
  });
});
