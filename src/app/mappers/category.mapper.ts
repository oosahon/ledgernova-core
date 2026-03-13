import { InferSelectModel } from 'drizzle-orm';
import {
  ECategoryType,
  ICategory,
} from '../../domain/category/types/category.types';
import { categoriesInCore } from '../../infra/db/drizzle/schema';

const categoryMapper = {
  toRepo: (category: ICategory): InferSelectModel<typeof categoriesInCore> => {
    return {
      ...category,
      type: category.type,
      taxKey: category.taxKey ?? null,
      userId: category.userId ?? null,
      parentId: category.parentId ?? null,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      deletedAt: category.deletedAt?.toISOString() ?? null,
    };
  },
};

export default categoryMapper;
