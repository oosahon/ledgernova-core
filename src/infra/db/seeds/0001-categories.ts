import { TDBTransaction } from '../../../shared/types/seeder.types';
import categoryEntity from '../../../domain/category/entities/category.entity';
import {
  ECategoryType,
  ICategory,
} from '../../../domain/category/types/category.types';
import taxKeyValue from '../../../domain/tax/value-objects/tax-keys.vo';
import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { seeds } from '../drizzle/schema';
import categoryRepo from '../repos/category.repo.impl';

type TPayload = TCreationOmits<ICategory, 'status' | 'parentId' | 'userId'>;

type TIncomeCategoryMap = {
  [key in keyof typeof taxKeyValue.income.value]: TPayload;
};

function createCustomSystemIncomeCategory(
  name: string,
  description: string
): ICategory {
  return categoryEntity.make({
    name,
    taxKey: taxKeyValue.income.make(),
    type: ECategoryType.Income,
    description,
    parentId: null,
    userId: null,
  });
}

// Always use the transaction passed to you
export default async function main(tx: TDBTransaction) {
  const incomeCategoryMap: TIncomeCategoryMap = {
    salary: {
      name: 'Salary',
      taxKey: taxKeyValue.income.value.salary,
      type: ECategoryType.Income,
      description: 'Regular employment income.',
    },
    compensationLossOfEmployment: {
      name: 'Compensation',
      taxKey: taxKeyValue.income.value.compensationLossOfEmployment,
      type: ECategoryType.Income,
      description: 'Compensation for loss of employment or injury.',
    },
    sales: {
      name: 'Sales',
      taxKey: taxKeyValue.income.value.sales,
      type: ECategoryType.Income,
      description: 'Proceeds from sales.',
    },

    salesPersonalVehicle: {
      name: 'Sales (Personal Vehicle)',
      taxKey: taxKeyValue.income.value.salesPersonalVehicle,
      type: ECategoryType.Income,
      description: 'Personal vehicle sale proceeds.',
    },

    salesPersonalEffect: {
      name: 'Sales (Personal Effect)',
      taxKey: taxKeyValue.income.value.salesPersonalEffect,
      type: ECategoryType.Income,
      description: 'Proceeds from personal items: jewelry, clothes, etc.',
    },

    retirementBenefit: {
      name: 'Retirement Benefit',
      taxKey: taxKeyValue.income.value.retirementBenefit,
      type: ECategoryType.Income,
      description: 'Proceeds from retirement benefits: pension, savings, etc.',
    },

    homeSale: {
      name: 'Sales (Residential Home)',
      taxKey: taxKeyValue.income.value.homeSale,
      type: ECategoryType.Income,
      description: 'Personal vehicle the sale of residential home.',
    },

    royalties: {
      name: 'Royalties',
      taxKey: taxKeyValue.income.value.royalties,
      type: ECategoryType.Income,
      description: 'Earnings from intellectual property, art, music, writing.',
    },
    rental: {
      name: 'Rental',
      taxKey: taxKeyValue.income.value.rental,
      type: ECategoryType.Income,
      description: 'Income from property or equipment rentals.',
    },
    dividends: {
      name: 'Dividends',
      taxKey: taxKeyValue.income.value.dividends,
      type: ECategoryType.Income,
      description: 'Dividends received from investments.',
    },
    interest: {
      name: 'Interest',
      taxKey: taxKeyValue.income.value.interest,
      type: ECategoryType.Income,
      description: 'Interest earned from savings or loans.',
    },
    taxRefund: {
      name: 'Tax Refund',
      taxKey: taxKeyValue.income.value.taxRefund,
      type: ECategoryType.Income,
      description: 'Refunds for taxes or legal fees',
    },
    rebate: {
      name: 'Rebate',
      taxKey: taxKeyValue.income.value.rebate,
      type: ECategoryType.Income,
      description: 'Refunds or rebates for goods or services',
    },
    gift: {
      name: 'Gift',
      taxKey: taxKeyValue.income.value.gift,
      type: ECategoryType.Income,
      description: 'Gifts or donations to individuals or organizations',
    },
    lifeInsurance: {
      name: 'Insurance',
      taxKey: taxKeyValue.income.value.lifeInsurance,
      type: ECategoryType.Income,
      description: 'Income from insurance premiums or claims.',
    },
    pensionPRA: {
      name: 'Pension',
      taxKey: taxKeyValue.income.value.pensionPRA,
      type: ECategoryType.Income,
      description: 'Income from pensions or retirement plans.',
    },
    other: {
      name: 'Other',
      taxKey: taxKeyValue.income.value.other,
      type: ECategoryType.Income,
      description: 'Miscellaneous income not categorized elsewhere.',
    },
  };

  const liabilityIncomeCategoryMap: Record<string, Omit<TPayload, 'taxKey'>> = {
    moneyHeldForOthers: {
      name: 'Money held for others',
      type: ECategoryType.LiabilityIncome,
      description: 'Money held for others',
    },
    loan: {
      name: 'Loan',
      type: ECategoryType.LiabilityIncome,
      description: 'Loan received from others',
    },
  };

  const seedCategories: ICategory[] = [
    ...Object.values(incomeCategoryMap).map((category) =>
      categoryEntity.make({
        ...category,
        parentId: null,
        userId: null,
      })
    ),

    ...Object.values(liabilityIncomeCategoryMap).map((category) =>
      categoryEntity.make({
        ...category,
        parentId: null,
        userId: null,
        taxKey: taxKeyValue.income.makeLiability(),
      })
    ),

    createCustomSystemIncomeCategory(
      'Service fee',
      'Fees you charged for services rendered.'
    ),
  ];
  await tx.insert(seeds).values({
    fileName: '0001-categories',
    createdAt: new Date().toISOString(),
  });

  for (const category of seedCategories) {
    categoryRepo.save(category, {
      correlationId: 'seed:0001-categories',
      tx,
    });
  }
}
