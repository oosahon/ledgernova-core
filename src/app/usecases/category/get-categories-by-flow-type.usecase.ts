import ICategoryRepo from '../../../domain/category/repos/category.repo';
import IStorage from '../../contracts/storage/store.contract';

// TODO: reimplement this usecase;
type UCategoryFlowType = 'in' | 'out';

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
