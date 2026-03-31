import { AppError } from '../../../shared/value-objects/error';
import { ELedgerType, ULedgerType } from '../../ledger/types/index.types';
import { IPostingAdvisory } from '../types/posting-rule';

function validateAccountType(accountType: ULedgerType) {
  const isValid =
    accountType === ELedgerType.Asset || accountType === ELedgerType.Liability;

  if (!isValid) {
    throw new AppError(`Invalid account type for personal finance`, {
      cause: { accountType },
    });
  }
}

function inflowRule(accountType: ULedgerType): IPostingAdvisory {
  validateAccountType(accountType);

  if (accountType === ELedgerType.Asset) {
    return Object.freeze({
      debit: ELedgerType.Asset,
      credit: ELedgerType.Revenue,
    });
  }

  return Object.freeze({
    debit: ELedgerType.Liability,
    credit: ELedgerType.Revenue,
  });
}

function outflowRule(accountType: ULedgerType): IPostingAdvisory {
  validateAccountType(accountType);

  if (accountType === ELedgerType.Asset) {
    return Object.freeze({
      debit: ELedgerType.Revenue,
      credit: ELedgerType.Asset,
    });
  }

  return Object.freeze({
    debit: ELedgerType.Revenue,
    credit: ELedgerType.Liability,
  });
}

function transferRule(
  fromAccountType: ULedgerType,
  toAccountType: ULedgerType
): IPostingAdvisory {
  const isValidTransfer =
    fromAccountType === ELedgerType.Asset &&
    toAccountType === ELedgerType.Asset;

  if (!isValidTransfer) {
    throw new AppError(`Invalid account type for transfer `, {
      cause: { toAccountType, fromAccountType },
    });
  }

  return Object.freeze({
    debit: fromAccountType,
    credit: toAccountType,
  });
}

function openingBalanceRule(accountType: ULedgerType): IPostingAdvisory {
  validateAccountType(accountType);

  if (accountType === ELedgerType.Asset) {
    return Object.freeze({
      debit: ELedgerType.Asset,
      credit: ELedgerType.Equity,
    });
  }

  return Object.freeze({
    debit: ELedgerType.Equity,
    credit: ELedgerType.Liability,
  });
}

const personalFinancePostingRules = Object.freeze({
  inflow: inflowRule,
  outflow: outflowRule,
  transfer: transferRule,
  openingBalance: openingBalanceRule,
});

export default personalFinancePostingRules;
