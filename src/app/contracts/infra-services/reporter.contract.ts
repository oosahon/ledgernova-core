import { Application } from 'express';

interface IReporter {
  reportAppError(app: Application): void;
  report(error: Error | unknown, context?: Record<string, any>): void;
}

export default IReporter;
