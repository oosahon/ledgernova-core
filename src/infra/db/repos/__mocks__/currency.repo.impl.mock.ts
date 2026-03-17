import ICurrencyRepo from '../../../../domain/transaction/repos/currency.repo';

export const MockCurrencyRepo: jest.Mocked<ICurrencyRepo> = {
  save: jest.fn(),
  findByCode: jest.fn(),
  findAll: jest.fn(),
};

export default MockCurrencyRepo;
