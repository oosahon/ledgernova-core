import { IApiValidationError } from '../../../shared/value-objects/error';

export interface IApiError {
  message: string;
  validationErrors?: IApiValidationError[];
  cause?: any;
}
