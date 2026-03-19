/**
 * DOMAIN: personal
 * This rule is used to determine the valid categories for a given ledger account type.
 * This is to prevent users from creating invalid transactions for a specific ledger account type.
 *
 * NB:
 *  - This rule is only applicable to personal accounts
 *  - This rule is only applicable to system-managed ledger accounts ie ledger accounts with subtypes
 */

import {
  ECategoryType,
  UCategoryType,
} from '../../category/types/category.types';
import { UJournalDirection } from '../../journal-entry/types/journal-entry.types';
import {
  ELedgerType,
  ULedgerType,
} from '../../ledger-account/types/index.types';

function assetCategories(): Record<UJournalDirection, UCategoryType[]> {
  const debit = [
    ECategoryType.Sale,
    ECategoryType.Receipt,
    ECategoryType.DebitNote,
  ];

  const credit = [
    ECategoryType.Purchase,
    ECategoryType.Expense,
    ECategoryType.Payment,
    ECategoryType.CreditNote,
    ECategoryType.Sale,
  ];

  return {
    debit,
    credit,
  };
}

function liabilityCategories(): Record<UJournalDirection, UCategoryType[]> {
  const debit = [ECategoryType.Payment, ECategoryType.DebitNote];

  const credit = [
    ECategoryType.Purchase,
    ECategoryType.Expense,
    ECategoryType.Receipt,
  ];

  return {
    debit,
    credit,
  };
}

function revenueCategories(): Record<UJournalDirection, UCategoryType[]> {
  const debit = [ECategoryType.CreditNote];

  const credit = [ECategoryType.Sale, ECategoryType.Receipt];

  return {
    debit,
    credit,
  };
}

function expenseCategories(): Record<UJournalDirection, UCategoryType[]> {
  const debit = [
    ECategoryType.Expense,
    ECategoryType.Payment,
    ECategoryType.Purchase,
  ];

  const credit = [ECategoryType.DebitNote];

  return {
    debit,
    credit,
  };
}

export default function ledgerAccountCategoryMappingRule(
  ledgerAccountType: ULedgerType
) {
  switch (ledgerAccountType) {
    case ELedgerType.Asset:
      return assetCategories();
    case ELedgerType.Liability:
      return liabilityCategories();
    case ELedgerType.Revenue:
      return revenueCategories();
    case ELedgerType.Expense:
      return expenseCategories();
    default:
      throw new Error('Invalid ledger account type');
  }
}
