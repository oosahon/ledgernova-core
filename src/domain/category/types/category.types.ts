import { UAccountingDomain } from '../../accounting/types/accounting.types';

export const ECategoryStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type UCategoryStatus =
  (typeof ECategoryStatus)[keyof typeof ECategoryStatus];

// same as Omit<UTransactionType, 'Transfer' | 'Journal'>
export const ECategoryType = {
  Sale: 'sale',
  Purchase: 'purchase',
  CreditNote: 'credit_note',
  DebitNote: 'debit_note',
  Expense: 'expense',
  Payment: 'payment',
  Receipt: 'receipt',
} as const;

export type UCategoryType = (typeof ECategoryType)[keyof typeof ECategoryType];

export interface ICategory {
  id: string;
  name: string;
  accountingDomain: UAccountingDomain;
  type: UCategoryType;
  taxKey: string;
  status: UCategoryStatus;
  description: string;
  parentId: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
