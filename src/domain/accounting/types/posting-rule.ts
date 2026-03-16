import { ULedgerAccountType } from '../../account/types/account.types';

export interface IPostingAdvisory {
  debit: ULedgerAccountType;
  credit: ULedgerAccountType;
}
