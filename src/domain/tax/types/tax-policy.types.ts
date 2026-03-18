import { IMoney } from '../../../shared/types/money.types';
import { ITransactionItem } from '../../transaction/types/transaction.types';

export interface IPersonalIncomeTaxDeductionPolicy {
  transactionItems: ITransactionItem[];
  deductibleAmount: IMoney;
}

export interface IPersonalIncomeTaxPolicy {
  transactionItem: ITransactionItem;
  taxableAmount: IMoney;
}
