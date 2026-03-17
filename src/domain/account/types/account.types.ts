import { ICurrency } from '../../../shared/types/money.types';

export const ELedgerAccountType = {
  Asset: 'asset',
  Liability: 'liability',
  Revenue: 'revenue',
  Expense: 'expense',
  Equity: 'equity',
} as const;

export type ULedgerAccountType =
  (typeof ELedgerAccountType)[keyof typeof ELedgerAccountType];

export const EAccountStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type UAccountStatus =
  (typeof EAccountStatus)[keyof typeof EAccountStatus];

export interface IAccount {
  id: string;
  userId: string;
  status: UAccountStatus;
  name: string;
  type: ULedgerAccountType;
  subType?: string | null;
  currencyCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IAccountWithCurrency extends IAccount {
  currency: ICurrency;
}
