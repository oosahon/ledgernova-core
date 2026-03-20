/**
 * ⚠️ WARNING: SYSTEM CRITICAL DATA ⚠️
 *
 * DO NOT MODIFY, DELETE, OR REORDER items in this file without
 * explicit architectural approval.
 *
 * These records are bootstrapped into the production database.
 * Changing existing keys, IDs, or values here will cause database
 * sync issues, broken relationships, or application startup failures.
 *
 * If you need to add a new category or currency, carefully review
 * the migration guidelines first.
 */
import { EAccountingDomain } from '../../../domain/accounting/types/accounting.types';
import {
  ECategoryStatus,
  ECategoryType,
  ICategory,
  UCategoryType,
} from '../../../domain/category/types/category.types';
import { SYSTEM_PERSONAL_TAX_KEYS } from '../../../domain/tax/policies/personal-income-tax/categorizations';
import taxKeyValue from '../../../domain/tax/value-objects/tax-keys.vo';

interface IIndividualCategory extends ICategory {
  accountingDomain: 'individual';
  status: 'active';
  createdBy: null;
  deletedAt: null;
}

const now = new Date();

function createCategory(
  id: string,
  name: string,
  description: string,
  type: UCategoryType,
  taxKey: string
): IIndividualCategory {
  return Object.freeze({
    id,
    name,
    description,
    type,
    taxKey,
    accountingDomain: EAccountingDomain.Individual,
    status: ECategoryStatus.Active,
    parentId: null,
    createdBy: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });
}

const deductibleFully: IIndividualCategory[] = [
  createCategory(
    '09f18961-6f54-45ec-857b-6d6720b385d5',
    'Pension Contribution',
    'Statutory pension contributions which are fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.pensionContribution
  ),
  createCategory(
    '32cc42d5-d230-4f1f-b1ff-d9eb9b6cad27',
    'NHF Contribution',
    'National Housing Fund contributions, fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.nhfContribution
  ),
  createCategory(
    'a73c991d-9b75-4f6c-80c4-4f5b3148c707',
    'NHIS Contribution',
    'National Health Insurance Scheme contributions, fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.nhisContribution
  ),
  createCategory(
    '8e4d11bc-f47e-485c-bf21-d8bf37b37c07',
    'Annuity Premium',
    'Premiums paid for a life annuity, fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.annuityPremium
  ),
  createCategory(
    '0f9f72c3-590e-45c9-abf7-712d84595856',
    'Health Insurance',
    'Health insurance premiums, fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.healthInsurance
  ),
  createCategory(
    'f38291cf-3abf-4a4d-94e3-4047a8a6be9f',
    'Life Insurance',
    'Life insurance premiums, fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.lifeInsurance
  ),
  createCategory(
    '27812f4e-d5a1-4b53-8837-bb1154f3dc06',
    'Interest on House Loan',
    'Interest payments on loans for an owner-occupied house, fully tax deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.deductibleFully.interestOnOwnerOccupiedHouseLoan
  ),
];

const deductiblePartly: IIndividualCategory[] = [
  createCategory(
    '0ad8620a-e912-4ca6-9cf2-cf3b15c5351f',
    'Rent Payment',
    'Rent payments made for accommodation, partly tax deductible.',
    ECategoryType.Expense,
    SYSTEM_PERSONAL_TAX_KEYS.deductiblePartly.rent
  ),
];

const exemptFully: IIndividualCategory[] = [
  createCategory(
    'adc8078a-0232-4fc8-8e92-6d7ca951d978',
    'Tax Refunds',
    'Refunds received for overpaid taxes, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.taxRefund
  ),
  createCategory(
    '65e0f437-51a1-47bb-9e17-6b7e68456722',
    'Gifts Received',
    'Gifts received from others, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.gift
  ),
  createCategory(
    '3beca634-4b5f-47d8-a215-9eb55c80edc9',
    'Life Insurance Payout',
    'Payouts received from life insurance policies, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.lifeInsurance
  ),
  createCategory(
    '6312c053-926b-481e-b9d4-36d8c5ad0b2d',
    'Pension and RSA Payout',
    'Pension and Retirement Savings Account payouts, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.pensionPRA
  ),
  createCategory(
    '0b1ed248-dd2e-408d-8788-f2fd9f043506',
    'Retirement Benefits',
    'Benefits received upon retirement, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.retirementBenefit
  ),
  createCategory(
    '4dd66406-8152-47ef-bbd1-c7bf83aacd14',
    'Death Gratuities',
    'Gratuities paid out upon death, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.deathGratuity
  ),
  createCategory(
    '3cd54504-0eb7-4979-ba59-6fca030eacb7',
    'Compensation for Loss of Employment',
    'Compensation received for loss of employment, tax handled by payer or exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.compensationLossOfEmployment
  ),
  createCategory(
    'f6f903c9-bc7b-466a-909f-31e8ecd50b13',
    'Sale of Owner-Occupied Home',
    'Income from the sale of an owner-occupied residence, fully tax exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptFully.saleOfOwnerOccupiedHome
  ),
];

const exemptPartly: IIndividualCategory[] = [
  createCategory(
    '0ea6276a-48f5-4029-85b4-1d884dfad9f0',
    'Sale of Personal Effects',
    'Income from selling personal items, partly exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfPersonalEffects
  ),
  createCategory(
    '4a359147-0257-4da1-bcc4-e7c0dac341d0',
    'Sale of Vehicles',
    'Income from selling personal vehicles, partly exempt.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles
  ),
];

