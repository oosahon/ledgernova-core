/**
 * ⚠️ WARNING: SYSTEM CRITICAL DATA ⚠️
 *
 * DO NOT MODIFY OR DELETE items in this file without explicit approval.
 *
 * Tax keys are used to identify tax types and are essential for
 * generating tax receipts and tax returns. Changing existing
 * keys or values here will cause database sync issues, broken
 * relationships, and severe impact on the tax system in production.
 */

/**
 * Transactions recorded in this category are fully deductible
 */
const DEDUCTIBLE_FULLY = {
  pensionContribution: 'personal:payment:deductible:fully:pension_contribution',
  nhfContribution: 'personal:payment:deductible:fully:nhf_contribution',
  nhisContribution: 'personal:payment:deductible:fully:nhis_contribution',
  annuityPremium: 'personal:payment:deductible:fully:annuity_premium',
  healthInsurance: 'personal:payment:deductible:fully:health_insurance',
  lifeInsurance: 'personal:payment:deductible:fully:life_insurance',
  interestOnOwnerOccupiedHouseLoan:
    'personal:payment:deductible:fully:interest_on_owner_occupied_house_loan',
};

/**
 * Transactions recorded in this category are partly deductible
 */
const DEDUCTIBLE_PARTLY = {
  // 20% or N500_000 whichever is lower
  rent: 'personal:deductible:partly:rent',
};

/**
 * Transactions recorded in this category are fully exempt
 */
const EXEMPT_FULLY = {
  taxRefund: 'personal:receipt:exempt:fully:tax_refunds',
  gift: 'personal:receipt:exempt:fully:gift',
  lifeInsurance: 'personal:receipt:exempt:fully:life_insurance',
  pensionPRA: 'personal:receipt:exempt:fully:pensions_rsa',
  retirementBenefit: 'personal:receipt:exempt:fully:retirement_benefit',
  deathGratuity: 'personal:receipt:exempt:fully:death_gratuities',
  // taxes on payments >NGN 50M is handled by the paying organization
  compensationLossOfEmployment:
    'personal:receipt:compensation_loss_of_employment',
  saleOfOwnerOccupiedHome:
    'personal:receipt:exempt:fully:sale_of_owner_occupied_home',
};

const EXEMPT_PARTLY = {
  // up to N5m
  saleOfPersonalEffects:
    'personal:receipt:exempt:partly:sale_of_personal_effects',

  // up to two vehicles a year
  saleOfVehicles: 'personal:receipt:exempt:partly:sale_of_vehicles',
};

/**
 * Transactions recorded in this category are subject to WHT
 */
const WHT_APPLICABLE = {
  // WHT is not final tax: 10%
  rentalToOrganization: 'personal:receipt:wht:not_final:rental_to_organization',

  // WHT is final tax: 10%
  royalties: 'personal:receipt:wht:final:royalties',

  // WHT is final tax: 10%
  dividends: 'personal:receipt:wht:final:dividends',

  // WHT is final tax: 10%
  interest: 'personal:receipt:wht:final:interest',
};

/**
 * Transactions that trigger user clarification
 */
const PROMPT_TRIGGERS_EXPENSES = {
  interestOnHouseLoan: 'personal:expense:interest_on_house_loan',
  mortgageInterest: 'personal:expense:mortgage_interest',
};

const PROMPT_TRIGGERS_PAYMENT = {
  mortgage: 'personal:payment:mortgage',
  healthInsurance: 'personal:payment:health_insurance',
  stocksPurchase: 'personal:payment:stocks_purchase',
};

const PROMPT_TRIGGERS_RECEIPT = {
  rentalIncome: 'personal:receipt:rental_income',
  // this may or may not have been taxed at source.
  salary: 'personal:receipt:salary',
  rebate: 'personal:receipt:rebate',
};

export const SYSTEM_PERSONAL_TAX_KEYS_COMBINED = Object.freeze({
  ...DEDUCTIBLE_FULLY,
  ...DEDUCTIBLE_PARTLY,
  ...EXEMPT_FULLY,
  ...EXEMPT_PARTLY,
  ...WHT_APPLICABLE,
});

export const SYSTEM_PERSONAL_TAX_KEYS = Object.freeze({
  deductibleFully: Object.freeze(DEDUCTIBLE_FULLY),
  deductiblePartly: Object.freeze(DEDUCTIBLE_PARTLY),
  exemptFully: Object.freeze(EXEMPT_FULLY),
  exemptPartly: Object.freeze(EXEMPT_PARTLY),
  whtApplicable: Object.freeze(WHT_APPLICABLE),
  promptTriggersExpenses: Object.freeze(PROMPT_TRIGGERS_EXPENSES),
  promptTriggersPayment: Object.freeze(PROMPT_TRIGGERS_PAYMENT),
  promptTriggersReceipt: Object.freeze(PROMPT_TRIGGERS_RECEIPT),
});

export const SYSTEM_PERSONAL_TAX_KEYS_PROMPT_TRIGGERS_ALL = Object.freeze({
  ...PROMPT_TRIGGERS_EXPENSES,
  ...PROMPT_TRIGGERS_PAYMENT,
  ...PROMPT_TRIGGERS_RECEIPT,
  ...WHT_APPLICABLE,

  gift: EXEMPT_FULLY.gift,
});
