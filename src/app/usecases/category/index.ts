import repos from '../../../infra/db/repos';
import getCategoriesUseCase from './get-categories.usecase';
import services from '../../../infra/services';

const categoryUseCases = {
  getAll: getCategoriesUseCase(repos.category, services.storage),
};

export default categoryUseCases;
