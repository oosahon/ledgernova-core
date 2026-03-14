import IReporter from '../../../app/contracts/infra-services/reporter.contract';

export const MockReporter: jest.Mocked<IReporter> = {
  reportAppError: jest.fn(),
  report: jest.fn(),
};

export default MockReporter;
