/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CurrencyController } from './src/http/controllers/currency.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CategoryController } from './src/http/controllers/category.controller';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  ECategoryType: {
    dataType: 'refEnum',
    enums: ['income', 'expense', 'liability_income', 'liability_expense'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UCategoryStatus: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['active'] },
        { dataType: 'enum', enums: ['archived'] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ICategory: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      name: { dataType: 'string', required: true },
      type: { ref: 'ECategoryType', required: true },
      taxKey: { dataType: 'string', required: true },
      status: { ref: 'UCategoryStatus', required: true },
      description: { dataType: 'string', required: true },
      parentId: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
        required: true,
      },
      userId: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
        required: true,
      },
      createdAt: { dataType: 'datetime', required: true },
      updatedAt: { dataType: 'datetime', required: true },
      deletedAt: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'datetime' },
          { dataType: 'enum', enums: [null] },
        ],
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'throw-on-extras',
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsCurrencyController_getCurrencies: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {};
  app.get(
    '/api/v1/currencies',
    ...fetchMiddlewares<RequestHandler>(CurrencyController),
    ...fetchMiddlewares<RequestHandler>(
      CurrencyController.prototype.getCurrencies
    ),

    async function CurrencyController_getCurrencies(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCurrencyController_getCurrencies,
          request,
          response,
        });

        const controller = new CurrencyController();

        await templateService.apiHandler({
          methodName: 'getCurrencies',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCategoryController_getCategories: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    categoryType: {
      in: 'query',
      name: 'categoryType',
      required: true,
      ref: 'ECategoryType',
    },
  };
  app.get(
    '/api/v1/categories',
    ...fetchMiddlewares<RequestHandler>(CategoryController),
    ...fetchMiddlewares<RequestHandler>(
      CategoryController.prototype.getCategories
    ),

    async function CategoryController_getCategories(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCategoryController_getCategories,
          request,
          response,
        });

        const controller = new CategoryController();

        await templateService.apiHandler({
          methodName: 'getCategories',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
