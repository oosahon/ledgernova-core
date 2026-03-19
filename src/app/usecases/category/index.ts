import repos from '../../../infra/db/repos';
import getAllCategoriesUseCase from './get-all.usecase';
import services from '../../../infra/services';

const categoryUseCases = {
  getAll: getAllCategoriesUseCase(repos.category, services.storage),
};

export default categoryUseCases;
