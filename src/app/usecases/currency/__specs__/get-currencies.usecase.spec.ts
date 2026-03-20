import getCurrenciesUseCase from '../get-currencies.usecase';
import { MockCurrencyRepo } from '../../../../infra/db/repos/__mocks__/currency.repo.impl.mock';
import MockRequestContext from '../../../contracts/storage/__mocks__/request-context.mock';
import { ICurrency } from '../../../../domain/currency/types/currency.types';
import IRequestContext from '../../../../shared/types/request-context.types';

/**
 * ========= USECASE TESTS =========
 *
 * DOMAIN: global
 *
 * This usecase is used to get all supported currencies
 */
describe('getCurrenciesUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all currencies successfully', async () => {
    const correlationId = 'test-corr-id';

    MockRequestContext.get.mockReturnValue({
      correlationId,
    } as IRequestContext);

    const mockCurrencies = [
      { code: 'USD', symbol: '$', name: 'US Dollar', minorUnit: 2n },
      { code: 'EUR', symbol: '€', name: 'Euro', minorUnit: 2n },
    ] as ICurrency[];

    MockCurrencyRepo.findAll.mockResolvedValue(mockCurrencies);

    const usecase = getCurrenciesUseCase(MockCurrencyRepo, MockRequestContext);
    const result = await usecase();

    expect(MockRequestContext.get).toHaveBeenCalledTimes(1);
    expect(MockCurrencyRepo.findAll).toHaveBeenCalledWith({ correlationId });
    expect(result).toEqual(
      mockCurrencies.map((c) => ({
        ...c,
        minorUnit: Number(c.minorUnit),
      }))
    );
  });
});
