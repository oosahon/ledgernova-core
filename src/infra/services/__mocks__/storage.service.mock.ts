import IStorage from '../../../app/contracts/storage/store.contract';

export const MockStorageService = jest.fn(
  (): jest.Mocked<IStorage> => ({
    init: jest.fn(),
    get: jest.fn(),
  })
);

export default MockStorageService;
