import { ULedgerType } from '../../ledger-account/types/index.types';

export interface IPostingAdvisory {
  debit: ULedgerType;
  credit: ULedgerType;
}
