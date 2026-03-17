import { relations } from "drizzle-orm/relations";
import { usersInCore, userActivitiesInAudit, categoriesInCore } from "./schema";

export const userActivitiesInAuditRelations = relations(userActivitiesInAudit, ({one}) => ({
	usersInCore: one(usersInCore, {
		fields: [userActivitiesInAudit.userId],
		references: [usersInCore.id]
	}),
}));

export const usersInCoreRelations = relations(usersInCore, ({many}) => ({
	userActivitiesInAudits: many(userActivitiesInAudit),
	categoriesInCores: many(categoriesInCore),
}));

export const categoriesInCoreRelations = relations(categoriesInCore, ({one, many}) => ({
	usersInCore: one(usersInCore, {
		fields: [categoriesInCore.userId],
		references: [usersInCore.id]
	}),
	categoriesInCore: one(categoriesInCore, {
		fields: [categoriesInCore.parentId],
		references: [categoriesInCore.id],
		relationName: "categoriesInCore_parentId_categoriesInCore_id"
	}),
	categoriesInCores: many(categoriesInCore, {
		relationName: "categoriesInCore_parentId_categoriesInCore_id"
	}),
}));