import getCategoriesUseCase from '../get-categories.usecase';
import ICategoryRepo from '../../../../domain/category/repos/category.repo';
import { ECategoryType } from '../../../../domain/category/types/category.types';
import { MockStore } from '../../../contracts/storage/__mocks__/store.contract.mock';

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
    } as any);

    const mockCategories = [{ id: '1', name: 'category 1' }] as any;
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
      user: null as any,
    } as any);

    const mockCategories = [] as any;
    categoryRepo.findAll.mockResolvedValue(mockCategories);

    const execute = getCategoriesUseCase(categoryRepo, MockStore);
    const result = await execute(ECategoryType.Income);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAll).toHaveBeenCalledWith(
      [ECategoryType.Income, ECategoryType.LiabilityIncome],
      { correlationId },
      { userId: undefined }
    );
    expect(result).toEqual(mockCategories);
  });
});
