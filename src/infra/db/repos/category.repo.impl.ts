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
    const query = getDbQuery(options);

    const result = await query
      .select()
      .from(categories)
      .where(eq(categories.taxKey, taxKey));

    if (!result.length) return null;

    return categoryMapper.toDomain(result[0]);
  },

  findByName: async (name, type, userId, options) => {
    // TODO: implement
    return {} as ICategory;
  },

  delete: async (categoryId, userId, options) => {},

  findAll: async (params, options) => {
    const where: SQL<unknown>[] = [
      eq(categories.accountingDomain, params.accountingDomain),

      eq(categories.status, ECategoryStatus.Active),
      isNull(categories.deletedAt),
    ];

    if (params.types) {
      where.push(inArray(categories.type, params.types));
    }

    if (params.userId) {
      where.push(eq(categories.createdBy, params.userId));
    }

    const res = await getDbQuery(options)
      .select()
      .from(categories)
      .where(and(...where))
      .orderBy(asc(categories.name));

    return res.map(categoryMapper.toDomain);
  },
};

export default categoryRepo;
