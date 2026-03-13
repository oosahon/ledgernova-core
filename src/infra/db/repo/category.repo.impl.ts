import { db } from '..';
import categoryMapper from '../../../app/mappers/category.mapper';
import ICategoryRepo from '../../../domain/category/repos/category.repo';
import { ICategory } from '../../../domain/category/types/category.types';
import { categoriesInCore } from '../drizzle/schema';

const categoryRepo: ICategoryRepo = {
  save: async (category, options) => {
    const query = options.tx ?? db;
    await query
      .insert(categoriesInCore)
      .values(categoryMapper.toRepo(category));
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
    // TODO: implement
    return [] as ICategory[];
  },
};

export default categoryRepo;
