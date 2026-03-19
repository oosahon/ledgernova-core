import { ULedgerAccountType } from '../../ledger-account/types/ledger-account.types';

export interface IPostingAdvisory {
  debit: ULedgerAccountType;
  credit: ULedgerAccountType;
}
