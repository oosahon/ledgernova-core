import ICategoryRepo from '../../../../domain/category/repos/category.repo';

export const MockCategoryRepo: jest.Mocked<ICategoryRepo> = {
  save: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findByTaxKey: jest.fn(),
  findByName: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

export default MockCategoryRepo;
