export const ECategoryType = {
  Income: 'income',
  Expense: 'expense',
  LiabilityIncome: 'liability_income',
  LiabilityExpense: 'liability_expense',
} as const;

export type UCategoryType = (typeof ECategoryType)[keyof typeof ECategoryType];

export const ECategoryStatus = {
  Active: 'active',
  Archived: 'archived',
} as const;

export type UCategoryStatus =
  (typeof ECategoryStatus)[keyof typeof ECategoryStatus];

export interface ICategory {
  id: string;
  name: string;
  type: UCategoryType;
  taxKey: string;
  status: UCategoryStatus;
  description: string;
  parentId: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IIncomeCategory extends ICategory {
  type: 'income';
}

export interface IExpenseCategory extends ICategory {
  type: 'expense';
}

export interface ILiabilityIncomeCategory extends ICategory {
  type: 'liability_income';
}

export interface ILiabilityExpenseCategory extends ICategory {
  type: 'liability_expense';
}
