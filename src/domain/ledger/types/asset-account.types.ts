import { ILedgerAccount } from '../../ledger/types/index.types';
import { IGeneralLedgerAccount } from './index.types';

export const EAssetAccountType = {
  Cash: 'asset_cash_and_equivalents',
  Receivable: 'asset_receivable',
  Inventory: 'asset_inventory',
  FixedAsset: 'asset_fixed_asset',
  Investment: 'asset_investment',
  Other: 'asset_other',
};
export type UAssetAccountType =
  (typeof EAssetAccountType)[keyof typeof EAssetAccountType];

export const ECashAccountSubType = {
  Cash: 'asset_cash_and_equivalents_cash',
  Bank: 'asset_cash_and_equivalents_bank',
  Savings: 'asset_cash_and_equivalents_savings',
  VirtualCard: 'asset_cash_and_equivalents_virtual_card',
  EWallet: 'asset_cash_and_equivalents_e_wallet',
};
export type UCashSubType =
  (typeof ECashAccountSubType)[keyof typeof ECashAccountSubType];

export const EInvestmentAccountSubType = {
  Stocks: 'asset_investment_stocks',
  Bonds: 'asset_investment_bonds',
  MutualFunds: 'asset_investment_mutual_funds',
  Crypto: 'asset_investment_crypto',
  FixedIncome: 'asset_investment_fixed_income',
};
export type UInvestmentSubType =
  (typeof EInvestmentAccountSubType)[keyof typeof EInvestmentAccountSubType];

export const EReceivableAccountSubType = {
  AccountsReceivable: 'asset_receivable_accounts',
  AllowanceForDoubtfulAccounts: 'asset_receivable_allowance',
};
export type UReceivableSubType =
  (typeof EReceivableAccountSubType)[keyof typeof EReceivableAccountSubType];

export const EInventoryAccountSubType = {
  RawMaterials: 'asset_inventory_raw_materials',
  WorkInProgress: 'asset_inventory_work_in_progress',
  FinishedGoods: 'asset_inventory_finished_goods',
};
export type UInventorySubType =
  (typeof EInventoryAccountSubType)[keyof typeof EInventoryAccountSubType];

export const EFixedAssetAccountSubType = {
  Property: 'asset_fixed_property',
  Equipment: 'asset_fixed_equipment',
  Vehicles: 'asset_fixed_vehicles',
  Furniture: 'asset_fixed_furniture',
  AccumulatedDepreciation: 'asset_fixed_accumulated_depreciation',
};
export type UFixedAssetSubType =
  (typeof EFixedAssetAccountSubType)[keyof typeof EFixedAssetAccountSubType];

export const EAssetAccountSubType = {
  ...ECashAccountSubType,
  ...EInvestmentAccountSubType,
  ...EReceivableAccountSubType,
  ...EInventoryAccountSubType,
  ...EFixedAssetAccountSubType,
  Other: 'asset_sub_type_other',
};
export type UAssetAccountSubType =
  (typeof EAssetAccountSubType)[keyof typeof EAssetAccountSubType];

export interface IAssetGeneralLedgerAccount extends IGeneralLedgerAccount {
  ledgerAccountType: UAssetAccountType;
}

export interface IAssetAccount extends ILedgerAccount {
  subType: UAssetAccountSubType;
}
