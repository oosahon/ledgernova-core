import IReporter from '../reporter.contract';

export const MockReporter: jest.Mocked<IReporter> = {
  reportAppError: jest.fn(),
  report: jest.fn(),
};
