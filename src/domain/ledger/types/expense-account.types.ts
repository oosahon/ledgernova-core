import { ELedgerType, ILedgerAccount } from './ledger.types';
import {
  TExpenseLedgerCode,
  TCostOfSalesLedgerCode,
  TContraExpenseLedgerCode,
  TPayrollLedgerCode,
  TRentUtilitiesLedgerCode,
  TAdminGeneralLedgerCode,
  TMarketingSellingLedgerCode,
  TResearchDevLedgerCode,
  TDepreciationAmortizationLedgerCode,
  TInterestFinanceLedgerCode,
  TIncomeTaxLedgerCode,
  TUnrealizedLossLedgerCode,
  TAssetDisposalLossLedgerCode,
  TImpairmentLossLedgerCode,
  TOtherLossesLedgerCode,
} from './ledger-code.types';
import { EAdjunctAccountRule, EContraAccountRule } from './ledger.types';

export const EExpenseSubType = {
  CostOfSales: 'cost_of_sales',
  ContraExpense: 'contra_expense',
  PayrollAndPersonnel: 'payroll_and_personnel',
  RentAndUtilities: 'rent_and_utilities',
  AdminAndGeneral: 'admin_and_general',
  MarketingAndSelling: 'marketing_and_selling',
  ResearchAndDevelopment: 'research_and_development',
  DepreciationAndAmortization: 'depreciation_and_amortization',
  InterestAndFinanceCharges: 'interest_and_finance_charges',
  IncomeTaxExpense: 'income_tax_expense',
  UnrealizedLoss: 'unrealized_loss',
  LossOnAssetDisposal: 'loss_on_asset_disposal',
  ImpairmentLosses: 'impairment_losses',
  OtherLosses: 'other_losses',
} as const;

export type UExpenseSubType =
  (typeof EExpenseSubType)[keyof typeof EExpenseSubType];

const ECostOfSalesBehavior = {
  COGS: 'cogs',
  CostOfServices: 'cost_of_services',
} as const;

type UCostOfSalesBehavior =
  (typeof ECostOfSalesBehavior)[keyof typeof ECostOfSalesBehavior];

const EContraExpenseBehavior = {
  PurchaseReturns: 'purchase_returns',
  PurchaseDiscounts: 'purchase_discounts',
} as const;

type UContraExpenseBehavior =
  (typeof EContraExpenseBehavior)[keyof typeof EContraExpenseBehavior];

const EOpexBehavior = {
  PayrollAndPersonnel: 'payroll_and_personnel',
  RentAndUtilities: 'rent_and_utilities',
  AdminAndGeneral: 'admin_and_general',
  MarketingAndSelling: 'marketing_and_selling',
  ResearchAndDevelopment: 'research_and_development',
  DepreciationAndAmortization: 'depreciation_and_amortization',
} as const;

const ENonOperatingExpenseBehavior = {
  FinanceCosts: 'finance_costs',
  TaxExpense: 'tax_expense',
} as const;

const ELossBehavior = {
  UnrealizedLoss: 'unrealized_loss',
  AssetDisposalLoss: 'asset_disposal_loss',
  ImpairmentLoss: 'impairment_loss',
  OtherLosses: 'other_losses',
} as const;

export const EExpenseAccountBehavior = {
  ...ECostOfSalesBehavior,
  ...EContraExpenseBehavior,
  ...EOpexBehavior,
  ...ENonOperatingExpenseBehavior,
  ...ELossBehavior,
} as const;

export type UExpenseAccountBehavior =
  (typeof EExpenseAccountBehavior)[keyof typeof EExpenseAccountBehavior];

export interface IExpenseLedgerAccount extends ILedgerAccount {
  code: TExpenseLedgerCode;
  type: typeof ELedgerType.Expense;
  subType: UExpenseSubType;
  behavior: UExpenseAccountBehavior;
}

/**
 * =============== Cost of Sales ===============
 * code: 500xxx
 */
