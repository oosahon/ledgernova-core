import ICategoryRepo from '../../../domain/category/repos/category.repo';
import { UCategoryFlowType } from '../../../domain/category/types/category.types';
import IStorage from '../../contracts/storage/store.contract';

export default function getCategoriesByFlowTypeUseCase(
  categoryRepo: ICategoryRepo,
  storage: IStorage
) {
  return async (flowType: UCategoryFlowType) => {
    const { user, correlationId } = storage.get();

    return await categoryRepo.findAllByFlowType(
      flowType,
      { correlationId },
      user?.id
    );
  };
}
