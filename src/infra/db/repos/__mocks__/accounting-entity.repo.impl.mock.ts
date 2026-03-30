import IAccountingEntityRepo from '../../../../domain/accounting/repos/accounting-entity.repo';

export const MockAccountingEntityRepo: jest.Mocked<IAccountingEntityRepo> = {
  save: jest.fn(),
};

export default MockAccountingEntityRepo;
