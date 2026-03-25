import { IMoney } from '../../../shared/types/money.types';
import { ICategory } from '../../category/types/category.types';

export const ETransactionType = {
  Sale: 'sale',
  Purchase: 'purchase',
  CreditNote: 'credit_note',
  DebitNote: 'debit_note',
  Expense: 'expense',
  Transfer: 'transfer',
  Payment: 'payment',
  Receipt: 'receipt',
  Journal: 'journal',
} as const;

export const ETransactionStatus = {
  Pending: 'pending',
  Posted: 'posted',
  Voided: 'voided',
  Archived: 'archived',
} as const;

export type UTransactionStatus =
  (typeof ETransactionStatus)[keyof typeof ETransactionStatus];

export type UTransactionType =
  (typeof ETransactionType)[keyof typeof ETransactionType];

export interface ITransactionItem {
  id: string;
  name: string;
  // actual transaction amount in any currency
  amount: IMoney;

  // amount in the user's functional currency
  functionalCurrencyAmount: IMoney;
  quantity: number;
  unitPrice: IMoney | null;
  transactionId: string;
  category: ICategory;
  isSystemGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ITransaction {
  id: string;
  reference: string;
  status: UTransactionStatus;

  // used instead of `userId` because the trx creator might not be the owner of the account
  createdBy: string;
  type: UTransactionType;
  accountId: string;

  // unless for transfers and journal entries, this is derived from the items
  amount: IMoney;

  // unless for transfers and journal entries, this is derived from the items
  functionalCurrencyAmount: IMoney;
  attachmentIds: string[];

  // TODO: add counterpartyId

  // `null` for transfers and journals
  items: ITransactionItem[] | null;
  date: Date;

  // only used for transfers
  recipientAccountId: string | null;
  exchangeRate: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ITransactionAttachment {
  // TODO: implement
}
