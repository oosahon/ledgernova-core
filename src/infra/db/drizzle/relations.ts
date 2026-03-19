import { relations } from 'drizzle-orm/relations';
import {
  usersInCore,
  userActivitiesInAudit,
  currenciesInCore,
  currencyExchangeRatesInCore,
  ledgerAccountsInCore,
  transactionsInCore,
  categoriesInCore,
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
  ledgerAccountsInCores: many(ledgerAccountsInCore),
  transactionsInCores: many(transactionsInCore),
  categoriesInCores: many(categoriesInCore),
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
    ledgerAccountsInCores: many(ledgerAccountsInCore),
    transactionsInCores: many(transactionsInCore),
  })
);

export const ledgerAccountsInCoreRelations = relations(
  ledgerAccountsInCore,
  ({ one, many }) => ({
    usersInCore: one(usersInCore, {
      fields: [ledgerAccountsInCore.userId],
      references: [usersInCore.id],
    }),
    currenciesInCore: one(currenciesInCore, {
      fields: [ledgerAccountsInCore.currencyCode],
      references: [currenciesInCore.code],
    }),
    transactionsInCores_ledgerAccountId: many(transactionsInCore, {
      relationName:
        'transactionsInCore_ledgerAccountId_ledgerAccountsInCore_id',
    }),
    transactionsInCores_recipientAccountId: many(transactionsInCore, {
      relationName:
        'transactionsInCore_recipientAccountId_ledgerAccountsInCore_id',
    }),
  })
);

export const transactionsInCoreRelations = relations(
  transactionsInCore,
  ({ one }) => ({
    usersInCore: one(usersInCore, {
      fields: [transactionsInCore.createdBy],
      references: [usersInCore.id],
    }),
    ledgerAccountsInCore_ledgerAccountId: one(ledgerAccountsInCore, {
      fields: [transactionsInCore.ledgerAccountId],
      references: [ledgerAccountsInCore.id],
      relationName:
        'transactionsInCore_ledgerAccountId_ledgerAccountsInCore_id',
    }),
    currenciesInCore: one(currenciesInCore, {
      fields: [transactionsInCore.currencyCode],
      references: [currenciesInCore.code],
    }),
    ledgerAccountsInCore_recipientAccountId: one(ledgerAccountsInCore, {
      fields: [transactionsInCore.recipientAccountId],
      references: [ledgerAccountsInCore.id],
      relationName:
        'transactionsInCore_recipientAccountId_ledgerAccountsInCore_id',
    }),
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
      fields: [categoriesInCore.userId],
      references: [usersInCore.id],
    }),
  })
);
