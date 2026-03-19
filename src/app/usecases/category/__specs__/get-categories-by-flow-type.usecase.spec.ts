import getCategoriesByFlowTypeUseCase from '../get-categories-by-flow-type.usecase';
import ICategoryRepo from '../../../../domain/category/repos/category.repo';
import { MockStore } from '../../../contracts/storage/__mocks__/store.contract.mock';
import { IStore } from '../../../../shared/types/store.types';

// TODO: reimplement this usecase;
type UCategoryFlowType = 'in' | 'out';

describe('getCategoriesByFlowTypeUseCase', () => {
  let categoryRepo: jest.Mocked<ICategoryRepo>;

  beforeEach(() => {
    categoryRepo = {
      findAllByFlowType: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepo>;

    jest.clearAllMocks();
  });

  it('should get categories by flow type successfully', async () => {
    const correlationId = 'test-corr-id';
    const userId = 'test-user-id';
    const flowType: UCategoryFlowType = 'in';

    MockStore.get.mockReturnValue({
      correlationId,
      user: { id: userId },
    } as IStore);

    const mockCategories = [
      { id: 'cat-1', name: 'Salary', flowType: 'in' },
      { id: 'cat-2', name: 'Freelance', flowType: 'in' },
    ] as any;

    categoryRepo.findAllByFlowType.mockResolvedValue(mockCategories);

    const usecase = getCategoriesByFlowTypeUseCase(categoryRepo, MockStore);
    const result = await usecase(flowType);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAllByFlowType).toHaveBeenCalledWith(
      flowType,
      { correlationId },
      userId
    );
    expect(result).toEqual(mockCategories);
  });

  it('should pass undefined as user id when user is not present in store', async () => {
    const correlationId = 'test-corr-id-2';
    const flowType: UCategoryFlowType = 'out';

    MockStore.get.mockReturnValue({
      correlationId,
      // no user
    } as IStore);

    const mockCategories = [
      { id: 'cat-3', name: 'Food', flowType: 'out' },
    ] as any;

    categoryRepo.findAllByFlowType.mockResolvedValue(mockCategories);

    const usecase = getCategoriesByFlowTypeUseCase(categoryRepo, MockStore);
    const result = await usecase(flowType);

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(categoryRepo.findAllByFlowType).toHaveBeenCalledWith(
      flowType,
      { correlationId },
      undefined
    );
    expect(result).toEqual(mockCategories);
  });
});
