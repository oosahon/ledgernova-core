import ICategoryRepo from '../../../domain/category/repos/category.repo';
import { UJournalDirection } from '../../../domain/journal-entry/types/journal-entry.types';
import { ULedgerType } from '../../../domain/ledger-account/types/index.types';
import IStorage from '../../contracts/storage/store.contract';

export default function getAllCategoriesUseCase(
  categoryRepo: ICategoryRepo,
  storage: IStorage
) {
  return async (
    ledgerAccountType: ULedgerType,
    transactionDirection: UJournalDirection
  ) => {
    const { user, correlationId } = storage.get();

    // TODO: implement
  };
}
