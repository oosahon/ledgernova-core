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

  findAll: async (params, options) => {
    // TODO: implement
    return Promise.resolve([]);
  },
};

export default categoryRepo;
