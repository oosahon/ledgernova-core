import ICurrencyRepo from '../../../domain/currency/repos/currency.repo';
import IStorage from '../../contracts/storage/request-context.contract';

export default function getCurrenciesUseCase(
  currencyRepo: ICurrencyRepo,
  storage: IStorage
) {
  /**
   * ========= USECASE EXECUTOR =========
   *
   * DOMAIN: global
   *
   * This usecase is used to get all supported currencies
   */
  return async () => {
    const { correlationId } = storage.get();

    const res = await currencyRepo.findAll({
      correlationId,
    });

    return res.map((currency) => ({
      ...currency,
      minorUnit: Number(currency.minorUnit),
    }));
  };
}
