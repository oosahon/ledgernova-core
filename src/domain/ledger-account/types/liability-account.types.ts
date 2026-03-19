import { IGeneralLedgerAccount, ILedgerAccount } from './index.types';

export const ELiabilityAccountType = {
  Payable: 'liability_payable',
  Loan: 'liability_loan',
  CreditCard: 'liability_credit_card',
  Other: 'liability_other',
};
export type ULiabilityLedgerType =
  (typeof ELiabilityAccountType)[keyof typeof ELiabilityAccountType];

export const EPayableAccountSubType = {
  AccountsPayable: 'liability_payable_accounts',
  AccruedExpense: 'liability_payable_accrued_expense',
  SalesTaxPayable: 'liability_payable_sales_tax',
};
export type UPayableSubType =
  (typeof EPayableAccountSubType)[keyof typeof EPayableAccountSubType];

export const ELoanAccountSubType = {
  ShortTerm: 'liability_loan_short_term',
  LongTerm: 'liability_loan_long_term',
  Mortgage: 'liability_loan_mortgage',
};
export type ULoanSubType =
  (typeof ELoanAccountSubType)[keyof typeof ELoanAccountSubType];

export const ELiabilityAccountSubType = {
  ...EPayableAccountSubType,
  ...ELoanAccountSubType,
  Other: 'liability_sub_type_other',
};
export type ULiabilityLedgerSubType =
  (typeof ELiabilityAccountSubType)[keyof typeof ELiabilityAccountSubType];

export interface ILiabilityGeneralLedgerAccount extends IGeneralLedgerAccount {
  ledgerAccountType: ULiabilityLedgerType;
}

export interface ILiabilityAccount extends ILedgerAccount {
  subType: ULiabilityLedgerSubType;
}
