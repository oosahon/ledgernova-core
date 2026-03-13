export enum ECategoryType {
  Income = 'income',
  Expense = 'expense',
  LiabilityIncome = 'liability_income',
  LiabilityExpense = 'liability_expense',
}

export type UCategoryStatus = 'active' | 'archived';

export interface ICategory {
  id: string;
  name: string;
  type: ECategoryType;
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
  type: ECategoryType.Income;
}

export interface IExpenseCategory extends ICategory {
  type: ECategoryType.Expense;
}

export interface ILiabilityIncomeCategory extends ICategory {
  type: ECategoryType.LiabilityIncome;
}

export interface ILiabilityExpenseCategory extends ICategory {
  type: ECategoryType.LiabilityExpense;
}
