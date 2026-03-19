import { ICurrency } from '../../../domain/currency/types/currency.types';

const NAIRA: ICurrency = {
  name: 'Naira',
  symbol: '₦',
  code: 'NGN',
  minorUnit: 2n,
};

const USD: ICurrency = {
  name: 'United States Dollar',
  symbol: '$',
  code: 'USD',
  minorUnit: 2n,
};

const EUR: ICurrency = {
  name: 'Euro',
  symbol: '€',
  code: 'EUR',
  minorUnit: 2n,
};

const GBP: ICurrency = {
  name: 'British Pound',
  symbol: '£',
  code: 'GBP',
  minorUnit: 2n,
};

const CAD: ICurrency = {
  name: 'Canadian Dollar',
  symbol: '$',
  code: 'CAD',
  minorUnit: 2n,
};

const YEN: ICurrency = {
  name: 'Yen',
  symbol: '¥',
  code: 'JPY',
  minorUnit: 0n,
};

const YUAN: ICurrency = {
  name: 'Yuan',
  symbol: '¥',
  code: 'CNY',
  minorUnit: 2n,
};

const DIRHAM: ICurrency = {
  name: 'Dirham',
  symbol: 'د.إ',
  code: 'AED',
  minorUnit: 2n,
};

export const SYSTEM_CURRENCIES = [NAIRA, USD, EUR, GBP, CAD, YEN, YUAN, DIRHAM];