export interface ICostOfSalesAccount extends IExpenseLedgerAccount {
  code: TCostOfSalesLedgerCode;
  subType: typeof EExpenseSubType.CostOfSales;
  behavior: UCostOfSalesBehavior;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Contra-Expenses (Purchase Returns & Discounts) ===============
 * code: 501xxx
 */
export interface IContraExpenseAccount extends IExpenseLedgerAccount {
  code: TContraExpenseLedgerCode;
  subType: typeof EExpenseSubType.ContraExpense;
  behavior: UContraExpenseBehavior;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Payroll & Personnel ===============
 * code: 502xxx
 */
export interface IPayrollAccount extends IExpenseLedgerAccount {
  code: TPayrollLedgerCode;
  subType: typeof EExpenseSubType.PayrollAndPersonnel;
  behavior: typeof EOpexBehavior.PayrollAndPersonnel;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Rent & Utilities ===============
 * code: 503xxx
 */
export interface IRentUtilitiesAccount extends IExpenseLedgerAccount {
  code: TRentUtilitiesLedgerCode;
  subType: typeof EExpenseSubType.RentAndUtilities;
  behavior: typeof EOpexBehavior.RentAndUtilities;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Admin & General ===============
 * code: 504xxx
 */
export interface IAdminGeneralAccount extends IExpenseLedgerAccount {
  code: TAdminGeneralLedgerCode;
  subType: typeof EExpenseSubType.AdminAndGeneral;
  behavior: typeof EOpexBehavior.AdminAndGeneral;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Marketing & Selling ===============
 * code: 505xxx
 */
export interface IMarketingSellingAccount extends IExpenseLedgerAccount {
  code: TMarketingSellingLedgerCode;
  subType: typeof EExpenseSubType.MarketingAndSelling;
  behavior: typeof EOpexBehavior.MarketingAndSelling;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Research & Development ===============
 * code: 506xxx
 */
export interface IResearchDevAccount extends IExpenseLedgerAccount {
  code: TResearchDevLedgerCode;
  subType: typeof EExpenseSubType.ResearchAndDevelopment;
  behavior: typeof EOpexBehavior.ResearchAndDevelopment;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Depreciation & Amortization ===============
 * code: 507xxx
 */
export interface IDepreciationAmortizationAccount extends IExpenseLedgerAccount {
  code: TDepreciationAmortizationLedgerCode;
  subType: typeof EExpenseSubType.DepreciationAndAmortization;
  behavior: typeof EOpexBehavior.DepreciationAndAmortization;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Interest & Finance Charges ===============
 * code: 508xxx
 */
export interface IInterestFinanceAccount extends IExpenseLedgerAccount {
  code: TInterestFinanceLedgerCode;
  subType: typeof EExpenseSubType.InterestAndFinanceCharges;
  behavior: typeof ENonOperatingExpenseBehavior.FinanceCosts;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Income Tax Expense ===============
 * code: 509xxx
 */
export interface IIncomeTaxExpenseAccount extends IExpenseLedgerAccount {
  code: TIncomeTaxLedgerCode;
  subType: typeof EExpenseSubType.IncomeTaxExpense;
  behavior: typeof ENonOperatingExpenseBehavior.TaxExpense;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Unrealized Loss ===============
 * code: 510xxx
 */
export interface IUnrealizedLossAccount extends IExpenseLedgerAccount {
  code: TUnrealizedLossLedgerCode;
  subType: typeof EExpenseSubType.UnrealizedLoss;
  behavior: typeof ELossBehavior.UnrealizedLoss;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Loss on Asset Disposal ===============
 * code: 511xxx
 */
export interface IAssetDisposalLossAccount extends IExpenseLedgerAccount {
  code: TAssetDisposalLossLedgerCode;
  subType: typeof EExpenseSubType.LossOnAssetDisposal;
  behavior: typeof ELossBehavior.AssetDisposalLoss;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Impairment Losses ===============
 * code: 512xxx
 */
export interface IImpairmentLossAccount extends IExpenseLedgerAccount {
  code: TImpairmentLossLedgerCode;
  subType: typeof EExpenseSubType.ImpairmentLosses;
  behavior: typeof ELossBehavior.ImpairmentLoss;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}

/**
 * =============== Other Losses ===============
 * code: 513xxx
 */
export interface IOtherLossesAccount extends IExpenseLedgerAccount {
  code: TOtherLossesLedgerCode;
  subType: typeof EExpenseSubType.OtherLosses;
  behavior: typeof ELossBehavior.OtherLosses;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}
