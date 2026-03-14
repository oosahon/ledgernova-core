export const ETransactionDirection = {
  Debit: 'debit',
  Credit: 'credit',
} as const;

export type UTransactionDirection =
  (typeof ETransactionDirection)[keyof typeof ETransactionDirection];

export const ETransactionType = {
  Sale: 'sale',
  SaleReturn: 'sale_return',
  Purchase: 'purchase',
  PurchaseReturn: 'purchase_return',
  Transfer: 'transfer',
  Expense: 'expense',
  Payment: 'payment',
  Receipt: 'receipt',
  Refund: 'refund',
  Journal: 'journal',
};

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

export interface ITransaction {
  id: string;
  status: UTransactionStatus;
  createdBy: string;
  type: UTransactionType;
  accountId: string;
  amount: bigint;
  currencyCode: string;
  categoryId: string | null;
  attachmentIds: string[];
  date: Date;
  recipientAccountId: string | null;
  exchangeRate: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
