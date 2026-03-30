import IUserRepo from '../../../../domain/user/repos/user.repo';

export const MockUserRepo: jest.Mocked<IUserRepo> = {
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
};

export default MockUserRepo;
