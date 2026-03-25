/**
 * The personal income tax is calculated progressively per the NTA 2025
 */

import { IMoney } from '../../../../shared/types/money.types';
import { AppError } from '../../../../shared/value-objects/error';
import moneyValue from '../../../../shared/value-objects/money.vo';
import {
  IPersonalIncomeTaxCalculatorLogs,
  IPITProgressiveTaxationResult,
} from '../../types/personal-income-tax.types';

export default function personalIncomeTaxCalculator(
  taxableAmount: IMoney,
  currentBand: number, // !!! should always start from 0 !!!
  currentTax: IMoney,
  logs: IPersonalIncomeTaxCalculatorLogs[]
): IPITProgressiveTaxationResult {
  const TAX_BANDS = [
    { limit: 800_000, rate: 0 },
    { limit: 3_000_000, rate: 15 },
    { limit: 12_000_000, rate: 18 },
    { limit: 25_000_000, rate: 21 },
    { limit: 50_000_000, rate: 23 },
    { limit: Infinity, rate: 25 },
  ];

  if (!taxableAmount) {
    throw new AppError('Taxable amount is required', {
      cause: { taxableAmount },
    });
  }

  const zeroAmount = moneyValue.makeZeroAmount(taxableAmount.currency);

  const shouldExit =
    currentBand >= TAX_BANDS.length ||
    moneyValue.isGreaterThan(taxableAmount, zeroAmount);

  if (shouldExit) {
    return Object.freeze({
      tax: currentTax,
      band: currentBand,
      logs,
    });
  }

  const { rate, limit } = TAX_BANDS[currentBand];

  const limitAmount = moneyValue.make(limit, taxableAmount.currency, false);

  const amountToTax = moneyValue.min(taxableAmount, limitAmount);

  const tax = moneyValue.multiply(amountToTax, {
    numerator: rate,
    denominator: 100,
  });
  const newTaxAmount = moneyValue.add(currentTax, tax);
  const newTaxableAmount = moneyValue.subtract(taxableAmount, amountToTax);

  const logEntry: IPersonalIncomeTaxCalculatorLogs = {
    amountTaxed: amountToTax,
    band: currentBand,
    tax: tax,
  };

  return personalIncomeTaxCalculator(
    newTaxableAmount,
    currentBand + 1,
    newTaxAmount,
    [...logs, logEntry]
  );
}
