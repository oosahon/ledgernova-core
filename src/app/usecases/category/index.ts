import repos from '../../../infra/db/repos';
import getCategoriesByFlowTypeUseCase from './get-categories-by-flow-type.usecase';
import services from '../../../infra/services';

const categoryUseCases = {
  getAllByFlowType: getCategoriesByFlowTypeUseCase(
    repos.category,
    services.storage
  ),
};

export default categoryUseCases;
