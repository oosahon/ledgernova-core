/**
 * ===================== ASSET LEDGER CODES =====================
 * @see {@link ../__docs__/asset-ledger.md} to understand the structure of asset ledger codes
 */
declare const AssetPrefix = '1';
export type TAssetLedgerCode = `${typeof AssetPrefix}${string}`;

declare const CashPrefix = '100';
export type TCashLedgerCode = `${typeof CashPrefix}${string}`;

declare const ShortTermInvestmentPrefix = '101';
export type TShortTermInvestmentLedgerCode =
  `${typeof ShortTermInvestmentPrefix}${string}`;

declare const ReceivablesPrefix = '102';
export type TReceivablesLedgerCode = `${typeof ReceivablesPrefix}${string}`;

declare const InventoryPrefix = '103';
export type TInventoryLedgerCode = `${typeof InventoryPrefix}${string}`;

declare const AccruedIncomePrefix = '104';
export type TAccruedIncomeLedgerCode = `${typeof AccruedIncomePrefix}${string}`;

declare const PrepaymentsPrefix = '105';
export type TPrepaymentsLedgerCode = `${typeof PrepaymentsPrefix}${string}`;

declare const LongTermInvestmentPrefix = '106';
export type TLongTermInvestmentLedgerCode =
  `${typeof LongTermInvestmentPrefix}${string}`;

declare const PPEPrefix = '107';
export type TPPELedgerCode = `${typeof PPEPrefix}${string}`;

declare const IntangibleAssetsPrefix = '108';
export type TIntangibleAssetsLedgerCode =
  `${typeof IntangibleAssetsPrefix}${string}`;

declare const ROUAssetsPrefix = '109';
export type TROUAssetsLedgerCode = `${typeof ROUAssetsPrefix}${string}`;

declare const GoodwillPrefix = '110';
export type TGoodwillLedgerCode = `${typeof GoodwillPrefix}${string}`;

declare const SuspensePrefix = '199';
export type TAssetSuspenseLedgerCode = `${typeof SuspensePrefix}${string}`;

/**
 * ===================== LIABILITY LEDGER CODES =====================
 * @see {@link ../__docs__/liability-ledger.md} to understand the structure of liability ledger codes
 */
declare const LiabilityPrefix = '2';
export type TLiabilityLedgerCode = `${typeof LiabilityPrefix}${string}`;

declare const ShortTermDebtPrefix = '200';
export type TShortTermDebtLedgerCode = `${typeof ShortTermDebtPrefix}${string}`;

declare const TradePayablePrefix = '201';
export type TTradePayableLedgerCode = `${typeof TradePayablePrefix}${string}`;

declare const AccruedExpensePrefix = '202';
export type TAccruedExpenseLedgerCode =
  `${typeof AccruedExpensePrefix}${string}`;

declare const StatutoryPayablePrefix = '203';
export type TStatutoryPayableLedgerCode =
  `${typeof StatutoryPayablePrefix}${string}`;

declare const DeferredRevenuePrefix = '204';
export type TDeferredRevenueLedgerCode =
  `${typeof DeferredRevenuePrefix}${string}`;

declare const LongTermLoanPrefix = '205';
export type TLongTermLoanLedgerCode = `${typeof LongTermLoanPrefix}${string}`;

declare const LeaseLiabilityPrefix = '206';
export type TLeaseLiabilityLedgerCode =
  `${typeof LeaseLiabilityPrefix}${string}`;

declare const ProvisionPrefix = '207';
export type TProvisionLedgerCode = `${typeof ProvisionPrefix}${string}`;

declare const LiabilitySuspensePrefix = '299';
export type TLiabilitySuspenseLedgerCode =
  `${typeof LiabilitySuspensePrefix}${string}`;

/**
 * ===================== EQUITY LEDGER CODES =====================
 * @see {@link ../__docs__/03-equity-accounts.md} to understand the structure of equity ledger codes
 */
declare const EquityPrefix = '3';
export type TEquityLedgerCode = `${typeof EquityPrefix}${string}`;

declare const CapitalPrefix = '300';
export type TCapitalLedgerCode = `${typeof CapitalPrefix}${string}`;

declare const RetainedEarningsPrefix = '301';
export type TRetainedEarningsLedgerCode =
  `${typeof RetainedEarningsPrefix}${string}`;

declare const ReservesPrefix = '302';
export type TReservesLedgerCode = `${typeof ReservesPrefix}${string}`;

declare const OpeningBalanceEquityPrefix = '399';
export type TOpeningBalanceEquityLedgerCode =
  `${typeof OpeningBalanceEquityPrefix}${string}`;

/**
 * ===================== REVENUE LEDGER CODES =====================
 * @see {@link ../__docs__/04-revenue-accounts.md} to understand the structure of revenue ledger codes
 */
declare const RevenuePrefix = '4';
export type TRevenueLedgerCode = `${typeof RevenuePrefix}${string}`;

declare const SalesPrefix = '400';
export type TSalesLedgerCode = `${typeof SalesPrefix}${string}`;

declare const ContraRevenuePrefix = '401';
export type TContraRevenueLedgerCode = `${typeof ContraRevenuePrefix}${string}`;

declare const ServicesPrefix = '402';
export type TServicesLedgerCode = `${typeof ServicesPrefix}${string}`;

declare const SubscriptionsPrefix = '403';
export type TSubscriptionsLedgerCode = `${typeof SubscriptionsPrefix}${string}`;

declare const EmploymentIncomePrefix = '404';
export type TEmploymentIncomeLedgerCode =
  `${typeof EmploymentIncomePrefix}${string}`;

declare const InterestIncomePrefix = '405';
export type TInterestIncomeLedgerCode =
  `${typeof InterestIncomePrefix}${string}`;

declare const GainOnSalePrefix = '406';
export type TGainOnSaleLedgerCode = `${typeof GainOnSalePrefix}${string}`;

declare const UnrealizedGainPrefix = '407';
export type TUnrealizedGainLedgerCode =
  `${typeof UnrealizedGainPrefix}${string}`;
