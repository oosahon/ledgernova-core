import { IMoney } from '../../../shared/types/money.types';
import { ITransactionItem } from '../../transaction/types/transaction.types';

export interface IPersonalIncomeDeductionPolicy {
  transactionItems: ITransactionItem[];
  totalAmount: IMoney;
  deductibleAmount: IMoney;
}

export interface IPersonalIncomeTaxationPolicy {
  transactionItems: ITransactionItem[];
  totalAmount: IMoney;
  taxableAmount: IMoney;
  taxCredits: IMoney;
  withholdingTax: IMoney;
}

export interface IIndividualTaxPromptResponse {
  id: string;
  userId: string;
  transactionItemId: string;
  ownerOccupiedHome: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionItemWithPromptResponse extends ITransactionItem {
  individualTaxPromptResponse?: IIndividualTaxPromptResponse;
}

export interface IPersonalIncomeTaxCalculatorLogs {
  amountTaxed: IMoney;
  band: number;
  tax: IMoney;
}

export interface IPersonalIncomeTaxCalculatorResult {
  taxableAmount: IMoney;
  taxCredits: IMoney;
  withholdingTax: IMoney;
  totalTax: IMoney;
  logs: IPersonalIncomeTaxCalculatorLogs[];
  band: number;
}

export interface IPITProgressiveTaxationResult {
  tax: IMoney;
  band: number;
  logs: IPersonalIncomeTaxCalculatorLogs[];
}
