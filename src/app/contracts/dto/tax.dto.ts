import { IIndividualTaxPromptResponse } from '../../../domain/tax/types/personal-income-tax.types';
import { IMoney } from '../../../shared/types/money.types';

export interface IGenericTaxCalculatorTransactionReq {
  amount: IMoney;
  categoryId: string;
  promptResponse: IIndividualTaxPromptResponse;
}

export interface IGenericTaxCalculatorReq {
  incomes: IGenericTaxCalculatorTransactionReq[];
  expenses: IGenericTaxCalculatorTransactionReq[];
}
