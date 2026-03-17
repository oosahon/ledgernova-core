import repos from '../../../infra/db/repos';
import getCurrenciesUseCase from './get-currencies.usecase';
import services from '../../../infra/services';

const currencyUseCase = {
  getAll: getCurrenciesUseCase(repos.currency, services.storage),
};

export default currencyUseCase;
