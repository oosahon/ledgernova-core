import { InferSelectModel } from 'drizzle-orm';
import { ICategory } from '../../domain/category/types/category.types';
import { categoriesInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';

const categoryMapper = {
  toRepo: (category: ICategory): InferSelectModel<typeof categoriesInCore> => {
    return {
      ...category,
      taxKey: category.taxKey ?? null,
      userId: category.userId ?? null,
      parentId: category.parentId ?? null,
      ...toCommonRepoDates(category),
    } as any; // TODO: remove any after migration is run
  },

  toDomain: (
    category: InferSelectModel<typeof categoriesInCore>
  ): ICategory => {
    return {
      ...category,
      ...fromCommonRepoDates(category),
    } as unknown as ICategory; // TODO: remove unknown as ICategory after migration is run
  },
};

export default categoryMapper;
