import repos from '../../../infra/db/repos';
import services from '../../../infra/services';
import dbService from '../../../infra/services/db.service';
import appContext from '../../context';
import signupWithEmailUsecase from './signup-with-email.usecase';

const authUseCase = {
  signupWithEmail: signupWithEmailUsecase(
    dbService,
    appContext.request,
    repos.user,
    services.auth,
    repos.accountingEntity
  ),
};

export default authUseCase;
