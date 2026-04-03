import { ELedgerType, ILedgerAccount } from './ledger.types';
import {
  TLiabilityLedgerCode,
  TLiabilitySuspenseLedgerCode,
  TShortTermDebtLedgerCode,
  TTradePayableLedgerCode,
  TAccruedExpenseLedgerCode,
  TStatutoryPayableLedgerCode,
  TDeferredRevenueLedgerCode,
  TLongTermLoanLedgerCode,
  TLeaseLiabilityLedgerCode,
  TProvisionLedgerCode,
} from './ledger-code.types';
import { EAdjunctAccountRule, EContraAccountRule } from './ledger.types';
import {
  ESuspenseSubType,
  ISuspenseLedgerAccount,
  TSuspenseSubType,
} from './suspense-account.types';
import { TEntityId } from '../../../shared/types/uuid';

export const ELiabilitySubType = {
  ShortTermDebt: 'short_term_debt',
  TradePayable: 'trade_payable',
  AccruedExpense: 'accrued_expense',
  StatutoryPayable: 'statutory_payable',
  DeferredRevenue: 'deferred_revenue',
  LongTermLoan: 'long_term_loan',
  LeaseLiability: 'lease_liability',
  Provision: 'provision',
  Suspense: ESuspenseSubType.Suspense,
} as const;

export type ULiabilitySubType =
  (typeof ELiabilitySubType)[keyof typeof ELiabilitySubType];

const EShortTermDebtBehavior = {
  CreditCard: 'credit_card',
  Overdraft: 'overdraft',
  ShortTermLoan: 'short_term_loan',
} as const;

type UShortTermDebtBehavior =
  (typeof EShortTermDebtBehavior)[keyof typeof EShortTermDebtBehavior];

const EStatutoryPayableBehavior = {
  TaxPayable: 'tax_payable',
} as const;

type UStatutoryPayableBehavior =
  (typeof EStatutoryPayableBehavior)[keyof typeof EStatutoryPayableBehavior];

const ELongTermLoanBehavior = {
  Mortgage: 'mortgage',
  OtherLongTermLoan: 'other_long_term_loan',
} as const;

type ULongTermLoanBehavior =
  (typeof ELongTermLoanBehavior)[keyof typeof ELongTermLoanBehavior];

export const ELiabilityAccountBehavior = {
  ...EShortTermDebtBehavior,
  ...EStatutoryPayableBehavior,
  ...ELongTermLoanBehavior,
  Default: 'default',
} as const;

export type ULiabilityAccountBehavior =
  (typeof ELiabilityAccountBehavior)[keyof typeof ELiabilityAccountBehavior];

export interface ILiabilityLedgerAccount extends ILedgerAccount {
  code: TLiabilityLedgerCode;
  type: typeof ELedgerType.Liability;
  subType: ULiabilitySubType;
  behavior: ULiabilityAccountBehavior;
}

/**
 * =============== Suspense Accounts =================
 * code: 299xxx
 * @see {@link ../__docs__/02-liability-accounts.md#suspense-accounts} for documentation
 */
export interface ILiabilitySuspenseAccount extends ISuspenseLedgerAccount {
  code: TLiabilitySuspenseLedgerCode;
  type: typeof ELedgerType.Liability;
  subType: TSuspenseSubType;
  behavior: typeof ELiabilityAccountBehavior.Default;
}

/**
 * =============== Short Term Debts ===============
 * code: 200xxx
 * @see {@link ../__docs__/02-liability-accounts.md#short-term-debts} for documentation
 */

export interface IShortTermDebtAccount extends ILiabilityLedgerAccount {
  code: TShortTermDebtLedgerCode;
  subType: typeof ELiabilitySubType.ShortTermDebt;
  behavior: UShortTermDebtBehavior;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}

export interface ICreditCardAccountMeta {
  cardIssuer: string;
  lastFourDigits: string;
  lastReconciliationDate: Date | null;
}

export interface ICreditCardAccount extends IShortTermDebtAccount {
  controlAccountId: TEntityId;
  behavior: typeof EShortTermDebtBehavior.CreditCard;
  meta: ICreditCardAccountMeta;
}

