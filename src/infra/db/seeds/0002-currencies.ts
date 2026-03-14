import currencyValue from '../../../shared/value-objects/currency.vo';
import { TDBTransaction } from '../../../shared/types/seeder.types';
import currencyRepo from '../repos/currency.repo.impl';

// Always use the transaction passed to you
export default async function main(tx: TDBTransaction) {
  const currencies = Object.values(currencyValue.value);

  for (const currency of currencies) {
    await currencyRepo.save(currency, {
      tx,
      correlationId: '0002-currencies-seed',
    });
  }
}
