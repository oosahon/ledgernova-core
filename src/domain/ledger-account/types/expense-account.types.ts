import { IGeneralLedgerAccount, ILedgerAccount } from './index.types';

export const EExpenseAccountType = {
  CostOfGoodsSold: 'expense_cost_of_goods_sold',
  Operating: 'expense_operating',
  Other: 'expense_other',
};
export type UExpenseLedgerType =
  (typeof EExpenseAccountType)[keyof typeof EExpenseAccountType];

export const ECostOfGoodsSoldSubType = {
  DirectMaterials: 'expense_cogs_direct_materials',
  DirectLabor: 'expense_cogs_direct_labor',
  Overhead: 'expense_cogs_overhead',
  Shipping: 'expense_cogs_shipping',
};
export type UCostOfGoodsSoldSubType =
  (typeof ECostOfGoodsSoldSubType)[keyof typeof ECostOfGoodsSoldSubType];

export const EOperatingExpenseSubType = {
  Payroll: 'expense_operating_payroll',
  Rent: 'expense_operating_rent',
  Utilities: 'expense_operating_utilities',
  Marketing: 'expense_operating_marketing',
  OfficeSupplies: 'expense_operating_office_supplies',
  Software: 'expense_operating_software',
  LegalAndProfessional: 'expense_operating_legal',
  Depreciation: 'expense_operating_depreciation',
  TravelAndMeals: 'expense_operating_travel',
  Insurance: 'expense_operating_insurance',
  BankFees: 'expense_operating_bank_fees',
};
export type UOperatingExpenseSubType =
  (typeof EOperatingExpenseSubType)[keyof typeof EOperatingExpenseSubType];

export const EOtherExpenseSubType = {
  InterestExpense: 'expense_other_interest',
  TaxExpense: 'expense_other_tax',
};
export type UOtherExpenseSubType =
  (typeof EOtherExpenseSubType)[keyof typeof EOtherExpenseSubType];

export const EExpenseAccountSubType = {
  ...ECostOfGoodsSoldSubType,
  ...EOperatingExpenseSubType,
  ...EOtherExpenseSubType,
  Other: 'expense_sub_type_other',
};
export type UExpenseLedgerSubType =
  (typeof EExpenseAccountSubType)[keyof typeof EExpenseAccountSubType];

export interface IExpenseGeneralLedgerAccount extends IGeneralLedgerAccount {
  ledgerAccountType: UExpenseLedgerType;
}

export interface IExpenseAccount extends ILedgerAccount {
  subType: UExpenseLedgerSubType;
}
