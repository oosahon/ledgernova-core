import ILogger from '../../../app/contracts/infra/logger.contract';

export const MockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
  log: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  emit: jest.fn(),
} as unknown as jest.Mocked<ILogger>;

export default MockLogger;
