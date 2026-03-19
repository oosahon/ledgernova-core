import { IMoney } from '../../../shared/types/money.types';
import { ULedgerAccountType } from '../../ledger-account/types/ledger-account.types';
import { UTransactionDirection } from '../../transaction/types/transaction.types';

export interface IJournalEntry {
  id: string;
  ledgerAccountType: ULedgerAccountType;
  accountId: string;
  transactionId: string;
  amount: IMoney;
  functionalAmount: IMoney;
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