const whtApplicable: IIndividualCategory[] = [
  createCategory(
    '505a0849-a8dd-4c51-9c09-c59bd1ae855e',
    'Royalties Received',
    'Income received from royalties, subject to 10% withholding tax.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.royalties
  ),
  createCategory(
    'da9d9803-8cf5-48d6-98f2-96796a05cfeb',
    'Rental to Organization',
    'Rental income from renting to an organization, subject to 10% withholding tax.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.rentalToOrganization
  ),
  createCategory(
    '4bb38f56-5a1c-4164-bfa9-dbc685a8a435',
    'Dividends Received',
    'Dividend income, subject to 10% withholding tax.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.dividends
  ),
  createCategory(
    'c29c9a38-8d74-49fb-addf-02c10585de6a',
    'Interest Received',
    'Interest income, subject to 10% withholding tax.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.interest
  ),
];

const promptTriggers: IIndividualCategory[] = [
  // Expenses
  createCategory(
    '470cce12-9db9-43c3-b257-ba7ffe6555b5',
    'General Interest on House Loan',
    'Interest payments on a general house loan. May require clarification.',
    ECategoryType.Expense,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersExpenses.interestOnHouseLoan
  ),
  createCategory(
    '4fcb0ca1-72bd-4cdd-bea6-d490b0da476a',
    'Mortgage Interest',
    'Interest payments on a mortgage. May require clarification.',
    ECategoryType.Expense,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersExpenses.mortgageInterest
  ),
  // Payments
  createCategory(
    'f7f4f18e-0448-499e-8498-c05f44c2d5fe',
    'Mortgage Payment',
    'Payments made towards a mortgage principle or interest.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersPayment.mortgage
  ),
  createCategory(
    'ff761a25-6533-4cde-b051-646981fe745a',
    'Health Insurance Payment',
    'Payments for health insurance, may be fully deductible.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersPayment.healthInsurance
  ),
  createCategory(
    'c734dbd0-e09e-4ffd-a1b9-1beb6e63e0c9',
    'Stocks Purchase',
    'Payments made to purchase stocks. May require clarification.',
    ECategoryType.Payment,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersPayment.stocksPurchase
  ),
  // Receipts
  createCategory(
    'bab13a33-8cd1-4cac-946c-5f8fa877a4a4',
    'Rental Income',
    'Income received from renting out a property.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersReceipt.rentalIncome
  ),
  createCategory(
    '25cb479d-2bc9-4c4e-94a5-c5498939295b',
    'Salary Income',
    'Income received as salary, which may or may not have been taxed at source.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersReceipt.salary
  ),
  createCategory(
    '59859510-ab22-4267-9b8e-9f82026a559f',
    'Rebate Received',
    'Rebates received on previous purchases or payments.',
    ECategoryType.Receipt,
    SYSTEM_PERSONAL_TAX_KEYS.promptTriggersReceipt.rebate
  ),
];

const defaultOthers: IIndividualCategory[] = [
  createCategory(
    '2a2eb03d-9175-4e32-bd40-067af6a28640',
    'Other Sale',
    'Miscellaneous sales income.',
    ECategoryType.Sale,
    taxKeyValue.make(ECategoryType.Sale)
  ),
  createCategory(
    '0f8d3353-86a0-4c5b-a5fb-b0f2c41fbc9e',
    'Other Purchase',
    'Miscellaneous purchase expenses.',
    ECategoryType.Purchase,
    taxKeyValue.make(ECategoryType.Purchase)
  ),
  createCategory(
    'c2d29ab2-d1b7-4b44-a2e8-145dbb802fcb',
    'Other Credit Note',
    'Miscellaneous credit note transactions.',
    ECategoryType.CreditNote,
    taxKeyValue.make(ECategoryType.CreditNote)
  ),
  createCategory(
    'eee6e4e6-f6ac-4bc4-9293-548ebb0393f0',
    'Other Debit Note',
    'Miscellaneous debit note transactions.',
    ECategoryType.DebitNote,
    taxKeyValue.make(ECategoryType.DebitNote)
  ),
  createCategory(
    '6b1983fe-66f1-4e11-bf21-a3cb58ac4f75',
    'Other Expense',
    'Miscellaneous expenses.',
    ECategoryType.Expense,
    taxKeyValue.make(ECategoryType.Expense)
  ),
  createCategory(
    '633fdfc1-8e5e-40d6-8936-268156dcaa6c',
    'Other Payment',
    'Miscellaneous outward payments.',
    ECategoryType.Payment,
    taxKeyValue.make(ECategoryType.Payment)
  ),
  createCategory(
    '81fae3cc-bd08-48c8-b24f-1ddd8ceb8c68',
    'Other Receipt',
    'Miscellaneous inward receipts.',
    ECategoryType.Receipt,
    taxKeyValue.make(ECategoryType.Receipt)
  ),
];

export const SYSTEM_CATEGORIES_INDIVIDUAL: readonly IIndividualCategory[] = [
  ...deductibleFully,
  ...deductiblePartly,
  ...exemptFully,
  ...exemptPartly,
  ...whtApplicable,
  ...promptTriggers,
  ...defaultOthers,
];
