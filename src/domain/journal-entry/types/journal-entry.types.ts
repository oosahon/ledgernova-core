import { IMoney } from '../../../shared/types/money.types';
import { ULedgerType } from '../../ledger-account/types/index.types';

export const EJournalDirection = {
  Debit: 'debit',
  Credit: 'credit',
} as const;

export type UJournalDirection =
  (typeof EJournalDirection)[keyof typeof EJournalDirection];

export interface IJournalEntry {
  id: string;
  ledgerAccountType: ULedgerType;
  accountId: string;
  transactionId: string;
  amount: IMoney;
  functionalAmount: IMoney;
  direction: UJournalDirection;
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
