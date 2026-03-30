/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CurrencyController } from './src/interface/http/controllers/currency.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CategoryController } from './src/interface/http/controllers/category.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './src/interface/http/controllers/auth.controller';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  UAccountingEntityType: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['individual'] },
        { dataType: 'enum', enums: ['sole_trader'] },
        { dataType: 'enum', enums: ['company'] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UCategoryType: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['expense'] },
        { dataType: 'enum', enums: ['sale'] },
        { dataType: 'enum', enums: ['purchase'] },
        { dataType: 'enum', enums: ['credit_note'] },
        { dataType: 'enum', enums: ['debit_note'] },
        { dataType: 'enum', enums: ['payment'] },
        { dataType: 'enum', enums: ['receipt'] },
      ],
      validators: {},
    },
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
      accountingEntityType: { ref: 'UAccountingEntityType', required: true },
      type: { ref: 'UCategoryType', required: true },
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
      createdBy: {
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
  ULedgerType: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['asset'] },
        { dataType: 'enum', enums: ['liability'] },
        { dataType: 'enum', enums: ['revenue'] },
        { dataType: 'enum', enums: ['expense'] },
        { dataType: 'enum', enums: ['equity'] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UJournalDirection: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['debit'] },
        { dataType: 'enum', enums: ['credit'] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  IIndividualSignupReq: {
    dataType: 'refObject',
    properties: {
      firstName: { dataType: 'string', required: true },
      lastName: { dataType: 'string', required: true },
      email: { dataType: 'string', required: true },
      password: { dataType: 'string', required: true },
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
    _: {
      in: 'header',
      name: 'x-accounting-entity-type',
      required: true,
      ref: 'UAccountingEntityType',
    },
    ledgerType: { in: 'query', name: 'ledgerType', ref: 'ULedgerType' },
    transactionDirection: {
      in: 'query',
      name: 'transactionDirection',
      ref: 'UJournalDirection',
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
  const argsAuthController_signupWithEmail: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    body: {
      in: 'body',
      name: 'body',
      required: true,
      ref: 'IIndividualSignupReq',
    },
  };
  app.post(
    '/api/v1/auth/signup-with-email',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(
      AuthController.prototype.signupWithEmail
    ),

    async function AuthController_signupWithEmail(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_signupWithEmail,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'signupWithEmail',
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
