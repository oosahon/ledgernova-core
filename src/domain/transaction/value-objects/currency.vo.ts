import { ICurrency } from '../types/money.types';

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

const currencies: Record<string, ICurrency> = {
  NGN: Naira,
  USD: USDollar,
  CAD: CanadianDollar,
  EUR: Euro,
  GBP: Pounds,
  JPY: Yen,
};

function isValidCurrencyCode(code: string): boolean {
  return Object.keys(currencies).includes(code);
}

function isValidMinorUnit(minorUnit: number): boolean {
  return Number.isInteger(minorUnit) && minorUnit >= 0 && minorUnit <= 8;
}

const currencyValue = Object.freeze({
  value: currencies,
  isValidCurrencyCode,
  isValidMinorUnit,
});

export default currencyValue;
