import { ULedgerAccountType } from '../../account/types/account.types';

export const ECategoryStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type UCategoryStatus =
  (typeof ECategoryStatus)[keyof typeof ECategoryStatus];

/**
 * Category flow types are not standard accounting terms
 * but are used, solely for UX purposes, to describe the flow of money.
 * NB: they have no effect on the accounting advisory.
 */
export const ECategoryFlowType = {
  In: 'in',
  Out: 'out',
} as const;

export type UCategoryFlowType =
  (typeof ECategoryFlowType)[keyof typeof ECategoryFlowType];

export interface ICategory {
  id: string;
  name: string;
  ledgerAccountType: ULedgerAccountType;

  // UX only
  flowType: UCategoryFlowType;
  taxKey: string;
  status: UCategoryStatus;
  description: string;
  parentId: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
