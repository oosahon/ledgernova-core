import { InferSelectModel } from 'drizzle-orm';
import { ICategory } from '../../domain/category/types/category.types';
import { categoriesInCore } from '../../infra/db/drizzle/schema';
import { fromCommonRepoDates, toCommonRepoDates } from './date';

const categoryMapper = {
  toRepo: (category: ICategory): InferSelectModel<typeof categoriesInCore> => {
    const { type, ...categoryOmittedType } = category;
    return {
      ...categoryOmittedType,
      transactionType: category.type,
      taxKey: category.taxKey ?? null,
      createdBy: category.createdBy ?? null,
      parentId: category.parentId ?? null,
      ...toCommonRepoDates(category),
    } as any; // TODO: remove after migration
  },

  toDomain: (
    category: InferSelectModel<typeof categoriesInCore>
  ): ICategory => {
    const { transactionType, ...categoryOmittedTxType } = category;
    return {
      ...categoryOmittedTxType,
      type: category.transactionType,
      ...fromCommonRepoDates(category),
    } as unknown as ICategory; // TODO: remove unknown as ICategory after migration is run
  },
};

export default categoryMapper;
