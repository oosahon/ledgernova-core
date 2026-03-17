import getCurrenciesUseCase from '../get-currencies.usecase';
import ICurrencyRepo from '../../../../domain/transaction/repos/currency.repo';
import { MockStore } from '../../../contracts/storage/__mocks__/store.contract.mock';
import { IStore } from '../../../../shared/types/store.types';
import { ICurrency } from '../../../../shared/types/money.types';

describe('getCurrenciesUseCase', () => {
  let currencyRepo: jest.Mocked<ICurrencyRepo>;

  beforeEach(() => {
    currencyRepo = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ICurrencyRepo>;

    jest.clearAllMocks();
  });

  it('should get all currencies successfully', async () => {
    const correlationId = 'test-corr-id';

    MockStore.get.mockReturnValue({
      correlationId,
    } as IStore);

    const mockCurrencies = [
      { code: 'USD', symbol: '$', name: 'US Dollar', minorUnit: 2n },
      { code: 'EUR', symbol: '€', name: 'Euro', minorUnit: 2n },
    ] as ICurrency[];

    currencyRepo.findAll.mockResolvedValue(mockCurrencies);

    const usecase = getCurrenciesUseCase(currencyRepo, MockStore);
    const result = await usecase();

    expect(MockStore.get).toHaveBeenCalledTimes(1);
    expect(currencyRepo.findAll).toHaveBeenCalledWith({ correlationId });
    expect(result).toEqual(
      mockCurrencies.map((c) => ({
        ...c,
        minorUnit: Number(c.minorUnit),
      }))
    );
  });
});
