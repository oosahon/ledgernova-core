import stringUtils from '../../../shared/utils/string';
import { AppError } from '../../../shared/value-objects/error';
import accountEntity from '../../account/entities/account.entity';
import {
  ELedgerAccountType,
  ULedgerAccountType,
} from '../../account/types/account.types';

const expenseTaxKeys = {
  other: 'expense:other',
  rent: 'expense:rent',
  lifeInsurance: 'expense:life_insurance',
  healthInsurance: 'expense:health_insurance',
  pensionContribution: 'expense:pension_contribution',
  nhisContribution: 'expense:nhis_contribution',
  nhfContribution: 'expense:nhf_contribution',
  interestOnHouseLoan: 'expense:interest_on_house_loan',
};

const revenueTaxKeys = {
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
  // Insurance = 'insurance',
  lifeInsurance: 'revenue:life_insurance',
  // Pension = 'pension',
  pensionPRA: 'revenue:pensions_rsa',
  retirementBenefit: 'revenue:retirement_benefit',
  other: 'revenue:other',
};

function make(type: ULedgerAccountType, userId?: string | null) {
  accountEntity.validateType(type);
  if (userId) {
    stringUtils.validateUUID(userId);
  }
  const base = `${type}`;
  return !userId ? base : `${base}::${userId}`;
}

function isValid(taxKey: string, type: ULedgerAccountType) {
  if (!taxKey || typeof taxKey !== 'string') return false;

  const [baseTaxKey, userId] = taxKey.split('::');

  if (userId) {
    stringUtils.validateUUID(userId);
  }

  switch (type) {
    case ELedgerAccountType.Revenue:
      return Object.values(revenueTaxKeys).includes(baseTaxKey as any);
    case ELedgerAccountType.Expense:
      return Object.values(expenseTaxKeys).includes(baseTaxKey as any);
    case ELedgerAccountType.Liability:
      return baseTaxKey === ELedgerAccountType.Liability;
    case ELedgerAccountType.Asset:
      return baseTaxKey === ELedgerAccountType.Asset;
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

const taxKeyValue = Object.freeze({
  make,
  isValid,
  revenue: Object.freeze(revenueTaxKeys),
  expense: Object.freeze(expenseTaxKeys),
  validate,
});

export default taxKeyValue;
