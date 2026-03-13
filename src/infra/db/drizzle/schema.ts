import { pgTable, serial, varchar, timestamp, pgSchema, unique, uuid, boolean, index, foreignKey, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const core = pgSchema("core");
export const audit = pgSchema("audit");
export const categoryStatusInCore = core.enum("category_status", ['active', 'archived'])
export const categoryTypeInCore = core.enum("category_type", ['income', 'expense', 'liability_income', 'liability_expense'])


export const pgmigrations = pgTable("pgmigrations", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	runOn: timestamp("run_on", { mode: 'string' }).notNull(),
});

export const seeds = pgTable("seeds", {
	id: serial().primaryKey().notNull(),
	fileName: varchar("file_name", { length: 250 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const usersInCore = core.table("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	firstName: varchar("first_name", { length: 200 }).notNull(),
	lastName: varchar("last_name", { length: 200 }).notNull(),
	email: varchar({ length: 200 }).notNull(),
	emailVerified: boolean("email_verified").notNull(),
	password: varchar({ length: 200 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const userActivitiesInAudit = audit.table("user_activities", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id"),
	action: varchar({ length: 50 }).notNull(),
	resourceType: varchar("resource_type", { length: 50 }).notNull(),
	resourceId: uuid("resource_id").notNull(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index().using("btree", table.resourceType.asc().nullsLast().op("text_ops"), table.resourceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInCore.id],
			name: "user_activities_user_id_fkey"
		}).onDelete("cascade"),
]);

export const categoriesInCore = core.table("categories", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id"),
	taxKey: varchar("tax_key", { length: 250 }).notNull(),
	type: categoryTypeInCore().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 200 }).notNull(),
	status: categoryStatusInCore().default('active').notNull(),
	parentId: uuid("parent_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index().using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInCore.id],
			name: "categories_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "categories_parent_id_fkey"
		}).onDelete("restrict"),
	unique("unique_user_tax_name").on(table.userId, table.taxKey, table.name),
]);
