import { TDBTransaction } from '../../../shared/types/seeder.types';
import currencyRepo from '../repos/currency.repo.impl';
import { ICurrency } from '../../../shared/types/money.types';

const Naira: ICurrency = {
  code: 'NGN',
  symbol: '₦',
  name: 'Naira',
  minorUnit: 2n,
};

const USDollar: ICurrency = {
  code: 'USD',
  symbol: '$',
  name: 'Dollar',
  minorUnit: 2n,
};

const CanadianDollar: ICurrency = {
  code: 'CAD',
  symbol: '$',
  name: 'Dollar',
  minorUnit: 2n,
};

const Euro: ICurrency = {
  code: 'EUR',
  symbol: '€',
  name: 'Euro',
  minorUnit: 2n,
};

const Pounds: ICurrency = {
  code: 'GBP',
  symbol: '£',
  name: 'Pounds',
  minorUnit: 2n,
};

const Yen: ICurrency = {
  code: 'JPY',
  symbol: '¥',
  name: 'Yen',
  minorUnit: 0n,
};

const currencies = [Naira, USDollar, CanadianDollar, Euro, Pounds, Yen];

// Always use the transaction passed to you
export default async function main(tx: TDBTransaction) {
  for (const currency of currencies) {
    await currencyRepo.save(currency, {
      tx,
      correlationId: '0002-currencies-seed',
    });
  }
}
