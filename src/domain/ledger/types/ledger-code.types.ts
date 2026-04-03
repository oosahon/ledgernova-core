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
