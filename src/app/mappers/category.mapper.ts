import { InferSelectModel } from 'drizzle-orm';
import {
  ECategoryType,
  ICategory,
} from '../../domain/category/types/category.types';
import { categoriesInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';

const categoryMapper = {
  toRepo: (category: ICategory): InferSelectModel<typeof categoriesInCore> => {
    return {
      ...category,
      type: category.type,
      taxKey: category.taxKey ?? null,
      userId: category.userId ?? null,
      parentId: category.parentId ?? null,
      ...toCommonRepoDates(category),
    };
  },

  toDomainExpense: (
    category: InferSelectModel<typeof categoriesInCore>
  ): ICategory => {
    return {
      ...category,
      type: ECategoryType.Expense,
      ...fromCommonRepoDates(category),
    };
  },

  toDomainIncome: (
    category: InferSelectModel<typeof categoriesInCore>
  ): ICategory => {
    return {
      ...category,
      type: ECategoryType.Income,
      ...fromCommonRepoDates(category),
    };
  },
};

export default categoryMapper;
