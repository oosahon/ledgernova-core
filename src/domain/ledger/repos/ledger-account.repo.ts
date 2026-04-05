import { TEntityId } from '../../../shared/types/uuid';
import { ILedgerAccount } from '../types/ledger.types';

export default interface ILedgerAccountRepo {
  findById(id: TEntityId): Promise<ILedgerAccount | null>;

  findByCode(
    code: string,
    accountingEntityId: TEntityId
  ): Promise<ILedgerAccount | null>;
}
