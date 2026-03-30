import { AppError } from '../../../../shared/value-objects/error';
import accountingEntityTypeEntity from '../accounting-entity.entity';
import userEntity from '../../../user/entities/user.entity';
import { ICurrency } from '../../../currency/types/currency.types';
import { IUser } from '../../../user/types/user.types';
import { EAccountDomainEvents } from '../../events/accounting-domain.events';
import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import {
  EAccountingEntityType,
  IaccountingEntityTypeEntity,
} from '../../types/accounting.types';

describe('Accounting Domain Entity', () => {
  let validUser: IUser;
  let validCurrency: ICurrency;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-15T00:00:00.000Z'));

    const [user] = userEntity.make({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: false,
    });
    validUser = user;

    validCurrency = {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      minorUnit: 2n,
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('makeIndividual', () => {
    it('should successfully create an individual domain account with valid inputs', () => {
      const payload: TCreationOmits<IaccountingEntityTypeEntity> = {
        owner: validUser,
        type: EAccountingEntityType.Individual,
        functionalCurrency: validCurrency,
      };

      const [domain, events] =
        accountingEntityTypeEntity.makeIndividual(payload);

      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(
        EAccountDomainEvents.IndividualDomainAccountCreated
      );
      expect(events[0].event.data).toEqual(domain);

      expect(typeof domain.id).toBe('string');
      expect(domain.id.length).toBeGreaterThan(0);
      expect(domain.owner).toEqual(validUser);
      expect(domain.functionalCurrency).toEqual(validCurrency);
      expect(domain.createdAt).toEqual(new Date('2026-03-15T00:00:00.000Z'));
      expect(domain.updatedAt).toEqual(new Date('2026-03-15T00:00:00.000Z'));
      expect(domain.deletedAt).toBeNull();
      expect(Object.isFrozen(domain)).toBe(true);
    });

    it('should throw an AppError if the owner is invalid', () => {
      const invalidUser = { ...validUser, firstName: '' };

      const payload: TCreationOmits<IaccountingEntityTypeEntity> = {
        owner: invalidUser,
        type: EAccountingEntityType.Individual,
        functionalCurrency: validCurrency,
      };

      expect(() => accountingEntityTypeEntity.makeIndividual(payload)).toThrow(
        AppError
      );
    });

    it('should throw an AppError if the functional currency code is invalid', () => {
      const invalidCurrency = { ...validCurrency, code: 'INVALID_CODE' };

      const payload: TCreationOmits<IaccountingEntityTypeEntity> = {
        owner: validUser,
        type: EAccountingEntityType.Individual,
        functionalCurrency: invalidCurrency,
      };

      expect(() => accountingEntityTypeEntity.makeIndividual(payload)).toThrow(
        AppError
      );
    });

    it('should throw an AppError if currency code is undefined or not a string', () => {
      const invalidCurrency = {
        ...validCurrency,
        code: undefined as unknown as string,
      };

      const payload: TCreationOmits<IaccountingEntityTypeEntity> = {
        owner: validUser,
        type: EAccountingEntityType.SoleTrader,
        functionalCurrency: invalidCurrency,
      };

      expect(() => accountingEntityTypeEntity.makeIndividual(payload)).toThrow(
        AppError
      );
    });
  });
});
