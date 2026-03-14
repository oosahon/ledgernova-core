import { ULedgerAccountType } from '../../account/types/account.types';
import { UTransactionDirection } from '../../transaction/types/transaction.types';

export interface IJournalEntry {
  id: string;
  ledgerAccountType: ULedgerAccountType;
  accountId: string;
  transactionId: string;
  amount: bigint;
  currencyCode: string;
  functionalAmount: bigint;
  direction: UTransactionDirection;
  description: string;
  postedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDebitJournalEntry extends IJournalEntry {
  direction: 'debit';
}

export interface ICreditJournalEntry extends IJournalEntry {
  direction: 'credit';
}
