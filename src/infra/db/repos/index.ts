import accountingEntityRepo from './accounting-entity.repo.impl';
import categoryRepo from './category.repo.impl';
import currencyRepo from './currency.repo.impl';
import userRepo from './user.repo.impl';

const repos = {
  category: categoryRepo,
  currency: currencyRepo,
  user: userRepo,
  accountingEntity: accountingEntityRepo,
};

export default repos;
