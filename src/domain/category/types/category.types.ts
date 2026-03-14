export const ECategoryType = {
  Income: 'income',
  Expense: 'expense',
  LiabilityIncome: 'liability_income',
  LiabilityExpense: 'liability_expense',
} as const;

export type UCategoryType = (typeof ECategoryType)[keyof typeof ECategoryType];

export type UCategoryStatus = 'active' | 'archived';

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
