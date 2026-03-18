import { IMoney } from '../../../shared/types/money.types';
import { ICategory } from '../../category/types/category.types';

export const ETransactionDirection = {
  Debit: 'debit',
  Credit: 'credit',
} as const;

export type UTransactionDirection =
  (typeof ETransactionDirection)[keyof typeof ETransactionDirection];

export const ETransactionType = {
  /**
   * denotes the sale of goods or services (cash or credit)
   */
  Sale: 'sale',

  /**
   * denotes the purchase of goods or services (inventory or non-inventory)
   */
  Purchase: 'purchase',

  /**
   * issued to a customer to reduce or reverse a sale (e.g. returns, discounts)
   */
  CreditNote: 'credit_note',

  /**
   * issued to a supplier to reduce or reverse a purchase
   */
  DebitNote: 'debit_note',

  /**
   * denotes the recognition of a cost (may be cash or credit)
   */
  Expense: 'expense',

  /**
   * denotes movement of funds between internal accounts
   */
  Transfer: 'transfer',

  /**
   * denotes any outgoing payment (cash/bank)
   */
  Payment: 'payment',

  /**
   * denotes any incoming funds (cash/bank)
   */
  Receipt: 'receipt',

  /**
   * denotes manual or adjusting journal entries
   */
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

  // `null` for transfers and journals
  items: ITransactionItem[] | null;
  date: Date;

  // only used for transfers
  recipientAccountId: string | null;
  exchangeRate: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ITransactionAttachment {
  // TODO: implement
}
