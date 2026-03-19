import { AppError } from '../../../../shared/value-objects/error';
import {
  ELedgerAccountType,
  ULedgerAccountType,
} from '../../types/ledger-account.types';

function validateType(type: ULedgerAccountType) {
  const isValid = [
    ELedgerAccountType.Asset,
    ELedgerAccountType.Liability,
    ELedgerAccountType.Equity,
    ELedgerAccountType.Revenue,
    ELedgerAccountType.Expense,
  ].includes(type);

  if (!isValid) {
    throw new AppError('Invalid account type', { cause: type });
  }
}

function sanitizeName(name: string): string {
  const isInvalid =
    typeof name !== 'string' || name.trim().length === 0 || name.length > 100;
  if (isInvalid) {
    throw new AppError('Invalid account name', { cause: name });
  }
  return name.trim();
}

function sanitizeSubType(subType?: string | null): string | null {
  if (!subType) {
    return null;
  }
  const isInvalid =
    typeof subType !== 'string' ||
    subType.trim().length === 0 ||
    subType.length > 100;
  if (isInvalid) {
    throw new AppError('Invalid account sub type', { cause: subType });
  }
  return subType.trim();
}

const accountHelpers = Object.freeze({
  validateType,
  sanitizeName,
  sanitizeSubType,
});

export default accountHelpers;
