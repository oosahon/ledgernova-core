/**
 *  🚨 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
 *
 *  ‼️ CAUTION ‼️
 *
 *  🚨 🚨🚨🚨🚨🚨🚨🚨🚨🚨 🚨🚨🚨🚨🚨🚨🚨🚨
 *
 * Tax keys are used to identify tax types and are used to generate tax receipts.
 * They are also used to generate tax returns.
 * Be careful when modifying this file, as it can have a significant impact on the tax system.
 *
 */

import stringUtils from '../../../shared/utils/string';
import { AppError } from '../../../shared/value-objects/error';
import {
  ETransactionType,
  UTransactionType,
} from '../../transaction/types/transaction.types';

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

const systemPaymentTaxKeys = {
  pensionContribution: 'payment:pension_contribution',
  nhfContribution: 'payment:nhf_contribution',
  stocksPurchase: 'payment:stocks_purchase',
  stocksReinvestment: 'payment:stocks_reinvestment',
  annuityPremium: 'payment:annuity_premium',
  other: 'payment:other',
};

const systemSaleTaxKeys = {
  sales: 'sale:sales',
  homeSale: 'sale:home_sale',
  salesPersonalEffect: 'sale:sales_personal_effect',
  salesPersonalVehicle: 'sale:sales_personal_vehicles',
  other: 'sale:other',
};

const systemReceiptTaxKeys = {
  salary: 'receipt:salary',
  rebate: 'receipt:rebate',
  compensationLossOfEmployment: 'receipt:compensation_loss_of_employment',
  royalties: 'receipt:royalties',
  rental: 'receipt:rental',
  dividends: 'receipt:dividends',
  interest: 'receipt:interest',
  taxRefund: 'receipt:tax_refunds',
  gift: 'receipt:gift',
  lifeInsurance: 'receipt:life_insurance',
  pensionPRA: 'receipt:pensions_rsa',
  retirementBenefit: 'receipt:retirement_benefit',
  other: 'receipt:other',
};

function appendUserId(taxKey: string, userId?: string | null) {
  if (!userId) return taxKey;

  stringUtils.validateUUID(userId);
  return `${taxKey}::${userId}`;
}

function make(type: UTransactionType, userId?: string | null) {
  if (!Object.values(ETransactionType).includes(type)) {
    throw new AppError('Invalid transaction type', { cause: type });
  }

  if (userId) {
    stringUtils.validateUUID(userId);
  }

  switch (type) {
    case ETransactionType.Sale:
      return appendUserId(systemSaleTaxKeys.other, userId);
    case ETransactionType.Receipt:
      return appendUserId(systemReceiptTaxKeys.other, userId);
    case ETransactionType.Expense:
      return appendUserId(systemExpenseTaxKeys.other, userId);
    case ETransactionType.Payment:
      return appendUserId(systemPaymentTaxKeys.other, userId);
    default:
      return appendUserId(type, userId);
  }
}

function isValid(taxKey: string, type: UTransactionType) {
  if (!taxKey || typeof taxKey !== 'string') return false;

  const [baseTaxKey, userId] = taxKey.split('::');

  if (userId) {
    stringUtils.validateUUID(userId);
  }

  switch (type) {
    case ETransactionType.Sale:
      return Object.values(systemSaleTaxKeys).includes(baseTaxKey as any);
    case ETransactionType.Receipt:
      return Object.values(systemReceiptTaxKeys).includes(baseTaxKey as any);
    case ETransactionType.Expense:
      return Object.values(systemExpenseTaxKeys).includes(baseTaxKey as any);
    case ETransactionType.Payment:
      return Object.values(systemPaymentTaxKeys).includes(baseTaxKey as any);
    default:
      return baseTaxKey === type;
  }
}

function validate(taxKey: string, type: UTransactionType) {
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
  sale: Object.freeze(systemSaleTaxKeys),
  receipt: Object.freeze(systemReceiptTaxKeys),
  expense: Object.freeze(systemExpenseTaxKeys),
  payment: Object.freeze(systemPaymentTaxKeys),
});

export default taxKeyValue;
