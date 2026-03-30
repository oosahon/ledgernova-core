import signupWithEmailUsecase from '../signup-with-email.usecase';
import { EAccountingEntityType } from '../../../../domain/accounting/types/accounting.types';
import { ErrorConflict } from '../../../../shared/value-objects/error';
import emailValue from '../../../../domain/user/value-objects/email.vo';
import MockRequestContext from '../../../contracts/storage/__mocks__/request-context.mock';
import mockDbService from '../../../../infra/services/__mocks__/db.service.mock';
import MockUserRepo from '../../../../infra/db/repos/__mocks__/user.repo.impl.mock';
import MockAccountingEntityRepo from '../../../../infra/db/repos/__mocks__/accounting-entity.repo.impl.mock';
import mockAuthService from '../../../../infra/services/__mocks__/auth.service.mock';
import IRequestContextData from '../../../../shared/types/request-context.types';
import { IUser } from '../../../../domain/user/types/user.types';
import { TDBTransaction } from '../../../../shared/types/seeder.types';

describe('signupWithEmailUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully sign up a new user and create an individual accounting domain', async () => {
    const correlationId = 'test-corr-id';
    MockRequestContext.get.mockReturnValue({
      correlationId,
    } as unknown as IRequestContextData);

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'SecurePassword123!',
    };

    const mockTx = { txId: 'tx-1' };
    mockDbService.runInTransaction.mockImplementation(async (cb) => {
      await cb(mockTx as unknown as TDBTransaction);
    });

    MockUserRepo.findByEmail.mockResolvedValue(null);
    mockAuthService.hashPassword.mockResolvedValue('hashed-password');

    const usecase = signupWithEmailUsecase(
      mockDbService,
      MockRequestContext,
      MockUserRepo,
      mockAuthService,
      MockAccountingEntityRepo
    );

    await usecase(payload);

    expect(MockRequestContext.get).toHaveBeenCalledTimes(1);

    // Check if user was searched by email
    const emailVo = emailValue.make(payload.email);
    expect(MockUserRepo.findByEmail).toHaveBeenCalledWith(emailVo, {
      correlationId,
    });

    expect(mockAuthService.hashPassword).toHaveBeenCalledTimes(1);
    expect(mockDbService.runInTransaction).toHaveBeenCalledTimes(1);

    // Assert that save methods were called correctly within the transaction
    expect(MockUserRepo.save).toHaveBeenCalledTimes(1);
    const savedUserArgs = MockUserRepo.save.mock.calls[0];
    expect(savedUserArgs[0]).toMatchObject({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: emailVo,
      emailVerified: false,
      password: 'hashed-password',
    });
    expect(savedUserArgs[1]).toEqual({ tx: mockTx, correlationId });

    expect(MockAccountingEntityRepo.save).toHaveBeenCalledTimes(1);
    const savedDomainArgs = MockAccountingEntityRepo.save.mock.calls[0];
    expect(savedDomainArgs[0]).toMatchObject({
      type: EAccountingEntityType.Individual,
      owner: expect.objectContaining({
        firstName: payload.firstName,
        lastName: payload.lastName,
      }),
      functionalCurrency: expect.objectContaining({
        code: 'NGN',
      }),
    });
    expect(savedDomainArgs[1]).toEqual({ tx: mockTx, correlationId });
  });

  it('should throw ErrorConflict if user already exists', async () => {
    const correlationId = 'test-corr-id';
    MockRequestContext.get.mockReturnValue({
      correlationId,
    } as unknown as IRequestContextData);

    const payload = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@example.com',
      password: 'SecurePassword123!',
    };

    MockUserRepo.findByEmail.mockResolvedValue({
      id: 'existing-user-id',
    } as unknown as IUser);

    const usecase = signupWithEmailUsecase(
      mockDbService,
      MockRequestContext,
      MockUserRepo,
      mockAuthService,
      MockAccountingEntityRepo
    );

    await expect(usecase(payload)).rejects.toThrow(ErrorConflict);
    await expect(usecase(payload)).rejects.toThrow('User already exists');

    expect(MockUserRepo.findByEmail).toHaveBeenCalledTimes(2); // Since we called it twice in expect
    expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
    expect(mockDbService.runInTransaction).not.toHaveBeenCalled();
  });
});
