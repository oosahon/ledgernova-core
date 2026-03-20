import appContext from '../../context';
import repos from '../../../infra/db/repos';
import getAllCategoriesUseCase from './get-all-categories.usecase';

const categoryUseCases = Object.freeze({
  getAll: getAllCategoriesUseCase(repos.category, appContext.request),
});

export default categoryUseCases;
