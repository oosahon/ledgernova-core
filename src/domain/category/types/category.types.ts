import _ from 'lodash';
import { UAccountingDomain } from '../../accounting/types/accounting.types';
import {
  ETransactionType,
  UTransactionType,
} from '../../transaction/types/transaction.types';

export const ECategoryStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type UCategoryStatus =
  (typeof ECategoryStatus)[keyof typeof ECategoryStatus];

export const ECategoryType = {
  ..._.omit(ETransactionType, ['Transfer', 'Journal']),
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
