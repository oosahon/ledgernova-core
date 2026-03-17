import { and, asc, eq, inArray, isNull, or, SQL } from 'drizzle-orm';
import categoryMapper from '../../../app/mappers/category.mapper';
import ICategoryRepo from '../../../domain/category/repos/category.repo';
import {
  ECategoryStatus,
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

  findAllByFlowType: async (flowType, options, userId) => {
    const dbQuery = getDbQuery(options);

    const conditions: (SQL<unknown> | undefined)[] = [
      eq(categories.status, ECategoryStatus.Active),
      eq(categories.flowType, flowType),
    ];

    if (userId) {
      conditions.push(
        or(eq(categories.userId, userId), isNull(categories.userId))
      );
    } else {
      conditions.push(isNull(categories.userId));
    }

    const result = await dbQuery
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(asc(categories.name));

    return result.map((category) => categoryMapper.toDomain(category));
  },
};

export default categoryRepo;
