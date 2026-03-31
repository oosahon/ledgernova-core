import { ULedgerType } from '../../ledger/types/index.types';

export interface IPostingAdvisory {
  debit: ULedgerType;
  credit: ULedgerType;
}
