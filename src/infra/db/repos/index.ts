import categoryRepo from './category.repo.impl';
import currencyRepo from './currency.repo.impl';

const repos = {
  category: categoryRepo,
  currency: currencyRepo,
};

export default repos;
