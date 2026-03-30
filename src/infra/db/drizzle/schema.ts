import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgSchema,
  uuid,
  boolean,
  index,
  foreignKey,
  jsonb,
  char,
  smallint,
  numeric,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const audit = pgSchema('audit');
export const core = pgSchema('core');
export const accountingDomainInCore = core.enum('accounting_domain', [
  'individual',
  'sole_trader',
  'organization',
]);
export const categoryStatusInCore = core.enum('category_status', [
  'active',
  'archived',
]);
export const categoryTypeInCore = core.enum('category_type', [
  'sale',
  'purchase',
  'credit_note',
  'debit_note',
  'expense',
  'payment',
  'receipt',
]);

export const pgmigrations = pgTable('pgmigrations', {
  id: serial().notNull(),
  name: varchar({ length: 255 }).notNull(),
  runOn: timestamp('run_on', { mode: 'string' }).notNull(),
});

export const seeds = pgTable('seeds', {
  id: serial().notNull(),
  fileName: varchar('file_name', { length: 250 }).notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
});

export const usersInCore = core.table('users', {
  id: uuid()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  firstName: varchar('first_name', { length: 200 }).notNull(),
  lastName: varchar('last_name', { length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull(),
  emailVerified: boolean('email_verified').notNull(),
  password: varchar({ length: 200 }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});

export const userActivitiesInAudit = audit.table(
  'user_activities',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .notNull(),
    userId: uuid('user_id'),
    action: varchar({ length: 50 }).notNull(),
    resourceType: varchar('resource_type', { length: 50 }).notNull(),
    resourceId: uuid('resource_id').notNull(),
    metadata: jsonb(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index().using(
      'btree',
      table.resourceType.asc().nullsLast().op('text_ops'),
      table.resourceId.asc().nullsLast().op('text_ops')
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [usersInCore.id],
      name: 'user_activities_user_id_fkey',
    }).onDelete('cascade'),
  ]
);

export const currenciesInCore = core.table('currencies', {
  code: char({ length: 3 }).notNull(),
  symbol: varchar({ length: 5 }).notNull(),
  name: varchar({ length: 50 }).notNull(),
  minorUnit: smallint('minor_unit').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});

export const currencyExchangeRatesInCore = core.table(
  'currency_exchange_rates',
  {
    baseCurrencyCode: char('base_currency_code', { length: 3 }).notNull(),
    targetCurrencyCode: char('target_currency_code', { length: 3 }).notNull(),
    rate: numeric({ precision: 20, scale: 10 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.baseCurrencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'currency_exchange_rates_base_currency_code_fkey',
    }),
    foreignKey({
      columns: [table.targetCurrencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'currency_exchange_rates_target_currency_code_fkey',
    }),
  ]
);

export const categoriesInCore = core.table(
  'categories',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .notNull(),
    name: varchar({ length: 100 }).notNull(),
    accountingDomain: accountingDomainInCore('accounting_domain').notNull(),
    type: categoryTypeInCore().notNull(),
    taxKey: varchar('tax_key', { length: 250 }).notNull(),
    status: categoryStatusInCore().default('active').notNull(),
    description: varchar({ length: 200 }).notNull(),
    parentId: uuid('parent_id'),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index().using('btree', table.createdBy.asc().nullsLast().op('uuid_ops')),
    index().using('btree', table.parentId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'categories_parent_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [usersInCore.id],
      name: 'categories_created_by_fkey',
    }).onDelete('set null'),
  ]
);

export const individualDomainAccountsInCore = core.table(
  'individual_domain_accounts',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .notNull(),
    ownerId: uuid('owner_id').notNull(),
    functionalCurrencyCode: varchar('functional_currency_code', {
      length: 3,
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [usersInCore.id],
      name: 'individual_domain_accounts_owner_id_fkey',
    }),
    foreignKey({
      columns: [table.functionalCurrencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'individual_domain_accounts_functional_currency_code_fkey',
    }),
  ]
);
