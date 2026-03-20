import { IMoney } from '../../../shared/types/money.types';
import { ITransactionItem } from '../../transaction/types/transaction.types';

export interface IPITDeductionPolicy {
  transactionItems: ITransactionItem[];
  deductibleAmount: IMoney;
}

export interface IPITDeductionUserInput {
  id: string;
  userId: string;
  transactionItemId: string;
  ownerOccupiedHome: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPITPolicy {
  transactionItem: ITransactionItem;
  taxableAmount: IMoney;
}

export interface ITransactionItemWithPITUserInput extends ITransactionItem {
  userInput?: IPITDeductionUserInput;
}