export interface IOverdraftAccountMeta {
  linkedBankAccountId: TEntityId;
}

export interface IOverdraftAccount extends IShortTermDebtAccount {
  behavior: typeof EShortTermDebtBehavior.Overdraft;
  meta: IOverdraftAccountMeta;
}

export interface IShortTermLoanAccountMeta {
  lenderName: string;
  maturityDate: Date | null;
}

export interface IShortTermLoanAccount extends IShortTermDebtAccount {
  behavior: typeof EShortTermDebtBehavior.ShortTermLoan;
  meta: IShortTermLoanAccountMeta;
}

/**
 * =============== Trade Payables ===============
 * code: 201xxx
 */
export interface ITradePayableAccount extends ILiabilityLedgerAccount {
  code: TTradePayableLedgerCode;
  subType: typeof ELiabilitySubType.TradePayable;
  behavior: typeof ELiabilityAccountBehavior.Default;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}

/**
 * =============== Accrued Expenses ===============
 * code: 202xxx
 */
export interface IAccruedExpenseAccount extends ILiabilityLedgerAccount {
  code: TAccruedExpenseLedgerCode;
  subType: typeof ELiabilitySubType.AccruedExpense;
  behavior: typeof ELiabilityAccountBehavior.Default;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}

/**
 * =============== Statutory Payables ===============
 * code: 203xxx
 * @see {@link ../__docs__/02-liability-accounts.md#statutory-payables} for documentation
 */
export interface IStatutoryPayableAccount extends ILiabilityLedgerAccount {
  code: TStatutoryPayableLedgerCode;
  subType: typeof ELiabilitySubType.StatutoryPayable;
  behavior: UStatutoryPayableBehavior;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

export interface ITaxPayableAccountMeta {
  taxAuthority: string;
  taxType: string;
}

export interface ITaxPayableAccount extends IStatutoryPayableAccount {
  behavior: typeof EStatutoryPayableBehavior.TaxPayable;
  meta: ITaxPayableAccountMeta;
}

/**
 * =============== Deferred Revenues ===============
 * code: 204xxx
 */
export interface IDeferredRevenueAccount extends ILiabilityLedgerAccount {
  code: TDeferredRevenueLedgerCode;
  subType: typeof ELiabilitySubType.DeferredRevenue;
  behavior: typeof ELiabilityAccountBehavior.Default;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}

/**
 * =============== Long Term Loans ===============
 * code: 205xxx
 * @see {@link ../__docs__/02-liability-accounts.md#long-term-loans} for documentation
 */
export interface ILongTermLoanAccount extends ILiabilityLedgerAccount {
  code: TLongTermLoanLedgerCode;
  subType: typeof ELiabilitySubType.LongTermLoan;
  behavior: ULongTermLoanBehavior;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}

export interface IMortgageAccountMeta {
  lenderName: string;
  propertyAddress: string;
  maturityDate: Date | null;
}

export interface IMortgageAccount extends ILongTermLoanAccount {
  behavior: typeof ELongTermLoanBehavior.Mortgage;
  meta: IMortgageAccountMeta;
}

export interface IOtherLongTermLoanAccountMeta {
  lenderName: string;
  maturityDate: Date | null;
}

export interface IOtherLongTermLoanAccount extends ILongTermLoanAccount {
  behavior: typeof ELongTermLoanBehavior.OtherLongTermLoan;
  meta: IOtherLongTermLoanAccountMeta;
}

/**
 * =============== Lease Liabilities ===============
 * code: 206xxx
 */
export interface ILeaseLiabilityAccount extends ILiabilityLedgerAccount {
  code: TLeaseLiabilityLedgerCode;
  subType: typeof ELiabilitySubType.LeaseLiability;
  behavior: typeof ELiabilityAccountBehavior.Default;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}

/**
 * =============== Provisions ===============
 * code: 207xxx
 */
export interface IProvisionAccount extends ILiabilityLedgerAccount {
  code: TProvisionLedgerCode;
  subType: typeof ELiabilitySubType.Provision;
  behavior: typeof ELiabilityAccountBehavior.Default;
  contraAccountRule: typeof EContraAccountRule.ContraPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctPermitted;
}
