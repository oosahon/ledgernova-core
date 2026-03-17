import { InferSelectModel } from 'drizzle-orm';
import { ICategory } from '../../domain/category/types/category.types';
import { categoriesInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';

const categoryMapper = {
  toRepo: (category: ICategory): InferSelectModel<typeof categoriesInCore> => {
    return {
      ...category,
      ledgerAccountType: category.ledgerAccountType,
      taxKey: category.taxKey ?? null,
      userId: category.userId ?? null,
      parentId: category.parentId ?? null,
      ...toCommonRepoDates(category),
    };
  },

  toDomain: (
    category: InferSelectModel<typeof categoriesInCore>
  ): ICategory => {
    return {
      ...category,
      ...fromCommonRepoDates(category),
    } as ICategory;
  },
};

export default categoryMapper;
