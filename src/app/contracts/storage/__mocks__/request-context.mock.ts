import IRequestContext from '../request-context.contract';

const MockRequestContext: jest.Mocked<IRequestContext> = {
  init: jest.fn(),
  get: jest.fn(),
};

export default MockRequestContext;
