import ICurrencyRepo from '../../../domain/currency/repos/currency.repo';
import IStorage from '../../contracts/storage/store.contract';

export default function getCurrenciesUseCase(
  currencyRepo: ICurrencyRepo,
  storage: IStorage
) {
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
