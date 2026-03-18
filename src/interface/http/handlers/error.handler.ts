import { Request, Response } from 'express';
import { ValidateError } from 'tsoa';
import {
  ErrorInternalServerError,
  ErrorUnprocessableEntity,
} from '../../../shared/value-objects/error';

import { NODE_ENV } from '../../../infra/config/vars.config';
import ILogger from '../../../app/contracts/infra-services/logger.contract';
import IReporter from '../../../app/contracts/infra-services/reporter.contract';

function httpErrorHandler(logger: ILogger, reporter: IReporter) {
  return (req: Request, res: Response, error: any) => {
    delete req?.headers.authorization;
    // @ts-ignore
    delete req?.file?.buffer;
    delete req?.body?.password;

    req.files?.length &&
      // @ts-ignore
      req.files.forEach((file: any) => {
        delete file.buffer;
      });

    if (error instanceof ValidateError) {
      const validationErrors = Object.entries(error.fields).map(
        ([key, value]) => ({
          field: key,
          message: value.message,
        })
      );
      const { code, ...body } = new ErrorUnprocessableEntity(validationErrors);

      return res.status(code).json(body);
    }

    if (error.name === 'ApiError') {
      return res.status(error.code).json({
        message: error.message,
        validationErrors: error.validationErrors,
      });
    }

    const serverError = new ErrorInternalServerError(error.message);
    if (NODE_ENV !== 'local') {
      reporter.report(serverError);
    } else {
      logger.error('error', serverError);
    }

    return res.status(serverError.code).json({ message: serverError.message });
  };
}

export default httpErrorHandler;
