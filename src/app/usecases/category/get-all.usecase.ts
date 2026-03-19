import ICategoryRepo from '../../../domain/category/repos/category.repo';
import { ULedgerAccountType } from '../../../domain/ledger-account/types/ledger-account.types';
import { UTransactionDirection } from '../../../domain/transaction/types/transaction.types';
import IStorage from '../../contracts/storage/store.contract';

export default function getAllCategoriesUseCase(
  categoryRepo: ICategoryRepo,
  storage: IStorage
) {
  return async (
    ledgerAccountType: ULedgerAccountType,
    transactionDirection: UTransactionDirection
  ) => {
    const { user, correlationId } = storage.get();

    // TODO: implement
  };
}
