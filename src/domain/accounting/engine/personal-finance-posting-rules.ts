import { AppError } from '../../../shared/value-objects/error';
import {
  ELedgerAccountType,
  ULedgerAccountType,
} from '../../account/types/account.types';
import { IPostingAdvisory } from '../types/posting-rule';

function validateAccountType(accountType: ULedgerAccountType) {
  const isValid =
    accountType === ELedgerAccountType.Asset ||
    accountType === ELedgerAccountType.Liability;

  if (!isValid) {
    throw new AppError(`Invalid account type for personal finance`, {
      cause: { accountType },
    });
  }
}

function inflowRule(accountType: ULedgerAccountType): IPostingAdvisory {
  validateAccountType(accountType);

  if (accountType === ELedgerAccountType.Asset) {
    return Object.freeze({
      debit: ELedgerAccountType.Asset,
      credit: ELedgerAccountType.Revenue,
    });
  }

  return Object.freeze({
    debit: ELedgerAccountType.Liability,
    credit: ELedgerAccountType.Revenue,
  });
}

function outflowRule(accountType: ULedgerAccountType): IPostingAdvisory {
  validateAccountType(accountType);

  if (accountType === ELedgerAccountType.Asset) {
    return Object.freeze({
      debit: ELedgerAccountType.Revenue,
      credit: ELedgerAccountType.Asset,
    });
  }

  return Object.freeze({
    debit: ELedgerAccountType.Revenue,
    credit: ELedgerAccountType.Liability,
  });
}

function transferRule(
  fromAccountType: ULedgerAccountType,
  toAccountType: ULedgerAccountType
): IPostingAdvisory {
  const isValidTransfer =
    fromAccountType === ELedgerAccountType.Asset &&
    toAccountType === ELedgerAccountType.Asset;

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

function openingBalanceRule(accountType: ULedgerAccountType): IPostingAdvisory {
  validateAccountType(accountType);

  if (accountType === ELedgerAccountType.Asset) {
    return Object.freeze({
      debit: ELedgerAccountType.Asset,
      credit: ELedgerAccountType.Equity,
    });
  }

  return Object.freeze({
    debit: ELedgerAccountType.Equity,
    credit: ELedgerAccountType.Liability,
  });
}

const personalFinancePostingRules = Object.freeze({
  inflow: inflowRule,
  outflow: outflowRule,
  transfer: transferRule,
  openingBalance: openingBalanceRule,
});

export default personalFinancePostingRules;
