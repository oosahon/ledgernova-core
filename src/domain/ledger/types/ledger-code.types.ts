declare const AssetPrefix = '1';
export type TAssetLedgerCode = `${typeof AssetPrefix}${string}`;

declare const SuspensePrefix = '100';
export type TAssetSuspenseLedgerCode = `${typeof SuspensePrefix}${string}`;

declare const CashPrefix = '101';
export type TCashLedgerCode = `${typeof CashPrefix}${string}`;

declare const ShortTermInvestmentPrefix = '102';
export type TShortTermInvestmentLedgerCode =
  `${typeof ShortTermInvestmentPrefix}${string}`;

declare const ReceivablesPrefix = '103';
export type TReceivablesLedgerCode = `${typeof ReceivablesPrefix}${string}`;

declare const InventoryPrefix = '104';
export type TInventoryLedgerCode = `${typeof InventoryPrefix}${string}`;

declare const AccruedIncomePrefix = '105';
export type TAccruedIncomeLedgerCode = `${typeof AccruedIncomePrefix}${string}`;

declare const PrepaymentsPrefix = '106';
export type TPrepaymentsLedgerCode = `${typeof PrepaymentsPrefix}${string}`;

declare const LongTermInvestmentPrefix = '107';
export type TLongTermInvestmentLedgerCode =
  `${typeof LongTermInvestmentPrefix}${string}`;

declare const PPEPrefix = '108';
export type TPPELedgerCode = `${typeof PPEPrefix}${string}`;

declare const IntangibleAssetsPrefix = '109';
export type TIntangibleAssetsLedgerCode =
  `${typeof IntangibleAssetsPrefix}${string}`;

declare const ROUAssetsPrefix = '110';
export type TROUAssetsLedgerCode = `${typeof ROUAssetsPrefix}${string}`;

declare const GoodwillPrefix = '111';
export type TGoodwillLedgerCode = `${typeof GoodwillPrefix}${string}`;
