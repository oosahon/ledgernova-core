import {
  ECategoryType,
  UCategoryType,
} from '../../category/types/category.types';

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

const incomeTaxKeys = {
  salary: 'income:salary',
  sales: 'income:sales',
  homeSale: 'income:home_sale',
  salesPersonalEffect: 'income:sales_personal_effect',
  salesPersonalVehicle: 'income:sales_personal_vehicles',
  rebate: 'income:rebate',
  // TODO: shares profit will be handled when the bookkeeping module is complete.
  // SharesProfit = 'shares_profit',
  // ServiceFee = 'Service Fee',
  // Bonus = 'bonus',
  // Compensation = 'compensation',
  compensationLossOfEmployment: 'income:compensation_loss_of_employment',
  // Business = 'business',
  // Commissions = 'commissions',
  royalties: 'income:royalties',
  rental: 'income:rental',
  dividends: 'income:dividends',
  interest: 'income:interest',
  // CapitalGains = 'capital_gains',
  // Grants = 'grants',
  // Sponsorships = 'sponsorships',
  taxRefund: 'income:tax_refunds',
  gift: 'income:gift',
  // Insurance = 'insurance',
  lifeInsurance: 'income:life_insurance',
  // Pension = 'pension',
  pensionPRA: 'income:pensions_rsa',
  retirementBenefit: 'income:retirement_benefit',
  other: 'income:other',
};

function makeIncome(userId?: string | null) {
  return !userId ? incomeTaxKeys.other : `${incomeTaxKeys.other}::${userId}`;
}

function makeLiabilityIncome(userId?: string | null) {
  const base = `income:liability`;
  return !userId ? base : `${base}::${userId}`;
}

function makeExpense(userId?: string | null) {
  return !userId ? expenseTaxKeys.other : `${expenseTaxKeys.other}::${userId}`;
}

function makeLiabilityExpense(userId?: string | null) {
  const base = `expense:liability`;
  return !userId ? base : `${base}::${userId}`;
}

function isValid(taxKey: string, type: UCategoryType) {
  switch (type) {
    case ECategoryType.Income:
      return Object.values(incomeTaxKeys).includes(taxKey);
    case ECategoryType.Expense:
      return Object.values(expenseTaxKeys).includes(taxKey);
    case ECategoryType.LiabilityIncome:
      return taxKey.startsWith('income:liability');
    case ECategoryType.LiabilityExpense:
      return taxKey.startsWith('expense:liability');
    default:
      return false;
  }
}

const taxKeyValue = Object.freeze({
  income: Object.freeze({
    make: makeIncome,
    value: Object.freeze(incomeTaxKeys),
    makeLiability: makeLiabilityIncome,
  }),
  expense: Object.freeze({
    make: makeExpense,
    value: Object.freeze(expenseTaxKeys),
    makeLiability: makeLiabilityExpense,
  }),
  isValid,
});

export default taxKeyValue;
