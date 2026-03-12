import { AppError } from '../../../shared/value-objects/error';
import { ICurrency, IMoney } from '../types/money.types';
import currencyValueObject from '../value-objects/currency.vo';

// TODO (i18n): translate error messages

interface IFactor {
  numerator: number;
  denominator: number;
}

/**
 * Checks if the factor is valid.
 */
function isValidFactor(factor: IFactor) {
  return (
    Number.isSafeInteger(factor.numerator) &&
    Number.isSafeInteger(factor.denominator) &&
    factor.denominator > 0
  );
}

/**
 * Normalizes an amount to its minor unit.
 */
function getNormalizedMinorUnit(amount: bigint | number, currency: ICurrency) {
  const normalizer = 10n ** currency.minorUnit;
  const normalizedAmount = Math.round(
    Number.parseFloat(amount.toString()) * Number(normalizer)
  );

  if (!Number.isSafeInteger(normalizedAmount)) {
    throw new AppError('Provide normalizable amount', {
      cause: { amount, currency },
    });
  }

  return BigInt(normalizedAmount);
}

/**
 * Creates a new money object.
 */
function make(
  amount: bigint | number,
  currency: ICurrency,
  isInMinorUnit: boolean
) {
  const isValidCurrencyCode = currencyValueObject.isValidCurrencyCode(
    currency.code
  );

  if (!isValidCurrencyCode) {
    throw new AppError('error.currency.invalid_code');
  }

  if (
    isInMinorUnit &&
    typeof amount === 'number' &&
    !Number.isSafeInteger(amount)
  ) {
    throw new AppError('Provide a non-fractional amount', { cause: amount });
  }

  const computedAmount = isInMinorUnit
    ? BigInt(amount)
    : getNormalizedMinorUnit(amount, currency);

  return Object.freeze({
    amount: computedAmount,
    currency,
  });
}

/**
 * Creates a new money object with zero amount.
 */

function makeZeroAmount(currency: ICurrency) {
  return make(0, currency, true);
}

/**
 * Checks if all money objects have the same currency.
 */
function isSameCurrency(...args: IMoney[]) {
  if (!args.length) return false;
  return args.every((a) => a.currency.code === args[0].currency.code);
}

/**
 * Adds money objects.
 */
function add(...args: IMoney[]): IMoney {
  if (!args.length) {
    throw new AppError('Provide at least one parameter');
  }

  if (!isSameCurrency(...args)) {
    throw new AppError('Please provide money objects with the same currency', {
      cause: args,
    });
  }

  const result = args.reduce((acc, param) => acc + param.amount, BigInt(0));

  const currency = args[0].currency;
  return make(result, currency, true);
}

/**
 * Subtracts money objects.
 */
function subtract(...args: IMoney[]): IMoney {
  if (!args.length) {
    throw new AppError('Provide at least one parameter', { cause: args });
  }

  if (!isSameCurrency(...args)) {
    throw new AppError('Please provide money objects with the same currency', {
      cause: args,
    });
  }

  const [first, ...rest] = args;
  const result = rest.reduce((acc, p) => acc - p.amount, first.amount);
  const currency = first.currency;

  return make(result, currency, true);
}

/**
 * Multiplies money objects.
 */
function multiply(money: IMoney, factor: IFactor): IMoney {
  if (!isValidFactor(factor)) {
    throw new AppError('Please provide a valid factor', { cause: factor });
  }

  const result =
    (money.amount * BigInt(factor.numerator)) / BigInt(factor.denominator);
  return make(result, money.currency, true);
}

/**
 * Divides money objects.
 */
function divide(
  money: IMoney,
  divisor: IFactor
): { value: IMoney; remainder: IMoney } {
  if (divisor.numerator === 0) {
    throw new AppError('Cannot divide by zero', { cause: divisor });
  }

  if (!isValidFactor(divisor)) {
    throw new AppError('Please provide a valid factor', { cause: divisor });
  }

  const numerator = BigInt(divisor.denominator);
  const denominator = BigInt(divisor.numerator);

  const result = (money.amount * numerator) / denominator;
  const remainder = (money.amount * numerator) % denominator;

  return {
    value: make(result, money.currency, true),
    remainder: make(remainder, money.currency, true),
  };
}

const money = Object.freeze({
  make,
  makeZeroAmount,
  isSameCurrency,
  add,
  subtract,
  divide,
  multiply,
});

export default money;
