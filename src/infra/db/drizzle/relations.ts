import { relations } from 'drizzle-orm/relations';
import {
  usersInCore,
  userActivitiesInAudit,
  currenciesInCore,
  currencyExchangeRatesInCore,
  categoriesInCore,
  accountingEntitiesInCore,
} from './schema';

export const userActivitiesInAuditRelations = relations(
  userActivitiesInAudit,
  ({ one }) => ({
    usersInCore: one(usersInCore, {
      fields: [userActivitiesInAudit.userId],
      references: [usersInCore.id],
    }),
  })
);

export const usersInCoreRelations = relations(usersInCore, ({ many }) => ({
  userActivitiesInAudits: many(userActivitiesInAudit),
  categoriesInCores: many(categoriesInCore),
  accountingEntitiesInCores: many(accountingEntitiesInCore),
}));

export const currencyExchangeRatesInCoreRelations = relations(
  currencyExchangeRatesInCore,
  ({ one }) => ({
    currenciesInCore_baseCurrencyCode: one(currenciesInCore, {
      fields: [currencyExchangeRatesInCore.baseCurrencyCode],
      references: [currenciesInCore.code],
      relationName:
        'currencyExchangeRatesInCore_baseCurrencyCode_currenciesInCore_code',
    }),
    currenciesInCore_targetCurrencyCode: one(currenciesInCore, {
      fields: [currencyExchangeRatesInCore.targetCurrencyCode],
      references: [currenciesInCore.code],
      relationName:
        'currencyExchangeRatesInCore_targetCurrencyCode_currenciesInCore_code',
    }),
  })
);

export const currenciesInCoreRelations = relations(
  currenciesInCore,
  ({ many }) => ({
    currencyExchangeRatesInCores_baseCurrencyCode: many(
      currencyExchangeRatesInCore,
      {
        relationName:
          'currencyExchangeRatesInCore_baseCurrencyCode_currenciesInCore_code',
      }
    ),
    currencyExchangeRatesInCores_targetCurrencyCode: many(
      currencyExchangeRatesInCore,
      {
        relationName:
          'currencyExchangeRatesInCore_targetCurrencyCode_currenciesInCore_code',
      }
    ),
    accountingEntitiesInCores: many(accountingEntitiesInCore),
  })
);

export const categoriesInCoreRelations = relations(
  categoriesInCore,
  ({ one, many }) => ({
    categoriesInCore: one(categoriesInCore, {
      fields: [categoriesInCore.parentId],
      references: [categoriesInCore.id],
      relationName: 'categoriesInCore_parentId_categoriesInCore_id',
    }),
    categoriesInCores: many(categoriesInCore, {
      relationName: 'categoriesInCore_parentId_categoriesInCore_id',
    }),
    usersInCore: one(usersInCore, {
      fields: [categoriesInCore.createdBy],
      references: [usersInCore.id],
    }),
  })
);

export const accountingEntitiesInCoreRelations = relations(
  accountingEntitiesInCore,
  ({ one }) => ({
    usersInCore: one(usersInCore, {
      fields: [accountingEntitiesInCore.ownerId],
      references: [usersInCore.id],
    }),
    currenciesInCore: one(currenciesInCore, {
      fields: [accountingEntitiesInCore.functionalCurrencyCode],
      references: [currenciesInCore.code],
    }),
  })
);
