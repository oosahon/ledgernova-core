/**
 * This usecase is a generic personal income tax calculator that can be used to calculate the personal income tax for Nigerians.
 *
 * It serves as a simple interface that lead magnets and AI agents can use to calculate the personal income taxes.
 *
 * To handle this, we will create the following dummy entities:
 *  - account
 *  - transaction items
 *  - transactions
 *
 */

import ICategoryRepo from '../../../domain/category/repos/category.repo';
import transactionEntity from '../../../domain/transaction/entities/transaction.entity';
import {
  ETransactionStatus,
  ETransactionType,
  ITransaction,
  ITransactionItem,
} from '../../../domain/transaction/types/transaction.types';
import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { AppError } from '../../../shared/value-objects/error';
import {
  IGenericTaxCalculatorReq,
  IGenericTaxCalculatorTransactionReq,
} from '../../contracts/dto/tax.dto';
import IRequestContext from '../../contracts/storage/request-context.contract';

export default function genericPersonalIncomeTaxCalculatorUseCase(
  categoryRepo: ICategoryRepo,
  requestContext: IRequestContext
) {
  return async (payload: IGenericTaxCalculatorReq) => {
    const { correlationId } = requestContext.get();

    const incomeTransactions = makeDummyIncomeTransactions(
      categoryRepo,
      payload.incomes,
      correlationId
    );

    const expenseTransactions = makeDummyExpenses(
      categoryRepo,
      payload.expenses,
      correlationId
    );

    // TODO: pass to tax engine
    return {
      incomeTransactions,
      expenseTransactions,
    };
  };
}

async function makeDummyIncomeTransactions(
  categoryRepo: ICategoryRepo,
  incomes: IGenericTaxCalculatorTransactionReq[],
  correlationId: string
) {
  const incomeTransactions: ITransaction[] = [];
  for (const income of incomes) {
    const category = await categoryRepo.findById(income.categoryId, {
      correlationId,
    });

    if (!category) {
      throw new AppError('Invalid category provided', { cause: income });
    }

    const itemsPayload: TCreationOmits<ITransactionItem, 'transactionId'> = {
      amount: income.amount,
      functionalCurrencyAmount: income.amount,
      quantity: 1,
      unitPrice: income.amount,
      category,
      isSystemGenerated: true,
      name: 'Dummy',
    };

    const transactionPayload: TCreationOmits<
      ITransaction,
      'reference' | 'items'
    > = {
      status: ETransactionStatus.Posted,
      createdBy: correlationId,
      type: ETransactionType.Receipt,
      accountId: correlationId,
      amount: income.amount,
      functionalCurrencyAmount: income.amount,
      attachmentIds: [],
      date: new Date(),
      recipientAccountId: null,
      exchangeRate: 1,
      notes: null,
    };

    const [dummyTransaction] = transactionEntity.make(transactionPayload, [
      itemsPayload,
    ]);

    incomeTransactions.push(dummyTransaction);
  }

  return incomeTransactions;
}

async function makeDummyExpenses(
  categoryRepo: ICategoryRepo,
  expenses: IGenericTaxCalculatorTransactionReq[],
  correlationId: string
) {
  const expenseTransactions: ITransaction[] = [];
  for (const expense of expenses) {
    const category = await categoryRepo.findById(expense.categoryId, {
      correlationId,
    });

    if (!category) {
      throw new AppError('Invalid category provided', { cause: expense });
    }

    const itemsPayload: TCreationOmits<ITransactionItem, 'transactionId'> = {
      amount: expense.amount,
      functionalCurrencyAmount: expense.amount,
      quantity: 1,
      unitPrice: expense.amount,
      category,
      isSystemGenerated: true,
      name: 'Dummy',
    };

    const transactionPayload: TCreationOmits<
      ITransaction,
      'reference' | 'items'
    > = {
      status: ETransactionStatus.Posted,
      createdBy: correlationId,
      type: ETransactionType.Receipt,
      accountId: correlationId,
      amount: expense.amount,
      functionalCurrencyAmount: expense.amount,
      attachmentIds: [],
      date: new Date(),
      recipientAccountId: null,
      exchangeRate: 1,
      notes: null,
    };

    const [dummyTransaction] = transactionEntity.make(transactionPayload, [
      itemsPayload,
    ]);

    expenseTransactions.push(dummyTransaction);
  }

  return expenseTransactions;
}
