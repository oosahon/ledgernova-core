import appContext from '../../context';
import repos from '../../../infra/db/repos';
import getCurrenciesUseCase from './get-currencies.usecase';

const currencyUseCase = Object.freeze({
  getAll: getCurrenciesUseCase(repos.currency, appContext.request),
});

export default currencyUseCase;
