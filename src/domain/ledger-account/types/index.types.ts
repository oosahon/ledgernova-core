export const ELedgerType = {
  Asset: 'asset',
  Liability: 'liability',
  Revenue: 'revenue',
  Expense: 'expense',
  Equity: 'equity',
} as const;

export type ULedgerType = (typeof ELedgerType)[keyof typeof ELedgerType];

export const ELedgerAccountStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type ULedgerAccountStatus =
  (typeof ELedgerAccountStatus)[keyof typeof ELedgerAccountStatus];

export interface IGeneralLedgerAccount {
  id: string;
  ledgerCode: string;
  ledgerType: ULedgerType;
  ledgerAccountType: string;
  name: string;
  currencyCode: string;
  status: ULedgerAccountStatus;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ILedgerAccount extends IGeneralLedgerAccount {
  subType: string;
  parentId: string;
}
