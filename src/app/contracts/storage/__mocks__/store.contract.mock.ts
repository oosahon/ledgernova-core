import IStorage from '../store.contract';

export const MockStore: jest.Mocked<IStorage> = {
  init: jest.fn(),
  get: jest.fn(),
};
