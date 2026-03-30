import accountingDomainEntity from '../../../domain/accounting/entities/accounting-domain';
import IIndividualDomainRepo from '../../../domain/accounting/repos/individual-domain.repo';
import userEntity from '../../../domain/user/entities/user.entity';
import IUserRepo from '../../../domain/user/repos/user.repo';
import emailValue from '../../../domain/user/value-objects/email.vo';
import passwordValue from '../../../domain/user/value-objects/password.vo';
import { ErrorConflict } from '../../../shared/value-objects/error';
import { NAIRA } from '../../bootstrap/data/currencies';
import { IIndividualSignupReq } from '../../contracts/dto/auth.dto';
import IAuthService from '../../contracts/infra-services/auth-service.contract';
import IDbService from '../../contracts/infra-services/db.contract';
import IRequestContext from '../../contracts/storage/request-context.contract';

export default function individualSignupWithEmailUsecase(
  dbService: IDbService,
  requestContext: IRequestContext,
  userRepo: IUserRepo,
  authService: IAuthService,
  individualDomainRepo: IIndividualDomainRepo
) {
  return async (payload: IIndividualSignupReq) => {
    const { correlationId } = requestContext.get();

    const email = emailValue.make(payload.email);

    const existingUser = await userRepo.findByEmail(email, {
      correlationId,
    });

    if (existingUser) {
      throw new ErrorConflict('User already exists');
    }

    // TODO: publish events
    const [user, userEvents] = userEntity.make({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email,
      emailVerified: false,
    });

    // TODO: publish events
    const [individualDomain, individualDomainEvents] =
      accountingDomainEntity.makeIndividual({
        owner: user,
        functionalCurrency: NAIRA,
      });

    const password = passwordValue.make(payload.password);
    const passwordHash = await authService.hashPassword(password);
    const userWithPassword = { ...user, password: passwordHash };

    await dbService.runInTransaction(async (tx) => {
      await userRepo.save(userWithPassword, { tx, correlationId });
      await individualDomainRepo.save(individualDomain, { tx, correlationId });
    });
  };
}
