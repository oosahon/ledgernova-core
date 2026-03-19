import { IGeneralLedgerAccount, ILedgerAccount } from './index.types';

export const EEquityAccountType = {
  OwnerInvestment: 'equity_owner_investment',
  RetainedEarnings: 'equity_retained_earnings',
  Other: 'equity_other',
};
export type UEquityLedgerType =
  (typeof EEquityAccountType)[keyof typeof EEquityAccountType];

export const EEquityOwnerSubType = {
  CommonStock: 'equity_owner_common_stock',
  PreferredStock: 'equity_owner_preferred_stock',
  OwnerDraws: 'equity_owner_draws',
  OwnerContributions: 'equity_owner_contributions',
};
export type UEquityOwnerSubType =
  (typeof EEquityOwnerSubType)[keyof typeof EEquityOwnerSubType];

export const EEquityAccountSubType = {
  ...EEquityOwnerSubType,
  Other: 'equity_sub_type_other',
};

export type UEquityLedgerSubType =
  (typeof EEquityAccountSubType)[keyof typeof EEquityAccountSubType];

export interface IEquityGeneralLedgerAccount extends IGeneralLedgerAccount {
  ledgerAccountType: UEquityLedgerSubType;
}

export interface IEquityAccount extends ILedgerAccount {
  subType: UEquityLedgerSubType;
}
