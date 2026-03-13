const expenseTaxKeys = Object.freeze({
  other: 'expense:other',
  rent: 'expense:rent',
  lifeInsurance: 'expense:life_insurance',
  healthInsurance: 'expense:health_insurance',
  pensionContribution: 'expense:pension_contribution',
  nhisContribution: 'expense:nhis_contribution',
  nhfContribution: 'expense:nhf_contribution',
  interestOnHouseLoan: 'expense:interest_on_house_loan',
});

const incomeTaxKeys = Object.freeze({
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
});

function makeIncome(userId?: string | null) {
  return !userId
    ? incomeTaxKeys.other
    : `${incomeTaxKeys.other}::${userId}::${Date.now()}`;
}

function makeExpense(userId?: string | null) {
  return !userId
    ? expenseTaxKeys.other
    : `${expenseTaxKeys.other}::${userId}::${Date.now()}`;
}

const taxKey = Object.freeze({
  income: {
    make: makeIncome,
    value: incomeTaxKeys,
  },
  expense: {
    make: makeExpense,
    value: expenseTaxKeys,
  },
});

export default taxKey;
