// TODO: tax keys should be based on transaction types and not category ledger types

import stringUtils from '../../../shared/utils/string';
import { AppError } from '../../../shared/value-objects/error';
import accountEntity from '../../account/entities/account.entity';
import {
  ELedgerAccountType,
  ULedgerAccountType,
} from '../../account/types/account.types';

const systemExpenseTaxKeys = {
  other: 'expense:other',
  rent: 'expense:rent',
  lifeInsurance: 'expense:life_insurance',
  healthInsurance: 'expense:health_insurance',
  nhisContribution: 'expense:nhis_contribution',

  interestOnHouseLoan: 'expense:interest_on_house_loan',
  interestOnOwnerOccupiedHouseLoan:
    'expense:interest_on_owner_occupied_house_loan',
};

const systemAssetTaxKeys = {
  pensionContribution: 'asset:pension_contribution',
  nhfContribution: 'asset:nhf_contribution',
  stocksPurchase: 'asset:stocks_purchase',
  stocksReinvestment: 'asset:stocks_reinvestment',
  other: 'asset:other',
};

const systemRevenueTaxKeys = {
  salary: 'revenue:salary',
  sales: 'revenue:sales',
  homeSale: 'revenue:home_sale',
  salesPersonalEffect: 'revenue:sales_personal_effect',
  salesPersonalVehicle: 'revenue:sales_personal_vehicles',
  rebate: 'revenue:rebate',
  // TODO: shares profit will be handled when the bookkeeping module is complete.
  // SharesProfit = 'shares_profit',
  // ServiceFee = 'Service Fee',
  // Bonus = 'bonus',
  // Compensation = 'compensation',
  compensationLossOfEmployment: 'revenue:compensation_loss_of_employment',
  // Business = 'business',
  // Commissions = 'commissions',
  royalties: 'revenue:royalties',
  rental: 'revenue:rental',
  dividends: 'revenue:dividends',
  interest: 'revenue:interest',
  // CapitalGains = 'capital_gains',
  // Grants = 'grants',
  // Sponsorships = 'sponsorships',
  taxRefund: 'revenue:tax_refunds',
  gift: 'revenue:gift',
  lifeInsurance: 'revenue:life_insurance',
  pensionPRA: 'revenue:pensions_rsa',
  retirementBenefit: 'revenue:retirement_benefit',
  other: 'revenue:other',
};

function appendUserId(taxKey: string, userId?: string | null) {
  if (!userId) return taxKey;

  stringUtils.validateUUID(userId);
  return `${taxKey}::${userId}`;
}

function make(type: ULedgerAccountType, userId?: string | null) {
  accountEntity.validateType(type);

  if (userId) {
    stringUtils.validateUUID(userId);
  }

  switch (type) {
    case ELedgerAccountType.Revenue:
      return appendUserId(systemRevenueTaxKeys.other, userId);

    case ELedgerAccountType.Expense:
      return appendUserId(systemExpenseTaxKeys.other, userId);

    case ELedgerAccountType.Asset:
      return appendUserId(systemAssetTaxKeys.other, userId);

    default:
      return appendUserId(type, userId);
  }
}

function isValid(taxKey: string, type: ULedgerAccountType) {
  if (!taxKey || typeof taxKey !== 'string') return false;

  const [baseTaxKey, userId] = taxKey.split('::');

  if (userId) {
    stringUtils.validateUUID(userId);
  }

  switch (type) {
    case ELedgerAccountType.Revenue:
      return Object.values(systemRevenueTaxKeys).includes(baseTaxKey as any);
    case ELedgerAccountType.Expense:
      return Object.values(systemExpenseTaxKeys).includes(baseTaxKey as any);
    case ELedgerAccountType.Liability:
      return baseTaxKey === ELedgerAccountType.Liability;
    case ELedgerAccountType.Asset:
      return Object.values(systemAssetTaxKeys).includes(baseTaxKey as any);
    case ELedgerAccountType.Equity:
      return baseTaxKey === ELedgerAccountType.Equity;
    default:
      return false;
  }
}

function validate(taxKey: string, type: ULedgerAccountType) {
  if (!isValid(taxKey, type)) {
    throw new AppError('Invalid tax key', { cause: taxKey });
  }
}

function getBaseTaxKey(taxKey: string) {
  return taxKey.split('::')[0];
}

const taxKeyValue = Object.freeze({
  make,
  isValid,
  getBaseTaxKey,
  validate,
  revenue: Object.freeze(systemRevenueTaxKeys),
  expense: Object.freeze(systemExpenseTaxKeys),
  asset: Object.freeze(systemAssetTaxKeys),
});

export default taxKeyValue;
