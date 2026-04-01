import { TEntityId } from '../../../shared/types/uuid';
import { ICurrency } from '../../currency/types/currency.types';

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

export const EContraAccountRule = {
  ContraPermitted: 'contra_permitted',
  ContraNotPermitted: 'contra_not_permitted',
  ContraOnly: 'contra_only',
  NotApplicable: 'not_applicable',
} as const;

type UContraAccountRule =
  (typeof EContraAccountRule)[keyof typeof EContraAccountRule];

export const EAdjunctAccountRule = {
  AdjunctPermitted: 'adjunct_permitted',
  AdjunctNotPermitted: 'adjunct_not_permitted',
  AdjunctOnly: 'adjunct_only',
  NotApplicable: 'not_applicable',
} as const;

type UAdjunctAccountRule =
  (typeof EAdjunctAccountRule)[keyof typeof EAdjunctAccountRule];

/**
 * PLAN:
 * - I'm trying to make ledger accounts in such a way that they will support different types of behaviors.
 * What I'm not sure of:
 *  - Using meta data to store these behaviors or creating separate entities, persistable in the db.
 *  - Use relationships to link bank accounts and their corresponding suspense accounts or have a bank account hold its suspense account
 *
 * What I'm most likely going to do:
 * - define ledger account behavioral types in a new file
 * - have behavioral entities carry their own contra and adjunct account rules
 * - Create a special transaction category for cash/cash equivalents: FX sale/purchase.
 *   This will allow us determine realized gains and losses on FX transactions.
 */
export interface ILedgerAccount {
  id: TEntityId;
  code: string;
  accountingEntityId: TEntityId;
  type: ULedgerType;
  subType: string;
  behavior: string;
  isControlAccount: boolean;
  controlAccountId: TEntityId;
  name: string;
  currency: ICurrency;
  status: ULedgerAccountStatus;
  contraAccountRule: UContraAccountRule;
  adjunctAccountRule: UAdjunctAccountRule;
  createdBy: TEntityId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
