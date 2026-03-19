import { IGeneralLedgerAccount, ILedgerAccount } from './index.types';

export const ERevenueAccountType = {
  Operating: 'revenue_operating',
  Other: 'revenue_other',
};
export type URevenueAccountType =
  (typeof ERevenueAccountType)[keyof typeof ERevenueAccountType];

export const EOperatingRevenueSubType = {
  ProductSales: 'revenue_operating_product_sales',
  ServiceSales: 'revenue_operating_service_sales',
  Subscription: 'revenue_operating_subscription',
  DiscountGiven: 'revenue_operating_discount_given',
  ReturnsAndAllowances: 'revenue_operating_returns',
};
export type UOperatingRevenueSubType =
  (typeof EOperatingRevenueSubType)[keyof typeof EOperatingRevenueSubType];

export const EOtherRevenueSubType = {
  InterestIncome: 'revenue_other_interest',
  DividendIncome: 'revenue_other_dividend',
  RentalIncome: 'revenue_other_rental',
};
export type UOtherRevenueSubType =
  (typeof EOtherRevenueSubType)[keyof typeof EOtherRevenueSubType];

export const ERevenueAccountSubType = {
  ...EOperatingRevenueSubType,
  ...EOtherRevenueSubType,
  Other: 'revenue_sub_type_other',
};
export type URevenueSubType =
  (typeof ERevenueAccountSubType)[keyof typeof ERevenueAccountSubType];

export interface IRevenueGeneralLedgerAccount extends IGeneralLedgerAccount {
  ledgerAccountType: URevenueAccountType;
}

export interface IRevenueAccount extends ILedgerAccount {
  subType: URevenueSubType;
}
