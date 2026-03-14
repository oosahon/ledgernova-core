import { and, asc, eq, inArray, isNull, or, SQL } from 'drizzle-orm';
import categoryMapper from '../../../app/mappers/category.mapper';
import ICategoryRepo from '../../../domain/category/repos/category.repo';
import {
  ECategoryType,
  ICategory,
} from '../../../domain/category/types/category.types';
import { categoriesInCore as categories } from '../drizzle/schema';
import getDbQuery from './query';

const categoryRepo: ICategoryRepo = {
  save: async (category, options) => {
    const query = getDbQuery(options);

    await query.insert(categories).values(categoryMapper.toRepo(category));
  },

  update: async (category, options) => {},

  findById: async (categoryId, options) => {
    // TODO: implement
    return {} as ICategory;
  },

  findByTaxKey: async (taxKey, options) => {
    // TODO: implement
    return {} as ICategory;
  },

  findByName: async (name, type, userId, options) => {
    // TODO: implement
    return {} as ICategory;
  },

  delete: async (categoryId, userId, options) => {},

  findAll: async (type, options, query) => {
    const dbQuery = getDbQuery(options);

    const userId = query?.userId;
    const ids = query?.ids;

    const conditions: (SQL<unknown> | undefined)[] = [
      eq(categories.status, 'active'),
      inArray(categories.type, type),
    ];

    if (userId) {
      conditions.push(
        or(eq(categories.userId, userId), isNull(categories.userId))
      );
    } else {
      conditions.push(isNull(categories.userId));
    }
    if (ids) {
      conditions.push(inArray(categories.id, ids));
    }

    const result = await dbQuery
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(asc(categories.name));

    return result.map((category) =>
      type.includes(ECategoryType.Expense)
        ? categoryMapper.toDomainExpense(category)
        : categoryMapper.toDomainIncome(category)
    );
  },
};

export default categoryRepo;
