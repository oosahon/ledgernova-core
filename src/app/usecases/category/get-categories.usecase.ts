import ICategoryRepo from '../../../domain/category/repos/category.repo';
import {
  ECategoryType,
  UCategoryType,
} from '../../../domain/category/types/category.types';
import IStorage from '../../contracts/storage/store.contract';

export default function getCategoriesUseCase(
  categoryRepo: ICategoryRepo,
  storage: IStorage
) {
  return async (categoryType: UCategoryType) => {
    const { user, correlationId } = storage.get();

    const typePayload: UCategoryType[] = [];

    switch (categoryType) {
      case ECategoryType.Income:
        typePayload.push(ECategoryType.Income, ECategoryType.LiabilityIncome);
        break;
      case ECategoryType.Expense:
        typePayload.push(ECategoryType.Expense, ECategoryType.LiabilityExpense);
        break;
      case ECategoryType.LiabilityIncome:
        typePayload.push(ECategoryType.LiabilityIncome);
        break;
      case ECategoryType.LiabilityExpense:
        typePayload.push(ECategoryType.LiabilityExpense);
        break;
    }

    return await categoryRepo.findAll(
      typePayload,
      { correlationId },
      { userId: user?.id }
    );
  };
}
