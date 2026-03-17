import getCategoriesUseCase from '../get-categories.usecase';
import ICategoryRepo from '../../../../domain/category/repos/category.repo';
import {
  ECategoryType,
  ICategory,
} from '../../../../domain/category/types/category.types';
import { MockStore } from '../../../contracts/storage/__mocks__/store.contract.mock';
import { IStore } from '../../../../shared/types/store.types';

describe('getCategoriesUseCase', () => {
  let categoryRepo: jest.Mocked<ICategoryRepo>;

  beforeEach(() => {
    categoryRepo = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepo>;

    jest.clearAllMocks();
  });

  it('should get categories for Income type', async () => {
    const correlationId = 'test-corr-id';
    const userId = 'test-user-id';

    MockStore.get.mockReturnValue({
      correlationId,
      user: { id: userId },
    } as IStore);

    const mockCategories = [{ id: '1', name: 'category 1' }] as ICategory[];
    categoryRepo.findAll.mockResolvedValue(mockCategories);

    const execute = getCategoriesUseCase(categoryRepo, MockStore);
    const result = await execute(ECategoryType.Income);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAll).toHaveBeenCalledWith(
      [ECategoryType.Income, ECategoryType.LiabilityIncome],
      { correlationId },
      { userId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should get categories for Expense type', async () => {
    const correlationId = 'test-corr-id';
    const userId = 'test-user-id';

    MockStore.get.mockReturnValue({
      correlationId,
      user: { id: userId },
    } as any);

    const mockCategories = [{ id: '1', name: 'category 1' }] as any;
    categoryRepo.findAll.mockResolvedValue(mockCategories);

    const execute = getCategoriesUseCase(categoryRepo, MockStore);
    const result = await execute(ECategoryType.Expense);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAll).toHaveBeenCalledWith(
      [ECategoryType.Expense, ECategoryType.LiabilityExpense],
      { correlationId },
      { userId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should get categories for LiabilityIncome type', async () => {
    const correlationId = 'test-corr-id';
    const userId = 'test-user-id';

    MockStore.get.mockReturnValue({
      correlationId,
      user: { id: userId },
    } as any);

    const mockCategories = [{ id: '1', name: 'category 1' }] as any;
    categoryRepo.findAll.mockResolvedValue(mockCategories);

    const execute = getCategoriesUseCase(categoryRepo, MockStore);
    const result = await execute(ECategoryType.LiabilityIncome);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAll).toHaveBeenCalledWith(
      [ECategoryType.LiabilityIncome],
      { correlationId },
      { userId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should get categories for LiabilityExpense type', async () => {
    const correlationId = 'test-corr-id';
    const userId = 'test-user-id';

    MockStore.get.mockReturnValue({
      correlationId,
      user: { id: userId },
    } as any);

    const mockCategories = [{ id: '1', name: 'category 1' }] as any;
    categoryRepo.findAll.mockResolvedValue(mockCategories);

    const execute = getCategoriesUseCase(categoryRepo, MockStore);
    const result = await execute(ECategoryType.LiabilityExpense);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAll).toHaveBeenCalledWith(
      [ECategoryType.LiabilityExpense],
      { correlationId },
      { userId }
    );
    expect(result).toEqual(mockCategories);
  });

  it('should handle undefined user gracefully', async () => {
    const correlationId = 'test-corr-id';

    MockStore.get.mockReturnValue({
      correlationId,
      user: null,
    } as IStore);

    const mockCategories = [] as any;
    categoryRepo.findAll.mockResolvedValue(mockCategories);

    const usecase = getCategoriesUseCase(categoryRepo, MockStore);
    const result = await usecase(ECategoryType.Income);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAll).toHaveBeenCalledWith(
      [ECategoryType.Income, ECategoryType.LiabilityIncome],
      { correlationId },
      { userId: undefined }
    );
    expect(result).toEqual(mockCategories);
  });
});
