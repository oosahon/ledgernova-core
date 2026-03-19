import { ULedgerAccountType } from '../../account/types/account.types';
import { UAccountingDomain } from '../../accounting/types/accounting.types';
import { UTransactionType } from '../../transaction/types/transaction.types';

export const ECategoryStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type UCategoryStatus =
  (typeof ECategoryStatus)[keyof typeof ECategoryStatus];

export interface ICategory {
  id: string;
  name: string;
  accountingDomain: UAccountingDomain;
  transactionType: UTransactionType;
  taxKey: string;
  status: UCategoryStatus;
  description: string;
  parentId: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
